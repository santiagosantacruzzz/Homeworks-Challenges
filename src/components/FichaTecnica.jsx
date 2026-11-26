import { useCatalogo } from "../hooks/useCatalogo";
import { cifra } from "../utils/formato";

const FILAS = [
  ["Trie", "insert(título)", "O(L)", "L = letras del título"],
  ["Trie", "search(título)", "O(L)", "no depende de cuántas canciones haya"],
  ["Trie", "sugerencias(prefijo)", "O(P + S)", "P = prefijo, S = nodos del subárbol"],
  ["Max Heap", "peek()", "O(1)", "el máximo vive en heap[0]"],
  ["Max Heap", "push / pop", "O(log n)", "percolateUp / percolateDown"],
  ["Max Heap", "heapify()", "O(n)", "carga inicial de todo el catálogo"],
  ["Max Heap", "TOP K", "O(n + K log n)", "copia + K pops"],
  ["Grafo", "addNode / addEdge", "O(1)*", "*más la revisión de repetidos"],
  ["Grafo", "recomendar (BFS 2 niveles)", "O(V + E)", "en el peor caso"],
];

export default function FichaTecnica() {
  const { catalogo } = useCatalogo();
  const { trie, grafo } = catalogo;
  const v = grafo.nodes.length;
  const e = grafo.totalAristas();

  return (
    <aside className="panel tecnica" aria-labelledby="tec-t">
      <header className="panel__cabeza">
        <h2 id="tec-t" className="panel__titulo">
          <span className="panel__seccion">E</span> Ficha técnica
        </h2>
        <p className="panel__estructura">Complejidad de cada operación usada</p>
      </header>

      <table className="complejidad">
        <thead>
          <tr>
            <th scope="col">Estructura</th>
            <th scope="col">Operación</th>
            <th scope="col">Costo</th>
            <th scope="col">Nota</th>
          </tr>
        </thead>
        <tbody>
          {FILAS.map(([estructura, op, costo, nota]) => (
            <tr key={op}>
              <td>{estructura}</td>
              <td>
                <code>{op}</code>
              </td>
              <td className="complejidad__costo">{costo}</td>
              <td>{nota}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <dl className="tecnica__datos">
        <div>
          <dt>Títulos en el Trie</dt>
          <dd>{cifra(trie.totalPalabras)}</dd>
        </div>
        <div>
          <dt>Nodos del Trie</dt>
          <dd>{cifra(trie.totalNodos)}</dd>
        </div>
        <div>
          <dt>Ramas de la raíz</dt>
          <dd>{Object.keys(trie.root.children).length}</dd>
        </div>
        <div>
          <dt>Vértices / aristas</dt>
          <dd>
            {v} / {e}
          </dd>
        </div>
        <div>
          <dt>Grado promedio</dt>
          <dd>{v ? ((2 * e) / v).toFixed(1) : 0}</dd>
        </div>
      </dl>
    </aside>
  );
}
