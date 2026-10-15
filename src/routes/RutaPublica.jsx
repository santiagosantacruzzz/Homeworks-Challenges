import { Navigate, Outlet } from "react-router-dom";
import useSesion from "../hooks/useSesion";
import Cargando from "../components/Cargando";

export default function RutaPublica() {
  const { usuario, verificando } = useSesion();
  if (verificando) return <Cargando />;
  return usuario ? <Navigate to="/" replace /> : <Outlet />;
}
