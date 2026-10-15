import { useMemo } from "react";
import ArbolNario, { ID_RAIZ } from "../tree/ArbolNario";
import NodoArbol, { ARCHIVO, CARPETA } from "../tree/NodoArbol";
import { disponer, ALTO_NODO, ANCHO_NODO } from "../tree/disposicion";

// Árbol de muestra dibujado con el mismo algoritmo de disposición de la app
function muestra() {
  const a = new ArbolNario();
  const n = (id, tipo = CARPETA) => new NodoArbol({ id, nombre: id, tipo });
  a.agregar(ID_RAIZ, n("Universidad"));
  a.agregar(ID_RAIZ, n("Personal"));
  a.agregar("Universidad", n("Estructuras II"));
  a.agregar("Universidad", n("horario.pdf", ARCHIVO));
  a.agregar("Estructuras II", n("parcial-2.jsx", ARCHIVO));
  a.agregar("Estructuras II", n("arbol.js", ARCHIVO));
  a.agregar("Personal", n("ideas.txt", ARCHIVO));
  const abiertos = new Set(a.dfs().filter((x) => x.esCarpeta).map((x) => x.id));
  return disponer(a, abiertos);
}

export default function Portada({ titulo, children }) {
  const { posiciones, enlaces, ancho, alto } = useMemo(() => muestra(), []);

  return (
    <main className="portada">
      <section className="portada__arte" aria-hidden="true">
        <p className="portada__marca">Ramas</p>
        <svg
          className="portada__arbol"
          viewBox={`-8 -8 ${ancho + 16} ${alto + 16}`}
          preserveAspectRatio="xMinYMid meet"
        >
          {enlaces.map(({ desde, hasta }, i) => {
            const x1 = desde.x + ANCHO_NODO, y1 = desde.y + ALTO_NODO / 2;
            const x2 = hasta.x, y2 = hasta.y + ALTO_NODO / 2, m = (x1 + x2) / 2;
            return (
              <path
                key={hasta.nodo.id}
                d={`M${x1},${y1} C${m},${y1} ${m},${y2} ${x2},${y2}`}
                className="portada__rama"
                style={{ "--i": hasta.nodo.profundidad, "--k": i }}
                pathLength="1"
              />
            );
          })}
          {posiciones.map(({ nodo, x, y }) => (
            <g
              key={nodo.id}
              className={`portada__nodo portada__nodo--${nodo.tipo}`}
              transform={`translate(${x} ${y})`}
              style={{ "--i": nodo.profundidad }}
            >
              <rect width={ANCHO_NODO} height={ALTO_NODO} rx={nodo.esCarpeta ? 10 : 20} />
              <text x={16} y={ALTO_NODO / 2 + 5}>{nodo.nombre}</text>
            </g>
          ))}
        </svg>
        <p className="portada__lema">
          Tus carpetas y archivos, organizados como un árbol que puedes ver crecer.
        </p>
      </section>

      <section className="portada__form">
        <h1>{titulo}</h1>
        {children}
      </section>
    </main>
  );
}
