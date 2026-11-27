import { useEffect, useRef } from "react";

const MAX_K = 10;

/** Barra de búsqueda por prefijo + selector de K. */
export default function Barra({ consulta, onConsulta, k, onK }) {
  const entrada = useRef(null);

  // Tecla "/" para enfocar la búsqueda
  useEffect(() => {
    const atajo = (e) => {
      if (e.key === "/" && document.activeElement !== entrada.current && !/INPUT|SELECT/.test(document.activeElement?.tagName)) {
        e.preventDefault();
        entrada.current?.focus();
      }
    };
    window.addEventListener("keydown", atajo);
    return () => window.removeEventListener("keydown", atajo);
  }, []);

  return (
    <div className="barra">
      <label className="barra__busqueda">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          ref={entrada}
          value={consulta}
          onChange={(e) => onConsulta(e.target.value)}
          placeholder="Escribe un prefijo: air, adi, nike…"
          aria-label="Buscar por prefijo"
          autoComplete="off"
          spellCheck="false"
          autoFocus
        />
        {consulta ? (
          <button className="barra__borrar" onClick={() => onConsulta("")} aria-label="Borrar búsqueda">
            ×
          </button>
        ) : (
          <kbd>/</kbd>
        )}
      </label>

      <div className="barra__k" role="group" aria-label="Cantidad de resultados">
        <span>Top</span>
        <button onClick={() => onK(Math.max(1, k - 1))} disabled={k <= 1} aria-label="Menos resultados">
          −
        </button>
        <b>{k}</b>
        <button onClick={() => onK(Math.min(MAX_K, k + 1))} disabled={k >= MAX_K} aria-label="Más resultados">
          +
        </button>
      </div>
    </div>
  );
}
