import { useMemo, useState } from "react";
import { useBuscador } from "./hooks/useBuscador";
import Barra from "./components/Barra";
import Resultados from "./components/Resultados";
import PorDentro from "./components/PorDentro";
import NuevoProducto from "./components/NuevoProducto";

export default function App() {
  const { buscador, version, hacer, reiniciar } = useBuscador();
  const [consulta, setConsulta] = useState("");
  const [k, setK] = useState(3);

  const busqueda = useMemo(
    () => ({ ...buscador.searchTopK(consulta, k), camino: buscador.trie.camino(consulta) }),
    // `version` sube cada vez que el Trie cambia por dentro (insert / remove)
    // oxlint-disable-next-line react-hooks/exhaustive-deps
    [buscador, consulta, k, version]
  );

  const sumar = (p, cuanto) => hacer((b) => b.insert(p.name, Math.min(100, Math.max(0, p.popularity + cuanto))));
  const quitar = (p) => hacer((b) => b.trie.remove(p.name));

  return (
    <div className="pagina">
      <header className="marca">
        <span className="marca__logo">
          top<b>·</b>k
        </span>
        <span className="marca__dato">
          {buscador.trie.total} productos · {buscador.trie.contarNodos()} nodos en el Trie
        </span>
      </header>

      <main>
        <section className="hero">
          <h1>
            Lo más buscado, <em>al instante.</em>
          </h1>
          <Barra consulta={consulta} onConsulta={setConsulta} k={k} onK={setK} />
        </section>

        <Resultados
          consulta={consulta}
          k={k}
          resultados={busqueda.resultados}
          candidatos={busqueda.candidatos}
          onSumar={sumar}
          onQuitar={quitar}
        />

        <PorDentro consulta={consulta} camino={busqueda.camino} heap={busqueda.heapFinal} k={k} />

        <NuevoProducto
          buscador={buscador}
          onGuardar={(nombre, pop) => {
            const p = hacer((b) => b.insert(nombre, pop));
            setConsulta(p.name);
          }}
        />
      </main>

      <footer className="pie">
        Challenge 12 · Estructuras de Datos II ·{" "}
        <button className="enlace" onClick={reiniciar}>
          Restaurar catálogo
        </button>
      </footer>
    </div>
  );
}
