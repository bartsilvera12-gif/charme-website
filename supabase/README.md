# CHARME CMS · Puesta en marcha de Supabase

Pasos a ejecutar **una vez** en tu Supabase self-hosted (`api.neura.com.py`).
Todo el contenido del proyecto vive en el schema `charme`. No se tocan otros schemas.

## 1. Exponer el schema `charme` a la API (PostgREST)

El cliente consulta `charme` vía `.schema('charme')`, así que PostgREST debe exponerlo.

**Opción A — Studio:** Settings → API → *Exposed schemas* → agregá `charme` a la lista
(que quede: `public, storage, graphql_public, charme`) → guardar.

**Opción B — variables de entorno del servidor** (docker-compose / .env de Supabase):

```
PGRST_DB_SCHEMAS=public,storage,graphql_public,charme
```

Luego reiniciá el servicio `rest` (PostgREST):

```
docker compose restart rest
```

## 2. Ejecutar migraciones (SQL Editor, en orden)

1. `migrations/0001_schema_and_helpers.sql`
2. `migrations/0002_content_tables.sql`
3. `migrations/0003_rls_and_grants.sql`
4. `migrations/0004_storage.sql`

## 3. Cargar los datos actuales (seed)

1. `seed/0001_seed_courses.sql`  (11 formaciones + categorías, generado desde el código actual)
2. `seed/0002_seed_content.sql`  (home, nosotros, profesional, testimonios, FAQs, galería, config)

Los seeds son re-ejecutables (idempotentes).

## 4. Crear el primer administrador

No hay registro público de admins. Se crea así:

1. Studio → **Authentication → Users → Add user** → email + contraseña (marcá *Auto Confirm*).
2. Copiá el UUID del usuario creado y ejecutá en el SQL Editor:

```sql
insert into charme.admin_users (id, full_name, role, is_active)
values ('PEGA-AQUI-EL-UUID', 'Tu Nombre', 'superadmin', true);
```

Ese usuario ya puede entrar en `/admin/login`.

## 5. Variables de entorno

- **Local:** ya están en `.env.local` (no se commitea).
- **Vercel:** Project → Settings → Environment Variables, agregá:
  - `NEXT_PUBLIC_SUPABASE_URL` = `https://api.neura.com.py`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (anon key)
  - `SUPABASE_SERVICE_ROLE_KEY` = (service role key — **solo** este proyecto, server-side)
  - `NEXT_PUBLIC_SUPABASE_SCHEMA` = `charme`

## Seguridad

- La `service_role` fue expuesta en el chat: **rotála** cuando termine la configuración
  (Studio → Settings → API → *Generate new service role key*) y actualizá el valor en Vercel y `.env.local`.
- Nunca se usa la `service_role` en el navegador; el import `server-only` lo garantiza.
