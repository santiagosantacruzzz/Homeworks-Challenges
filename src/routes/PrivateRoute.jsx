import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Ruta privada: si hay sesión muestra las rutas hijas (<Outlet />);
// si no, redirige al login y recuerda a qué página se quería entrar.
export default function PrivateRoute() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
