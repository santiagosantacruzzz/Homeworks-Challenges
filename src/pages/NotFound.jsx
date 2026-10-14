import { Link, useLocation } from "react-router-dom";
import TileWord from "../components/TileWord";

// Ruta /* : cualquier dirección que no existe.
export default function NotFound() {
  const location = useLocation();

  return (
    <main className="not-found">
      <TileWord word="404" variant="queue" />
      <h1>Esta página no existe</h1>
      <p>
        No hay nada en <code>{location.pathname}</code>. Los ejercicios están en la pila
        de libros y en la fila del cajero.
      </p>
      <Link className="btn-mint" to="/pila">
        Ir a los ejercicios
      </Link>
    </main>
  );
}
