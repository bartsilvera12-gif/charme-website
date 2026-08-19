-- ============================================================
-- CHARME CMS · SCRIPT COMPLETO (migraciones + seeds en orden)
-- Pegar TODO esto en el SQL Editor de Supabase y ejecutar.
-- Re-ejecutable (idempotente).
-- ============================================================


-- >>>>>>>>>>>>>>>>>>>>>>>>  migrations/0001_schema_and_helpers.sql  <<<<<<<<<<<<<<<<<<<<<<<<

-- ============================================================
-- CHARME CMS · Migración 0001 · Schema, extensiones y helpers
-- Ejecutar en el SQL Editor de Supabase (self-hosted).
-- Todo el contenido propio del proyecto vive en el schema `charme`.
-- NO se crean tablas en `public`. NO se tocan otros schemas.
-- ============================================================

create schema if not exists charme;

-- Extensión para gen_random_uuid()
create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- Trigger genérico para mantener updated_at automáticamente
-- ------------------------------------------------------------
create or replace function charme.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ------------------------------------------------------------
-- Tabla de administradores (vincula auth.users por UUID)
-- charme.admin_users determina quién tiene acceso al panel.
-- NO se guardan contraseñas: la auth la maneja Supabase Auth.
-- ------------------------------------------------------------
create table if not exists charme.admin_users (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  role        text not null default 'admin' check (role in ('superadmin', 'admin', 'editor')),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists trg_admin_users_updated_at on charme.admin_users;
create trigger trg_admin_users_updated_at
  before update on charme.admin_users
  for each row execute function charme.set_updated_at();

-- ------------------------------------------------------------
-- Helper: ¿el usuario actual es un admin activo?
-- SECURITY DEFINER para poder leer charme.admin_users desde las
-- policies sin caer en recursión de RLS.
-- ------------------------------------------------------------
create or replace function charme.is_admin()
returns boolean
language sql
security definer
set search_path = charme, public
stable
as $$
  select exists (
    select 1
    from charme.admin_users a
    where a.id = auth.uid()
      and a.is_active = true
  );
$$;

revoke all on function charme.is_admin() from public;
grant execute on function charme.is_admin() to anon, authenticated, service_role;


-- >>>>>>>>>>>>>>>>>>>>>>>>  migrations/0002_content_tables.sql  <<<<<<<<<<<<<<<<<<<<<<<<

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


-- >>>>>>>>>>>>>>>>>>>>>>>>  migrations/0003_rls_and_grants.sql  <<<<<<<<<<<<<<<<<<<<<<<<

-- ============================================================
-- CHARME CMS · Migración 0003 · RLS, policies y grants
-- Público: sólo lee contenido activo.
-- Admin (charme.is_admin()): INSERT / UPDATE / DELETE / lectura total.
-- ============================================================

-- ------------------------------------------------------------
-- GRANTS a nivel de schema y tablas (PostgREST usa anon/authenticated)
-- ------------------------------------------------------------
grant usage on schema charme to anon, authenticated, service_role;

grant select on all tables in schema charme to anon, authenticated;
grant insert, update, delete on all tables in schema charme to authenticated;
grant all on all tables in schema charme to service_role;

-- Que futuras tablas del schema hereden los mismos grants
alter default privileges in schema charme grant select on tables to anon, authenticated;
alter default privileges in schema charme grant insert, update, delete on tables to authenticated;
alter default privileges in schema charme grant all on tables to service_role;

-- ------------------------------------------------------------
-- Habilitar RLS en todas las tablas del schema
-- ------------------------------------------------------------
do $$
declare t text;
  tables text[] := array[
    'admin_users','site_settings','contact_settings','home_content','about_content','about_values',
    'course_categories','courses','course_learning_items','course_modules','course_requirements',
    'professionals','gallery_items','testimonials','faqs'
  ];
begin
  foreach t in array tables loop
    execute format('alter table charme.%I enable row level security;', t);
  end loop;
end $$;

-- ------------------------------------------------------------
-- Policies estándar para tablas con columna is_active
-- (lectura pública de activos + lectura admin; escritura sólo admin)
-- ------------------------------------------------------------
do $$
declare t text;
  tables text[] := array[
    'home_content','about_values','course_categories','courses',
    'professionals','gallery_items','testimonials','faqs'
  ];
begin
  foreach t in array tables loop
    execute format('drop policy if exists %1$s_read on charme.%1$s;', t);
    execute format('drop policy if exists %1$s_insert on charme.%1$s;', t);
    execute format('drop policy if exists %1$s_update on charme.%1$s;', t);
    execute format('drop policy if exists %1$s_delete on charme.%1$s;', t);

    execute format($p$create policy %1$s_read on charme.%1$s
      for select using (is_active = true or charme.is_admin());$p$, t);
    execute format($p$create policy %1$s_insert on charme.%1$s
      for insert with check (charme.is_admin());$p$, t);
    execute format($p$create policy %1$s_update on charme.%1$s
      for update using (charme.is_admin()) with check (charme.is_admin());$p$, t);
    execute format($p$create policy %1$s_delete on charme.%1$s
      for delete using (charme.is_admin());$p$, t);
  end loop;
end $$;

-- ------------------------------------------------------------
-- Singletons de configuración: lectura pública total, escritura admin
-- ------------------------------------------------------------
do $$
declare t text;
  tables text[] := array['site_settings','contact_settings','about_content'];
begin
  foreach t in array tables loop
    execute format('drop policy if exists %1$s_read on charme.%1$s;', t);
    execute format('drop policy if exists %1$s_write on charme.%1$s;', t);
    execute format($p$create policy %1$s_read on charme.%1$s
      for select using (true);$p$, t);
    execute format($p$create policy %1$s_write on charme.%1$s
      for all using (charme.is_admin()) with check (charme.is_admin());$p$, t);
  end loop;
end $$;

-- ------------------------------------------------------------
-- Tablas hijas de courses: lectura pública si el curso padre está activo
-- ------------------------------------------------------------
do $$
declare t text;
  tables text[] := array['course_learning_items','course_modules','course_requirements'];
begin
  foreach t in array tables loop
    execute format('drop policy if exists %1$s_read on charme.%1$s;', t);
    execute format('drop policy if exists %1$s_write on charme.%1$s;', t);
    execute format($p$create policy %1$s_read on charme.%1$s
      for select using (
        charme.is_admin() or exists (
          select 1 from charme.courses c
          where c.id = %1$s.course_id and c.is_active = true
        )
      );$p$, t);
    execute format($p$create policy %1$s_write on charme.%1$s
      for all using (charme.is_admin()) with check (charme.is_admin());$p$, t);
  end loop;
end $$;

-- ------------------------------------------------------------
-- admin_users: sólo administradores pueden ver/gestionar.
-- No hay registro público. La creación inicial se hace por SQL/service_role.
-- ------------------------------------------------------------
drop policy if exists admin_users_read on charme.admin_users;
drop policy if exists admin_users_write on charme.admin_users;

create policy admin_users_read on charme.admin_users
  for select using (charme.is_admin() or id = auth.uid());
create policy admin_users_write on charme.admin_users
  for all using (charme.is_admin()) with check (charme.is_admin());


-- >>>>>>>>>>>>>>>>>>>>>>>>  migrations/0004_storage.sql  <<<<<<<<<<<<<<<<<<<<<<<<

-- ============================================================
-- CHARME CMS · Migración 0004 · Supabase Storage
-- Bucket público de sólo-lectura; escritura restringida a admins.
-- ============================================================

insert into storage.buckets (id, name, public)
values ('charme-media', 'charme-media', true)
on conflict (id) do nothing;

-- Lectura pública de los archivos del bucket
drop policy if exists "charme_media_public_read" on storage.objects;
create policy "charme_media_public_read"
  on storage.objects for select
  using (bucket_id = 'charme-media');

-- Subida sólo para administradores activos
drop policy if exists "charme_media_admin_insert" on storage.objects;
create policy "charme_media_admin_insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'charme-media' and charme.is_admin());

-- Actualizar (reemplazar) sólo admins
drop policy if exists "charme_media_admin_update" on storage.objects;
create policy "charme_media_admin_update"
  on storage.objects for update to authenticated
  using (bucket_id = 'charme-media' and charme.is_admin())
  with check (bucket_id = 'charme-media' and charme.is_admin());

-- Eliminar sólo admins
drop policy if exists "charme_media_admin_delete" on storage.objects;
create policy "charme_media_admin_delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'charme-media' and charme.is_admin());


-- >>>>>>>>>>>>>>>>>>>>>>>>  seed/0001_seed_courses.sql  <<<<<<<<<<<<<<<<<<<<<<<<

-- ============================================================
-- CHARME CMS · Seed 0001 · Categorías y formaciones (generado desde data.ts)
-- Idempotente: usa ON CONFLICT sobre slug. Re-ejecutable.
-- ============================================================

-- Categorías
insert into charme.course_categories (name, slug, sort_order)
  values ('Colorimetría', 'colorimetria', 0)
  on conflict (slug) do update set name = excluded.name, sort_order = excluded.sort_order;
insert into charme.course_categories (name, slug, sort_order)
  values ('Barbería', 'barberia', 1)
  on conflict (slug) do update set name = excluded.name, sort_order = excluded.sort_order;
insert into charme.course_categories (name, slug, sort_order)
  values ('Maquillaje', 'maquillaje', 2)
  on conflict (slug) do update set name = excluded.name, sort_order = excluded.sort_order;

-- Formaciones + contenidos relacionados

-- Colorimetría inicial
with cat as (select id from charme.course_categories where slug = 'colorimetria'),
ins as (
  insert into charme.courses
    (slug, name, price, image_url, category_id, duration, mode, level, certificate, intro, overview, is_active, is_featured, sort_order)
  select 'colorimetria-inicial', 'Colorimetría inicial', 'Gs. 250.000', '/images/colorimetria-inicial.webp', cat.id, '4 semanas', '100% online', 'Inicial', 'Certificado digital al finalizar', 'El punto de partida ideal para entender el color con base técnica y profesional.', 'En Colorimetría inicial vas a construir la base técnica que todo profesional de la belleza necesita: entender qué pasa en el cabello cuando aplicamos color. Trabajamos desde los fundamentos — reflejos, subtonos, neutralización — hasta las primeras aplicaciones prácticas con protocolo profesional.', true, false, 0
  from cat
  on conflict (slug) do update set
    name = excluded.name, price = excluded.price, image_url = excluded.image_url,
    category_id = excluded.category_id, duration = excluded.duration, mode = excluded.mode,
    level = excluded.level, certificate = excluded.certificate, intro = excluded.intro,
    overview = excluded.overview, sort_order = excluded.sort_order
  returning id
)
select id from ins;
delete from charme.course_learning_items where course_id = (select id from charme.courses where slug = 'colorimetria-inicial');
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Fundamentos de teoría del color aplicada al cabello', 0 from charme.courses where slug = 'colorimetria-inicial';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Lectura de reflejos, subtonos y neutralización', 1 from charme.courses where slug = 'colorimetria-inicial';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Preparación segura de fórmulas y decoloración', 2 from charme.courses where slug = 'colorimetria-inicial';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Técnicas de aplicación limpia y precisa', 3 from charme.courses where slug = 'colorimetria-inicial';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Diagnóstico previo y protocolos de cuidado', 4 from charme.courses where slug = 'colorimetria-inicial';
delete from charme.course_modules where course_id = (select id from charme.courses where slug = 'colorimetria-inicial');
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 1 — Fundamentos del color', 'Círculo cromático, reflejos, subtonos y cómo se combinan en el cabello.', 0 from charme.courses where slug = 'colorimetria-inicial';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 2 — Diagnóstico del cabello', 'Cómo leer el cabello del cliente antes de tocar el color: porosidad, historial, altura de tono.', 1 from charme.courses where slug = 'colorimetria-inicial';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 3 — Preparación y fórmulas', 'Mezclas seguras, proporciones y elección del oxidante correcto.', 2 from charme.courses where slug = 'colorimetria-inicial';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 4 — Aplicación práctica', 'Técnicas limpias de aplicación paso a paso con protocolo profesional.', 3 from charme.courses where slug = 'colorimetria-inicial';
delete from charme.course_requirements where course_id = (select id from charme.courses where slug = 'colorimetria-inicial');
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Ganas de aprender desde cero', 0 from charme.courses where slug = 'colorimetria-inicial';
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Acceso a computadora o celular con internet', 1 from charme.courses where slug = 'colorimetria-inicial';
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Kit básico de práctica (opcional para las clases guiadas)', 2 from charme.courses where slug = 'colorimetria-inicial';

-- Colorimetría técnico 1
with cat as (select id from charme.course_categories where slug = 'colorimetria'),
ins as (
  insert into charme.courses
    (slug, name, price, image_url, category_id, duration, mode, level, certificate, intro, overview, is_active, is_featured, sort_order)
  select 'colorimetria-tecnico-1', 'Colorimetría técnico 1', 'Gs. 300.000', '/images/colorimetria-tecnico-1.webp', cat.id, '6 semanas', '100% online', 'Técnico', 'Certificado digital al finalizar', 'Segundo nivel para consolidar la técnica con casos reales y clientas exigentes.', 'Ya conocés la base — ahora vamos a la técnica que se vende. Trabajamos casos reales de coloración, corrección y elaboración de mechas con protocolo profesional. Ideal para quienes ya trabajan en salón y quieren subir el nivel.', true, false, 1
  from cat
  on conflict (slug) do update set
    name = excluded.name, price = excluded.price, image_url = excluded.image_url,
    category_id = excluded.category_id, duration = excluded.duration, mode = excluded.mode,
    level = excluded.level, certificate = excluded.certificate, intro = excluded.intro,
    overview = excluded.overview, sort_order = excluded.sort_order
  returning id
)
select id from ins;
delete from charme.course_learning_items where course_id = (select id from charme.courses where slug = 'colorimetria-tecnico-1');
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Corrección de color y neutralización avanzada', 0 from charme.courses where slug = 'colorimetria-tecnico-1';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Técnicas de mechas: babylights, balayage y clásicas', 1 from charme.courses where slug = 'colorimetria-tecnico-1';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Fórmulas para coberturas de canas', 2 from charme.courses where slug = 'colorimetria-tecnico-1';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Cronograma capilar y cuidado post-color', 3 from charme.courses where slug = 'colorimetria-tecnico-1';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Precificación y comunicación con la clienta', 4 from charme.courses where slug = 'colorimetria-tecnico-1';
delete from charme.course_modules where course_id = (select id from charme.courses where slug = 'colorimetria-tecnico-1');
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 1 — Corrección de color', 'Cómo diagnosticar y corregir errores comunes en coloraciones previas.', 0 from charme.courses where slug = 'colorimetria-tecnico-1';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 2 — Mechas modernas', 'Babylights, balayage y mechas clásicas con paso a paso.', 1 from charme.courses where slug = 'colorimetria-tecnico-1';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 3 — Cobertura de canas', 'Fórmulas de larga duración para diferentes tipos de cana.', 2 from charme.courses where slug = 'colorimetria-tecnico-1';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 4 — Cronograma capilar', 'Cómo cuidar el cabello después del proceso químico.', 3 from charme.courses where slug = 'colorimetria-tecnico-1';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 5 — Negocio y precios', 'Cómo cobrar tu trabajo y comunicar el valor de la técnica.', 4 from charme.courses where slug = 'colorimetria-tecnico-1';
delete from charme.course_requirements where course_id = (select id from charme.courses where slug = 'colorimetria-tecnico-1');
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Haber completado Colorimetría inicial o tener conocimientos equivalentes', 0 from charme.courses where slug = 'colorimetria-tecnico-1';
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Acceso a computadora o celular con internet', 1 from charme.courses where slug = 'colorimetria-tecnico-1';

-- Colorimetría técnico 2
with cat as (select id from charme.course_categories where slug = 'colorimetria'),
ins as (
  insert into charme.courses
    (slug, name, price, image_url, category_id, duration, mode, level, certificate, intro, overview, is_active, is_featured, sort_order)
  select 'colorimetria-tecnico-2', 'Colorimetría técnico 2', 'Gs. 350.000', '/images/colorimetria-tecnico-2.webp', cat.id, '8 semanas', '100% online', 'Técnico avanzado', 'Certificado digital al finalizar', 'Especialización en color de alta complejidad y trabajo editorial.', 'Tercer nivel de colorimetría, orientado a especialización. Trabajamos rubios extremos, color creativo, editoriales y técnicas de alta complejidad. Para colorimetristas que quieren distinguirse en el mercado.', true, false, 2
  from cat
  on conflict (slug) do update set
    name = excluded.name, price = excluded.price, image_url = excluded.image_url,
    category_id = excluded.category_id, duration = excluded.duration, mode = excluded.mode,
    level = excluded.level, certificate = excluded.certificate, intro = excluded.intro,
    overview = excluded.overview, sort_order = excluded.sort_order
  returning id
)
select id from ins;
delete from charme.course_learning_items where course_id = (select id from charme.courses where slug = 'colorimetria-tecnico-2');
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Rubios extremos y decoloraciones controladas', 0 from charme.courses where slug = 'colorimetria-tecnico-2';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Color creativo: fantasía, colores directos y semi-permanentes', 1 from charme.courses where slug = 'colorimetria-tecnico-2';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Editorial y color para producciones', 2 from charme.courses where slug = 'colorimetria-tecnico-2';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Protocolos de reconstrucción capilar profesional', 3 from charme.courses where slug = 'colorimetria-tecnico-2';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Consultoría y diagnóstico para clientas complejas', 4 from charme.courses where slug = 'colorimetria-tecnico-2';
delete from charme.course_modules where course_id = (select id from charme.courses where slug = 'colorimetria-tecnico-2');
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 1 — Rubios de alta gama', 'Decoloración segura, matices platino, rubios cálidos y fríos.', 0 from charme.courses where slug = 'colorimetria-tecnico-2';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 2 — Color creativo', 'Aplicación de colores fantasía y directos sobre cabello aclarado.', 1 from charme.courses where slug = 'colorimetria-tecnico-2';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 3 — Reconstrucción', 'Protocolos profesionales para cabellos comprometidos.', 2 from charme.courses where slug = 'colorimetria-tecnico-2';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 4 — Editorial y foto', 'Cómo pensar el color para producciones y redes.', 3 from charme.courses where slug = 'colorimetria-tecnico-2';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 5 — Casos complejos', 'Diagnóstico y resolución de situaciones fuera del manual.', 4 from charme.courses where slug = 'colorimetria-tecnico-2';
delete from charme.course_requirements where course_id = (select id from charme.courses where slug = 'colorimetria-tecnico-2');
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Haber completado Colorimetría técnico 1 o tener experiencia comprobable', 0 from charme.courses where slug = 'colorimetria-tecnico-2';
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Kit profesional propio recomendado', 1 from charme.courses where slug = 'colorimetria-tecnico-2';

-- Técnico superior
with cat as (select id from charme.course_categories where slug = 'colorimetria'),
ins as (
  insert into charme.courses
    (slug, name, price, image_url, category_id, duration, mode, level, certificate, intro, overview, is_active, is_featured, sort_order)
  select 'tecnico-superior', 'Técnico superior', 'Gs. 400.000', '/images/tecnico-superior.webp', cat.id, '12 semanas', 'Online + workshops presenciales', 'Avanzado', 'Certificado técnico superior', 'Formación integral para posicionarte como especialista de referencia.', 'Una formación integral que combina toda la ruta técnica, casos clínicos, negocio y marca personal. Para quien quiere ser referencia en su ciudad.', true, false, 3
  from cat
  on conflict (slug) do update set
    name = excluded.name, price = excluded.price, image_url = excluded.image_url,
    category_id = excluded.category_id, duration = excluded.duration, mode = excluded.mode,
    level = excluded.level, certificate = excluded.certificate, intro = excluded.intro,
    overview = excluded.overview, sort_order = excluded.sort_order
  returning id
)
select id from ins;
delete from charme.course_learning_items where course_id = (select id from charme.courses where slug = 'tecnico-superior');
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Ruta técnica completa: base + avanzada + editorial', 0 from charme.courses where slug = 'tecnico-superior';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Diagnóstico integral y resolución de casos complejos', 1 from charme.courses where slug = 'tecnico-superior';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Marca personal y comunicación profesional', 2 from charme.courses where slug = 'tecnico-superior';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Precificación estratégica y captación de clientas', 3 from charme.courses where slug = 'tecnico-superior';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Protocolos de excelencia y control de calidad', 4 from charme.courses where slug = 'tecnico-superior';
delete from charme.course_modules where course_id = (select id from charme.courses where slug = 'tecnico-superior');
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 1 — Consolidación técnica', 'Repaso y profundización de toda la ruta anterior.', 0 from charme.courses where slug = 'tecnico-superior';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 2 — Casos clínicos', 'Diagnóstico y tratamiento de casos reales complejos.', 1 from charme.courses where slug = 'tecnico-superior';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 3 — Marca personal', 'Cómo construir una marca profesional que atrae.', 2 from charme.courses where slug = 'tecnico-superior';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 4 — Negocio', 'Precios, agenda, retención y crecimiento sostenible.', 3 from charme.courses where slug = 'tecnico-superior';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 5 — Certificación', 'Trabajo final y evaluación integral.', 4 from charme.courses where slug = 'tecnico-superior';
delete from charme.course_requirements where course_id = (select id from charme.courses where slug = 'tecnico-superior');
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Formación previa en colorimetría o experiencia demostrable', 0 from charme.courses where slug = 'tecnico-superior';
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Disponibilidad para prácticas guiadas', 1 from charme.courses where slug = 'tecnico-superior';

-- Master en colorimetría
with cat as (select id from charme.course_categories where slug = 'colorimetria'),
ins as (
  insert into charme.courses
    (slug, name, price, image_url, category_id, duration, mode, level, certificate, intro, overview, is_active, is_featured, sort_order)
  select 'master-colorimetria', 'Master en colorimetría', 'Gs. 500.000', '/images/master-colorimetria.webp', cat.id, '6 meses', 'Online + workshops presenciales', 'Master', 'Certificado Master en alianza con HSB', 'El programa más completo de CHARME, en alianza con la Academia N°1 del mundo en color.', 'El Master en Colorimetría es la propuesta más ambiciosa de Academia CHARME. Un recorrido de 6 meses en alianza con HSB, la academia número 1 del mundo en color, para formar colorimetristas de altísimo nivel. Cupos limitados.', true, true, 4
  from cat
  on conflict (slug) do update set
    name = excluded.name, price = excluded.price, image_url = excluded.image_url,
    category_id = excluded.category_id, duration = excluded.duration, mode = excluded.mode,
    level = excluded.level, certificate = excluded.certificate, intro = excluded.intro,
    overview = excluded.overview, sort_order = excluded.sort_order
  returning id
)
select id from ins;
delete from charme.course_learning_items where course_id = (select id from charme.courses where slug = 'master-colorimetria');
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Todos los contenidos de la ruta técnica CHARME', 0 from charme.courses where slug = 'master-colorimetria';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Metodología HSB de nivel internacional', 1 from charme.courses where slug = 'master-colorimetria';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Master classes con referentes de la industria', 2 from charme.courses where slug = 'master-colorimetria';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Portfolio profesional y prácticas supervisadas', 3 from charme.courses where slug = 'master-colorimetria';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Certificación reconocida a nivel internacional', 4 from charme.courses where slug = 'master-colorimetria';
delete from charme.course_modules where course_id = (select id from charme.courses where slug = 'master-colorimetria');
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Bloque 1 — Fundamentos y técnica', 'Consolidación completa de la base técnica.', 0 from charme.courses where slug = 'master-colorimetria';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Bloque 2 — Avanzado + editorial', 'Rubios extremos, color creativo y editorial.', 1 from charme.courses where slug = 'master-colorimetria';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Bloque 3 — Metodología HSB', 'Contenidos exclusivos de la academia internacional.', 2 from charme.courses where slug = 'master-colorimetria';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Bloque 4 — Master classes', 'Encuentros en vivo con referentes globales.', 3 from charme.courses where slug = 'master-colorimetria';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Bloque 5 — Práctica supervisada', 'Casos reales con acompañamiento de tutor.', 4 from charme.courses where slug = 'master-colorimetria';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Bloque 6 — Trabajo final', 'Portfolio profesional y evaluación integral.', 5 from charme.courses where slug = 'master-colorimetria';
delete from charme.course_requirements where course_id = (select id from charme.courses where slug = 'master-colorimetria');
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Formación previa en colorimetría (mínimo nivel técnico)', 0 from charme.courses where slug = 'master-colorimetria';
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Compromiso con la práctica semanal', 1 from charme.courses where slug = 'master-colorimetria';
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Cupos limitados — postulación previa', 2 from charme.courses where slug = 'master-colorimetria';

-- Barbería inicial
with cat as (select id from charme.course_categories where slug = 'barberia'),
ins as (
  insert into charme.courses
    (slug, name, price, image_url, category_id, duration, mode, level, certificate, intro, overview, is_active, is_featured, sort_order)
  select 'barberia-inicial', 'Barbería inicial', 'Gs. 250.000', '/images/barberia-inicial.webp', cat.id, '4 semanas', '100% online', 'Inicial', 'Certificado digital al finalizar', 'Base sólida en cortes clásicos, herramientas y atención al cliente.', 'Empezá a formarte en barbería con la base técnica que necesitás: manejo de herramientas, cortes clásicos, higiene y atención profesional. Ideal para arrancar de cero.', true, false, 5
  from cat
  on conflict (slug) do update set
    name = excluded.name, price = excluded.price, image_url = excluded.image_url,
    category_id = excluded.category_id, duration = excluded.duration, mode = excluded.mode,
    level = excluded.level, certificate = excluded.certificate, intro = excluded.intro,
    overview = excluded.overview, sort_order = excluded.sort_order
  returning id
)
select id from ins;
delete from charme.course_learning_items where course_id = (select id from charme.courses where slug = 'barberia-inicial');
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Cortes clásicos y contemporáneos con máquina y tijera', 0 from charme.courses where slug = 'barberia-inicial';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Diseño de barba y bigote profesional', 1 from charme.courses where slug = 'barberia-inicial';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Técnicas de degradado (fade) y desvanecido', 2 from charme.courses where slug = 'barberia-inicial';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Higiene, ergonomía y manejo de herramientas', 3 from charme.courses where slug = 'barberia-inicial';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Atención al cliente y estilos según rostro', 4 from charme.courses where slug = 'barberia-inicial';
delete from charme.course_modules where course_id = (select id from charme.courses where slug = 'barberia-inicial');
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 1 — Herramientas y ergonomía', 'Máquinas, tijeras, navajas y cuidado del kit.', 0 from charme.courses where slug = 'barberia-inicial';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 2 — Cortes clásicos', 'Corte de cabello con máquina y tijera paso a paso.', 1 from charme.courses where slug = 'barberia-inicial';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 3 — Barba y bigote', 'Diseño básico y mantenimiento profesional.', 2 from charme.courses where slug = 'barberia-inicial';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 4 — Cliente y salón', 'Higiene, atención y flujo de trabajo profesional.', 3 from charme.courses where slug = 'barberia-inicial';
delete from charme.course_requirements where course_id = (select id from charme.courses where slug = 'barberia-inicial');
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Kit básico de barbería recomendado', 0 from charme.courses where slug = 'barberia-inicial';
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Acceso a computadora o celular con internet', 1 from charme.courses where slug = 'barberia-inicial';

-- Barbería intermedia
with cat as (select id from charme.course_categories where slug = 'barberia'),
ins as (
  insert into charme.courses
    (slug, name, price, image_url, category_id, duration, mode, level, certificate, intro, overview, is_active, is_featured, sort_order)
  select 'barberia-intermedia', 'Barbería intermedia', 'Gs. 300.000', '/images/barberia-intermedia.webp', cat.id, '6 semanas', '100% online', 'Intermedio', 'Certificado digital al finalizar', 'Refiná técnica y sumá degradados, diseños y estilos actuales.', 'Segundo nivel para barberos que ya tienen la base. Trabajamos degradados (fades), diseños y estilos modernos que se demandan hoy en día.', true, false, 6
  from cat
  on conflict (slug) do update set
    name = excluded.name, price = excluded.price, image_url = excluded.image_url,
    category_id = excluded.category_id, duration = excluded.duration, mode = excluded.mode,
    level = excluded.level, certificate = excluded.certificate, intro = excluded.intro,
    overview = excluded.overview, sort_order = excluded.sort_order
  returning id
)
select id from ins;
delete from charme.course_learning_items where course_id = (select id from charme.courses where slug = 'barberia-intermedia');
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Técnicas de fade y desvanecido', 0 from charme.courses where slug = 'barberia-intermedia';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Diseños de barba modernos', 1 from charme.courses where slug = 'barberia-intermedia';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Cortes con estructura y volumen', 2 from charme.courses where slug = 'barberia-intermedia';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Adaptación del corte al tipo de rostro', 3 from charme.courses where slug = 'barberia-intermedia';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Retoque y mantenimiento profesional', 4 from charme.courses where slug = 'barberia-intermedia';
delete from charme.course_modules where course_id = (select id from charme.courses where slug = 'barberia-intermedia');
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 1 — Fade paso a paso', 'Degradados low, mid y high con precisión.', 0 from charme.courses where slug = 'barberia-intermedia';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 2 — Barba de nivel', 'Diseño y perfilado profesional de barba.', 1 from charme.courses where slug = 'barberia-intermedia';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 3 — Cortes con estructura', 'Estilos con volumen, texture y forma.', 2 from charme.courses where slug = 'barberia-intermedia';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 4 — Cliente y estilo', 'Consulta y adaptación al rostro del cliente.', 3 from charme.courses where slug = 'barberia-intermedia';
delete from charme.course_requirements where course_id = (select id from charme.courses where slug = 'barberia-intermedia');
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Haber completado Barbería inicial o experiencia equivalente', 0 from charme.courses where slug = 'barberia-intermedia';
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Kit propio de trabajo', 1 from charme.courses where slug = 'barberia-intermedia';

-- Barbería avanzado
with cat as (select id from charme.course_categories where slug = 'barberia'),
ins as (
  insert into charme.courses
    (slug, name, price, image_url, category_id, duration, mode, level, certificate, intro, overview, is_active, is_featured, sort_order)
  select 'barberia-avanzado', 'Barbería avanzado', 'Gs. 350.000', '/images/barberia-avanzado.webp', cat.id, '8 semanas', 'Online + workshops presenciales', 'Avanzado', 'Certificado digital al finalizar', 'Nivel senior: diseño creativo, técnica editorial y desarrollo de marca personal.', 'Para barberos con experiencia que quieren posicionarse como referencia. Diseño creativo, técnica editorial y desarrollo de marca personal.', true, false, 7
  from cat
  on conflict (slug) do update set
    name = excluded.name, price = excluded.price, image_url = excluded.image_url,
    category_id = excluded.category_id, duration = excluded.duration, mode = excluded.mode,
    level = excluded.level, certificate = excluded.certificate, intro = excluded.intro,
    overview = excluded.overview, sort_order = excluded.sort_order
  returning id
)
select id from ins;
delete from charme.course_learning_items where course_id = (select id from charme.courses where slug = 'barberia-avanzado');
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Diseños creativos y freehand', 0 from charme.courses where slug = 'barberia-avanzado';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Cortes editoriales y de producción', 1 from charme.courses where slug = 'barberia-avanzado';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Colorimetría aplicada a barbería', 2 from charme.courses where slug = 'barberia-avanzado';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Marca personal y redes', 3 from charme.courses where slug = 'barberia-avanzado';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Precificación y modelo de negocio', 4 from charme.courses where slug = 'barberia-avanzado';
delete from charme.course_modules where course_id = (select id from charme.courses where slug = 'barberia-avanzado');
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 1 — Diseño creativo', 'Freehand y patrones para diferenciarte.', 0 from charme.courses where slug = 'barberia-avanzado';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 2 — Cortes editoriales', 'Trabajos de producción y foto.', 1 from charme.courses where slug = 'barberia-avanzado';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 3 — Color en barbería', 'Aplicación de color y decoloración segura.', 2 from charme.courses where slug = 'barberia-avanzado';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 4 — Marca y negocio', 'Cómo posicionarte y cobrar tu trabajo.', 3 from charme.courses where slug = 'barberia-avanzado';
delete from charme.course_requirements where course_id = (select id from charme.courses where slug = 'barberia-avanzado');
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Experiencia previa comprobable en barbería', 0 from charme.courses where slug = 'barberia-avanzado';
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Kit profesional propio', 1 from charme.courses where slug = 'barberia-avanzado';

-- Maquillaje inicial
with cat as (select id from charme.course_categories where slug = 'maquillaje'),
ins as (
  insert into charme.courses
    (slug, name, price, image_url, category_id, duration, mode, level, certificate, intro, overview, is_active, is_featured, sort_order)
  select 'maquillaje-inicial', 'Maquillaje inicial', 'Gs. 250.000', '/images/maquillaje-inicial.webp', cat.id, '4 semanas', '100% online', 'Inicial', 'Certificado digital al finalizar', 'Base técnica y práctica para arrancar en el mundo del maquillaje profesional.', 'Un curso pensado para quien empieza: fundamentos de preparación de piel, uso de productos, cejas, ojos y contorno. Todo lo que necesitás para tus primeros trabajos.', true, false, 8
  from cat
  on conflict (slug) do update set
    name = excluded.name, price = excluded.price, image_url = excluded.image_url,
    category_id = excluded.category_id, duration = excluded.duration, mode = excluded.mode,
    level = excluded.level, certificate = excluded.certificate, intro = excluded.intro,
    overview = excluded.overview, sort_order = excluded.sort_order
  returning id
)
select id from ins;
delete from charme.course_learning_items where course_id = (select id from charme.courses where slug = 'maquillaje-inicial');
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Preparación de piel y elección de bases', 0 from charme.courses where slug = 'maquillaje-inicial';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Técnicas de cejas, ojos y contorno', 1 from charme.courses where slug = 'maquillaje-inicial';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Maquillaje de día, noche y ocasiones especiales', 2 from charme.courses where slug = 'maquillaje-inicial';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Uso profesional de pinceles y productos', 3 from charme.courses where slug = 'maquillaje-inicial';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Fotografía y comunicación de tu trabajo', 4 from charme.courses where slug = 'maquillaje-inicial';
delete from charme.course_modules where course_id = (select id from charme.courses where slug = 'maquillaje-inicial');
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 1 — Preparación de piel', 'Limpieza, hidratación y base para maquillaje.', 0 from charme.courses where slug = 'maquillaje-inicial';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 2 — Cejas y ojos', 'Diseño de cejas y técnicas básicas de ojos.', 1 from charme.courses where slug = 'maquillaje-inicial';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 3 — Rostro completo', 'Contorno, iluminado y rubor.', 2 from charme.courses where slug = 'maquillaje-inicial';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 4 — Práctica integral', 'Maquillaje de día y noche paso a paso.', 3 from charme.courses where slug = 'maquillaje-inicial';
delete from charme.course_requirements where course_id = (select id from charme.courses where slug = 'maquillaje-inicial');
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Kit básico de maquillaje', 0 from charme.courses where slug = 'maquillaje-inicial';
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Acceso a computadora o celular con internet', 1 from charme.courses where slug = 'maquillaje-inicial';

-- Maquillaje intermedio
with cat as (select id from charme.course_categories where slug = 'maquillaje'),
ins as (
  insert into charme.courses
    (slug, name, price, image_url, category_id, duration, mode, level, certificate, intro, overview, is_active, is_featured, sort_order)
  select 'maquillaje-intermedio', 'Maquillaje intermedio', 'Gs. 300.000', '/images/maquillaje-intermedio.webp', cat.id, '6 semanas', '100% online', 'Intermedio', 'Certificado digital al finalizar', 'Sumá técnica de novias, sociales y trabajos de mayor exigencia.', 'Segundo nivel para maquilladoras que ya tienen la base. Trabajamos maquillaje de novias, sociales y técnicas de larga duración.', true, false, 9
  from cat
  on conflict (slug) do update set
    name = excluded.name, price = excluded.price, image_url = excluded.image_url,
    category_id = excluded.category_id, duration = excluded.duration, mode = excluded.mode,
    level = excluded.level, certificate = excluded.certificate, intro = excluded.intro,
    overview = excluded.overview, sort_order = excluded.sort_order
  returning id
)
select id from ins;
delete from charme.course_learning_items where course_id = (select id from charme.courses where slug = 'maquillaje-intermedio');
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Maquillaje de novia y sociales', 0 from charme.courses where slug = 'maquillaje-intermedio';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Cut crease y técnicas de ojos avanzadas', 1 from charme.courses where slug = 'maquillaje-intermedio';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Larga duración y fijación profesional', 2 from charme.courses where slug = 'maquillaje-intermedio';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Adaptación a diferentes tipos de piel', 3 from charme.courses where slug = 'maquillaje-intermedio';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Atención y protocolo con la clienta', 4 from charme.courses where slug = 'maquillaje-intermedio';
delete from charme.course_modules where course_id = (select id from charme.courses where slug = 'maquillaje-intermedio');
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 1 — Novia clásica y moderna', 'Estilos de novia según personalidad.', 0 from charme.courses where slug = 'maquillaje-intermedio';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 2 — Ojos avanzados', 'Cut crease, halo eye y otras técnicas.', 1 from charme.courses where slug = 'maquillaje-intermedio';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 3 — Larga duración', 'Productos y técnicas para 12+ horas.', 2 from charme.courses where slug = 'maquillaje-intermedio';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 4 — Tipos de piel', 'Adaptación a cada piel y edad.', 3 from charme.courses where slug = 'maquillaje-intermedio';
delete from charme.course_requirements where course_id = (select id from charme.courses where slug = 'maquillaje-intermedio');
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Haber completado Maquillaje inicial o experiencia equivalente', 0 from charme.courses where slug = 'maquillaje-intermedio';
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Kit propio con paletas profesionales', 1 from charme.courses where slug = 'maquillaje-intermedio';

-- Maquillaje avanzado
with cat as (select id from charme.course_categories where slug = 'maquillaje'),
ins as (
  insert into charme.courses
    (slug, name, price, image_url, category_id, duration, mode, level, certificate, intro, overview, is_active, is_featured, sort_order)
  select 'maquillaje-avanzado', 'Maquillaje avanzado', 'Gs. 350.000', '/images/maquillaje-avanzado.webp', cat.id, '8 semanas', 'Online + workshops presenciales', 'Avanzado', 'Certificado digital al finalizar', 'Nivel senior: editorial, caracterización y trabajo de foto/video.', 'Para maquilladoras que quieren dar el salto al trabajo editorial, fotográfico y de caracterización. Técnicas de alto nivel y marca personal.', true, false, 10
  from cat
  on conflict (slug) do update set
    name = excluded.name, price = excluded.price, image_url = excluded.image_url,
    category_id = excluded.category_id, duration = excluded.duration, mode = excluded.mode,
    level = excluded.level, certificate = excluded.certificate, intro = excluded.intro,
    overview = excluded.overview, sort_order = excluded.sort_order
  returning id
)
select id from ins;
delete from charme.course_learning_items where course_id = (select id from charme.courses where slug = 'maquillaje-avanzado');
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Maquillaje editorial y de producción', 0 from charme.courses where slug = 'maquillaje-avanzado';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Técnicas para foto y video', 1 from charme.courses where slug = 'maquillaje-avanzado';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Caracterización y efectos', 2 from charme.courses where slug = 'maquillaje-avanzado';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Marca personal y portfolio', 3 from charme.courses where slug = 'maquillaje-avanzado';
insert into charme.course_learning_items (course_id, content, sort_order) select id, 'Networking en la industria', 4 from charme.courses where slug = 'maquillaje-avanzado';
delete from charme.course_modules where course_id = (select id from charme.courses where slug = 'maquillaje-avanzado');
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 1 — Editorial', 'Piel de revista y looks vanguardistas.', 0 from charme.courses where slug = 'maquillaje-avanzado';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 2 — Foto y video', 'Cómo adaptar el make a distintas cámaras.', 1 from charme.courses where slug = 'maquillaje-avanzado';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 3 — Caracterización', 'Introducción a efectos y transformación.', 2 from charme.courses where slug = 'maquillaje-avanzado';
insert into charme.course_modules (course_id, title, detail, sort_order) select id, 'Módulo 4 — Marca y portfolio', 'Construcción de imagen profesional.', 3 from charme.courses where slug = 'maquillaje-avanzado';
delete from charme.course_requirements where course_id = (select id from charme.courses where slug = 'maquillaje-avanzado');
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Experiencia previa demostrable en maquillaje', 0 from charme.courses where slug = 'maquillaje-avanzado';
insert into charme.course_requirements (course_id, content, sort_order) select id, 'Kit profesional completo', 1 from charme.courses where slug = 'maquillaje-avanzado';


-- >>>>>>>>>>>>>>>>>>>>>>>>  seed/0002_seed_content.sql  <<<<<<<<<<<<<<<<<<<<<<<<

-- ============================================================
-- CHARME CMS · Seed 0002 · Contenido (home, nosotros, config, etc.)
-- Idempotente donde es posible (singletons por 'singleton'/'section';
-- listas sólo se insertan si la tabla está vacía).
-- ============================================================

-- ------------------------------------------------------------
-- Configuración general
-- ------------------------------------------------------------
insert into charme.site_settings
  (singleton, site_name, logo_url, favicon_url, whatsapp, phone, email, address,
   copyright, neura_url, payment_terms)
values
  (true, 'Academia CHARME', '/images/logo.png', '/favicon.ico',
   '595986373130', '+595 (986) 373 130', 'academiacharmeparaguay@gmail.com',
   'Avda. Gaspar Rodríguez de Francia c/ Defensores del Chaco — San Lorenzo',
   '© Academia CHARME. Todos los derechos reservados.', 'https://neura.com.py',
   'Precios expresados para pagos en efectivo. Débito: recargo del 5%. Crédito: recargo del 10%.')
on conflict (singleton) do update set
  site_name = excluded.site_name, logo_url = excluded.logo_url, favicon_url = excluded.favicon_url,
  whatsapp = excluded.whatsapp, phone = excluded.phone, email = excluded.email,
  address = excluded.address, copyright = excluded.copyright, neura_url = excluded.neura_url,
  payment_terms = excluded.payment_terms;

-- ------------------------------------------------------------
-- Contacto (fuente canónica)
-- ------------------------------------------------------------
insert into charme.contact_settings
  (singleton, phone, whatsapp, email, address, hours, maps_url, map_embed_url)
values
  (true, '+595 (986) 373 130', '595986373130', 'academiacharmeparaguay@gmail.com',
   'Avda. Gaspar Rodríguez de Francia c/ Defensores del Chaco — San Lorenzo',
   'Lunes a viernes, 08:00 a 18:00 hs',
   'https://www.google.com.py/maps/place/CHARME+SAN+LORENZO/@-25.3417691,-57.5077899,17z',
   'https://www.google.com/maps?q=CHARME+SAN+LORENZO,-25.3417691,-57.5077899&z=16&output=embed')
on conflict (singleton) do update set
  phone = excluded.phone, whatsapp = excluded.whatsapp, email = excluded.email,
  address = excluded.address, hours = excluded.hours, maps_url = excluded.maps_url,
  map_embed_url = excluded.map_embed_url;

-- ------------------------------------------------------------
-- Home por secciones
-- ------------------------------------------------------------
insert into charme.home_content (section, eyebrow, title, subtitle, body, cta_label, cta_url, image_url, extra, sort_order)
values
  ('hero', 'Academia digital CHARME', 'Aprendé de quienes viven la belleza.',
   'Formación profesional, ahora desde cualquier lugar.', null,
   'Explorar formaciones', '#formaciones', '/images/hero.avif',
   '{"badge_left":"Est. Paraguay","badge_right":"+30 años de excelencia","image_secondary":"/images/editorial.webp"}'::jsonb, 0),
  ('academia', 'Nuestra forma de enseñar', 'Experiencia que se enseña.', null,
   'En Academia CHARME transformamos años de experiencia en formación real y aplicable. Enseñamos con excelencia para que desarrolles tu talento, eleves tu técnica y construyas tu propio camino en la belleza.',
   'Conocer la academia', '#profesionales', '/images/galeria/galeria-26.webp', '{}'::jsonb, 1),
  ('formaciones', 'Formaciones CHARME', 'Perfeccioná tu técnica.', null,
   'Elegí la formación que acompaña tu próximo nivel profesional.', null, null, null,
   '{"initial_count":4,"payment_terms":"Precios expresados para pagos en efectivo. Débito: recargo del 5%. Crédito: recargo del 10%."}'::jsonb, 2),
  ('masterclass', 'CHARME Masterclass', 'Llevá tu técnica al próximo nivel.', null, null,
   'Descubrir masterclass', '#formaciones', '/images/masterclass.webp', '{}'::jsonb, 3),
  ('online', 'Experiencia online', 'Tu formación continúa donde estés.', null,
   'Una experiencia online diseñada para acompañarte en cada paso. Accedé a tus cursos, seguí tu progreso y organizá tu aprendizaje con todo en un solo lugar.',
   'Conocer el área del alumno', null, '/images/experiencia-online.png', '{}'::jsonb, 4),
  ('final_cta', 'Academia CHARME', 'Tu próximo nivel empieza acá.', null, null,
   'Explorar formaciones', '#formaciones', '/images/final-cta.webp', '{}'::jsonb, 5)
on conflict (section) do update set
  eyebrow = excluded.eyebrow, title = excluded.title, subtitle = excluded.subtitle,
  body = excluded.body, cta_label = excluded.cta_label, cta_url = excluded.cta_url,
  image_url = excluded.image_url, extra = excluded.extra, sort_order = excluded.sort_order;

-- ------------------------------------------------------------
-- Nosotros
-- ------------------------------------------------------------
insert into charme.about_content
  (singleton, title, main_description, image_url, vision, mission, quote, quote_author)
values
  (true, 'Nosotros',
   'Nacida del fruto de más de 30 años de experiencia de su Directora, la Sra. Mirta Mena. Academia CHARME es una institución creada para brindar una educación de calidad y excelencia a las personas que deseen comenzar a capacitarse como profesional en el ámbito de la Belleza Integral. En alianza con la Academia número 1 del mundo en color, la HSB, impartimos clases con profesionales de primer nivel.',
   '/images/nosotros-hero.webp',
   'Ser la institución líder a nivel nacional de alto adiestramiento profesional por la formación completa de sus profesionales en todas las áreas de la belleza y estética integral.',
   'Proveer al estudiante de Academia CHARME la experiencia más completa, moderna y de excelencia en el aprendizaje, usando metodologías innovadoras a nivel mundial con educadores altamente preparados, fomentando la cultura del estudio constante.',
   'La meta de la educación es el avance en el conocimiento y en la diseminación de la verdad.',
   '— Dir. Gral. Mirta Mena')
on conflict (singleton) do update set
  title = excluded.title, main_description = excluded.main_description, image_url = excluded.image_url,
  vision = excluded.vision, mission = excluded.mission, quote = excluded.quote, quote_author = excluded.quote_author;

insert into charme.about_values (label, sort_order)
select v.label, v.ord from (values
  ('Excelencia', 0), ('Compromiso', 1), ('Integridad', 2), ('Fe y Salvación', 3),
  ('Perseverancia', 4), ('Sacrificio', 5), ('Pasión', 6)
) as v(label, ord)
where not exists (select 1 from charme.about_values);

-- ------------------------------------------------------------
-- Profesionales (Mirta Mena)
-- ------------------------------------------------------------
insert into charme.professionals (name, role_title, eyebrow, short_description, image_url, is_featured, sort_order)
select 'Mirta Mena', 'Master artist', 'Master artist',
  'Una propuesta de formación nacida del oficio, la práctica y la búsqueda constante de excelencia.',
  '/images/mirta.webp', true, 0
where not exists (select 1 from charme.professionals);

-- ------------------------------------------------------------
-- Testimonios
-- ------------------------------------------------------------
insert into charme.testimonials (name, username, body, avatar_url, country, sort_order)
select t.name, t.username, t.body, t.avatar_url, t.country, t.ord from (values
  ('Ana Giménez', '@ana.g', 'Los cursos me cambiaron la forma de trabajar. Práctica pura y bien explicada.', 'https://randomuser.me/api/portraits/women/32.jpg', '🇵🇾 Paraguay', 0),
  ('Sofía Ramírez', '@sofir', 'Aprendí colorimetría desde cero y hoy vivo de esto. Gracias CHARME.', 'https://randomuser.me/api/portraits/women/68.jpg', '🇦🇷 Argentina', 1),
  ('Mateo Rojas', '@mateor', 'Las clases online son claras, con material que se puede ver una y otra vez.', 'https://randomuser.me/api/portraits/men/51.jpg', '🇺🇾 Uruguay', 2),
  ('María Duarte', '@mari', 'Me encantó la forma de enseñar. Muy profesional y humano a la vez.', 'https://randomuser.me/api/portraits/women/53.jpg', '🇵🇾 Paraguay', 3),
  ('Nicolás Vera', '@nicov', 'El master de colorimetría es lo mejor que hice en mi carrera.', 'https://randomuser.me/api/portraits/men/33.jpg', '🇨🇱 Chile', 4),
  ('Lucas Benítez', '@lucasb', 'Muy práctico y aplicable desde el primer día. 100% recomendado.', 'https://randomuser.me/api/portraits/men/22.jpg', '🇧🇴 Bolivia', 5),
  ('Camila Torres', '@camit', 'El área del alumno es cómoda y muy fácil de usar.', 'https://randomuser.me/api/portraits/women/85.jpg', '🇵🇾 Paraguay', 6),
  ('Emma López', '@emma', 'Contenido de altísima calidad. Se nota la experiencia detrás.', 'https://randomuser.me/api/portraits/women/45.jpg', '🇵🇪 Perú', 7),
  ('Carlos Ríos', '@carlos', 'Los tips de Mirta valen oro. Ya se ve el cambio en mi trabajo.', 'https://randomuser.me/api/portraits/men/61.jpg', '🇪🇸 España', 8)
) as t(name, username, body, avatar_url, country, ord)
where not exists (select 1 from charme.testimonials);

-- ------------------------------------------------------------
-- Preguntas frecuentes
-- ------------------------------------------------------------
insert into charme.faqs (question, answer, sort_order)
select f.q, f.a, f.ord from (values
  ('¿Cómo accedo a los cursos?', 'Después de inscribirte, ingresás al área del alumno con tu correo y contraseña para acceder a tus formaciones.', 0),
  ('¿Los cursos tienen certificado?', 'La disponibilidad y las condiciones del certificado se indican en la ficha de cada formación antes de inscribirte.', 1),
  ('¿Puedo estudiar desde mi celular?', 'Sí. La plataforma está preparada para computadora, tablet y celular.', 2),
  ('¿Por cuánto tiempo tengo acceso?', 'El tiempo de acceso puede variar según la formación. Vas a encontrar ese dato dentro del detalle de cada curso.', 3)
) as f(q, a, ord)
where not exists (select 1 from charme.faqs);

-- ------------------------------------------------------------
-- Galería (48 imágenes + 6 videos existentes en /public)
-- Migración inicial referenciando los archivos actuales.
-- ------------------------------------------------------------
insert into charme.gallery_items (type, media_url, alt_text, sort_order)
select 'video',
       '/videos/galeria/galeria-v' || lpad(g::text, 2, '0') || '.mp4',
       'Video de Academia CHARME ' || g, g
from generate_series(1, 6) as g
where not exists (select 1 from charme.gallery_items);

insert into charme.gallery_items (type, media_url, alt_text, sort_order)
select 'image',
       '/images/galeria/galeria-' || lpad(g::text, 2, '0') || '.webp',
       'Trabajo profesional de Academia CHARME ' || g, 100 + g
from generate_series(1, 48) as g
where not exists (select 1 from charme.gallery_items where type = 'image');


-- >>>>>>>>>>>>>>>>>>>>>>>>  seed/0003_seed_admin.sql  <<<<<<<<<<<<<<<<<<<<<<<<

-- ============================================================
-- CHARME CMS · Seed 0003 · Administrador inicial
-- Vincula un usuario existente de auth.users con charme.admin_users.
-- Requiere haber corrido 0001_schema_and_helpers.sql.
-- Cambiá full_name si querés.
-- ============================================================

insert into charme.admin_users (id, full_name, role, is_active)
values ('349eae53-e598-45f4-82cc-758dda4d5db7', 'Administrador CHARME', 'superadmin', true)
on conflict (id) do update set
  role = excluded.role,
  is_active = true,
  full_name = coalesce(charme.admin_users.full_name, excluded.full_name);


-- Refrescar el cache de PostgREST al final
notify pgrst, 'reload schema';
