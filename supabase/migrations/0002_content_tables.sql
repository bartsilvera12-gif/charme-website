-- ============================================================
-- CHARME CMS · Migración 0002 · Tablas de contenido
-- ============================================================

-- ------------------------------------------------------------
-- Configuración general del sitio (singleton)
-- ------------------------------------------------------------
create table if not exists charme.site_settings (
  id             uuid primary key default gen_random_uuid(),
  singleton      boolean not null default true unique,   -- garantiza 1 sola fila
  site_name      text not null default 'Academia CHARME',
  logo_url       text,
  favicon_url    text,
  whatsapp       text,
  phone          text,
  email          text,
  address        text,
  instagram      text,
  facebook       text,
  tiktok         text,
  copyright      text,
  neura_url      text,
  payment_terms  text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  created_by     uuid references auth.users (id) on delete set null,
  updated_by     uuid references auth.users (id) on delete set null,
  constraint site_settings_singleton_true check (singleton = true)
);

-- ------------------------------------------------------------
-- Configuración de contacto (singleton) · fuente canónica de contacto
-- ------------------------------------------------------------
create table if not exists charme.contact_settings (
  id             uuid primary key default gen_random_uuid(),
  singleton      boolean not null default true unique,
  phone          text,
  whatsapp       text,
  email          text,
  address        text,
  hours          text,
  maps_url       text,
  map_embed_url  text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  created_by     uuid references auth.users (id) on delete set null,
  updated_by     uuid references auth.users (id) on delete set null,
  constraint contact_settings_singleton_true check (singleton = true)
);

-- ------------------------------------------------------------
-- Contenido del Home por sección (hero, academia, formaciones, ...)
-- ------------------------------------------------------------
create table if not exists charme.home_content (
  id          uuid primary key default gen_random_uuid(),
  section     text not null unique
              check (section in ('hero','academia','formaciones','masterclass','online','final_cta')),
  eyebrow     text,
  title       text,
  subtitle    text,
  body        text,
  cta_label   text,
  cta_url     text,
  image_url   text,
  extra       jsonb not null default '{}'::jsonb,  -- badges, imágenes secundarias, etc.
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid references auth.users (id) on delete set null,
  updated_by  uuid references auth.users (id) on delete set null
);

-- ------------------------------------------------------------
-- Nosotros (singleton) · sólo campos propios de "sobre nosotros"
-- (el contacto vive en contact_settings para no duplicar)
-- ------------------------------------------------------------
create table if not exists charme.about_content (
  id                uuid primary key default gen_random_uuid(),
  singleton         boolean not null default true unique,
  title             text,
  main_description  text,
  image_url         text,
  vision            text,
  mission           text,
  quote             text,
  quote_author      text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  created_by        uuid references auth.users (id) on delete set null,
  updated_by        uuid references auth.users (id) on delete set null,
  constraint about_content_singleton_true check (singleton = true)
);

create table if not exists charme.about_values (
  id          uuid primary key default gen_random_uuid(),
  label       text not null,
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid references auth.users (id) on delete set null,
  updated_by  uuid references auth.users (id) on delete set null
);

-- ------------------------------------------------------------
-- Categorías de formaciones
-- ------------------------------------------------------------
create table if not exists charme.course_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid references auth.users (id) on delete set null,
  updated_by  uuid references auth.users (id) on delete set null
);

-- ------------------------------------------------------------
-- Formaciones (cursos)
-- ------------------------------------------------------------
create table if not exists charme.courses (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  name             text not null,
  price            text,
  image_url        text,
  category_id      uuid references charme.course_categories (id) on delete set null,
  duration         text,
  mode             text,
  level            text,
  certificate      text,
  intro            text,
  overview         text,
  pagopar_url      text,
  alt_enroll_url   text,
  seo_title        text,
  seo_description  text,
  is_active        boolean not null default true,
  is_featured      boolean not null default false,
  sort_order       integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  created_by       uuid references auth.users (id) on delete set null,
  updated_by       uuid references auth.users (id) on delete set null
);
create index if not exists idx_courses_category on charme.courses (category_id);
create index if not exists idx_courses_active on charme.courses (is_active);

-- Lo que vas a aprender
create table if not exists charme.course_learning_items (
  id          uuid primary key default gen_random_uuid(),
  course_id   uuid not null references charme.courses (id) on delete cascade,
  content     text not null,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists idx_learning_course on charme.course_learning_items (course_id);

-- Programa (módulos)
create table if not exists charme.course_modules (
  id          uuid primary key default gen_random_uuid(),
  course_id   uuid not null references charme.courses (id) on delete cascade,
  title       text not null,
  detail      text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists idx_modules_course on charme.course_modules (course_id);

-- Requisitos
create table if not exists charme.course_requirements (
  id          uuid primary key default gen_random_uuid(),
  course_id   uuid not null references charme.courses (id) on delete cascade,
  content     text not null,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists idx_requirements_course on charme.course_requirements (course_id);

-- ------------------------------------------------------------
-- Profesionales
-- ------------------------------------------------------------
create table if not exists charme.professionals (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,
  role_title         text,
  eyebrow            text,
  short_description  text,
  biography          text,
  image_url          text,
  is_active          boolean not null default true,
  is_featured        boolean not null default false,
  sort_order         integer not null default 0,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  created_by         uuid references auth.users (id) on delete set null,
  updated_by         uuid references auth.users (id) on delete set null
);

-- ------------------------------------------------------------
-- Galería (imágenes y videos)
-- ------------------------------------------------------------
create table if not exists charme.gallery_items (
  id           uuid primary key default gen_random_uuid(),
  type         text not null default 'image' check (type in ('image','video')),
  media_url    text not null,
  title        text,
  description  text,
  alt_text     text,
  category     text,
  is_active    boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  created_by   uuid references auth.users (id) on delete set null,
  updated_by   uuid references auth.users (id) on delete set null
);
create index if not exists idx_gallery_active on charme.gallery_items (is_active);

-- ------------------------------------------------------------
-- Testimonios
-- ------------------------------------------------------------
create table if not exists charme.testimonials (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  username    text,
  body        text not null,
  avatar_url  text,
  country     text,
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid references auth.users (id) on delete set null,
  updated_by  uuid references auth.users (id) on delete set null
);

-- ------------------------------------------------------------
-- Preguntas frecuentes
-- ------------------------------------------------------------
create table if not exists charme.faqs (
  id          uuid primary key default gen_random_uuid(),
  question    text not null,
  answer      text not null,
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid references auth.users (id) on delete set null,
  updated_by  uuid references auth.users (id) on delete set null
);

-- ------------------------------------------------------------
-- Triggers updated_at para todas las tablas de contenido
-- ------------------------------------------------------------
do $$
declare
  t text;
  tables text[] := array[
    'site_settings','contact_settings','home_content','about_content','about_values',
    'course_categories','courses','course_learning_items','course_modules','course_requirements',
    'professionals','gallery_items','testimonials','faqs'
  ];
begin
  foreach t in array tables loop
    execute format('drop trigger if exists trg_%1$s_updated_at on charme.%1$s;', t);
    execute format(
      'create trigger trg_%1$s_updated_at before update on charme.%1$s
         for each row execute function charme.set_updated_at();', t);
  end loop;
end $$;
