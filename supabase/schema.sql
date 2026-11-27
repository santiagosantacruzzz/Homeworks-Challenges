-- ════════════════════════════════════════════════════════════════
-- Challenge 10 · Torre de Control — esquema de Supabase (Clase 10)
-- Ejecutar completo en: Dashboard → SQL Editor → New query → Run
-- ════════════════════════════════════════════════════════════════

-- 1. Tabla de tareas (igual a la de la clase).
--    user_id toma solo el id del usuario que inserta: auth.uid()
create table if not exists tareas (
  id bigint generated always as identity primary key,
  titulo text not null check (char_length(titulo) between 1 and 120),
  completada boolean default false,
  user_id uuid references auth.users default auth.uid(),
  created_at timestamptz default now()
);

-- 2. Permisos base del Data API (los proyectos nuevos no siempre los dan
--    a las tablas creadas por SQL; sin esto la app recibe 0 filas).
grant usage on schema public to authenticated;
grant select, insert, update, delete on tareas to authenticated;

-- 3. RLS: cada usuario solo ve, crea, edita y borra SUS tareas.
alter table tareas enable row level security;

drop policy if exists "ver mis tareas" on tareas;
drop policy if exists "crear mis tareas" on tareas;
drop policy if exists "editar mis tareas" on tareas;
drop policy if exists "borrar mis tareas" on tareas;

create policy "ver mis tareas" on tareas
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "crear mis tareas" on tareas
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "editar mis tareas" on tareas
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "borrar mis tareas" on tareas
  for delete to authenticated using ((select auth.uid()) = user_id);

-- 4. Realtime: la lista se actualiza en vivo.
--    replica identity full → los eventos DELETE traen la fila completa
--    (con user_id), así el filtro por usuario también funciona al borrar.
alter table tareas replica identity full;
alter publication supabase_realtime add table tareas;

-- 5. Storage: bucket "avatars" (público para poder mostrar la foto con su URL).
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

-- Cada usuario sube, reemplaza y borra solo dentro de su carpeta: avatars/<su uid>/...
drop policy if exists "ver mis archivos" on storage.objects;
drop policy if exists "subir a mi carpeta" on storage.objects;
drop policy if exists "reemplazar mis archivos" on storage.objects;
drop policy if exists "eliminar mis archivos" on storage.objects;

-- (upsert necesita poder leer el archivo existente)
create policy "ver mis archivos" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "subir a mi carpeta" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "reemplazar mis archivos" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "eliminar mis archivos" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- Recargar el esquema del Data API
notify pgrst, 'reload schema';
