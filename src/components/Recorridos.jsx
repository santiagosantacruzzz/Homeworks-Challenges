import { useState } from "react";
import useArbol from "../hooks/useArbol";

const MODOS = {
  dfs: { nombre: "En profundidad (DFS)", explicacion: "Baja por cada rama hasta el final antes de pasar a la siguiente." },
  bfs: { nombre: "Por niveles (BFS)", explicacion: "Recorre el árbol nivel por nivel usando una cola." },
};

export default function Recorridos() {
  const { arbol, seleccionado, seleccionar } = useArbol();
  const [modo, setModo] = useState("dfs");
  const orden = modo === "dfs" ? arbol.dfs() : arbol.bfs();

  return (
    <section className="bloque">
      <h3>Recorrido del árbol</h3>
      <div className="conmutador" role="tablist" aria-label="Tipo de recorrido">
        {Object.entries(MODOS).map(([clave, { nombre }]) => (
          <button
            key={clave}
            role="tab"
            aria-selected={modo === clave}
            onClick={() => setModo(clave)}
          >
            {nombre}
          </button>
        ))}
      </div>
      <p className="nota">{MODOS[modo].explicacion}</p>

      <ol className="recorrido">
        {orden.map((nodo, i) => (
          <li key={nodo.id}>
            <button
              type="button"
              className={`paso paso--${nodo.tipo}${nodo.id === seleccionado.id ? " es-activo" : ""}`}
              onClick={() => seleccionar(nodo.id)}
            >
              <span className="paso__n">{i + 1}</span>
              {nodo.nombre}
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
