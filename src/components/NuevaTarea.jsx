import { useState } from "react";

/** Create del CRUD: programa un vuelo (tarea) nuevo. */
export default function NuevaTarea({ onCrear }) {
  const [titulo, setTitulo] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    const limpio = titulo.trim();
    if (!limpio) return;
    setEnviando(true);
    const creada = await onCrear(limpio);
    setEnviando(false);
    if (creada) setTitulo("");
  }

  return (
    <form className="nueva" onSubmit={enviar}>
      <label htmlFor="nueva-tarea">Programar vuelo</label>
      <input
        id="nueva-tarea"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Ej: entregar el challenge 10"
        maxLength={120}
        autoComplete="off"
      />
      <button className="boton boton--ambar" disabled={enviando || !titulo.trim()}>
        {enviando ? "…" : "Programar"}
      </button>
    </form>
  );
}
