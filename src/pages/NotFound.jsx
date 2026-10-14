import { Link, useLocation } from "react-router-dom";

export default function NotFound() {
  const location = useLocation();

  return (
    <main className="app-container page page--narrow not-found">
      <p className="not-found__code">404</p>
      <h1 className="page-head__title">Esta página no existe</h1>
      <p className="text-body-secondary">
        No hay nada en <code>{location.pathname}</code>.
      </p>
      <Link to="/tareas" className="btn btn-primary btn-lg">
        Ir a mis tareas
      </Link>
    </main>
  );
}
