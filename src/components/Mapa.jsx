import { useEffect, useMemo, useRef, useState } from "react";
import { Graph } from "react-d3-graph";
import { colorCiudad } from "../utils/colores";

const TINTA = "#1d2a44";
const PAPEL = "#fbf6ea";

/**
 * Dibuja el grafo con react-d3-graph.
 *  - Ciudad  = cuadrado grande (sello) con el color de la ciudad.
 *  - Persona = círculo (alfiler) con el borde del color de su ciudad.
 *  - Arista punteada = "vive en" · arista sólida = amistad.
 */
export default function Mapa({ red, version, seleccion, onElegir, onSoltar }) {
  const caja = useRef(null);
  const [tam, setTam] = useState({ ancho: 800, alto: 560 });

  // react-d3-graph necesita ancho y alto en píxeles: se miden del contenedor
  useEffect(() => {
    const obs = new ResizeObserver(([entrada]) => {
      const { width, height } = entrada.contentRect;
      setTam({ ancho: Math.max(280, Math.floor(width)), alto: Math.max(360, Math.floor(height)) });
    });
    obs.observe(caja.current);
    return () => obs.disconnect();
  }, []);

  const datos = useMemo(() => {
    const ciudades = red.ciudades();
    const nodes = red.grafo.nodes.map((n) => {
      const elegido = n.id === seleccion;
      if (n.tipo === "ciudad") {
        return {
          id: n.id,
          etiqueta: n.nombre.toUpperCase(),
          symbolType: "square",
          size: elegido ? 1500 : 1000,
          color: colorCiudad(ciudades, n.id),
          strokeColor: TINTA,
          strokeWidth: elegido ? 4 : 2,
          fontSize: 13,
          fontWeight: "bold",
        };
      }
      const ciudad = red.ciudadDe(n.id);
      return {
        id: n.id,
        etiqueta: `${n.nombre} · ${n.edad}`,
        symbolType: "circle",
        size: elegido ? 700 : 420,
        color: elegido ? colorCiudad(ciudades, ciudad?.id) : PAPEL,
        strokeColor: colorCiudad(ciudades, ciudad?.id),
        strokeWidth: 3.5,
        fontSize: 11,
      };
    });

    const links = red.grafo.edges().map(([source, target]) => {
      const a = red.grafo.searchNode(source);
      const b = red.grafo.searchNode(target);
      const residencia = a.tipo === "ciudad" || b.tipo === "ciudad";
      const ciudad = a.tipo === "ciudad" ? a : b;
      const tocaSel = seleccion && (source === seleccion || target === seleccion);
      return residencia
        ? { source, target, color: colorCiudad(ciudades, ciudad.id), strokeDasharray: 5, strokeWidth: tocaSel ? 3 : 1.6 }
        : { source, target, color: TINTA, strokeWidth: tocaSel ? 3.5 : 2 };
    });

    return { nodes, links };
    // `version` cambia cada vez que la red se modifica por dentro
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [red, version, seleccion]);

  const compacto = tam.ancho < 560;

  const config = useMemo(
    () => ({
      width: tam.ancho,
      height: tam.alto,
      nodeHighlightBehavior: true,
      linkHighlightBehavior: true,
      highlightDegree: 1,
      highlightOpacity: 0.18,
      panAndZoom: true,
      maxZoom: 3,
      minZoom: 0.4,
      initialZoom: compacto ? 0.7 : 1,
      d3: compacto
        ? { gravity: -140, linkLength: 60, linkStrength: 0.7, alphaTarget: 0.05 }
        : { gravity: -320, linkLength: 95, linkStrength: 0.6, alphaTarget: 0.05 },
      node: {
        labelProperty: "etiqueta",
        fontColor: TINTA,
        fontSize: 11,
        highlightFontSize: 13,
        highlightFontWeight: "bold",
        highlightStrokeColor: "SAME",
        labelPosition: "bottom",
        mouseCursor: "pointer",
      },
      link: { highlightColor: "#e4473a", strokeLinecap: "round" },
    }),
    [tam, compacto]
  );

  return (
    <section className="mapa" ref={caja}>
      {red.grafo.isEmpty() ? (
        <p className="mapa__vacio">El atlas está en blanco. Registra una ciudad para empezar.</p>
      ) : (
        <Graph
          id="atlas-grafo"
          data={datos}
          config={config}
          onClickNode={onElegir}
          onClickGraph={onSoltar}
        />
      )}

      <ul className="mapa__leyenda" aria-label="Convenciones">
        <li>
          <i className="sim sim--ciudad" /> Ciudad
        </li>
        <li>
          <i className="sim sim--persona" /> Persona
        </li>
        <li>
          <i className="sim sim--vive" /> Vive en
        </li>
        <li>
          <i className="sim sim--amigo" /> Amistad
        </li>
      </ul>
      <p className="mapa__ayuda">Arrastra los nodos · rueda para zoom · clic para ver la ficha</p>
    </section>
  );
}
