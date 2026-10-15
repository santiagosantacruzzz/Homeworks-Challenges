import { useContext } from "react";
import SesionContext from "../context/SesionContext";

export default function useSesion() {
  const valor = useContext(SesionContext);
  if (!valor) throw new Error("useSesion necesita <SesionProvider>");
  return valor;
}
