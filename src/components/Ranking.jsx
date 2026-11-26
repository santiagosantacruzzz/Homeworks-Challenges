import { useMemo, useState } from "react";
import { useCatalogo } from "../hooks/useCatalogo";
import { useCaratulas } from "../hooks/useCaratulas";
import Portada from "./Portada";
import VistaHeap from "./VistaHeap";
import { GENEROS } from "../data/mock";
import { cifra, cifraCorta } from "../utils/formato";

const OPCIONES_K = [5, 10, 15];

function Movimiento({ valor }) {
  if (valor === "nueva") return <span className="mov mov--nueva">Nueva</span>;
  if (!valor) return <span className="mov mov--igual" aria-label="Sin cambio">=</span>;
  return valor > 0 ? (
    <span className="mov mov--sube" aria-label={`Subió ${valor}`}>▲{valor}</span>
  ) : (
    <span className="mov mov--baja" aria-label={`Bajó ${-valor}`}>▼{-valor}</span>
  );
}

export default function Ranking() {
  const { catalogo, version, movimientos, seleccionar, seleccionada, reproducir } = useCatalogo();
  const [k, setK] = useState(10);
  const [verHeap, setVerHeap] = useState(false);

  // TOP K = sacar K veces la raíz de una copia del Max Heap
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const top = useMemo(() => catalogo.top(k), [catalogo, k, version]);
  const caratulas = useCaratulas(top);
  const maximo = top[0]?.reproducciones || 1;

  return (
    <section className="panel ranking" aria-labelledby="ranking-t">
      <header className="panel__cabeza">
        <h2 id="ranking-t" className="panel__titulo">
          <span className="panel__seccion">B</span> Los más escuchados
        </h2>
        <p className="panel__estructura">Max Heap · peek · pop × K · percolateUp al reproducir</p>
      </header>

      <div className="ranking__controles">
        <div className="conmutador" role="group" aria-label="Tamaño del TOP">
          {OPCIONES_K.map((n) => (
            <button key={n} type="button" aria-pressed={k === n} onClick={() => setK(n)}>
              TOP {n}
            </button>
          ))}
        </div>
        <button type="button" className="boton boton--linea" aria-expanded={verHeap} onClick={() => setVerHeap((v) => !v)}>
          {verHeap ? "Ocultar el heap" : "Ver el heap por dentro"}
        </button>
      </div>

      {verHeap && <VistaHeap />}

      <ol className="tabla">
        {top.map((c, i) => (
          <li
            key={c.id}
            className={`fila genero--${c.genero} ${i === 0 ? "fila--lider" : ""}`}
            aria-current={seleccionada?.id === c.id}
          >
            <span className="fila__puesto">{i + 1}</span>
            <Movimiento valor={movimientos[c.id]} />
            <Portada cancion={c} detalle={caratulas[c.id]} tamano={i === 0 ? "lg" : "sm"} />
            <button type="button" className="fila__datos" onClick={() => seleccionar(c.id)}>
              <span className="fila__titulo">{c.titulo}</span>
              <span className="fila__artista">
                {c.artista} · {GENEROS[c.genero] ?? c.genero}
                {c.anio ? ` · ${c.anio}` : ""}
              </span>
              <span className="barra" style={{ "--avance": c.reproducciones / maximo }} aria-hidden="true" />
            </button>
            <span className="fila__cifra" title={`${cifra(c.reproducciones)} reproducciones`}>
              {cifraCorta(c.reproducciones)}
            </span>
            <button type="button" className="reproducir" aria-label={`Reproducir ${c.titulo}`} onClick={() => reproducir(c.id)}>
              ▶
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
