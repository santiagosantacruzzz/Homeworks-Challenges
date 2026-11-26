import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_KEY;

/**
 * Una sola instancia para toda la app (Clase 10).
 * Si no hay .env, queda en null y la app trabaja con los datos de ejemplo.
 * Solo va la llave publishable: la seguridad real la ponen las políticas RLS.
 */
export const supabase = url && key ? createClient(url, key) : null;

export const hayConexion = supabase !== null;
