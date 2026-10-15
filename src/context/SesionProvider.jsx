import SesionContext from "./SesionContext";
import useAutenticacion from "../hooks/useAutenticacion";

export default function SesionProvider({ children }) {
  const sesion = useAutenticacion();
  return <SesionContext.Provider value={sesion}>{children}</SesionContext.Provider>;
}
