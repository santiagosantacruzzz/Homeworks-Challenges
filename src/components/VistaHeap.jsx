import { useState } from "react";
import { useCatalogo } from "../hooks/useCatalogo";
import { cifraCorta, recortar } from "../utils/formato";

const NIVELES_VISIBLES = 4; // 1 + 2 + 4 + 8 = 15 nodos

/**
 * Muestra el arreglo real del Max Heap y cómo ese arreglo es un árbol
 * binario completo por niveles. Al pasar el mouse por una casilla se
 * marcan su padre floor((i-1)/2) y sus hijos 2i+1 y 2i+2.
 */
export default function VistaHeap() {
  const { catalogo } = useCatalogo();
  const [foco, setFoco] = useState(null);
  const arreglo = catalogo.ranking.toArray();

  const papel = (i) => {
    if (foco === null) return "";
    if (i === foco) return "nodo--foco";
    if (i === Math.floor((foco - 1) / 2) && foco > 0) return "nodo--padre";
    if (i === 2 * foco + 1 || i === 2 * foco + 2) return "nodo--hijo";
    return "";
  };

  const niveles = [];
  for (let n = 0; n < NIVELES_VISIBLES; n++) {
    const desde = 2 ** n - 1;
    const hasta = Math.min(2 ** (n + 1) - 1, arreglo.length);
    if (desde >= arreglo.length) break;
    niveles.push({ n, indices: Array.from({ length: hasta - desde }, (_, j) => desde + j) });
  }
  const ocultos = Math.max(0, arreglo.length - (2 ** NIVELES_VISIBLES - 1));

  const casilla = (i) => (
    <button
      key={i}
      type="button"
      className={`nodo genero--${arreglo[i].genero} ${papel(i)}`}
      onMouseEnter={() => setFoco(i)}
      onFocus={() => setFoco(i)}
      onMouseLeave={() => setFoco(null)}
      onBlur={() => setFoco(null)}
      title={`[${i}] ${arreglo[i].titulo} · ${arreglo[i].reproducciones}`}
    >
      <span className="nodo__i">{i}</span>
      <span className="nodo__t">{recortar(arreglo[i].titulo, 14)}</span>
      <span className="nodo__v">{cifraCorta(arreglo[i].reproducciones)}</span>
    </button>
  );

  return (
    <div className="heap">
      <p className="heap__nota">
        <code>heap[0]</code> siempre es el máximo. Hijos de <code>i</code>: <code>2i+1</code> y <code>2i+2</code>.
        Padre: <code>⌊(i−1)/2⌋</code>. Pasa el cursor por un nodo.
      </p>

      <div className="heap__arbol">
        {niveles.map(({ n, indices }) => (
          <div key={n} className="heap__nivel" style={{ "--columnas": 2 ** n }}>
            {indices.map(casilla)}
          </div>
        ))}
        {ocultos > 0 && <p className="heap__mas">…y {ocultos} nodos más en los niveles de abajo</p>}
      </div>

      <div className="heap__arreglo" aria-label="Arreglo interno del heap">
        {arreglo.map((c, i) => (
          <span key={c.id} className={`celda ${papel(i)}`} onMouseEnter={() => setFoco(i)} onMouseLeave={() => setFoco(null)}>
            <small>{i}</small>
            {cifraCorta(c.reproducciones)}
          </span>
        ))}
      </div>
    </div>
  );
}
