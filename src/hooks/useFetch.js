import { useEffect, useState } from "react";
import { http } from "../api/http";

/**
 * useFetch de la Clase 13: encapsula estado, cancelación y errores.
 * Si la URL cambia, la petición anterior se cancela con AbortController,
 * así una respuesta vieja nunca pisa a la nueva (race condition).
 */
export function useFetch(url, opciones) {
  const [estado, setEstado] = useState({ data: null, error: null, cargando: Boolean(url) });

  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    setEstado((s) => ({ ...s, cargando: true }));

    http
      .get(url, { ...opciones, signal: controller.signal })
      .then((data) => setEstado({ data, error: null, cargando: false }))
      .catch((error) => {
        if (error.name !== "AbortError") setEstado({ data: null, error, cargando: false });
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return url ? estado : { data: null, error: null, cargando: false };
}
