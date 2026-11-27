import { useEffect, useState } from "react";
import { escucharPeticiones } from "../api/giphy";

/** Última petición registrada por los interceptores de Axios. */
export function useRegistro() {
  const [ultima, setUltima] = useState(null);
  useEffect(() => escucharPeticiones(setUltima), []);
  return ultima;
}
