import { useCallback, useEffect, useRef, useState } from "react";
import { buscarGifs, gifsTendencia, POR_PAGINA } from "../services/gifsService";
import { esCancelacion } from "../api/giphy";

const VACIO = { consulta: null, gifs: [], total: 0, estado: "cargando", error: null };

const pedirPagina = (q, offset, signal) => (q ? buscarGifs(q, offset, signal) : gifsTendencia(offset, signal));

/**
 * Busca GIFs (o trae tendencias si no hay texto) y pagina con offset.
 * Cada resultado queda guardado junto a la búsqueda que lo produjo: si la búsqueda
 * cambia, la pantalla nunca muestra GIFs (ni errores) de la búsqueda anterior.
 * La petición anterior se cancela con AbortController (Clase 13, diapositivas 16 y 37).
 */
export function useGifs(consulta) {
  const q = consulta.trim();
  const [datos, setDatos] = useState(VACIO);
  const control = useRef(null);

  // Primera página: se pide cada vez que cambia la búsqueda
  useEffect(() => {
    const ctrl = new AbortController();
    control.current = ctrl;

    pedirPagina(q, 0, ctrl.signal)
      .then((pagina) => setDatos({ consulta: q, gifs: pagina.gifs, total: pagina.total, estado: "listo", error: null }))
      .catch((e) => {
        if (!esCancelacion(e)) setDatos({ consulta: q, gifs: [], total: 0, estado: "error", error: e.message });
      });

    return () => ctrl.abort(); // cleanup: cancela si cambia la búsqueda o se desmonta
  }, [q]);

  // Mientras llega la respuesta de la búsqueda nueva, se muestra "cargando"
  const actual = datos.consulta === q ? datos : { ...VACIO, consulta: q };

  // Páginas siguientes (offset = cuántos GIFs ya hay)
  const cargarPagina = useCallback(
    async (offset) => {
      const ctrl = new AbortController();
      control.current = ctrl;
      setDatos((d) => ({ ...d, estado: "mas", error: null }));
      try {
        const pagina = await pedirPagina(q, offset, ctrl.signal);
        setDatos((d) => {
          if (d.consulta !== q) return d;
          const vistos = new Set(d.gifs.map((g) => g.id)); // GIPHY a veces repite entre páginas
          return { ...d, gifs: [...d.gifs, ...pagina.gifs.filter((g) => !vistos.has(g.id))], total: pagina.total, estado: "listo" };
        });
      } catch (e) {
        if (!esCancelacion(e)) setDatos((d) => (d.consulta === q ? { ...d, estado: "error", error: e.message } : d));
      }
    },
    [q]
  );

  const hayMas = actual.gifs.length > 0 && actual.gifs.length < actual.total;

  const cargarMas = useCallback(() => {
    if (actual.estado === "listo" && hayMas) cargarPagina(actual.gifs.length);
  }, [actual.estado, actual.gifs.length, hayMas, cargarPagina]);

  /** Si falló la primera página se repite todo; si falló una siguiente, solo esa. */
  const reintentar = () => {
    if (actual.gifs.length) return cargarPagina(actual.gifs.length);
    setDatos(VACIO);
    const ctrl = new AbortController();
    control.current = ctrl;
    pedirPagina(q, 0, ctrl.signal)
      .then((pagina) => setDatos({ consulta: q, gifs: pagina.gifs, total: pagina.total, estado: "listo", error: null }))
      .catch((e) => !esCancelacion(e) && setDatos({ consulta: q, gifs: [], total: 0, estado: "error", error: e.message }));
  };

  // Al desmontar, cancela lo que esté pendiente
  useEffect(() => () => control.current?.abort(), []);

  return { ...actual, hayMas, cargarMas, reintentar, porPagina: POR_PAGINA };
}
