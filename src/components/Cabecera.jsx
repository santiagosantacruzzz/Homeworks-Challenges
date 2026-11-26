import { useCatalogo } from "../hooks/useCatalogo";
import { cifra, fechaEdicion, numeroEdicion } from "../utils/formato";

export default function Cabecera() {
  const { catalogo, fuente } = useCatalogo();
  const { trie, ranking, grafo } = catalogo;

  return (
    <header className="cabecera">
      <div className="cabecera__franja">
        <span>Edición N.º {numeroEdicion()}</span>
        <span className="cabecera__fecha">{fechaEdicion()}</span>
        <span className={`fuente fuente--${fuente}`}>
          {fuente === "supabase" ? "● En vivo · Supabase" : "○ Datos de ejemplo"}
        </span>
      </div>

      <h1 className="cabecera__titulo">Repertorio</h1>
      <p className="cabecera__lema">
        Cartelera semanal de escucha — se busca con un <em>Trie</em>, se ordena con un <em>Max Heap</em> y se
        recomienda con un <em>grafo</em>.
      </p>

      <dl className="cabecera__cifras">
        <div>
          <dt>Canciones</dt>
          <dd>{cifra(catalogo.tamano)}</dd>
        </div>
        <div>
          <dt>Nodos del Trie</dt>
          <dd>{cifra(trie.totalNodos)}</dd>
        </div>
        <div>
          <dt>Altura del heap</dt>
          <dd>{ranking.size() ? Math.floor(Math.log2(ranking.size())) + 1 : 0}</dd>
        </div>
        <div>
          <dt>Aristas del grafo</dt>
          <dd>{cifra(grafo.totalAristas())}</dd>
        </div>
      </dl>
    </header>
  );
}
