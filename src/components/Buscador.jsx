import { useId, useMemo, useState } from "react";
import { useCatalogo } from "../hooks/useCatalogo";
import { normalizar } from "../estructuras/normalizar";
import { GENEROS } from "../data/mock";
import { cifraCorta } from "../utils/formato";

const MAXIMO = 12;

/** Camino que recorre el prefijo dentro del Trie, letra por letra. */
function CaminoTrie({ pasos }) {
  return (
    <ol className="camino" aria-label="Camino recorrido en el Trie">
      <li className="camino__paso camino__paso--raiz" title="Raíz (null)">
        <span className="camino__letra">∅</span>
        <span className="camino__nota">raíz</span>
      </li>
      {pasos.map((p, i) => (
        <li
          key={i}
          className={[
            "camino__paso",
            p.existe ? "" : "camino__paso--roto",
            p.finDePalabra ? "camino__paso--fin" : "",
          ].join(" ")}
          title={
            p.existe
              ? `${p.ramas} rama(s) salen de aquí${p.finDePalabra ? " · aquí termina un título" : ""}`
              : "No hay nodo para esta letra: el camino se corta"
          }
        >
          <span className="camino__letra">{p.letra === " " ? "␣" : p.letra}</span>
          <span className="camino__nota">{p.existe ? `${p.ramas}↘` : "✕"}</span>
        </li>
      ))}
    </ol>
  );
}

export default function Buscador() {
  const { catalogo, version, seleccionar, seleccionada, reproducir } = useCatalogo();
  const [texto, setTexto] = useState("");
  const [orden, setOrden] = useState("popularidad");
  const idCampo = useId();
  const { trie } = catalogo;

  const prefijo = normalizar(texto);

  const { pasos, existe, siguientes, resultados, total } = useMemo(() => {
    const sugerencias = trie.sugerencias(prefijo);
    const total = sugerencias.reduce((s, x) => s + x.canciones.length, 0);
    const resultados =
      orden === "popularidad"
        ? trie.searchTopK(prefijo, MAXIMO) // Trie + Max Heap
        : sugerencias.flatMap((s) => s.canciones).slice(0, MAXIMO); // DFS alfabético
    return {
      pasos: trie.camino(prefijo),
      existe: prefijo ? trie.search(prefijo) : null,
      siguientes: trie.siguientesLetras(prefijo),
      resultados,
      total,
    };
    // version: el Trie cambió por dentro
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefijo, orden, version, trie]);

  return (
    <section className="panel buscador" aria-labelledby={`${idCampo}-t`}>
      <header className="panel__cabeza">
        <h2 id={`${idCampo}-t`} className="panel__titulo">
          <span className="panel__seccion">A</span> Buscador predictivo
        </h2>
        <p className="panel__estructura">Trie · insert · search · sugerencias por prefijo</p>
      </header>

      <div className="buscador__campo">
        <label htmlFor={idCampo} className="sr-only">
          Título de la canción
        </label>
        <input
          id={idCampo}
          type="search"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe el comienzo de un título…"
          autoComplete="off"
          spellCheck="false"
        />
        <div className="conmutador" role="group" aria-label="Orden de las sugerencias">
          <button type="button" aria-pressed={orden === "popularidad"} onClick={() => setOrden("popularidad")}>
            Por popularidad <small>Trie + Heap</small>
          </button>
          <button type="button" aria-pressed={orden === "alfabetico"} onClick={() => setOrden("alfabetico")}>
            Alfabético <small>DFS</small>
          </button>
        </div>
      </div>

      <div className="buscador__traza">
        <CaminoTrie pasos={pasos} />
        <div className="buscador__lectura">
          <code>
            search("{prefijo || "…"}") →{" "}
            <b className={existe ? "si" : "no"}>{existe === null ? "—" : String(existe)}</b>
          </code>
          {siguientes.length > 0 && (
            <p>
              Puede seguir con:{" "}
              {siguientes.map((l) => (
                <button key={l} type="button" className="letra" onClick={() => setTexto(prefijo + l)}>
                  {l === " " ? "␣" : l}
                </button>
              ))}
            </p>
          )}
        </div>
      </div>

      {resultados.length === 0 ? (
        <p className="vacio">
          Ningún título empieza por «{texto.trim()}». El camino se cortó en la letra marcada con ✕.
        </p>
      ) : (
        <>
          <p className="buscador__conteo">
            {total} {total === 1 ? "título coincide" : "títulos coinciden"}
            {total > resultados.length && ` · se muestran ${resultados.length}`}
          </p>
          <ol className="resultados">
            {resultados.map((c, i) => {
              const exacta = normalizar(c.titulo) === prefijo;
              return (
                <li key={c.id} className={`resultado genero--${c.genero}`}>
                  <button
                    type="button"
                    className="resultado__cuerpo"
                    aria-current={seleccionada?.id === c.id}
                    onClick={() => seleccionar(c.id)}
                  >
                    <span className="resultado__n">{i + 1}</span>
                    <span className="resultado__titulo">
                      <Resaltado titulo={c.titulo} largo={prefijo.length} />
                      {exacta && <span className="sello">exacta</span>}
                    </span>
                    <span className="resultado__meta">
                      {c.artista} · <span className="etiqueta">{GENEROS[c.genero] ?? c.genero}</span>
                    </span>
                    <span className="resultado__cifra">{cifraCorta(c.reproducciones)}</span>
                  </button>
                  <button
                    type="button"
                    className="reproducir"
                    aria-label={`Reproducir ${c.titulo}`}
                    onClick={() => reproducir(c.id)}
                  >
                    ▶
                  </button>
                </li>
              );
            })}
          </ol>
        </>
      )}
    </section>
  );
}

/** Resalta la parte del título que ya recorrió el Trie. */
function Resaltado({ titulo, largo }) {
  if (!largo) return titulo;
  // El prefijo normalizado y el título original tienen el mismo largo letra a letra,
  // salvo espacios repetidos (que el catálogo no tiene).
  return (
    <>
      <mark>{titulo.slice(0, largo)}</mark>
      {titulo.slice(largo)}
    </>
  );
}
