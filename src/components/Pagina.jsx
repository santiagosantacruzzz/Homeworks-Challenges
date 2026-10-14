import { Link, useOutletContext } from "react-router-dom";

// Muestra el componente del ítem del menú con su ruta de migas de pan
// (el camino desde la raíz hasta el nodo en el árbol).
export default function Pagina({ nodo, arbol }) {
  const { camino } = useOutletContext();
  const Componente = nodo.valor.component;
  const nivel = camino.length - 1;

  return (
    <article className="page">
      {camino.length > 1 && (
        <nav className="crumbs" aria-label="Ubicación en el menú">
          {camino.slice(0, -1).map((n) => (
            <span key={n.valor.link}>
              <Link to={n.valor.link}>{n.valor.title}</Link>
              <span aria-hidden="true"> / </span>
            </span>
          ))}
        </nav>
      )}
      <h1>{nodo.valor.title}</h1>
      <p className="page__meta">
        <code>{nodo.valor.link}</code>
        <span>Nivel {nivel}</span>
        <span>
          {nodo.hijos.length === 0
            ? "Hoja"
            : `${nodo.hijos.length} ${nodo.hijos.length === 1 ? "hijo" : "hijos"}`}
        </span>
      </p>
      <div className="page__body">
        <Componente nodo={nodo} arbol={arbol} />
      </div>
    </article>
  );
}
