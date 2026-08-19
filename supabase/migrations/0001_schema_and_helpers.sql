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
