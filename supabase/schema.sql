-- ════════════════════════════════════════════════════════════════
-- Parcial 3 · Repertorio — esquema de Supabase (Clase 10)
-- Ejecutar en: Dashboard → SQL Editor → New query → Run
-- Después ejecutar supabase/semilla.sql para cargar las canciones.
-- ════════════════════════════════════════════════════════════════

-- 1. Canciones (vértices del grafo, palabras del Trie, elementos del Heap)
create table if not exists canciones (
  id bigint generated always as identity primary key,
  titulo text not null check (char_length(titulo) between 1 and 80),
  artista text not null check (char_length(artista) between 1 and 80),
  genero text not null,
  anio int check (anio between 1000 and 2100),
  reproducciones bigint not null default 0 check (reproducciones >= 0),
  created_at timestamptz default now()
);

-- 2. Relaciones de similitud (aristas del grafo NO dirigido).
--    Se guarda una sola fila por par: cancion_a < cancion_b.
create table if not exists relaciones (
  id bigint generated always as identity primary key,
  cancion_a bigint not null references canciones (id) on delete cascade,
  cancion_b bigint not null references canciones (id) on delete cascade,
  created_at timestamptz default now(),
  check (cancion_a < cancion_b),
  unique (cancion_a, cancion_b)
);

-- 3. RLS: cualquiera puede leer el catálogo y proponer canciones nuevas,
--    pero las canciones nuevas arrancan en 0 reproducciones.
--    Nadie puede editar el contador directamente: solo con reproducir().
alter table canciones enable row level security;
alter table relaciones enable row level security;

create policy "leer canciones" on canciones
  for select to anon, authenticated using (true);

create policy "agregar canciones en cero" on canciones
  for insert to anon, authenticated with check (reproducciones = 0);

create policy "leer relaciones" on relaciones
  for select to anon, authenticated using (true);

create policy "agregar relaciones" on relaciones
  for insert to anon, authenticated with check (true);

-- 4. Sumar reproducciones de forma atómica.
--    security definer: corre con permisos del dueño, así el UPDATE no
--    necesita una política abierta en la tabla.
--    `veces` tiene tope para que el botón "simular tendencia" no se abuse.
create or replace function reproducir(cancion_id bigint, veces int default 1)
returns bigint
language sql
security definer
set search_path = public
as $$
  update canciones
     set reproducciones = reproducciones + least(greatest(veces, 1), 250000)
   where id = cancion_id
  returning reproducciones;
$$;

revoke all on function reproducir(bigint, int) from public;
grant execute on function reproducir(bigint, int) to anon, authenticated;

-- 5. Realtime: el ranking (Max Heap) se reacomoda en vivo
--    cuando alguien reproduce o agrega una canción.
alter publication supabase_realtime add table canciones;
alter publication supabase_realtime add table relaciones;
