import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CatalogoContext } from "./CatalogoContext";
import Catalogo from "../estructuras/Catalogo";
import { CANCIONES, RELACIONES } from "../data/mock";
import { hayConexion } from "../lib/supabase";
import * as servicio from "../services/cancionesService";

/**
 * Guarda el catálogo (Trie + Max Heap + Grafo) y lo mantiene al día.
 * Las estructuras son objetos mutables, así que viven en un useRef
 * y cada cambio sube `version` para que React vuelva a pintar.
 */
export function CatalogoProvider({ children }) {
  const catalogoRef = useRef(new Catalogo());
  const [version, setVersion] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [seleccionadaId, setSeleccionadaId] = useState(null);
  const [movimientos, setMovimientos] = useState({});
  const [eventos, setEventos] = useState([]);

  const fuente = hayConexion ? "supabase" : "ejemplo";

  const anotar = useCallback((texto) => {
    setEventos((previos) => [{ id: crypto.randomUUID(), texto, hora: new Date() }, ...previos].slice(0, 6));
  }, []);

  /**
   * Aplica un cambio al catálogo y calcula cuántos puestos subió o bajó
   * cada canción en el ranking (para las flechas ▲ ▼).
   */
  const aplicar = useCallback((cambio) => {
    const catalogo = catalogoRef.current;
    const antes = catalogo.posiciones();
    const resultado = cambio(catalogo);
    const despues = catalogo.posiciones();

    const movidas = {};
    for (const [id, puesto] of despues) {
      const previo = antes.get(id);
      if (previo === undefined) movidas[id] = "nueva";
      else if (previo !== puesto) movidas[id] = previo - puesto;
    }
    if (Object.keys(movidas).length) setMovimientos(movidas);
    setVersion((v) => v + 1);
    return resultado;
  }, []);

  // ── Carga inicial ────────────────────────────────────────────
  useEffect(() => {
    let activo = true;

    async function cargar() {
      try {
        const { canciones, relaciones } = hayConexion
          ? await servicio.listarCatalogo()
          : { canciones: CANCIONES, relaciones: RELACIONES };
        if (!activo) return;
        catalogoRef.current = Catalogo.desde(canciones, relaciones);
        setSeleccionadaId(catalogoRef.current.top(1)[0]?.id ?? null);
        setVersion((v) => v + 1);
      } catch (e) {
        if (activo) setError(e.message ?? String(e));
      } finally {
        if (activo) setCargando(false);
      }
    }
    cargar();
    return () => {
      activo = false;
    };
  }, []);

  // ── Realtime (solo con Supabase) ─────────────────────────────
  useEffect(() => {
    if (!hayConexion || cargando) return undefined;

    return servicio.escucharCambios({
      alCambiarCancion: (cancion) => {
        const existia = catalogoRef.current.obtener(cancion.id);
        const antes = existia?.reproducciones ?? 0;
        // El cambio pudo hacerlo esta misma pestaña y ya estar aplicado
        if (existia && antes === cancion.reproducciones) return;
        aplicar((cat) => cat.actualizar(cancion));
        anotar(
          existia
            ? `«${cancion.titulo}» sumó ${(cancion.reproducciones - antes).toLocaleString("es-CO")} reproducciones`
            : `Nueva en el repertorio: «${cancion.titulo}»`
        );
      },
      alBorrarCancion: (id) => aplicar((cat) => cat.eliminar(id)),
      alConectar: (a, b) => aplicar((cat) => cat.conectar(a, b)),
    });
  }, [cargando, aplicar, anotar]);

  // ── Acciones ─────────────────────────────────────────────────
  const sumarReproducciones = useCallback(
    async (id, veces = 1) => {
      const cancion = catalogoRef.current.obtener(id);
      if (!cancion) return;
      try {
        if (hayConexion) {
          // El cambio llega de vuelta por Realtime, pero se aplica ya para no esperar
          const total = await servicio.reproducir(id, veces);
          aplicar((cat) => cat.actualizar({ ...cancion, reproducciones: total }));
        } else {
          aplicar((cat) => cat.actualizar({ ...cancion, reproducciones: cancion.reproducciones + veces }));
        }
        anotar(`«${cancion.titulo}» sumó ${veces.toLocaleString("es-CO")} reproducciones`);
      } catch (e) {
        setError(e.message);
      }
    },
    [aplicar, anotar]
  );

  /**
   * Escoge una canción entre los puestos 4 y 16 y le suma justo lo necesario
   * para adelantar de 1 a 4 puestos: así el percolateUp se ve en el TOP.
   */
  const simularTendencia = useCallback(() => {
    const orden = catalogoRef.current.top(16);
    if (orden.length < 5) return;
    const i = 3 + Math.floor(Math.random() * (orden.length - 3));
    const elegida = orden[i];
    const objetivo = orden[Math.max(0, i - 1 - Math.floor(Math.random() * 4))];
    const pico = Math.min(
      250000,
      objetivo.reproducciones - elegida.reproducciones + 1000 + Math.floor(Math.random() * 15000)
    );
    return sumarReproducciones(elegida.id, pico);
  }, [sumarReproducciones]);

  const agregarCancion = useCallback(
    async (datos, relacionadas = []) => {
      setError(null);
      const catalogo = catalogoRef.current;
      if (catalogo.trie.buscar(datos.titulo).some((c) => c.artista.toLowerCase() === datos.artista.toLowerCase())) {
        throw new Error("Esa canción de ese artista ya está en el repertorio.");
      }

      let nueva;
      if (hayConexion) {
        nueva = await servicio.crearCancion(datos);
        await Promise.all(relacionadas.map((otra) => servicio.conectarCanciones(nueva.id, otra)));
      } else {
        const siguienteId = Math.max(0, ...[...catalogo.porId.keys()].map(Number)) + 1;
        nueva = { ...datos, id: String(siguienteId), reproducciones: 0 };
      }

      aplicar((cat) => {
        cat.agregar(nueva);
        relacionadas.forEach((otra) => cat.conectar(nueva.id, otra));
      });
      anotar(`Nueva en el repertorio: «${nueva.titulo}»`);
      setSeleccionadaId(nueva.id);
      return nueva;
    },
    [aplicar, anotar]
  );

  const valor = useMemo(
    () => ({
      catalogo: catalogoRef.current,
      version,
      fuente,
      cargando,
      error,
      limpiarError: () => setError(null),
      seleccionada: catalogoRef.current.obtener(seleccionadaId),
      seleccionar: setSeleccionadaId,
      movimientos,
      eventos,
      reproducir: sumarReproducciones,
      simularTendencia,
      agregarCancion,
    }),
    // version cambia cada vez que el catálogo cambia por dentro
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [version, fuente, cargando, error, seleccionadaId, movimientos, eventos, sumarReproducciones, simularTendencia, agregarCancion]
  );

  return <CatalogoContext.Provider value={valor}>{children}</CatalogoContext.Provider>;
}
