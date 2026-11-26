import { useCatalogo } from "./hooks/useCatalogo";
import Cabecera from "./components/Cabecera";
import Teletipo from "./components/Teletipo";
import Buscador from "./components/Buscador";
import Ranking from "./components/Ranking";
import Recomendaciones from "./components/Recomendaciones";
import NuevaCancion from "./components/NuevaCancion";
import FichaTecnica from "./components/FichaTecnica";

export default function App() {
  const { cargando, error, limpiarError } = useCatalogo();

  return (
    <div className="pagina">
      <Cabecera />
      <Teletipo />

      {error && (
        <div className="alerta" role="alert">
          <p>{error}</p>
          <button type="button" onClick={limpiarError} aria-label="Cerrar aviso">
            ×
          </button>
        </div>
      )}

      {cargando ? (
        <p className="cargando">Armando el Trie, el heap y el grafo…</p>
      ) : (
        <main className="rejilla">
          <Buscador />
          <Ranking />
          <Recomendaciones />
          <NuevaCancion />
          <FichaTecnica />
        </main>
      )}

      <footer className="pie">
        Parcial 3 · Estructuras de Datos II · Universidad Autónoma de Occidente · Santiago Santacruz Samboni
      </footer>
    </div>
  );
}
