import { useCallback, useState } from "react";
import RedSocial from "../estructuras/RedSocial";
import { crearSemilla } from "../data/semilla";

const CLAVE = "atlas-amigos-v1";

function cargar() {
  try {
    const guardado = localStorage.getItem(CLAVE);
    if (guardado) return RedSocial.desdeJSON(JSON.parse(guardado));
  } catch {
    /* si el JSON está dañado se arranca con la semilla */
  }
  return crearSemilla();
}

function guardar(red) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(red.aJSON()));
  } catch {
    /* sin localStorage la app sigue funcionando en memoria */
  }
}

/**
 * La RedSocial es una clase que se modifica por dentro (addNode, addEdge…),
 * así que React no ve el cambio solo: `version` sube para que vuelva a pintar.
 */
export function useAtlas() {
  const [red, setRed] = useState(cargar);
  const [version, setVersion] = useState(0);
  const [error, setError] = useState(null);

  /** Ejecuta una acción sobre la red; si lanza error lo muestra y devuelve null. */
  const hacer = useCallback(
    (accion) => {
      try {
        const resultado = accion(red);
        setError(null);
        guardar(red);
        setVersion((v) => v + 1);
        return resultado ?? true;
      } catch (e) {
        setError(e.message);
        return null;
      }
    },
    [red]
  );

  const reiniciar = useCallback(() => {
    const nueva = crearSemilla();
    setRed(nueva);
    setError(null);
    guardar(nueva);
    setVersion((v) => v + 1);
  }, []);

  return { red, version, error, limpiarError: () => setError(null), hacer, reiniciar };
}
