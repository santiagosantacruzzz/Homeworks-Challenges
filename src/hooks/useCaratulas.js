import { useEffect, useState } from "react";
import { buscarDetalle } from "../api/itunes";

/**
 * Pide la carátula de varias canciones a la vez con Promise.allSettled
 * (Clase 13): si una falla, las demás se muestran igual. Es justo el caso
 * del dashboard que explica la diapositiva.
 * Devuelve un objeto id -> detalle (o null si esa no se pudo traer).
 */
export function useCaratulas(canciones) {
  const [detalles, setDetalles] = useState({});
  const clave = canciones.map((c) => c.id).join(",");

  useEffect(() => {
    if (!clave) return;
    const controller = new AbortController();

    Promise.allSettled(
      canciones.map((c) => buscarDetalle(c, { signal: controller.signal }))
    ).then((resultados) => {
      if (controller.signal.aborted) return;
      setDetalles((previos) => {
        const siguiente = { ...previos };
        resultados.forEach((r, i) => {
          siguiente[canciones[i].id] = r.status === "fulfilled" ? r.value : null;
        });
        return siguiente;
      });
    });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave]);

  return detalles;
}
