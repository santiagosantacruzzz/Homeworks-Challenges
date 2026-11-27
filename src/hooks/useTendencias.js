import { useEffect, useState } from "react";
import { busquedasTendencia, categorias } from "../services/gifsService";

const SUGERENCIAS = ["gatos", "feliz", "baile", "fútbol", "aplausos", "wow", "café", "lunes"];

/**
 * Promise.allSettled (Clase 13, diapositiva 21): las dos peticiones salen al tiempo
 * y nunca cae en catch. Si una falla, la otra igual se muestra; si fallan las dos,
 * quedan las sugerencias fijas.
 */
export function useTendencias() {
  const [etiquetas, setEtiquetas] = useState({ tendencia: [], categorias: [], sugerencias: SUGERENCIAS });

  useEffect(() => {
    const ctrl = new AbortController();
    Promise.allSettled([busquedasTendencia(ctrl.signal), categorias(ctrl.signal)]).then(([tend, cats]) => {
      if (ctrl.signal.aborted) return;
      setEtiquetas({
        tendencia: tend.status === "fulfilled" ? tend.value : [],
        categorias: cats.status === "fulfilled" ? cats.value : [],
        sugerencias: SUGERENCIAS,
      });
    });
    return () => ctrl.abort();
  }, []);

  return etiquetas;
}
