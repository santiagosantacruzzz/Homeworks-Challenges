import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import PageLoader from "../components/PageLoader";

// Login y registro: si ya hay sesión, se va directo a las tareas
// (o a la página que se quería abrir antes de iniciar sesión).
export default function PublicOnlyRoute() {
  const { user, authReady } = useContext(AuthContext);
  const location = useLocation();

  if (!authReady) return <PageLoader />;

  if (user) {
    const from = location.state?.from;
    return <Navigate to={from && from !== "/" ? from : "/tareas"} replace />;
  }

  return <Outlet />;
}
