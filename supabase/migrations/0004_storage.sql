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
