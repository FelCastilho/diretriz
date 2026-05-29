-- ============================================================================
-- Diretriz · Brand System — Functions & Triggers
-- ----------------------------------------------------------------------------
-- Run AFTER supabase-schema.sql.
-- Provides: updated_at maintenance, auth.users → profiles sync, owner
-- bootstrapping on brand creation, block reordering helpers, audit logging,
-- block-revision snapshots, and download/search logging RPCs.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. updated_at auto-maintenance
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Attach the updated_at trigger to every table that has the column.
do $$
declare
  r record;
begin
  for r in
    select c.table_name
    from information_schema.columns c
    where c.table_schema = 'public'
      and c.column_name = 'updated_at'
  loop
    execute format(
      'drop trigger if exists trg_set_updated_at on public.%I;', r.table_name
    );
    execute format(
      'create trigger trg_set_updated_at before update on public.%I
       for each row execute function public.set_updated_at();', r.table_name
    );
  end loop;
end;
$$;

-- ----------------------------------------------------------------------------
-- 2. auth.users → profiles
-- ----------------------------------------------------------------------------
-- Auto-create a profile row whenever a new auth user signs up (incl. SSO).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name, avatar_url, job_title)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'first_name',
             split_part(coalesce(new.raw_user_meta_data ->> 'full_name', ''), ' ', 1),
             ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    new.raw_user_meta_data ->> 'avatar_url',
    new.raw_user_meta_data ->> 'job_title'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep profile email in sync when the auth email changes.
create or replace function public.handle_user_email_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email is distinct from old.email then
    update public.profiles set email = new.email where id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_updated on auth.users;
create trigger on_auth_user_email_updated
  after update of email on auth.users
  for each row execute function public.handle_user_email_update();

-- ----------------------------------------------------------------------------
-- 3. Brand creation → owner membership bootstrap
-- ----------------------------------------------------------------------------
-- Whoever creates a brand becomes its owner member automatically.
create or replace function public.handle_new_brand()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.created_by is not null then
    insert into public.brand_memberships (brand_id, user_id, role, invited_by)
    values (new.id, new.created_by, 'owner', new.created_by)
    on conflict (brand_id, user_id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_brand_created on public.brands;
create trigger on_brand_created
  after insert on public.brands
  for each row execute function public.handle_new_brand();

-- ----------------------------------------------------------------------------
-- 4. Block ordering helper
-- ----------------------------------------------------------------------------
-- Auto-assign the next position when a block is inserted without one.
create or replace function public.assign_block_position()
returns trigger
language plpgsql
as $$
begin
  if new.position is null or new.position = 0 then
    select coalesce(max(position), 0) + 1
      into new.position
      from public.blocks
      where page_id = new.page_id;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_assign_block_position on public.blocks;
create trigger trg_assign_block_position
  before insert on public.blocks
  for each row execute function public.assign_block_position();

-- ----------------------------------------------------------------------------
-- 5. Block revision snapshots
-- ----------------------------------------------------------------------------
-- Snapshot prior content into block_revisions whenever a block's content,
-- type, or position changes (powers Edit mode history).
create or replace function public.snapshot_block_revision()
returns trigger
language plpgsql
as $$
begin
  if (new.content is distinct from old.content)
     or (new.type is distinct from old.type)
     or (new.position is distinct from old.position) then
    insert into public.block_revisions (block_id, content, type, position, edited_by)
    values (old.id, old.content, old.type, old.position, new.created_by);
  end if;
  return new;
end;
$$;

drop trigger if exists trg_snapshot_block_revision on public.blocks;
create trigger trg_snapshot_block_revision
  before update on public.blocks
  for each row execute function public.snapshot_block_revision();

-- ----------------------------------------------------------------------------
-- 6. Page publish bookkeeping
-- ----------------------------------------------------------------------------
-- Stamp published_at when a page transitions into 'published'.
create or replace function public.handle_page_publish()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'published' and (old.status is distinct from 'published') then
    new.published_at := coalesce(new.published_at, now());
  end if;
  new.content_updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_handle_page_publish on public.pages;
create trigger trg_handle_page_publish
  before update on public.pages
  for each row execute function public.handle_page_publish();

-- ----------------------------------------------------------------------------
-- 7. Single-primary enforcement helpers
-- ----------------------------------------------------------------------------
-- Ensure only one archetype is primary per brand.
create or replace function public.enforce_single_primary_archetype()
returns trigger
language plpgsql
as $$
begin
  if new.is_primary then
    update public.archetypes
      set is_primary = false
      where brand_id = new.brand_id
        and id <> new.id
        and is_primary;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_single_primary_archetype on public.archetypes;
create trigger trg_single_primary_archetype
  after insert or update of is_primary on public.archetypes
  for each row when (new.is_primary)
  execute function public.enforce_single_primary_archetype();

-- ----------------------------------------------------------------------------
-- 8. RPCs — logging helpers callable from the client
-- ----------------------------------------------------------------------------

-- Record a download event (DownloadRow click).
create or replace function public.log_download(
  p_asset_id uuid,
  p_format   file_format default null,
  p_asset_file_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.download_logs (asset_id, asset_file_id, user_id, format)
  values (p_asset_id, p_asset_file_id, auth.uid(), p_format)
  returning id into v_id;
  return v_id;
end;
$$;

-- Record a ⌘K search.
create or replace function public.log_search(
  p_brand_id uuid,
  p_query    text,
  p_result_count integer default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.search_queries (brand_id, user_id, query, result_count)
  values (p_brand_id, auth.uid(), p_query, p_result_count)
  returning id into v_id;
  return v_id;
end;
$$;

-- Generic audit writer.
create or replace function public.write_audit(
  p_brand_id    uuid,
  p_action      audit_action,
  p_entity_type text default null,
  p_entity_id   uuid default null,
  p_metadata    jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.audit_logs (brand_id, actor_id, action, entity_type, entity_id, metadata)
  values (p_brand_id, auth.uid(), p_action, p_entity_type, p_entity_id, p_metadata)
  returning id into v_id;
  return v_id;
end;
$$;

-- ============================================================================
-- End of triggers.sql
-- ============================================================================
