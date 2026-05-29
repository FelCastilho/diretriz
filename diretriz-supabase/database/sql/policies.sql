-- ============================================================================
-- Diretriz · Brand System — Row Level Security
-- ----------------------------------------------------------------------------
-- Run AFTER supabase-schema.sql and triggers.sql.
--
-- Access model
--   * Anonymous/public: may READ published pages (and their blocks + content
--     collections) whose page/brand visibility is 'public'. Public brand
--     metadata is also readable.
--   * Authenticated brand members: READ everything in their brand; WRITE
--     depends on membership role (editor+ can write content, admin/owner can
--     manage structure, memberships, access).
--   * profiles: a user can read/update only their own profile.
--   * Logs (audit/search/download): insert via SECURITY DEFINER RPCs; readable
--     by brand admins.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Helper functions (SECURITY DEFINER, stable)
-- ----------------------------------------------------------------------------

-- Is the current user a member of the brand?
create or replace function public.is_brand_member(p_brand_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.brand_memberships
    where brand_id = p_brand_id and user_id = auth.uid()
  );
$$;

-- The current user's membership role for a brand (null if not a member).
create or replace function public.brand_role(p_brand_id uuid)
returns membership_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.brand_memberships
  where brand_id = p_brand_id and user_id = auth.uid()
  limit 1;
$$;

-- Does the user meet at least the given role (owner > admin > editor > viewer)?
create or replace function public.has_brand_role(p_brand_id uuid, p_min membership_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select case brand_role(p_brand_id)
           when 'owner'  then 4
           when 'admin'  then 3
           when 'editor' then 2
           when 'viewer' then 1
           else 0
         end
       >= case p_min
            when 'owner'  then 4
            when 'admin'  then 3
            when 'editor' then 2
            when 'viewer' then 1
          end;
$$;

-- Can the current visitor READ this brand's content?
-- Either: a member, OR the brand is an active master/sub that exposes public pages.
create or replace function public.can_read_brand(p_brand_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select is_brand_member(p_brand_id)
     or exists (
       select 1 from public.pages
       where brand_id = p_brand_id
         and visibility = 'public'
         and status = 'published'
     );
$$;

-- Can the current visitor READ this specific page?
create or replace function public.can_read_page(p_page_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.pages p
    where p.id = p_page_id
      and (
        (p.visibility = 'public' and p.status = 'published')
        or is_brand_member(p.brand_id)
        or exists (
          select 1 from public.page_access_grants g
          where g.page_id = p.id
            and (g.user_id = auth.uid()
                 or g.email = (select email from public.profiles where id = auth.uid()))
        )
      )
  );
$$;

-- ----------------------------------------------------------------------------
-- 2. Enable RLS on every public table
-- ----------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','brands','brand_memberships','sections','pages','page_tags',
    'blocks','block_revisions','assets','asset_files','download_logs',
    'colors','color_combinations','typography_families','typography_weights',
    'typography_specimens','archetypes','brand_values','personas',
    'positioning_statements','positioning_pillars','competitors',
    'voice_traits','voice_examples','voice_registers','vocabulary_categories',
    'vocabulary_words','word_territories','word_territory_words','manifestos',
    'flags','logos','logo_misuses','logo_min_sizes','graphics','icons',
    'photography_references','photography_params','embeds','share_links',
    'page_access_grants','quick_answers','quick_answer_citations',
    'search_queries','audit_logs'
  ]
  loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('alter table public.%I force row level security;', t);
  end loop;
end;
$$;

-- ----------------------------------------------------------------------------
-- 3. profiles
-- ----------------------------------------------------------------------------
create policy "profiles: read own or same-brand"
  on public.profiles for select to authenticated
  using (
    id = auth.uid()
    or exists (
      select 1 from public.brand_memberships m1
      join public.brand_memberships m2 on m1.brand_id = m2.brand_id
      where m1.user_id = auth.uid() and m2.user_id = profiles.id
    )
  );

create policy "profiles: insert own"
  on public.profiles for insert to authenticated
  with check (id = auth.uid());

create policy "profiles: update own"
  on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- ----------------------------------------------------------------------------
-- 4. brands
-- ----------------------------------------------------------------------------
create policy "brands: read public or member"
  on public.brands for select to anon, authenticated
  using (can_read_brand(id));

create policy "brands: insert by authenticated (becomes owner)"
  on public.brands for insert to authenticated
  with check (created_by = auth.uid());

create policy "brands: update by admin+"
  on public.brands for update to authenticated
  using (has_brand_role(id, 'admin')) with check (has_brand_role(id, 'admin'));

create policy "brands: delete by owner"
  on public.brands for delete to authenticated
  using (has_brand_role(id, 'owner'));

-- ----------------------------------------------------------------------------
-- 5. brand_memberships
-- ----------------------------------------------------------------------------
create policy "memberships: read own or admin"
  on public.brand_memberships for select to authenticated
  using (user_id = auth.uid() or has_brand_role(brand_id, 'admin'));

create policy "memberships: manage by admin+"
  on public.brand_memberships for all to authenticated
  using (has_brand_role(brand_id, 'admin'))
  with check (has_brand_role(brand_id, 'admin'));

-- ----------------------------------------------------------------------------
-- 6. Brand-scoped content — generic read + role-gated write
-- ----------------------------------------------------------------------------
-- These tables all carry a brand_id and follow the same pattern:
--   SELECT: can_read_brand(brand_id)
--   INSERT/UPDATE/DELETE: has_brand_role(brand_id, 'editor')
do $$
declare t text;
begin
  foreach t in array array[
    'sections','assets','asset_files','colors','color_combinations',
    'typography_families','typography_specimens','archetypes','brand_values',
    'personas','positioning_statements','positioning_pillars','competitors',
    'voice_traits','voice_examples','voice_registers','vocabulary_categories',
    'word_territories','manifestos','flags','logos','logo_misuses',
    'logo_min_sizes','graphics','icons','photography_references',
    'photography_params','embeds','quick_answers'
  ]
  loop
    -- asset_files has no brand_id directly; handled separately below — skip it here.
    if t = 'asset_files' then
      continue;
    end if;

    execute format($f$
      create policy "%1$s: read public or member"
        on public.%1$s for select to anon, authenticated
        using (can_read_brand(brand_id));
    $f$, t);

    execute format($f$
      create policy "%1$s: write by editor+"
        on public.%1$s for all to authenticated
        using (has_brand_role(brand_id, 'editor'))
        with check (has_brand_role(brand_id, 'editor'));
    $f$, t);
  end loop;
end;
$$;

-- asset_files inherits scope from its parent asset.
create policy "asset_files: read public or member"
  on public.asset_files for select to anon, authenticated
  using (exists (
    select 1 from public.assets a
    where a.id = asset_files.asset_id and can_read_brand(a.brand_id)
  ));

create policy "asset_files: write by editor+"
  on public.asset_files for all to authenticated
  using (exists (
    select 1 from public.assets a
    where a.id = asset_files.asset_id and has_brand_role(a.brand_id, 'editor')
  ))
  with check (exists (
    select 1 from public.assets a
    where a.id = asset_files.asset_id and has_brand_role(a.brand_id, 'editor')
  ));

-- ----------------------------------------------------------------------------
-- 7. Child tables scoped via a parent (category/family/territory/page/answer)
-- ----------------------------------------------------------------------------

-- typography_weights → typography_families → brand
create policy "typo_weights: read"
  on public.typography_weights for select to anon, authenticated
  using (exists (select 1 from public.typography_families f
                 where f.id = family_id and can_read_brand(f.brand_id)));
create policy "typo_weights: write"
  on public.typography_weights for all to authenticated
  using (exists (select 1 from public.typography_families f
                 where f.id = family_id and has_brand_role(f.brand_id, 'editor')))
  with check (exists (select 1 from public.typography_families f
                 where f.id = family_id and has_brand_role(f.brand_id, 'editor')));

-- vocabulary_words → vocabulary_categories → brand
create policy "vocab_words: read"
  on public.vocabulary_words for select to anon, authenticated
  using (exists (select 1 from public.vocabulary_categories c
                 where c.id = category_id and can_read_brand(c.brand_id)));
create policy "vocab_words: write"
  on public.vocabulary_words for all to authenticated
  using (exists (select 1 from public.vocabulary_categories c
                 where c.id = category_id and has_brand_role(c.brand_id, 'editor')))
  with check (exists (select 1 from public.vocabulary_categories c
                 where c.id = category_id and has_brand_role(c.brand_id, 'editor')));

-- word_territory_words → word_territories → brand
create policy "territory_words: read"
  on public.word_territory_words for select to anon, authenticated
  using (exists (select 1 from public.word_territories t
                 where t.id = territory_id and can_read_brand(t.brand_id)));
create policy "territory_words: write"
  on public.word_territory_words for all to authenticated
  using (exists (select 1 from public.word_territories t
                 where t.id = territory_id and has_brand_role(t.brand_id, 'editor')))
  with check (exists (select 1 from public.word_territories t
                 where t.id = territory_id and has_brand_role(t.brand_id, 'editor')));

-- quick_answer_citations → quick_answers → brand
create policy "qa_citations: read"
  on public.quick_answer_citations for select to anon, authenticated
  using (exists (select 1 from public.quick_answers q
                 where q.id = quick_answer_id and can_read_brand(q.brand_id)));
create policy "qa_citations: write"
  on public.quick_answer_citations for all to authenticated
  using (exists (select 1 from public.quick_answers q
                 where q.id = quick_answer_id and has_brand_role(q.brand_id, 'editor')))
  with check (exists (select 1 from public.quick_answers q
                 where q.id = quick_answer_id and has_brand_role(q.brand_id, 'editor')));

-- ----------------------------------------------------------------------------
-- 8. pages, page_tags, blocks, block_revisions (page-aware visibility)
-- ----------------------------------------------------------------------------
create policy "pages: read visible"
  on public.pages for select to anon, authenticated
  using (can_read_page(id));
create policy "pages: write by editor+"
  on public.pages for all to authenticated
  using (has_brand_role(brand_id, 'editor'))
  with check (has_brand_role(brand_id, 'editor'));

create policy "page_tags: read with page"
  on public.page_tags for select to anon, authenticated
  using (can_read_page(page_id));
create policy "page_tags: write by editor+"
  on public.page_tags for all to authenticated
  using (exists (select 1 from public.pages p
                 where p.id = page_id and has_brand_role(p.brand_id, 'editor')))
  with check (exists (select 1 from public.pages p
                 where p.id = page_id and has_brand_role(p.brand_id, 'editor')));

create policy "blocks: read with page"
  on public.blocks for select to anon, authenticated
  using (can_read_page(page_id));
create policy "blocks: write by editor+"
  on public.blocks for all to authenticated
  using (exists (select 1 from public.pages p
                 where p.id = page_id and has_brand_role(p.brand_id, 'editor')))
  with check (exists (select 1 from public.pages p
                 where p.id = page_id and has_brand_role(p.brand_id, 'editor')));

create policy "block_revisions: read by member"
  on public.block_revisions for select to authenticated
  using (exists (select 1 from public.blocks b
                 join public.pages p on p.id = b.page_id
                 where b.id = block_id and is_brand_member(p.brand_id)));
create policy "block_revisions: insert by editor+"
  on public.block_revisions for insert to authenticated
  with check (exists (select 1 from public.blocks b
                 join public.pages p on p.id = b.page_id
                 where b.id = block_id and has_brand_role(p.brand_id, 'editor')));

-- ----------------------------------------------------------------------------
-- 9. share_links & page_access_grants
-- ----------------------------------------------------------------------------
create policy "share_links: read by member"
  on public.share_links for select to authenticated
  using (is_brand_member(brand_id));
create policy "share_links: manage by editor+"
  on public.share_links for all to authenticated
  using (has_brand_role(brand_id, 'editor'))
  with check (has_brand_role(brand_id, 'editor'));

create policy "page_access: read by admin or grantee"
  on public.page_access_grants for select to authenticated
  using (
    user_id = auth.uid()
    or exists (select 1 from public.pages p
               where p.id = page_id and has_brand_role(p.brand_id, 'admin'))
  );
create policy "page_access: manage by admin+"
  on public.page_access_grants for all to authenticated
  using (exists (select 1 from public.pages p
                 where p.id = page_id and has_brand_role(p.brand_id, 'admin')))
  with check (exists (select 1 from public.pages p
                 where p.id = page_id and has_brand_role(p.brand_id, 'admin')));

-- ----------------------------------------------------------------------------
-- 10. Logs — write via RPC, read by admins
-- ----------------------------------------------------------------------------
create policy "download_logs: insert self"
  on public.download_logs for insert to authenticated
  with check (user_id = auth.uid() or user_id is null);
create policy "download_logs: read by admin"
  on public.download_logs for select to authenticated
  using (exists (select 1 from public.assets a
                 where a.id = download_logs.asset_id and has_brand_role(a.brand_id, 'admin')));

create policy "search_queries: insert self"
  on public.search_queries for insert to authenticated
  with check (user_id = auth.uid() or user_id is null);
create policy "search_queries: read own or admin"
  on public.search_queries for select to authenticated
  using (
    user_id = auth.uid()
    or (brand_id is not null and has_brand_role(brand_id, 'admin'))
  );

create policy "audit_logs: insert authenticated"
  on public.audit_logs for insert to authenticated
  with check (actor_id = auth.uid() or actor_id is null);
create policy "audit_logs: read by admin"
  on public.audit_logs for select to authenticated
  using (brand_id is not null and has_brand_role(brand_id, 'admin'));

-- ============================================================================
-- End of policies.sql
-- ============================================================================
