-- ============================================================
-- CHARME CMS · Migración 0005 · Campus del alumno
-- Alumnos, inscripciones, lecciones (video), progreso y certificados.
-- Ejecutar en el SQL Editor de Supabase.
-- ============================================================

-- ------------------------------------------------------------
-- Alumnos: perfil vinculado a auth.users (para que el admin pueda listarlos)
-- ------------------------------------------------------------
create table if not exists charme.students (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  email       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists trg_students_updated_at on charme.students;
create trigger trg_students_updated_at before update on charme.students
  for each row execute function charme.set_updated_at();

-- Crea automáticamente el perfil de alumno al registrarse un usuario
create or replace function charme.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = charme, public
as $$
begin
  insert into charme.students (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function charme.handle_new_user();

-- Backfill: usuarios ya existentes
insert into charme.students (id, full_name, email)
select id, raw_user_meta_data->>'full_name', email from auth.users
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- Lecciones (contenido en video de cada curso)
-- ------------------------------------------------------------
create table if not exists charme.course_lessons (
  id            uuid primary key default gen_random_uuid(),
  course_id     uuid not null references charme.courses (id) on delete cascade,
  module_title  text,               -- agrupa clases en módulos (ej: "Módulo 1 - Día 1")
  module_order  integer not null default 0,
  title         text not null,
  description   text,
  video_url     text,
  duration      text,
  is_active     boolean not null default true,
  sort_order    integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  created_by   uuid references auth.users (id) on delete set null,
  updated_by   uuid references auth.users (id) on delete set null
);
create index if not exists idx_lessons_course on charme.course_lessons (course_id);

drop trigger if exists trg_course_lessons_updated_at on charme.course_lessons;
create trigger trg_course_lessons_updated_at before update on charme.course_lessons
  for each row execute function charme.set_updated_at();

-- ------------------------------------------------------------
-- Inscripciones: qué alumno tiene acceso a qué curso (lo asigna el admin)
-- ------------------------------------------------------------
create table if not exists charme.enrollments (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references auth.users (id) on delete cascade,
  course_id   uuid not null references charme.courses (id) on delete cascade,
  created_at  timestamptz not null default now(),
  created_by  uuid references auth.users (id) on delete set null,
  unique (student_id, course_id)
);
create index if not exists idx_enrollments_student on charme.enrollments (student_id);
create index if not exists idx_enrollments_course on charme.enrollments (course_id);

-- ------------------------------------------------------------
-- Progreso: lecciones completadas por cada alumno
-- ------------------------------------------------------------
create table if not exists charme.lesson_progress (
  id            uuid primary key default gen_random_uuid(),
  student_id    uuid not null references auth.users (id) on delete cascade,
  lesson_id     uuid not null references charme.course_lessons (id) on delete cascade,
  completed     boolean not null default true,
  completed_at  timestamptz not null default now(),
  unique (student_id, lesson_id)
);
create index if not exists idx_progress_student on charme.lesson_progress (student_id);

-- ------------------------------------------------------------
-- Certificados: se emiten al completar el curso
-- ------------------------------------------------------------
create table if not exists charme.certificates (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references auth.users (id) on delete cascade,
  course_id   uuid not null references charme.courses (id) on delete cascade,
  issued_at   timestamptz not null default now(),
  unique (student_id, course_id)
);

-- ------------------------------------------------------------
-- Teoría del curso (material de estudio: PDFs / textos)
-- ------------------------------------------------------------
create table if not exists charme.course_theory (
  id           uuid primary key default gen_random_uuid(),
  course_id    uuid not null references charme.courses (id) on delete cascade,
  title        text not null,
  content      text,
  file_url     text,
  is_active    boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  created_by   uuid references auth.users (id) on delete set null,
  updated_by   uuid references auth.users (id) on delete set null
);
create index if not exists idx_theory_course on charme.course_theory (course_id);

drop trigger if exists trg_course_theory_updated_at on charme.course_theory;
create trigger trg_course_theory_updated_at before update on charme.course_theory
  for each row execute function charme.set_updated_at();

-- ------------------------------------------------------------
-- Helper: ¿el usuario actual está inscripto en el curso?
-- ------------------------------------------------------------
create or replace function charme.is_enrolled(p_course uuid)
returns boolean
language sql
security definer
set search_path = charme, public
stable
as $$
  select exists (
    select 1 from charme.enrollments e
    where e.course_id = p_course and e.student_id = auth.uid()
  );
$$;
revoke all on function charme.is_enrolled(uuid) from public;
grant execute on function charme.is_enrolled(uuid) to anon, authenticated, service_role;

-- ------------------------------------------------------------
-- Grants
-- ------------------------------------------------------------
grant select on all tables in schema charme to anon, authenticated;
grant insert, update, delete on all tables in schema charme to authenticated;
grant all on all tables in schema charme to service_role;

-- ------------------------------------------------------------
-- RLS
-- ------------------------------------------------------------
alter table charme.students        enable row level security;
alter table charme.course_lessons  enable row level security;
alter table charme.course_theory   enable row level security;
alter table charme.enrollments     enable row level security;
alter table charme.lesson_progress enable row level security;
alter table charme.certificates    enable row level security;

-- students: cada uno ve/edita el suyo; admin ve todos
drop policy if exists students_read on charme.students;
drop policy if exists students_self_upsert on charme.students;
drop policy if exists students_self_update on charme.students;
drop policy if exists students_admin_all on charme.students;
create policy students_read on charme.students for select using (id = auth.uid() or charme.is_admin());
create policy students_self_upsert on charme.students for insert with check (id = auth.uid());
create policy students_self_update on charme.students for update using (id = auth.uid()) with check (id = auth.uid());
create policy students_admin_all on charme.students for all using (charme.is_admin()) with check (charme.is_admin());

-- lecciones: admin gestiona; alumno inscripto (o admin) las ve
drop policy if exists lessons_read on charme.course_lessons;
drop policy if exists lessons_write on charme.course_lessons;
create policy lessons_read on charme.course_lessons for select
  using (charme.is_admin() or (is_active and charme.is_enrolled(course_id)));
create policy lessons_write on charme.course_lessons for all
  using (charme.is_admin()) with check (charme.is_admin());

-- teoría: admin gestiona; alumno inscripto (o admin) la ve
drop policy if exists theory_read on charme.course_theory;
drop policy if exists theory_write on charme.course_theory;
create policy theory_read on charme.course_theory for select
  using (charme.is_admin() or (is_active and charme.is_enrolled(course_id)));
create policy theory_write on charme.course_theory for all
  using (charme.is_admin()) with check (charme.is_admin());

-- inscripciones: alumno ve las suyas; admin gestiona todas
drop policy if exists enrollments_read on charme.enrollments;
drop policy if exists enrollments_admin on charme.enrollments;
create policy enrollments_read on charme.enrollments for select
  using (student_id = auth.uid() or charme.is_admin());
create policy enrollments_admin on charme.enrollments for all
  using (charme.is_admin()) with check (charme.is_admin());

-- progreso: cada alumno gestiona el suyo; admin lo ve
drop policy if exists progress_own on charme.lesson_progress;
drop policy if exists progress_admin_read on charme.lesson_progress;
create policy progress_own on charme.lesson_progress for all
  using (student_id = auth.uid()) with check (student_id = auth.uid());
create policy progress_admin_read on charme.lesson_progress for select
  using (charme.is_admin());

-- certificados: alumno ve los suyos; admin gestiona
drop policy if exists certificates_read on charme.certificates;
drop policy if exists certificates_admin on charme.certificates;
create policy certificates_read on charme.certificates for select
  using (student_id = auth.uid() or charme.is_admin());
create policy certificates_admin on charme.certificates for all
  using (charme.is_admin()) with check (charme.is_admin());

notify pgrst, 'reload schema';
