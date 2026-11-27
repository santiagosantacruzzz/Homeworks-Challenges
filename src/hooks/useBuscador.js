import { useCallback, useState } from "react";
import Buscador from "../estructuras/Buscador";
import { PRODUCTOS } from "../data/productos";

const CLAVE = "buscador-top-k-v1";

function crear(lista) {
  const b = new Buscador();
  lista.forEach((p) => b.insert(p.name, p.popularity));
  return b;
}

function cargar() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE));
    if (Array.isArray(guardado)) return crear(guardado);
  } catch {
    /* JSON dañado: se usa el catálogo inicial */
  }
  return crear(PRODUCTOS);
}

function guardar(buscador) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(buscador.productos()));
  } catch {
    /* sin localStorage sigue en memoria */
  }
}

/**
 * El Buscador (Trie + Heap) cambia por dentro; `version` le avisa a React que vuelva a pintar.
 */
export function useBuscador() {
  const [buscador, setBuscador] = useState(cargar);
  const [version, setVersion] = useState(0);

  const hacer = useCallback(
    (accion) => {
      const r = accion(buscador);
      guardar(buscador);
      setVersion((v) => v + 1);
      return r;
    },
    [buscador]
  );

  const reiniciar = useCallback(() => {
    const nuevo = crear(PRODUCTOS);
    guardar(nuevo);
    setBuscador(nuevo);
    setVersion((v) => v + 1);
  }, []);

  return { buscador, version, hacer, reiniciar };
}
