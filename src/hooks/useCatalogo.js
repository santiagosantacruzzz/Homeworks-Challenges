import { useContext } from "react";
import { CatalogoContext } from "../context/CatalogoContext";

export function useCatalogo() {
  const valor = useContext(CatalogoContext);
  if (!valor) throw new Error("useCatalogo debe usarse dentro de <CatalogoProvider>");
  return valor;
}
