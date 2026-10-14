import { useState } from "react";

const MIN = 1;
const MAX = 999;

const esEntero = (texto) => /^-?\d+$/.test(texto.trim());

export default function ControlPanel({
  mensaje,
  onInsertar,
  onInsertarSerie,
  onAleatorio,
  onBuscar,
  onEjemplo,
  onVaciar,
}) {
  const [valor, setValor] = useState("");
  const [serie, setSerie] = useState("");
  const [buscado, setBuscado] = useState("");
  const [error, setError] = useState({});

  const leerNumero = (texto, campo) => {
    if (!esEntero(texto)) {
      setError({ [campo]: "Escribe un número entero." });
      return null;
    }
    const n = Number(texto);
    if (n < MIN || n > MAX) {
      setError({ [campo]: `Usa números del ${MIN} al ${MAX}.` });
      return null;
    }
    setError({});
    return n;
  };

  const handleInsertar = (event) => {
    event.preventDefault();
    const n = leerNumero(valor, "valor");
    if (n === null) return;
    if (onInsertar(n)) setValor("");
  };

  const handleSerie = (event) => {
    event.preventDefault();
    const partes = serie.split(/[\s,;]+/).filter(Boolean);
    if (partes.length === 0 || !partes.every(esEntero)) {
      setError({ serie: "Escribe números enteros separados por comas o espacios." });
      return;
    }
    const numeros = partes.map(Number);
    if (numeros.some((n) => n < MIN || n > MAX)) {
      setError({ serie: `Usa números del ${MIN} al ${MAX}.` });
      return;
    }
    setError({});
    onInsertarSerie(numeros);
    setSerie("");
  };

  const handleBuscar = (event) => {
    event.preventDefault();
    const n = leerNumero(buscado, "buscado");
    if (n === null) return;
    onBuscar(n);
  };

  return (
    <aside className="controls">
      <form className="control" onSubmit={handleInsertar} noValidate>
        <label htmlFor="valor">Insertar un número</label>
        <div className="control__row">
          <input
            id="valor"
            inputMode="numeric"
            placeholder="40"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            aria-invalid={Boolean(error.valor)}
            autoComplete="off"
          />
          <button type="submit">Insertar</button>
        </div>
        {error.valor && <span className="control__error">{error.valor}</span>}
        <button type="button" className="control__link" onClick={onAleatorio}>
          Insertar uno al azar
        </button>
      </form>

      <form className="control" onSubmit={handleSerie} noValidate>
        <label htmlFor="serie">Insertar una serie</label>
        <textarea
          id="serie"
          rows={2}
          placeholder="40, 7, 63, 30"
          value={serie}
          onChange={(e) => setSerie(e.target.value)}
          aria-invalid={Boolean(error.serie)}
        />
        {error.serie && <span className="control__error">{error.serie}</span>}
        <button type="submit">Insertar serie</button>
      </form>

      <form className="control" onSubmit={handleBuscar} noValidate>
        <label htmlFor="buscado">¿Está en el árbol?</label>
        <div className="control__row">
          <input
            id="buscado"
            inputMode="numeric"
            placeholder="44"
            value={buscado}
            onChange={(e) => setBuscado(e.target.value)}
            aria-invalid={Boolean(error.buscado)}
            autoComplete="off"
          />
          <button type="submit">Buscar</button>
        </div>
        {error.buscado && <span className="control__error">{error.buscado}</span>}
      </form>

      <p className={`status${mensaje ? ` status--${mensaje.tipo}` : ""}`} aria-live="polite">
        {mensaje?.texto ?? "Inserta números: los menores van a la izquierda y los mayores a la derecha."}
      </p>

      <div className="controls__footer">
        <button type="button" className="ghost" onClick={onEjemplo}>
          Cargar ejemplo de la clase
        </button>
        <button type="button" className="ghost" onClick={onVaciar}>
          Vaciar árbol
        </button>
      </div>
    </aside>
  );
}
