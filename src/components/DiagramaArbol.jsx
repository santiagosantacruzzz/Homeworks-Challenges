import { useEffect, useMemo, useRef } from "react";
import useArbol from "../hooks/useArbol";
import { disponer, ALTO_NODO, ANCHO_NODO } from "../tree/disposicion";
import { IconoNodo } from "./Icono";

const MARGEN = 32;

// Rama curva desde el borde derecho del padre hasta el borde izquierdo del hijo
function trazo({ desde, hasta }) {
  const x1 = desde.x + ANCHO_NODO;
  const y1 = desde.y + ALTO_NODO / 2;
  const x2 = hasta.x;
  const y2 = hasta.y + ALTO_NODO / 2;
  const medio = (x1 + x2) / 2;
  return `M${x1},${y1} C${medio},${y1} ${medio},${y2} ${x2},${y2}`;
}

export default function DiagramaArbol({ resaltados = null }) {
  const { arbol, abiertos, alternar, seleccionado, seleccionar, esDelUsuario } = useArbol();
  const lienzo = useRef(null);

  // Posiciones calculadas sobre el árbol n-ario (ver tree/disposicion.js)
  const { posiciones, enlaces, ancho, alto } = useMemo(
    () => disponer(arbol, abiertos),
    [arbol, abiertos]
  );

  // Mantiene visible el nodo seleccionado
  useEffect(() => {
    lienzo.current
      ?.querySelector(`[data-id="${seleccionado.id}"]`)
      ?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [seleccionado.id]);

  const enCamino = new Set(arbol.camino(seleccionado.id).map((n) => n.id));

  return (
    <div className="diagrama" ref={lienzo}>
      <div
        className="diagrama__lienzo"
        style={{ width: ancho + MARGEN * 2, height: alto + MARGEN * 2 }}
      >
        <svg
          className="diagrama__ramas"
          width={ancho + MARGEN * 2}
          height={alto + MARGEN * 2}
          aria-hidden="true"
        >
          <g transform={`translate(${MARGEN} ${MARGEN})`}>
            {enlaces.map((e) => (
              <path
                key={e.hasta.nodo.id}
                d={trazo(e)}
                className={enCamino.has(e.hasta.nodo.id) ? "rama rama--activa" : "rama"}
              />
            ))}
          </g>
        </svg>

        <ul className="diagrama__nodos" aria-label="Árbol de carpetas y archivos">
          {posiciones.map(({ nodo, x, y }) => {
            const abierto = abiertos.has(nodo.id);
            const activo = nodo.id === seleccionado.id;
            // Con una consulta activa, lo que no coincide se atenúa
            const atenuado = resaltados && nodo.padre && !resaltados.has(nodo.id);
            return (
              <li
                key={nodo.id}
                data-id={nodo.id}
                className={`nodo nodo--${nodo.tipo}${activo ? " es-activo" : ""}${nodo.padre ? "" : " nodo--raiz"}${atenuado ? " es-atenuado" : ""}`}
                style={{ transform: `translate(${x + MARGEN}px, ${y + MARGEN}px)` }}
              >
                <button
                  type="button"
                  className="nodo__boton"
                  onClick={() => seleccionar(nodo.id)}
                  aria-current={activo ? "true" : undefined}
                  title={arbol.ruta(nodo.id)}
                >
                  <IconoNodo nodo={nodo} />
                  <span className="nodo__nombre">{nodo.nombre}</span>
                  {nodo.padre && esDelUsuario(nodo) && (
                    <span className="nodo__propio" title="Creado por ti">
                      <span className="sr-only">(creado por ti)</span>
                    </span>
                  )}
                </button>

                {nodo.esCarpeta && nodo.hijos.length > 0 && (
                  <button
                    type="button"
                    className={`nodo__plegar${abierto ? " esta-abierto" : ""}`}
                    onClick={() => alternar(nodo.id)}
                    aria-expanded={abierto}
                    aria-label={`${abierto ? "Ocultar" : "Mostrar"} ${nodo.hijos.length} elementos de ${nodo.nombre}`}
                  >
                    {abierto ? "−" : nodo.hijos.length}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
