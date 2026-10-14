import { useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { AuthContext } from "../context/AuthContext";
import { CheckIcon } from "../components/Icons";

// Barra superior de las páginas privadas: navegación, usuario actual y logout.
export default function AppLayout() {
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      <Navbar expand="sm" className="app-nav" collapseOnSelect>
        <Container className="app-container">
          <Navbar.Brand as={NavLink} to="/tareas" className="app-nav__brand">
            <span className="app-nav__logo">
              <CheckIcon />
            </span>
            Tareas
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="app-nav-menu" />
          <Navbar.Collapse id="app-nav-menu">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/tareas" end eventKey="tareas">
                Mis tareas
              </Nav.Link>
              <Nav.Link as={NavLink} to="/tareas/nueva" eventKey="nueva">
                Nueva tarea
              </Nav.Link>
            </Nav>

            <div className="app-nav__session">
              <span className="app-nav__avatar" aria-hidden="true">
                {user.name.charAt(0).toUpperCase()}
              </span>
              <span className="app-nav__user">
                <strong>{user.name}</strong>
                <small>{user.email}</small>
              </span>
              {/* Al cerrar sesión, PrivateRoute manda al login. */}
              <Button variant="outline-dark" size="sm" onClick={logout}>
                Cerrar sesión
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Outlet />
    </>
  );
}
