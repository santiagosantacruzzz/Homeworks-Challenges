const RECORRIDOS = [
  { tipo: "preorden", regla: "N-L-R" },
  { tipo: "inorden", regla: "L-N-R" },
  { tipo: "postorden", regla: "L-R-N" },
];

// Réplica en pantalla de lo que se imprime en la consola del navegador.
export default function ConsolePanel({ recorridos, animacion, onPlay, onStop }) {
  return (
    <section className="console" aria-label="Recorridos">
      <p className="console__note">
        Los recorridos también se imprimen en la consola del navegador (F12 → Console) cada
        vez que cambia el árbol.
      </p>

      {RECORRIDOS.map(({ tipo, regla }) => {
        const activo = animacion?.tipo === "recorrido" && animacion.recorrido === tipo;
        const reproduciendo = activo && animacion.paso < animacion.orden.length;
        const valores = recorridos[tipo];

        return (
          <div key={tipo} className={`console__line${activo ? " is-active" : ""}`}>
            <button
              type="button"
              className="console__play"
              onClick={() => (reproduciendo ? onStop() : onPlay(tipo))}
              disabled={valores.length === 0}
              aria-label={reproduciendo ? `Detener ${tipo}` : `Reproducir ${tipo} en el árbol`}
            >
              {reproduciendo ? "■" : "▶"}
            </button>
            <span className="console__name">
              {tipo}
              <small>{regla}</small>
            </span>
            <span className="console__values">
              {valores.length === 0 && <span className="console__empty">(árbol vacío)</span>}
              {valores.map((valor, i) => (
                <span
                  key={valor}
                  className={`token${activo && i < animacion.paso ? " is-on" : ""}${
                    activo && i === animacion.paso - 1 && reproduciendo ? " is-current" : ""
                  }`}
                >
                  {valor}
                </span>
              ))}
            </span>
          </div>
        );
      })}
    </section>
  );
}
