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
