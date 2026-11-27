import { useState } from "react";
import { useAtlas } from "./hooks/useAtlas";
import Cabecera from "./components/Cabecera";
import Altas from "./components/Altas";
import Mapa from "./components/Mapa";
import Padron from "./components/Padron";
import Ficha from "./components/Ficha";
import ListaAdyacencia from "./components/ListaAdyacencia";

export default function App() {
  const { red, version, error, limpiarError, hacer, reiniciar } = useAtlas();
  const [seleccion, setSeleccion] = useState(null);
  const [ciudadPadron, setCiudadPadron] = useState(() => red.ciudades()[0]?.id ?? "");

  // Si el nodo elegido se borró, se suelta la selección
  const nodoSel = seleccion ? red.grafo.searchNode(seleccion) : null;
  const ciudadValida = red.grafo.searchNode(ciudadPadron) ? ciudadPadron : (red.ciudades()[0]?.id ?? "");

  function elegir(id) {
    setSeleccion(id);
    if (red.grafo.searchNode(id)?.tipo === "ciudad") setCiudadPadron(id);
  }

  return (
    <div className="atlas">
      <Cabecera red={red} onReiniciar={() => { reiniciar(); setSeleccion(null); }} />

      <aside className="atlas__izq">
        <Altas red={red} hacer={hacer} error={error} limpiarError={limpiarError} onCreado={elegir} />
      </aside>

      <main className="atlas__mapa">
        <Mapa red={red} version={version} seleccion={nodoSel?.id ?? null} onElegir={elegir} onSoltar={() => setSeleccion(null)} />
      </main>

      <aside className="atlas__der">
        {nodoSel && <Ficha red={red} nodo={nodoSel} hacer={hacer} onElegir={elegir} onCerrar={() => setSeleccion(null)} />}
        <Padron red={red} ciudad={ciudadValida} onCiudad={setCiudadPadron} onElegir={elegir} seleccion={nodoSel?.id} />
        <ListaAdyacencia red={red} />
      </aside>
    </div>
  );
}
