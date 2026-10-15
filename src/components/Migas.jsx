import useArbol from "../hooks/useArbol";

export default function Migas() {
  const { arbol, seleccionado, seleccionar } = useArbol();
  const camino = arbol.camino(seleccionado.id);

  return (
    <nav className="migas" aria-label="Ubicación">
      <ol>
        {camino.map((nodo, i) => (
          <li key={nodo.id}>
            <button
              type="button"
              onClick={() => seleccionar(nodo.id)}
              aria-current={i === camino.length - 1 ? "location" : undefined}
            >
              {nodo.nombre}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
