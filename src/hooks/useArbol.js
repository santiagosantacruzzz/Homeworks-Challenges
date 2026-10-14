import { useEffect, useMemo, useRef, useState } from "react";
import { ArbolBinario } from "../dataStructures/ArbolBinario";
import { toD3Tree } from "../utils/toD3Tree";

const TIPOS = ["preorden", "inorden", "postorden"];
const PASO_MS = 520;

const prefiereMenosMovimiento = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function crearArbol(serie) {
  const arbol = new ArbolBinario();
  serie.forEach((valor) => arbol.insertar(valor));
  return arbol;
}

// Custom hook: guarda el árbol, expone las acciones y calcula lo que la pantalla necesita.
export function useArbol(serieInicial) {
  const [arbol] = useState(() => crearArbol(serieInicial));
  const [serie, setSerie] = useState(serieInicial); // orden de inserción (para VisuAlgo)
  const [version, setVersion] = useState(0); // cambia cada vez que se modifica el árbol
  const [mensaje, setMensaje] = useState(null);
  const [animacion, setAnimacion] = useState(null); // { tipo, orden, paso, ... }
  const yaImpreso = useRef(false);

  // Al abrir la app se imprimen los recorridos del árbol inicial en la consola (una sola vez).
  useEffect(() => {
    if (yaImpreso.current) return;
    yaImpreso.current = true;
    arbol.imprimirRecorridos();
  }, [arbol]);

  // Avanza la animación paso a paso (recorridos y búsqueda).
  useEffect(() => {
    if (!animacion || animacion.paso >= animacion.orden.length) return;
    const id = setTimeout(
      () => setAnimacion((a) => (a ? { ...a, paso: a.paso + 1 } : a)),
      animacion.paso === 0 ? 120 : PASO_MS,
    );
    return () => clearTimeout(id);
  }, [animacion]);

  const datos = useMemo(() => {
    void version; // el árbol se modifica en sitio: version indica cuándo recalcular
    return {
      d3: toD3Tree(arbol.raiz),
      recorridos: Object.fromEntries(TIPOS.map((tipo) => [tipo, arbol.recorrido(tipo)])),
      stats: {
        nodos: arbol.tamaño(),
        altura: arbol.altura(),
        hojas: arbol.hojas(),
        raiz: arbol.raiz?.valor ?? null,
        minimo: arbol.minimo(),
        maximo: arbol.maximo(),
      },
    };
  }, [arbol, version]);

  const iniciarAnimacion = (anim) => {
    setAnimacion({ ...anim, paso: prefiereMenosMovimiento() ? anim.orden.length : 0 });
  };

  const cambio = () => {
    setVersion((v) => v + 1);
    arbol.imprimirRecorridos(); // cada cambio vuelve a imprimir los recorridos en consola
  };

  const insertar = (valor) => {
    const { camino, padre, lado } = arbol.buscar(valor);
    if (!arbol.insertar(valor)) {
      setMensaje({
        tipo: "aviso",
        texto: `${valor} ya está en el árbol: no se permiten valores repetidos.`,
      });
      iniciarAnimacion({ tipo: "busqueda", orden: camino, encontrado: valor });
      return false;
    }
    setSerie((s) => [...s, valor]);
    cambio();
    setMensaje({
      tipo: "ok",
      texto:
        padre === undefined || padre === null
          ? `${valor} es la nueva raíz del árbol.`
          : `${valor} se insertó a la ${lado} de ${padre}.`,
    });
    iniciarAnimacion({ tipo: "insercion", orden: [...camino, valor], insertado: valor });
    return true;
  };

  const insertarSerie = (valores) => {
    const insertados = [];
    const repetidos = [];
    for (const valor of valores) {
      (arbol.insertar(valor) ? insertados : repetidos).push(valor);
    }
    if (insertados.length) {
      setSerie((s) => [...s, ...insertados]);
      cambio();
    }
    setAnimacion(null);
    const partes = [];
    if (insertados.length)
      partes.push(
        `${insertados.length === 1 ? "Se insertó 1" : `Se insertaron ${insertados.length}`}: ${insertados.join(", ")}.`,
      );
    if (repetidos.length)
      partes.push(`Repetidos (no se insertan): ${repetidos.join(", ")}.`);
    setMensaje({ tipo: insertados.length ? "ok" : "aviso", texto: partes.join(" ") });
  };

  // Escoge al azar entre los números del 1 al 99 que todavía no están en el árbol.
  const insertarAleatorio = () => {
    const libres = Array.from({ length: 99 }, (_, i) => i + 1).filter(
      (valor) => !arbol.contiene(valor),
    );
    if (libres.length === 0) {
      setMensaje({ tipo: "aviso", texto: "Ya están todos los números del 1 al 99." });
      return;
    }
    insertar(libres[Math.floor(Math.random() * libres.length)]);
  };

  // Requisito: función para saber si un valor está en el árbol.
  const buscar = (valor) => {
    const encontrado = arbol.contiene(valor);
    const { camino, padre, lado } = arbol.buscar(valor);
    console.log(`contiene(${valor}) →`, encontrado);
    setMensaje(
      encontrado
        ? {
            tipo: "ok",
            texto: `${valor} sí está en el árbol (${camino.length} ${camino.length === 1 ? "comparación" : "comparaciones"}).`,
          }
        : {
            tipo: "aviso",
            texto: arbol.raiz
              ? `${valor} no está en el árbol. Se revisó ${camino.join(" → ")}; iría a la ${lado} de ${padre}.`
              : `${valor} no está: el árbol está vacío.`,
          },
    );
    iniciarAnimacion({
      tipo: "busqueda",
      orden: camino,
      encontrado: encontrado ? valor : null,
    });
    return encontrado;
  };

  const reproducir = (tipo) => {
    iniciarAnimacion({
      tipo: "recorrido",
      recorrido: tipo,
      orden: datos.recorridos[tipo],
    });
  };

  const cargar = (nuevaSerie) => {
    arbol.vaciar();
    nuevaSerie.forEach((valor) => arbol.insertar(valor));
    setSerie(nuevaSerie);
    setAnimacion(null);
    cambio();
    setMensaje(
      nuevaSerie.length
        ? {
            tipo: "ok",
            texto: "Se cargó la serie de ejemplo de la clase (diapositiva 11).",
          }
        : { tipo: "ok", texto: "El árbol quedó vacío." },
    );
  };

  return {
    ...datos,
    serie,
    mensaje,
    animacion,
    insertar,
    insertarSerie,
    insertarAleatorio,
    buscar,
    reproducir,
    detener: () => setAnimacion(null),
    cargar,
  };
}
