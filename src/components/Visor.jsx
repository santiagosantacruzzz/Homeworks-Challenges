import { useEffect, useState } from "react";

/** GIF en grande: título, autor, copiar enlace y navegación con flechas. */
export default function Visor({ gifs, indice, onIndice, onCerrar }) {
  const gif = gifs[indice];
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    const teclas = (e) => {
      if (e.key === "Escape") onCerrar();
      if (e.key === "ArrowRight" && indice < gifs.length - 1) onIndice(indice + 1);
      if (e.key === "ArrowLeft" && indice > 0) onIndice(indice - 1);
    };
    window.addEventListener("keydown", teclas);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", teclas);
      document.body.style.overflow = "";
    };
  }, [indice, gifs.length, onIndice, onCerrar]);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(gif.enlace);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1600);
    } catch {
      /* el navegador no dejó copiar */
    }
  }

  return (
    <div className="visor" role="dialog" aria-modal="true" aria-label={gif.titulo} onClick={onCerrar}>
      <div className="visor__tarjeta" onClick={(e) => e.stopPropagation()} key={gif.id}>
        <button className="visor__cerrar" onClick={onCerrar} aria-label="Cerrar">
          ×
        </button>

        <div className="visor__imagen" style={{ aspectRatio: `${gif.ancho} / ${gif.alto}` }}>
          <img src={gif.grande} alt={gif.titulo} />
        </div>

        <div className="visor__info">
          <div>
            <h3>{gif.titulo}</h3>
            {gif.usuario && <p>por {gif.usuario}</p>}
          </div>
          <div className="visor__acciones">
            <button className="boton" onClick={copiar}>
              {copiado ? "¡Copiado!" : "Copiar enlace"}
            </button>
            <a className="boton boton--claro" href={gif.enlace} target="_blank" rel="noreferrer">
              Ver en GIPHY
            </a>
          </div>
        </div>

        <div className="visor__nav">
          <button onClick={() => onIndice(indice - 1)} disabled={indice === 0} aria-label="Anterior">
            ←
          </button>
          <span>
            {indice + 1} / {gifs.length}
          </span>
          <button onClick={() => onIndice(indice + 1)} disabled={indice === gifs.length - 1} aria-label="Siguiente">
            →
          </button>
        </div>
      </div>
    </div>
  );
}
