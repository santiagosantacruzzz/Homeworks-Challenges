import { Navigate } from "react-router-dom";
import useSesion from "../hooks/useSesion";
import Cargando from "../components/Cargando";

/** Solo deja pasar a usuarios registrados con sesión iniciada */
export default function RutaPrivada({ children }) {
  const { usuario, verificando } = useSesion();
  if (verificando) return <Cargando />;
  return usuario ? children : <Navigate to="/ingresar" replace />;
}
