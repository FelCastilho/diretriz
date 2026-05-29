-- ============================================================================
-- Diretriz · Brand System — Supabase Schema
-- ----------------------------------------------------------------------------
-- Generated from the "diretriz-brand-system" React application.
-- Models: authentication/profiles, master+sub brands, sections, pages,
-- modular blocks, and every content collection surfaced in the UI
-- (colors, typography, archetypes, personas, vocabulary, flags, logos,
-- icons, assets/downloads, embeds, FAQ/assistant, share links, audit logs).
--
-- Execution order (run as the `postgres`/service role so seeds bypass RLS):
--   1. supabase-schema.sql   (this file — extensions, enums, tables, indexes)
--   2. triggers.sql          (functions + triggers)
--   3. policies.sql          (RLS helper functions + policies)
--   4. seeds.sql             (initial data extracted from the app)
--
-- Conventions
--   * snake_case identifiers; English table names, Portuguese domain values
--     preserved verbatim (slugs, labels, content) per the source app.
--   * Every table carries created_at / updated_at (updated_at auto-maintained
--     by a trigger defined in triggers.sql).
--   * UUID primary keys (gen_random_uuid) for portability and RLS friendliness.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. Extensions
-- ----------------------------------------------------------------------------
create extension if not exists "pgcrypto";   -- gen_random_uuid(), crypt()
create extension if not exists "citext";      -- case-insensitive email/slug
create extension if not exists "pg_trgm";     -- trigram search on text

-- ----------------------------------------------------------------------------
-- 1. Enumerated types
-- ----------------------------------------------------------------------------

-- Application-wide role (coarse capability tier). The human-readable job
-- title (e.g. "Brand Lead · Estúdio") lives in profiles.job_title.
create type app_role as enum ('owner', 'admin', 'editor', 'viewer');

-- Per-brand membership role (governs RLS write access).
create type membership_role as enum ('owner', 'admin', 'editor', 'viewer');

-- Master Brand System hierarchy.
create type brand_type as enum ('master', 'sub');

-- Sync state shown across the UI ("Sincronizado · Marca Mestre", master dot,
-- unlinked dot).
create type sync_status as enum ('master', 'synced', 'unlinked');

-- Page / link visibility (public link, SSO-only private, password-protected).
create type visibility_level as enum ('public', 'private', 'sso', 'password');

-- Publishing lifecycle.
create type content_status as enum ('draft', 'published', 'archived');

-- Editor block categories (the six insertable kinds in the Edit Toolbar).
-- The free-text block.type column preserves the richer display label
-- ("texto editorial", "navegação", "declaração", …).
create type block_category as enum ('texto', 'cor', 'tipo', 'midia', 'embed', 'download');

-- Color palette grouping.
create type color_palette as enum ('primary', 'secondary');

-- Persona tier.
create type persona_tier as enum ('primary', 'secondary', 'tertiary');

-- Tone-of-voice register.
create type voice_register as enum ('institucional', 'conversacional', 'editorial');

-- Vocabulary word polarity.
create type vocabulary_kind as enum ('use', 'avoid');

-- Asset taxonomy (the media/file library).
create type asset_kind as enum (
  'logo', 'font', 'icon', 'graphic', 'photo',
  'template', 'document', 'video', 'audio', 'pdf', 'other'
);

-- Downloadable file formats surfaced by DownloadRow across the app.
create type file_format as enum (
  'SVG', 'PNG', 'PDF', 'ICO', 'JPG', 'WEBP', 'GIF',
  'OTF', 'TTF', 'WOFF', 'WOFF2',
  'ZIP', 'FIG', 'AI', 'INDD', 'EPS',
  'DOCX', 'HTML', 'CSS', 'MP4', 'MP3', 'OTHER'
);

-- Embedded external content provider.
create type embed_kind as enum ('Figma', 'Vídeo', 'Miro', 'Drive', 'Link');

-- Theme preference.
create type theme_preference as enum ('dark', 'light');

-- Audit log action taxonomy.
create type audit_action as enum (
  'create', 'update', 'delete', 'publish', 'unpublish',
  'login', 'logout', 'download', 'share', 'upload',
  'access_grant', 'access_revoke', 'sync'
);

-- ----------------------------------------------------------------------------
-- 2. Identity & access
-- ----------------------------------------------------------------------------

-- Mirror of auth.users with brand-system profile fields.
-- Populated by the handle_new_user() trigger (triggers.sql).
create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  email        citext unique,
  first_name   text not null default '',
  last_name    text not null default '',
  full_name    text generated always as (
                  nullif(trim(coalesce(first_name, '') || ' ' || coalesce(last_name, '')), '')
                ) stored,
  initial      text generated always as (
                  upper(left(coalesce(nullif(first_name, ''), coalesce(email::text, '?')), 1))
                ) stored,
  job_title    text,                         -- "Brand Lead · Estúdio" (admin-defined)
  role         app_role not null default 'viewer',
  avatar_url   text,                          -- storage path / public URL
  theme        theme_preference not null default 'dark',
  bio          text,
  last_seen_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
comment on table public.profiles is 'User profile, 1:1 with auth.users. role is admin-defined.';

-- ----------------------------------------------------------------------------
-- 3. Brands (Master Brand System)
-- ----------------------------------------------------------------------------

create table public.brands (
  id              uuid primary key default gen_random_uuid(),
  slug            citext not null unique,
  name            text not null,                     -- "LOGOTIPO"
  brand_type      brand_type not null default 'master',
  parent_brand_id uuid references public.brands (id) on delete set null,
  descriptor      text,                              -- "B2B", "B2C", "Regional"
  description     text,
  logo_asset_id   uuid,                              -- FK added after assets exists
  sync_status     sync_status not null default 'master',
  is_active       boolean not null default true,
  created_by      uuid references public.profiles (id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  -- A sub-brand must point to a parent; a master must not.
  constraint brand_parent_consistency check (
    (brand_type = 'sub'    and parent_brand_id is not null) or
    (brand_type = 'master' and parent_brand_id is null)
  ),
  constraint brand_not_self_parent check (parent_brand_id is null or parent_brand_id <> id)
);
comment on table public.brands is 'Master brand and connected sub-brands (Arquitetura de Marca).';

-- Per-brand membership / permissions.
create table public.brand_memberships (
  id         uuid primary key default gen_random_uuid(),
  brand_id   uuid not null references public.brands (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  role       membership_role not null default 'viewer',
  invited_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (brand_id, user_id)
);
comment on table public.brand_memberships is 'Maps users to brands with a role; basis for RLS write access.';

-- ----------------------------------------------------------------------------
-- 4. Navigation structure: sections → pages → blocks
-- ----------------------------------------------------------------------------

-- The five top-level NAV_TREE sections.
create table public.sections (
  id         uuid primary key default gen_random_uuid(),
  brand_id   uuid not null references public.brands (id) on delete cascade,
  slug       text not null,                    -- overview, nucleo, verbal, visual, aplicacoes
  label      text not null,                    -- "Overview da Marca"
  position   integer not null default 0,
  icon       text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (brand_id, slug)
);
comment on table public.sections is 'Top-level sidebar sections (NAV_TREE).';

-- The 20 content pages.
create table public.pages (
  id                  uuid primary key default gen_random_uuid(),
  brand_id            uuid not null references public.brands (id) on delete cascade,
  section_id          uuid not null references public.sections (id) on delete cascade,
  slug                text not null,            -- "visao", "posicionamento"
  route               text not null,            -- "overview/visao"
  label               text not null,            -- sidebar label "Visão Geral"
  eyebrow             text,                      -- "Overview · Visão Geral"
  title               text not null,
  lede                text,
  visibility          visibility_level not null default 'public',
  status              content_status not null default 'published',
  sync_status         sync_status not null default 'unlinked',
  version             text not null default 'v1.0',     -- "v3.2"
  reading_minutes     integer,                  -- "~4 min"
  responsible         text,                     -- "Estúdio Diretriz"
  position            integer not null default 0,
  published_at        timestamptz,
  content_updated_at  timestamptz,              -- "Última atualização · 12 maio 2026"
  created_by          uuid references public.profiles (id) on delete set null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (brand_id, route),
  constraint reading_minutes_positive check (reading_minutes is null or reading_minutes >= 0)
);
comment on table public.pages is 'Brand-book pages. visibility/status drive public vs SSO access.';

-- PageHeader pill tags ({label, variant}).
create table public.page_tags (
  id         uuid primary key default gen_random_uuid(),
  page_id    uuid not null references public.pages (id) on delete cascade,
  label      text not null,                    -- "Privado · SSO"
  variant    text,                             -- 'private' | 'synced' | null (default)
  position   integer not null default 0,
  created_at timestamptz not null default now()
);

-- Modular content blocks composing each page.
create table public.blocks (
  id                  uuid primary key default gen_random_uuid(),
  page_id             uuid not null references public.pages (id) on delete cascade,
  category            block_category not null default 'texto',  -- editor insertable kind
  type                text not null default 'texto',            -- display label, preserved
  section_label_idx   text,                     -- "01"
  section_label_text  text,                     -- "Apresentação"
  position            integer not null default 0,
  content             jsonb not null default '{}'::jsonb,       -- block-specific payload
  sync_status         sync_status not null default 'unlinked',
  is_locked           boolean not null default false,
  created_by          uuid references public.profiles (id) on delete set null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
comment on table public.blocks is 'Reorderable modular blocks. content holds the typed payload as JSONB.';

-- Block edit history (Edit mode "Salvar"; version snapshots).
create table public.block_revisions (
  id         uuid primary key default gen_random_uuid(),
  block_id   uuid not null references public.blocks (id) on delete cascade,
  content    jsonb not null,
  type       text,
  position   integer,
  edited_by  uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 5. Asset / media library (uploads, downloads)
-- ----------------------------------------------------------------------------

create table public.assets (
  id          uuid primary key default gen_random_uuid(),
  brand_id    uuid not null references public.brands (id) on delete cascade,
  kind        asset_kind not null,
  title       text not null,                   -- "Logotipo Primário"
  description text,                            -- "Para fundos escuros · padrão"
  storage_path text,                            -- Supabase Storage object path
  mime_type   text,
  file_size   bigint,
  width       integer,
  height      integer,
  checksum    text,
  is_synced   boolean not null default false,
  metadata    jsonb not null default '{}'::jsonb,
  uploaded_by uuid references public.profiles (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
comment on table public.assets is 'Central media library: logos, fonts, icons, photos, templates, docs.';

-- An asset can be downloadable in multiple formats (DownloadRow formats[]).
create table public.asset_files (
  id           uuid primary key default gen_random_uuid(),
  asset_id     uuid not null references public.assets (id) on delete cascade,
  format       file_format not null,
  storage_path text,
  url          text,
  file_size    bigint,
  is_primary   boolean not null default false,
  position     integer not null default 0,
  created_at   timestamptz not null default now(),
  unique (asset_id, format)
);
comment on table public.asset_files is 'Per-format downloadable variants of an asset.';

-- Now that assets exists, wire brands.logo_asset_id.
alter table public.brands
  add constraint brands_logo_asset_fk
  foreign key (logo_asset_id) references public.assets (id) on delete set null;

-- Download event log (DownloadRow click → toast "Baixando …").
create table public.download_logs (
  id            uuid primary key default gen_random_uuid(),
  asset_id      uuid references public.assets (id) on delete set null,
  asset_file_id uuid references public.asset_files (id) on delete set null,
  user_id       uuid references public.profiles (id) on delete set null,
  format        file_format,
  created_at    timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 6. Content collections (Núcleo, Verbal, Visual, Aplicações)
-- ----------------------------------------------------------------------------
-- Each collection optionally links to the block that renders it, and always
-- to the owning brand for RLS scoping.

-- 6.1 Colors (Guia de Cores · ColorSwatch)
create table public.colors (
  id               uuid primary key default gen_random_uuid(),
  brand_id         uuid not null references public.brands (id) on delete cascade,
  block_id         uuid references public.blocks (id) on delete set null,
  name             text not null,             -- "Tinta 01"
  hex              text not null,             -- "#0D0D0D"
  rgb              text,                      -- "13 · 13 · 13"
  cmyk             text,                      -- "0 / 0 / 0 / 95"
  pantone          text,                      -- "Black 6 C"
  palette          color_palette not null default 'primary',
  usage_percentage numeric(5,2),             -- 60 / 25 / 10 / 5
  position         integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint colors_hex_format check (hex ~* '^#[0-9a-f]{6}$')
);

-- 6.2 Approved contrast combinations
create table public.color_combinations (
  id              uuid primary key default gen_random_uuid(),
  brand_id        uuid not null references public.brands (id) on delete cascade,
  label           text not null,             -- "Padrão dark"
  foreground_hex  text not null,
  background_hex  text not null,
  contrast_ratio  text,                      -- "20.5:1"
  wcag_level      text default 'AAA',
  position        integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- 6.3 Typography family / weights / specimens
create table public.typography_families (
  id             uuid primary key default gen_random_uuid(),
  brand_id       uuid not null references public.brands (id) on delete cascade,
  name           text not null,              -- "Inter"
  classification text,                        -- "Sans-serif · variável · Open source"
  source         text,
  license        text,
  is_primary     boolean not null default true,
  position       integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table public.typography_weights (
  id          uuid primary key default gen_random_uuid(),
  family_id   uuid not null references public.typography_families (id) on delete cascade,
  weight_value integer not null,             -- 500
  weight_name  text not null,                -- "Medium"
  usage        text,                          -- "corpo e labels"
  position     integer not null default 0,
  created_at   timestamptz not null default now()
);

create table public.typography_specimens (
  id          uuid primary key default gen_random_uuid(),
  brand_id    uuid not null references public.brands (id) on delete cascade,
  label       text not null,                 -- "Display", "H1 · Título de página"
  weight      text,                          -- "Semibold · 600"
  size        text,                          -- "72px / 1.02"
  tracking    text,                          -- "-0.025em"
  sample_text text,
  font_px     integer,                       -- noteSize
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 6.4 Archetypes (Arquétipos)
create table public.archetypes (
  id          uuid primary key default gen_random_uuid(),
  brand_id    uuid not null references public.brands (id) on delete cascade,
  name        text not null,                 -- "Sábio"
  body        text,
  is_primary  boolean not null default false,
  percentage  numeric(5,2),                  -- 60
  color_hex   text,
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 6.5 Brand values (Valores)
create table public.brand_values (
  id          uuid primary key default gen_random_uuid(),
  brand_id    uuid not null references public.brands (id) on delete cascade,
  name        text not null,                 -- "Verdade"
  description text,
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 6.6 Personas (Público-Alvo)
create table public.personas (
  id                uuid primary key default gen_random_uuid(),
  brand_id          uuid not null references public.brands (id) on delete cascade,
  tier              persona_tier not null,
  role_label        text,                    -- "Persona Primária"
  nickname          text,                    -- "[Apelido descritivo]"
  wants             text,
  fears             text,
  portrait_asset_id uuid references public.assets (id) on delete set null,
  position          integer not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- 6.7 Positioning (Posicionamento)
create table public.positioning_statements (
  id                 uuid primary key default gen_random_uuid(),
  brand_id           uuid not null references public.brands (id) on delete cascade,
  audience           text,                   -- [público-alvo]
  tension            text,                   -- [tensão central]
  category           text,                   -- [categoria]
  benefit            text,                   -- [benefício único]
  reason_to_believe  text,                   -- [razão para acreditar]
  statement_template text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create table public.positioning_pillars (
  id           uuid primary key default gen_random_uuid(),
  brand_id     uuid not null references public.brands (id) on delete cascade,
  title        text not null,                -- "Público-Alvo"
  body         text,
  linked_route text,                          -- "nucleo/publico"
  position     integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- 6.8 Competitive map (Mapa competitivo)
create table public.competitors (
  id         uuid primary key default gen_random_uuid(),
  brand_id   uuid not null references public.brands (id) on delete cascade,
  label      text not null,                  -- "Concorrente A" / brand name
  axis_x     numeric(5,2) not null,          -- 0..100
  axis_y     numeric(5,2) not null,          -- 0..100
  is_self    boolean not null default false,
  position   integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint competitor_axis_range check (
    axis_x between 0 and 100 and axis_y between 0 and 100
  )
);

-- 6.9 Tone of voice (Tom de Voz)
create table public.voice_traits (
  id         uuid primary key default gen_random_uuid(),
  brand_id   uuid not null references public.brands (id) on delete cascade,
  name       text not null,                  -- "Direto"
  body       text,
  position   integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.voice_examples (
  id         uuid primary key default gen_random_uuid(),
  brand_id   uuid not null references public.brands (id) on delete cascade,
  do_text    text not null,                  -- "Faça assim"
  dont_text  text not null,                  -- "Não faça assim"
  position   integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.voice_registers (
  id         uuid primary key default gen_random_uuid(),
  brand_id   uuid not null references public.brands (id) on delete cascade,
  register   voice_register not null,
  name       text not null,                  -- "Institucional"
  usage      text,                           -- "Site, documentação…"
  example    text,
  position   integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6.10 Vocabulary (Vocabulário) — normalized
create table public.vocabulary_categories (
  id         uuid primary key default gen_random_uuid(),
  brand_id   uuid not null references public.brands (id) on delete cascade,
  name       text not null,                  -- "Produto"
  position   integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (brand_id, name)
);

create table public.vocabulary_words (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.vocabulary_categories (id) on delete cascade,
  word        text not null,
  kind        vocabulary_kind not null,       -- use | avoid
  position    integer not null default 0,
  created_at  timestamptz not null default now()
);

-- 6.11 Word territories (Territórios de Palavras) — normalized
create table public.word_territories (
  id         uuid primary key default gen_random_uuid(),
  brand_id   uuid not null references public.brands (id) on delete cascade,
  name       text not null,                  -- "Cuidado"
  color_hex  text,
  body       text,
  position   integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.word_territory_words (
  id           uuid primary key default gen_random_uuid(),
  territory_id uuid not null references public.word_territories (id) on delete cascade,
  word         text not null,
  position     integer not null default 0,
  created_at   timestamptz not null default now()
);

-- 6.12 Manifesto
create table public.manifestos (
  id          uuid primary key default gen_random_uuid(),
  brand_id    uuid not null references public.brands (id) on delete cascade,
  page_id     uuid references public.pages (id) on delete set null,
  body        text not null,
  signed_by   text,                           -- "time fundador"
  signed_year integer,
  pdf_asset_id uuid references public.assets (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 6.13 Flags / commitments (Bandeiras da Marca)
create table public.flags (
  id            uuid primary key default gen_random_uuid(),
  brand_id      uuid not null references public.brands (id) on delete cascade,
  number        text,                         -- "01"
  title         text not null,                -- "Compromisso"
  body          text,
  is_verifiable boolean not null default true,
  updated_label text,                          -- "Atualizada · 04/26"
  position      integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- 6.14 Logo variants + misuse + minimum sizes (Logotipo)
create table public.logos (
  id            uuid primary key default gen_random_uuid(),
  brand_id      uuid not null references public.brands (id) on delete cascade,
  name          text not null,                -- "Logotipo Primário"
  description   text,                         -- "Para fundos escuros · padrão"
  is_primary    boolean not null default false,
  asset_id      uuid references public.assets (id) on delete set null,
  position      integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.logo_misuses (
  id          uuid primary key default gen_random_uuid(),
  brand_id    uuid not null references public.brands (id) on delete cascade,
  label       text not null,                  -- "Não rotacione"
  description text,
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.logo_min_sizes (
  id         uuid primary key default gen_random_uuid(),
  brand_id   uuid not null references public.brands (id) on delete cascade,
  context    text not null,                   -- "Digital", "Impressão"
  min_size   text not null,                   -- "120px largura"
  body       text,
  position   integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6.15 Graphics (Grafismos)
create table public.graphics (
  id          uuid primary key default gen_random_uuid(),
  brand_id    uuid not null references public.brands (id) on delete cascade,
  name        text not null,                  -- "Hairline"
  svg_markup  text,
  asset_id    uuid references public.assets (id) on delete set null,
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 6.16 Icons (Iconografia)
create table public.icons (
  id         uuid primary key default gen_random_uuid(),
  brand_id   uuid not null references public.brands (id) on delete cascade,
  name       text not null,                   -- "search"
  keywords   text[] not null default '{}',
  asset_id   uuid references public.assets (id) on delete set null,
  position   integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (brand_id, name)
);

-- 6.17 Photography references + technical params (Estilo Fotográfico)
create table public.photography_references (
  id           uuid primary key default gen_random_uuid(),
  brand_id     uuid not null references public.brands (id) on delete cascade,
  label        text not null,                 -- "Retrato · luz lateral"
  aspect_ratio text,                          -- "1", "2", "1/2"
  layout_span  text,                          -- "wide", "tall", null
  image_asset_id uuid references public.assets (id) on delete set null,
  position     integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.photography_params (
  id         uuid primary key default gen_random_uuid(),
  brand_id   uuid not null references public.brands (id) on delete cascade,
  key        text not null,                   -- "Temperatura"
  value      text,                            -- "5600K – 6500K"
  note       text,
  position   integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 7. Embeds, sharing, access, search/assistant, audit
-- ----------------------------------------------------------------------------

-- 7.1 External embeds (Figma/Vídeo/Miro/Drive)
create table public.embeds (
  id         uuid primary key default gen_random_uuid(),
  brand_id   uuid not null references public.brands (id) on delete cascade,
  block_id   uuid references public.blocks (id) on delete set null,
  kind       embed_kind not null default 'Figma',
  title      text not null,
  url        text,
  provider   text,
  position   integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 7.2 Share links (Topbar share — 14-day temp links, visibility público/senha/SSO)
create table public.share_links (
  id            uuid primary key default gen_random_uuid(),
  brand_id      uuid not null references public.brands (id) on delete cascade,
  page_id       uuid references public.pages (id) on delete cascade,
  token         text not null unique default encode(gen_random_bytes(16), 'hex'),
  visibility    visibility_level not null default 'public',
  password_hash text,                          -- when visibility = 'password'
  expires_at    timestamptz,                   -- 14-day temp links
  created_by    uuid references public.profiles (id) on delete set null,
  revoked_at    timestamptz,
  created_at    timestamptz not null default now()
);

-- 7.3 Page access grants (private/SSO pages — "Gerenciar acesso")
create table public.page_access_grants (
  id         uuid primary key default gen_random_uuid(),
  page_id    uuid not null references public.pages (id) on delete cascade,
  user_id    uuid references public.profiles (id) on delete cascade,
  email      citext,                           -- invite before signup
  granted_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  constraint grant_target_present check (user_id is not null or email is not null),
  unique (page_id, user_id),
  unique (page_id, email)
);

-- 7.4 FAQ / AI assistant quick answers (SearchModal QUICK_ANSWERS)
create table public.quick_answers (
  id         uuid primary key default gen_random_uuid(),
  brand_id   uuid not null references public.brands (id) on delete cascade,
  question   text not null,
  answer     text not null,
  position   integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.quick_answer_citations (
  id              uuid primary key default gen_random_uuid(),
  quick_answer_id uuid not null references public.quick_answers (id) on delete cascade,
  label           text not null,               -- "Logotipo · Co-branding"
  route           text not null,               -- "visual/logotipo"
  position        integer not null default 0,
  created_at      timestamptz not null default now()
);

-- 7.5 Search query log (⌘K usage analytics)
create table public.search_queries (
  id           uuid primary key default gen_random_uuid(),
  brand_id     uuid references public.brands (id) on delete set null,
  user_id      uuid references public.profiles (id) on delete set null,
  query        text not null,
  result_count integer,
  created_at   timestamptz not null default now()
);

-- 7.6 Audit log (logs)
create table public.audit_logs (
  id          uuid primary key default gen_random_uuid(),
  brand_id    uuid references public.brands (id) on delete set null,
  actor_id    uuid references public.profiles (id) on delete set null,
  action      audit_action not null,
  entity_type text,                            -- "page", "block", "asset"
  entity_id   uuid,
  metadata    jsonb not null default '{}'::jsonb,
  ip_address  inet,
  user_agent  text,
  created_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 8. Indexes
-- ----------------------------------------------------------------------------

-- Foreign-key / lookup indexes
create index idx_brands_parent            on public.brands (parent_brand_id);
create index idx_brand_memberships_brand  on public.brand_memberships (brand_id);
create index idx_brand_memberships_user   on public.brand_memberships (user_id);
create index idx_sections_brand           on public.sections (brand_id);
create index idx_pages_brand              on public.pages (brand_id);
create index idx_pages_section            on public.pages (section_id);
create index idx_pages_visibility_status  on public.pages (visibility, status);
create index idx_page_tags_page           on public.page_tags (page_id);
create index idx_blocks_page              on public.blocks (page_id);
create index idx_blocks_page_position     on public.blocks (page_id, position);
create index idx_block_revisions_block    on public.block_revisions (block_id);
create index idx_assets_brand             on public.assets (brand_id);
create index idx_assets_kind              on public.assets (brand_id, kind);
create index idx_asset_files_asset        on public.asset_files (asset_id);
create index idx_download_logs_asset      on public.download_logs (asset_id);
create index idx_colors_brand             on public.colors (brand_id);
create index idx_color_combos_brand       on public.color_combinations (brand_id);
create index idx_typo_families_brand      on public.typography_families (brand_id);
create index idx_typo_weights_family      on public.typography_weights (family_id);
create index idx_typo_specimens_brand     on public.typography_specimens (brand_id);
create index idx_archetypes_brand         on public.archetypes (brand_id);
create index idx_values_brand             on public.brand_values (brand_id);
create index idx_personas_brand           on public.personas (brand_id);
create index idx_positioning_pillars_brand on public.positioning_pillars (brand_id);
create index idx_competitors_brand        on public.competitors (brand_id);
create index idx_voice_traits_brand       on public.voice_traits (brand_id);
create index idx_voice_examples_brand     on public.voice_examples (brand_id);
create index idx_voice_registers_brand    on public.voice_registers (brand_id);
create index idx_vocab_categories_brand   on public.vocabulary_categories (brand_id);
create index idx_vocab_words_category     on public.vocabulary_words (category_id);
create index idx_territories_brand        on public.word_territories (brand_id);
create index idx_territory_words_terr     on public.word_territory_words (territory_id);
create index idx_manifestos_brand         on public.manifestos (brand_id);
create index idx_flags_brand              on public.flags (brand_id);
create index idx_logos_brand              on public.logos (brand_id);
create index idx_logo_misuses_brand       on public.logo_misuses (brand_id);
create index idx_logo_min_sizes_brand     on public.logo_min_sizes (brand_id);
create index idx_graphics_brand           on public.graphics (brand_id);
create index idx_icons_brand              on public.icons (brand_id);
create index idx_photo_refs_brand         on public.photography_references (brand_id);
create index idx_photo_params_brand       on public.photography_params (brand_id);
create index idx_embeds_brand             on public.embeds (brand_id);
create index idx_share_links_page         on public.share_links (page_id);
create index idx_share_links_token        on public.share_links (token);
create index idx_page_access_page         on public.page_access_grants (page_id);
create index idx_page_access_user         on public.page_access_grants (user_id);
create index idx_quick_answers_brand      on public.quick_answers (brand_id);
create index idx_qa_citations_qa          on public.quick_answer_citations (quick_answer_id);
create index idx_search_queries_brand     on public.search_queries (brand_id);
create index idx_audit_logs_brand         on public.audit_logs (brand_id);
create index idx_audit_logs_entity        on public.audit_logs (entity_type, entity_id);
create index idx_audit_logs_created       on public.audit_logs (created_at desc);

-- Trigram search indexes (⌘K / asset search)
create index idx_pages_title_trgm   on public.pages   using gin (title gin_trgm_ops);
create index idx_pages_label_trgm   on public.pages   using gin (label gin_trgm_ops);
create index idx_assets_title_trgm  on public.assets  using gin (title gin_trgm_ops);
create index idx_icons_name_trgm    on public.icons   using gin (name gin_trgm_ops);

-- JSONB block content
create index idx_blocks_content_gin on public.blocks using gin (content jsonb_path_ops);

-- ============================================================================
-- End of supabase-schema.sql
-- ============================================================================
