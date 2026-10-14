import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import PageLoader from "../components/PageLoader";

// Solo con sesión: si no hay usuario, al login (recordando a dónde se quería ir).
export default function PrivateRoute() {
  const { user, authReady } = useContext(AuthContext);
  const location = useLocation();

  if (!authReady) return <PageLoader />;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  return <Outlet />;
}
