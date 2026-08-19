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
