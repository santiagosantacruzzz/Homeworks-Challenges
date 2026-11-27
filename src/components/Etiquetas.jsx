import { useTendencias } from "../hooks/useTendencias";

/** Atajos de búsqueda: tendencias, categorías (de GIPHY) y sugerencias fijas. */
export default function Etiquetas({ activa, onElegir }) {
  const { tendencia, categorias, sugerencias } = useTendencias();
  const lista = [...new Set([...tendencia.slice(0, 6), ...categorias.slice(0, 4), ...sugerencias])].slice(0, 14);

  return (
    <nav className="etiquetas" aria-label="Búsquedas sugeridas">
      {tendencia.length > 0 && <span className="etiquetas__fuego">🔥 Tendencias</span>}
      {lista.map((e, i) => (
        <button
          key={e}
          className={`etiqueta etiqueta--${i % 4} ${activa.trim().toLowerCase() === e.toLowerCase() ? "activa" : ""}`}
          onClick={() => onElegir(e)}
        >
          {e}
        </button>
      ))}
    </nav>
  );
}
