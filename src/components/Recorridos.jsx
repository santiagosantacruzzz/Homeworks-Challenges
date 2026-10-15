import useArbol from "../hooks/useArbol";

const MODOS = {
  dfs: {
    nombre: "En profundidad (DFS)",
    explicacion:
      "Entra a una carpeta y baja hasta el fondo de esa rama; solo cuando la termina vuelve y sigue con la siguiente carpeta hermana.",
  },
  bfs: {
    nombre: "Por niveles (BFS)",
    explicacion:
      "Primero visita todo lo que está a profundidad 1, luego todo lo de profundidad 2, y así. Usa una cola: el primero que entra es el primero que se visita.",
  },
};

// Agrupa los nodos por profundidad, en el orden en que aparecen
function porNiveles(nodos) {
  const grupos = [];
  for (const n of nodos) {
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.nivel === n.profundidad) ultimo.nodos.push(n);
    else grupos.push({ nivel: n.profundidad, nodos: [n] });
  }
  return grupos;
}

export default function Recorridos() {
  const {
    arbol,
    seleccionado,
    seleccionar,
    modoRecorrido: modo,
    cambiarRecorrido,
    ordenRecorrido: orden,
    verOrden,
    setVerOrden,
    paso,
    reproducirRecorrido,
    detenerRecorrido,
  } = useArbol();

  const reproduciendo = paso !== null;
  const mismosOrdenes =
    orden.length > 1 && arbol.dfs().every((n, i) => n === arbol.bfs()[i]);

  const paso_ = (nodo, i) => (
    <li key={nodo.id}>
      <button
        type="button"
        className={`paso paso--${nodo.tipo}${nodo.id === seleccionado.id ? " es-activo" : ""}${
          reproduciendo && i === paso ? " es-visitando" : ""
        }${reproduciendo && i > paso ? " es-pendiente" : ""}`}
        onClick={() => seleccionar(nodo.id)}
      >
        <span className="paso__n">{i + 1}</span>
        {nodo.nombre}
      </button>
    </li>
  );

  return (
    <section className="bloque">
      <h3>Recorrido del árbol</h3>
      <div className="conmutador" role="tablist" aria-label="Tipo de recorrido">
        {Object.entries(MODOS).map(([clave, { nombre }]) => (
          <button
            key={clave}
            role="tab"
            aria-selected={modo === clave}
            onClick={() => cambiarRecorrido(clave)}
          >
            {nombre}
          </button>
        ))}
      </div>
      <p className="nota">{MODOS[modo].explicacion}</p>

      <div className="recorrido__acciones">
        {reproduciendo ? (
          <button className="boton boton--chico" onClick={detenerRecorrido}>
            Detener
          </button>
        ) : (
          <button className="boton boton--principal boton--chico" onClick={reproducirRecorrido}>
            Reproducir en el árbol
          </button>
        )}
        <label className="interruptor">
          <input
            type="checkbox"
            checked={verOrden}
            onChange={(e) => setVerOrden(e.target.checked)}
          />
          Ver el orden en el diagrama
        </label>
      </div>

      {mismosOrdenes && (
        <p className="pista">
          Con este árbol los dos recorridos dan el mismo orden. La diferencia aparece cuando dos
          o más carpetas del mismo nivel tienen contenido: crea una segunda carpeta junto a otra
          y agrégale algo adentro.
        </p>
      )}

      {modo === "bfs" ? (
        // BFS se muestra por niveles para que se vea la cola avanzando
        <div className="niveles">
          {porNiveles(orden).map((g) => (
            <div key={g.nivel} className="niveles__fila">
              <span className="niveles__etiqueta">Nivel {g.nivel}</span>
              <ol className="recorrido">
                {g.nodos.map((n) => paso_(n, orden.indexOf(n)))}
              </ol>
            </div>
          ))}
        </div>
      ) : (
        <ol className="recorrido">{orden.map((n, i) => paso_(n, i))}</ol>
      )}
    </section>
  );
}
