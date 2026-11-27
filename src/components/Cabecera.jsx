import { useEffect, useRef } from "react";

export default function Cabecera({ texto, onTexto, buscando }) {
  const entrada = useRef(null);

  // "/" enfoca la búsqueda
  useEffect(() => {
    const atajo = (e) => {
      if (e.key === "/" && !/INPUT|TEXTAREA/.test(document.activeElement?.tagName)) {
        e.preventDefault();
        entrada.current?.focus();
      }
    };
    window.addEventListener("keydown", atajo);
    return () => window.removeEventListener("keydown", atajo);
  }, []);

  return (
    <header className="cabecera">
      <a className="logo" href="/" aria-label="Pegatinas, inicio">
        <span className="logo__sticker">pe</span>gatinas
      </a>

      <label className={`busqueda ${buscando ? "busqueda--cargando" : ""}`}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          ref={entrada}
          type="search"
          value={texto}
          onChange={(e) => onTexto(e.target.value)}
          placeholder="Busca un GIF… gatos, feliz, lunes"
          aria-label="Buscar GIFs"
          maxLength={50}
          autoComplete="off"
          autoFocus
        />
        {texto ? (
          <button type="button" onClick={() => onTexto("")} aria-label="Borrar búsqueda">
            ×
          </button>
        ) : (
          <kbd>/</kbd>
        )}
      </label>
    </header>
  );
}
