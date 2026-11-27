import { useEffect, useState } from "react";

/** Espera a que el usuario deje de escribir antes de llamar la API. */
export function useDebounce(valor, ms = 450) {
  const [demorado, setDemorado] = useState(valor);
  useEffect(() => {
    const t = setTimeout(() => setDemorado(valor), ms);
    return () => clearTimeout(t);
  }, [valor, ms]);
  return demorado;
}
