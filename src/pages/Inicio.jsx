import { Link } from "react-router-dom";

export default function Inicio({ nodo, arbol }) {
  const total = arbol.nodos().length;

  return (
    <>
      <p className="lead">
        Este menú es un árbol N-ario de {total} ítems y {arbol.altura() + 1} niveles.
        El panel de la izquierda se dibuja recorriéndolo en profundidad (DFS).
      </p>
      <div className="cards">
        {nodo.hijos.map((hijo) => (
          <Link key={hijo.valor.link} to={hijo.valor.link} className="card">
            <strong>{hijo.valor.title}</strong>
            <span>{hijo.valor.link}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
