import { useState } from "react";

/** insert(name, popularity) desde la interfaz. */
export default function NuevoProducto({ buscador, onGuardar }) {
  const [nombre, setNombre] = useState("");
  const [pop, setPop] = useState(50);
  const [error, setError] = useState(null);

  const existe = nombre.trim() !== "" && buscador.trie.search(nombre);

  function enviar(e) {
    e.preventDefault();
    try {
      onGuardar(nombre, pop);
      setNombre("");
      setPop(50);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="nuevo">
      <h2>Agregar producto</h2>
      <form onSubmit={enviar}>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre, ej. air max 95"
          maxLength={40}
          aria-label="Nombre del producto"
          required
        />
        <label className="nuevo__pop">
          <span>
            Popularidad <b>{pop}</b>
          </span>
          <input type="range" min="0" max="100" value={pop} onChange={(e) => setPop(Number(e.target.value))} />
        </label>
        <button className="boton">{existe ? "Actualizar" : "Insertar"}</button>
      </form>
      {existe && <p className="nuevo__aviso">Ya está en el Trie: se actualizará su popularidad.</p>}
      {error && <p className="nuevo__error">{error}</p>}
    </section>
  );
}
