import { useState } from "react";
import { useArbol } from "./hooks/useArbol";
import { serieEjemplo } from "./data/serieEjemplo";
import ControlPanel from "./components/ControlPanel";
import TreeCanvas from "./components/TreeCanvas";
import TitleBlock from "./components/TitleBlock";
import ConsolePanel from "./components/ConsolePanel";
import "./styles/app.css";

export default function App() {
  const arbol = useArbol(serieEjemplo);
  const [copiado, setCopiado] = useState(false);

  // VisuAlgo acepta la serie separada por comas en "Insert": así se compara el dibujo.
  const copiarSerie = async () => {
    const texto = arbol.serie.join(",");
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    } catch {
      window.prompt("Copia la serie:", texto);
    }
  };

  return (
    <div className="sheet">
      <header className="sheet__head">
        <div>
          <h1>Árbol binario de búsqueda</h1>
          <p>
            Menores a la izquierda, mayores a la derecha. Dibujado con{" "}
            <code>react-d3-tree</code>; arrastra para mover y usa la rueda para acercar.
          </p>
        </div>
        <div className="sheet__links">
          <button type="button" className="ghost" onClick={copiarSerie} disabled={!arbol.serie.length}>
            {copiado ? "Serie copiada" : "Copiar serie"}
          </button>
          <a className="ghost" href="https://visualgo.net/en/bst" target="_blank" rel="noreferrer">
            Comparar en VisuAlgo
          </a>
        </div>
      </header>

      <ControlPanel
        mensaje={arbol.mensaje}
        onInsertar={arbol.insertar}
        onInsertarSerie={arbol.insertarSerie}
        onAleatorio={arbol.insertarAleatorio}
        onBuscar={arbol.buscar}
        onEjemplo={() => arbol.cargar(serieEjemplo)}
        onVaciar={() => arbol.cargar([])}
      />

      <TreeCanvas data={arbol.d3} animacion={arbol.animacion}>
        <TitleBlock stats={arbol.stats} />
      </TreeCanvas>

      <ConsolePanel
        recorridos={arbol.recorridos}
        animacion={arbol.animacion}
        onPlay={arbol.reproducir}
        onStop={arbol.detener}
      />
    </div>
  );
}
