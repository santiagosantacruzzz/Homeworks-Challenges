import { Link } from "react-router-dom";

// Componente de los ítems que agrupan otros (Configuración, Ayuda…):
// muestra sus hijos directos en el árbol.
export default function SeccionIndice({ nodo }) {
  return (
    <ul className="index-list">
      {nodo.hijos.map((hijo) => (
        <li key={hijo.valor.link}>
          <Link to={hijo.valor.link}>
            <span>{hijo.valor.title}</span>
            <span>
              {hijo.hijos.length > 0
                ? `${hijo.hijos.length} ${hijo.hijos.length === 1 ? "opción" : "opciones"}`
                : hijo.valor.link}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
