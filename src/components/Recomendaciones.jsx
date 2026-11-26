import { useMemo, useState } from "react";
import { useCatalogo } from "../hooks/useCatalogo";
import { useFetch } from "../hooks/useFetch";
import { aDetalle, urlBusqueda } from "../api/itunes";
import MapaGrafo from "./MapaGrafo";
import Portada from "./Portada";
import { GENEROS } from "../data/mock";
import { cifra } from "../utils/formato";

const LIMITE_MAPA = 16;
const LIMITE_LISTA = 8;

function Razon({ r, catalogo }) {
  const nombres = r.enComun.map((id) => `«${catalogo.obtener(id).titulo}»`);
  if (r.nivel === 1) {
    return nombres.length
      ? `Vecina directa; también se conecta con ${nombres.join(" y ")}`
      : "Vecina directa";
  }
  return `A 2 saltos, por ${nombres.slice(0, 2).join(" y ")}${nombres.length > 2 ? ` y ${nombres.length - 2} más` : ""}`;
}

export default function Recomendaciones() {
  const { catalogo, version, seleccionada, seleccionar, reproducir } = useCatalogo();
  const [verLista, setVerLista] = useState(false);

  const recomendaciones = useMemo(
    () => (seleccionada ? catalogo.recomendar(seleccionada.id, LIMITE_MAPA) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [catalogo, seleccionada, version]
  );

  // Detalle de la canción elegida desde la API de iTunes (useFetch, Clase 13)
  const { data, cargando, error } = useFetch(seleccionada ? urlBusqueda(seleccionada) : null);
  const detalle = aDetalle(data);

  if (!seleccionada) {
    return (
      <section className="panel recomendaciones">
        <p className="vacio">Elige una canción para ver sus recomendaciones.</p>
      </section>
    );
  }

  const vecinos = catalogo.grafo.printAdjacency(seleccionada.id);

  return (
    <section className="panel recomendaciones" aria-labelledby="rec-t">
      <header className="panel__cabeza">
        <h2 id="rec-t" className="panel__titulo">
          <span className="panel__seccion">C</span> Si te gusta…
        </h2>
        <p className="panel__estructura">Grafo no dirigido · lista de adyacencia · BFS a 2 niveles</p>
      </header>

      <article className={`ficha genero--${seleccionada.genero}`}>
        <Portada cancion={seleccionada} detalle={detalle} tamano="xl" />
        <div className="ficha__texto">
          <p className="ficha__antetitulo">{GENEROS[seleccionada.genero] ?? seleccionada.genero}</p>
          <h3 className="ficha__titulo">{seleccionada.titulo}</h3>
          <p className="ficha__artista">
            {seleccionada.artista}
            {seleccionada.anio ? ` · ${seleccionada.anio}` : ""}
            {detalle?.album ? ` · ${detalle.album}` : ""}
          </p>
          <p className="ficha__cifra">
            {cifra(seleccionada.reproducciones)} <small>reproducciones · grado {vecinos.length}</small>
          </p>
          {detalle?.muestra ? (
            <audio
              key={detalle.muestra}
              className="ficha__audio"
              controls
              preload="none"
              src={detalle.muestra}
              onPlay={() => reproducir(seleccionada.id)}
            >
              Tu navegador no reproduce audio.
            </audio>
          ) : (
            <button type="button" className="boton boton--tinta" onClick={() => reproducir(seleccionada.id)}>
              ▶ Sumar una reproducción
            </button>
          )}
          <p className="ficha__api">
            {cargando
              ? "Consultando la API de iTunes…"
              : error
                ? "No se pudo consultar iTunes. Se usa la portada local."
                : detalle
                  ? "Carátula y muestra de 30 s: API de iTunes."
                  : "iTunes no encontró esta canción."}
          </p>
        </div>
      </article>

      {recomendaciones.length === 0 ? (
        <p className="vacio">Esta canción todavía no tiene conexiones. Agrégale relacionadas en el formulario.</p>
      ) : (
        <>
          <MapaGrafo
            centro={seleccionada}
            recomendaciones={recomendaciones}
            adyacencia={(id) => catalogo.grafo.printAdjacency(id)}
            alElegir={seleccionar}
          />

          <ol className="sugeridas">
            {recomendaciones.slice(0, LIMITE_LISTA).map((r) => (
              <li key={r.id} className={`sugerida sugerida--n${r.nivel} genero--${r.cancion.genero}`}>
                <button type="button" onClick={() => seleccionar(r.id)}>
                  <span className="sugerida__nivel">{r.nivel === 1 ? "Directa" : "2 saltos"}</span>
                  <span className="sugerida__titulo">{r.cancion.titulo}</span>
                  <span className="sugerida__artista">{r.cancion.artista}</span>
                  <span className="sugerida__razon">
                    <Razon r={r} catalogo={catalogo} />
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </>
      )}

      <button type="button" className="boton boton--linea" aria-expanded={verLista} onClick={() => setVerLista((v) => !v)}>
        {verLista ? "Ocultar lista de adyacencia" : "Ver lista de adyacencia"}
      </button>
      {verLista && (
        <pre className="adyacencia">
          <code>
            {`printAdjacency("${seleccionada.id}") // ${seleccionada.titulo}\n→ [${vecinos.join(", ")}]\n\n`}
            {vecinos.map((v) => `${v.padStart(3)}  ${catalogo.obtener(v).titulo}`).join("\n")}
          </code>
        </pre>
      )}
    </section>
  );
}
