import { supabase } from "../lib/supabase";

/**
 * CRUD de la tabla `tareas`. No se filtra por user_id en las consultas:
 * las políticas RLS ya devuelven solo las filas del usuario autenticado.
 */

export async function listarTareas() {
  const { data, error } = await supabase
    .from("tareas")
    .select("id, titulo, completada, user_id, created_at")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function crearTarea(titulo) {
  // user_id lo pone la base de datos con default auth.uid()
  const { data, error } = await supabase.from("tareas").insert({ titulo }).select().single();
  if (error) throw error;
  return data;
}

export async function editarTarea(id, cambios) {
  const { data, error } = await supabase.from("tareas").update(cambios).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function borrarTarea(id) {
  const { error } = await supabase.from("tareas").delete().eq("id", id);
  if (error) throw error;
}

/**
 * Realtime: escucha INSERT / UPDATE / DELETE de las tareas del usuario.
 * Devuelve la función que cancela la suscripción (cleanup del useEffect).
 */
export function escucharTareas(userId, { alCambiar, alBorrar, alEstado }) {
  const canal = supabase
    .channel(`tareas-${userId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "tareas", filter: `user_id=eq.${userId}` },
      (payload) => {
        if (payload.eventType === "DELETE") alBorrar(payload.old.id);
        else alCambiar(payload.new);
      }
    )
    .subscribe((estado) => alEstado?.(estado));

  return () => supabase.removeChannel(canal);
}
