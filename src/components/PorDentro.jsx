import { useState } from "react";

/** Muestra el camino recorrido en el Trie y cómo quedó el arreglo del Min Heap. */
export default function PorDentro({ consulta, camino, heap, k }) {
  const [abierto, setAbierto] = useState(true);
  const roto = camino.findIndex((p) => !p.existe);

  return (
    <section className="dentro">
      <button className="dentro__toggle" onClick={() => setAbierto(!abierto)} aria-expanded={abierto}>
        Cómo lo encontró <span>{abierto ? "−" : "+"}</span>
      </button>

      {abierto && (
        <div className="dentro__grid">
          <article className="panel">
            <h3>1 · Camino en el Trie</h3>
            <div className="camino">
              <span className="nodo nodo--raiz" title="Raíz nula">
                ∅
              </span>
              {camino.map((paso, i) => (
                <span key={i} className="camino__paso">
                  <span className="camino__flecha">→</span>
                  <span className={`nodo ${paso.existe ? "" : "nodo--falta"}`} title={paso.existe ? `${paso.hijos} hijos` : "No existe"}>
                    {paso.letra === " " ? "␣" : paso.letra}
                  </span>
                </span>
              ))}
            </div>
            <p className="panel__nota">
              {!consulta.trim()
                ? "Sin prefijo: se toman todos los productos desde la raíz."
                : roto === -1
                  ? "Todas las letras existen: se recogen los productos que cuelgan de la última."
                  : `El camino se corta en la letra “${camino[roto].letra}”: ningún producto sigue por ahí.`}
            </p>
          </article>

          <article className="panel">
            <h3>2 · Min Heap de tamaño {k}</h3>
            {heap.length ? (
              <div className="heap">
                {heap.map((p, i) => (
                  <span key={p.name} className={`celda ${i === 0 ? "celda--raiz" : ""}`} title={p.name}>
                    <small>[{i}]</small>
                    <b>{p.popularity}</b>
                  </span>
                ))}
              </div>
            ) : (
              <p className="panel__vacio">heap vacío</p>
            )}
            <p className="panel__nota">
              Cada coincidencia entra con <code>push</code>; si el heap pasa de {k}, <code>pop</code> saca la menos
              popular (la raíz <b className="verde">[0]</b>). Al final se vacía y se invierte el orden.
            </p>
          </article>
        </div>
      )}
    </section>
  );
}
