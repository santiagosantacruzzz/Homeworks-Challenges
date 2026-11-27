import { supabase } from "../lib/supabase";

/** Registro con correo y contraseña. Si "Confirm email" está activo, session llega en null. */
export async function registrar({ correo, clave, nombre }) {
  const { data, error } = await supabase.auth.signUp({
    email: correo,
    password: clave,
    options: { data: { nombre } },
  });
  if (error) throw error;
  return { usuario: data.user, requiereConfirmacion: data.session === null };
}

export async function iniciarSesion({ correo, clave }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email: correo, password: clave });
  if (error) throw error;
  return data.session;
}

export async function cerrarSesion() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function obtenerSesion() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/** Escucha login / logout / refresh del token. Devuelve la función para desuscribirse. */
export function escucharSesion(callback) {
  const { data } = supabase.auth.onAuthStateChange((_evento, sesion) => callback(sesion));
  return () => data.subscription.unsubscribe();
}

/** Guarda la ruta del avatar en los metadatos del usuario (auth.users). */
export async function actualizarPerfil(datos) {
  const { data, error } = await supabase.auth.updateUser({ data: datos });
  if (error) throw error;
  return data.user;
}

/** Traduce los mensajes más comunes de Supabase Auth. */
export function mensajeAuth(error) {
  const m = error?.message ?? "";
  if (m.includes("Invalid login credentials")) return "Correo o contraseña incorrectos.";
  if (m.includes("Email not confirmed")) return "Primero confirma tu correo (revisa la bandeja de entrada).";
  if (m.includes("User already registered")) return "Ese correo ya tiene cuenta. Inicia sesión.";
  if (m.includes("Password should be")) return "La contraseña debe tener al menos 6 caracteres.";
  if (m.includes("rate limit")) return "Demasiados intentos. Espera un momento.";
  return m || "Algo salió mal.";
}
