import { useContext } from "react";
import ArbolContext from "../context/ArbolContext";

export default function useArbol() {
  const valor = useContext(ArbolContext);
  if (!valor) throw new Error("useArbol necesita <ArbolProvider>");
  return valor;
}
