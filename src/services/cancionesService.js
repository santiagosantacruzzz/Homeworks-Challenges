import { supabase } from "../lib/supabase";

/**
 * Acceso a las tablas `canciones` y `relaciones` de Supabase.
 * Todas las funciones lanzan el error para que el contexto lo muestre.
 */

const aCancion = (fila) => ({ ...fila, id: String(fila.id) });

export async function listarCatalogo() {
  // Las dos consultas son independientes: se lanzan juntas (Clase 13, Promise.all)
  const [canciones, relaciones] = await Promise.all([
    supabase.from("canciones").select("id, titulo, artista, genero, anio, reproducciones"),
    supabase.from("relaciones").select("cancion_a, cancion_b"),
  ]);
  if (canciones.error) throw canciones.error;
  if (relaciones.error) throw relaciones.error;

  return {
    canciones: canciones.data.map(aCancion),
    relaciones: relaciones.data.map((r) => [String(r.cancion_a), String(r.cancion_b)]),
  };
}

export async function crearCancion({ titulo, artista, genero, anio }) {
  const { data, error } = await supabase
    .from("canciones")
    .insert({ titulo, artista, genero, anio })
    .select()
    .single();
  if (error) throw error;
  return aCancion(data);
}

export async function conectarCanciones(idA, idB) {
  const [a, b] = [Number(idA), Number(idB)].sort((x, y) => x - y);
  const { error } = await supabase.from("relaciones").insert({ cancion_a: a, cancion_b: b });
  // 23505 = la arista ya existía (unique), no es un error para el usuario
  if (error && error.code !== "23505") throw error;
}

export async function reproducir(id, veces = 1) {
  const { data, error } = await supabase.rpc("reproducir", { cancion_id: Number(id), veces });
  if (error) throw error;
  return Number(data);
}

/**
 * Realtime: escucha INSERT / UPDATE / DELETE de las dos tablas.
 * Devuelve la función que cancela la suscripción (para el cleanup del useEffect).
 */
export function escucharCambios({ alCambiarCancion, alBorrarCancion, alConectar }) {
  const canal = supabase
    .channel("cambios-repertorio")
    .on("postgres_changes", { event: "*", schema: "public", table: "canciones" }, (payload) => {
      if (payload.eventType === "DELETE") alBorrarCancion(String(payload.old.id));
      else alCambiarCancion(aCancion(payload.new));
    })
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "relaciones" }, (payload) => {
      alConectar(String(payload.new.cancion_a), String(payload.new.cancion_b));
    })
    .subscribe();

  return () => supabase.removeChannel(canal);
}
