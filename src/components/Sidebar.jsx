import { NavLink } from "react-router-dom";

function Chevron({ abierto }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={abierto ? "chev chev--open" : "chev"}>
      <path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Un nodo del menú. Se dibuja el ítem y, debajo, sus hijos con el mismo componente:
// es el recorrido DFS del árbol hecho con recursión.
function MenuNodo({ nodo, estado, posicion }) {
  const { title, link } = nodo.valor;
  const { camino, estaAbierto, alternar, alNavegar } = estado;
  const tieneHijos = nodo.hijos.length > 0;
  const abierto = tieneHijos && estaAbierto(nodo);
  const idHijos = `sub-${link.replaceAll("/", "-")}`;

  // Clases para iluminar la rama que va de la raíz a la página abierta.
  const clases = ["node"];
  if (camino.includes(nodo)) clases.push("node--path");
  if (posicion === "antes-del-camino") clases.push("node--pass");

  // Hijo del camino activo entre los hijos de este nodo (para iluminar sus hermanos de arriba).
  const indiceEnCamino = nodo.hijos.findIndex((hijo) => camino.includes(hijo));

  return (
    <li className={clases.join(" ")}>
      <div className="node__row">
        <NavLink to={link} end className="node__link" onClick={alNavegar}>
          {title}
        </NavLink>
        {tieneHijos && (
          <button
            type="button"
            className="node__toggle"
            aria-expanded={abierto}
            aria-controls={idHijos}
            aria-label={`${abierto ? "Cerrar" : "Abrir"} ${title}`}
            onClick={() => alternar(nodo)}
          >
            <Chevron abierto={abierto} />
          </button>
        )}
      </div>

      {abierto && (
        <ul className="branch" id={idHijos}>
          {nodo.hijos.map((hijo, i) => (
            <MenuNodo
              key={hijo.valor.link}
              nodo={hijo}
              estado={estado}
              posicion={indiceEnCamino !== -1 && i < indiceEnCamino ? "antes-del-camino" : null}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

// El menú lateral: imprime el árbol N-ario empezando por la raíz.
export default function Sidebar({ arbol, estado }) {
  const raiz = arbol.raiz;
  const indiceEnCamino = raiz.hijos.findIndex((hijo) => estado.camino.includes(hijo));

  return (
    <nav className="tree-nav" aria-label="Menú principal">
      <NavLink to={raiz.valor.link} end className="tree-nav__root" onClick={estado.alNavegar}>
        <span className="tree-nav__dot" aria-hidden="true" />
        {raiz.valor.title}
      </NavLink>
      <ul className="branch branch--top">
        {raiz.hijos.map((hijo, i) => (
          <MenuNodo
            key={hijo.valor.link}
            nodo={hijo}
            estado={estado}
            posicion={indiceEnCamino !== -1 && i < indiceEnCamino ? "antes-del-camino" : null}
          />
        ))}
      </ul>
    </nav>
  );
}
