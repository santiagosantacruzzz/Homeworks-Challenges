import { useEffect, useRef, useState } from "react";
import Tree from "react-d3-tree";

const NODO_X = 58;
const NODO_Y = 86;

// Cuántas "columnas" ocupa el árbol abajo (hojas, contando los huecos).
function contarColumnas(datum) {
  if (!datum?.children?.length) return 1;
  return datum.children.reduce((total, hijo) => total + contarColumnas(hijo), 0);
}

// Clase de cada nodo según la animación en curso.
function estadoNodo(valor, animacion) {
  if (!animacion) return "";
  const { orden, paso, tipo } = animacion;
  const indice = orden.indexOf(valor);
  const visto = indice !== -1 && indice < paso;
  const terminado = paso >= orden.length;
  const clases = [];

  if (visto) clases.push(tipo === "recorrido" ? "is-visited" : "is-path");
  if (visto && indice === paso - 1 && !terminado) clases.push("is-current");
  if (terminado && tipo === "busqueda" && animacion.encontrado === valor)
    clases.push("is-found");
  if (terminado && tipo === "insercion" && animacion.insertado === valor)
    clases.push("is-new");
  if (tipo === "recorrido" && visto) clases.push(`order-${indice + 1}`);
  return clases.join(" ");
}

export default function TreeCanvas({ data, animacion, children }) {
  const contenedor = useRef(null);
  const [tamaño, setTamaño] = useState({ width: 800, height: 500 });

  // Centrar el árbol: la raíz arriba, en la mitad del área disponible.
  useEffect(() => {
    const el = contenedor.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setTamaño({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Zoom inicial para que todo el árbol quepa a lo ancho (sobre todo en celular).
  const anchoArbol = contarColumnas(data) * NODO_X * 1.1 + 60;
  const zoom = Math.min(1, Math.max(0.4, tamaño.width / anchoArbol));

  const renderNodo = ({ nodeDatum }) => {
    // Los "huecos" (hijo que no existe) no se dibujan: solo reservan su lado.
    if (nodeDatum.attributes?.hueco) return <g className="node node--hueco" />;

    const valor = nodeDatum.attributes.valor;
    const orden = animacion?.tipo === "recorrido" ? animacion.orden.indexOf(valor) : -1;
    const mostrarOrden = orden !== -1 && orden < animacion.paso;

    return (
      <g className={`node ${estadoNodo(valor, animacion)}`}>
        <circle r={21} />
        <text className="node__value" dy="0.36em">
          {nodeDatum.name}
        </text>
        {mostrarOrden && (
          <text className="node__order" x={24} y={-18}>
            {orden + 1}
          </text>
        )}
      </g>
    );
  };

  return (
    <section className="canvas" aria-label="Dibujo del árbol (react-d3-tree)">
      <div className="canvas__stage" ref={contenedor}>
        {data ? (
          <Tree
            data={data}
            orientation="vertical"
            pathFunc="straight"
            translate={{ x: tamaño.width / 2, y: 64 * zoom }}
            zoom={zoom}
            nodeSize={{ x: NODO_X, y: NODO_Y }}
            separation={{ siblings: 1, nonSiblings: 1.15 }}
            renderCustomNodeElement={renderNodo}
            pathClassFunc={(link) =>
              link.target.data.attributes?.hueco ? "link link--hueco" : "link"
            }
            collapsible={false}
            zoomable
            scaleExtent={{ min: 0.4, max: 2 }}
          />
        ) : (
          <div className="canvas__empty">
            <p>El árbol está vacío.</p>
            <p>Inserta un número o carga la serie de ejemplo de la clase.</p>
          </div>
        )}
      </div>
      {children}
    </section>
  );
}
