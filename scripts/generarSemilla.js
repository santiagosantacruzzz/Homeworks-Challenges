// Genera supabase/semilla.sql a partir de src/data/mock.js
// Uso: npm run semilla
import { CANCIONES, RELACIONES } from "../src/data/mock.js";

const q = (s) => `'${String(s).replace(/'/g, "''")}'`;
const titulo = new Map(CANCIONES.map((c) => [c.id, c.titulo]));

const filas = CANCIONES.map(
  (c) => `  (${q(c.titulo)}, ${q(c.artista)}, ${q(c.genero)}, ${c.anio ?? "null"}, ${c.reproducciones})`
).join(",\n");

const pares = RELACIONES.map(([a, b]) => `  (${q(titulo.get(a))}, ${q(titulo.get(b))})`).join(",\n");

console.log(`-- Semilla generada con: npm run semilla
-- Ejecutar DESPUÉS de schema.sql. Corre como postgres en el SQL Editor,
-- por eso puede cargar reproducciones iniciales distintas de cero.
-- Datos: Spotify Charts Colombia, semana del 19 de noviembre de 2026.

-- Deja las tablas vacías (sirve si ya se había cargado otra semilla)
truncate table relaciones, canciones restart identity;

insert into canciones (titulo, artista, genero, anio, reproducciones) values
${filas};

-- Las aristas se cruzan por título porque los id los genera la base.
insert into relaciones (cancion_a, cancion_b)
select least(a.id, b.id), greatest(a.id, b.id)
from (values
${pares}
) as par(ta, tb)
join canciones a on a.titulo = par.ta
join canciones b on b.titulo = par.tb
on conflict do nothing;`);
