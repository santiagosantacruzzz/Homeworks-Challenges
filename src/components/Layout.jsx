import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

// Estructura general: menú lateral (el árbol) + contenido de la página.
export default function Layout({ arbol }) {
  const { pathname } = useLocation();
  // Abrir/cerrar a mano: link → true/false, junto con la página en la que se hizo.
  const [manual, setManual] = useState({ ruta: pathname, links: {} });
  const [menuMovil, setMenuMovil] = useState(false);

  const camino = arbol.camino((nodo) => nodo.valor.link === pathname) ?? [];

  // Las ramas del camino a la página actual se abren solas; solo se respeta
  // cerrarlas a mano si se hizo estando ya en esta página.
  const estaAbierto = (nodo) => {
    const elegido = manual.links[nodo.valor.link];
    if (camino.includes(nodo)) return manual.ruta === pathname ? (elegido ?? true) : true;
    return elegido ?? false;
  };

  const estado = {
    camino,
    estaAbierto,
    alternar: (nodo) =>
      setManual((m) => ({
        ruta: pathname,
        links: { ...m.links, [nodo.valor.link]: !estaAbierto(nodo) },
      })),
    alNavegar: () => setMenuMovil(false),
  };

  return (
    <div className={`app${menuMovil ? " app--menu-open" : ""}`}>
      <aside className="side" id="menu-lateral">
        <div className="side__head">
          <p className="side__title">Centro de cuenta</p>
          <p className="side__meta">
            Árbol N-ario de {arbol.nodos().length} ítems, dibujado con DFS
          </p>
        </div>
        <Sidebar arbol={arbol} estado={estado} />
      </aside>

      <button
        type="button"
        className="menu-button"
        aria-expanded={menuMovil}
        aria-controls="menu-lateral"
        onClick={() => setMenuMovil((v) => !v)}
      >
        {menuMovil ? "Cerrar menú" : "Menú"}
      </button>
      {menuMovil && <div className="scrim" onClick={() => setMenuMovil(false)} aria-hidden="true" />}

      <main className="main">
        <Outlet context={{ camino }} />
      </main>
    </div>
  );
}
