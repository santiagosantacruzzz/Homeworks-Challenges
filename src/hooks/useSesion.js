import { useEffect, useState } from "react";
import { escucharSesion, obtenerSesion } from "../services/authService";

/** Sesión actual de Supabase Auth. `undefined` mientras carga, `null` si no hay login. */
export function useSesion() {
  const [sesion, setSesion] = useState(undefined);

  useEffect(() => {
    obtenerSesion().then(setSesion);
    return escucharSesion(setSesion);
  }, []);

  return sesion;
}
