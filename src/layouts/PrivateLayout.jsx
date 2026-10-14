import { useContext } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import TileWord from "../components/TileWord";

const linkClass = ({ isActive }) => `shell__link${isActive ? " shell__link--active" : ""}`;

// Encabezado de las páginas privadas: navegación entre los dos ejercicios,
// el usuario con sesión iniciada y el botón para cerrar sesión.
export default function PrivateLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // replace: true para que el botón "Atrás" no regrese a una página privada.
    navigate("/login", { replace: true });
  };

  return (
    <>
      <header className="shell">
        <span className="shell__brand">
          <TileWord word="PC" variant="queue" size="sm" />
          Pilas y colas
        </span>

        <nav className="shell__nav" aria-label="Ejercicios">
          <NavLink to="/pila" className={linkClass}>
            Pila de libros
          </NavLink>
          <NavLink to="/cajero" className={linkClass}>
            Fila del cajero
          </NavLink>
        </nav>

        <div className="shell__session">
          <span className="shell__avatar" aria-hidden="true">
            {user.name.charAt(0).toUpperCase()}
          </span>
          <span className="shell__user">
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </span>
          <button type="button" className="shell__logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <Outlet />
    </>
  );
}
