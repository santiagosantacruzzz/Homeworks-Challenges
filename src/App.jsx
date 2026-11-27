import { useState } from "react";
import { hayLlave } from "./api/giphy";
import { useDebounce } from "./hooks/useDebounce";
import { useGifs } from "./hooks/useGifs";
import Cabecera from "./components/Cabecera";
import Etiquetas from "./components/Etiquetas";
import Album from "./components/Album";
import Visor from "./components/Visor";
import Registro from "./components/Registro";
import SinLlave from "./components/SinLlave";

export default function App() {
  return hayLlave ? <Pegatinas /> : <SinLlave />;
}

function Pegatinas() {
  const [texto, setTexto] = useState("");
  const consulta = useDebounce(texto);
  const resultado = useGifs(consulta);
  const [abierto, setAbierto] = useState(null); // índice del GIF en el visor

  return (
    <div className="app">
      <Cabecera texto={texto} onTexto={setTexto} buscando={texto !== consulta || resultado.estado === "cargando"} />

      <main className="contenido">
        <Etiquetas activa={consulta} onElegir={setTexto} />

        <h2 className="titulo-album">
          {consulta.trim() ? (
            <>
              Resultados para <span className="resaltado">“{consulta.trim()}”</span>
            </>
          ) : (
            <>
              Lo que está <span className="resaltado">en tendencia</span>
            </>
          )}
          {resultado.estado === "listo" && resultado.total > 0 && (
            <small>{resultado.total.toLocaleString("es-CO")} GIFs</small>
          )}
        </h2>

        <Album {...resultado} consulta={consulta} onAbrir={setAbierto} />
      </main>

      {abierto !== null && resultado.gifs[abierto] && (
        <Visor gifs={resultado.gifs} indice={abierto} onIndice={setAbierto} onCerrar={() => setAbierto(null)} />
      )}

      <footer className="pie">
        <span>Challenge 13 · Estructuras de Datos II</span>
        <span className="pie__giphy">Powered by GIPHY</span>
      </footer>

      <Registro />
    </div>
  );
}
