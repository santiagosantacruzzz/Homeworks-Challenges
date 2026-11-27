import { useState } from "react";

/** print() del grafo: la lista de adyacencia en texto. */
export default function ListaAdyacencia({ red }) {
  const [abierta, setAbierta] = useState(false);

  return (
    <section className="tarjeta adyacencia">
      <button className="adyacencia__toggle" onClick={() => setAbierta(!abierta)} aria-expanded={abierta}>
        <span className="tarjeta__titulo">Lista de adyacencia</span>
        <span>{abierta ? "−" : "+"}</span>
      </button>
      {abierta && <pre>{red.grafo.print() || "(grafo vacío)"}</pre>}
    </section>
  );
}
