import { useEffect, useMemo, useRef, useState } from "react";
import Sticker from "./Sticker";

/** Cuántas columnas caben según el ancho disponible. */
function useColumnas(ref) {
  const [columnas, setColumnas] = useState(4);
  useEffect(() => {
    const obs = new ResizeObserver(([e]) => {
      const ancho = e.contentRect.width;
      setColumnas(ancho < 520 ? 2 : Math.min(5, Math.max(2, Math.floor(ancho / 230))));
    });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return columnas;
}

/**
 * Masonry: cada GIF va a la columna más corta en ese momento.
 * Como se reparte en orden, al cargar más páginas los de arriba no se mueven.
 */
function repartir(gifs, columnas) {
  const cols = Array.from({ length: columnas }, () => ({ alto: 0, items: [] }));
  gifs.forEach((g, i) => {
    const corta = cols.reduce((min, c) => (c.alto < min.alto ? c : min), cols[0]);
    corta.items.push({ gif: g, indice: i });
    corta.alto += g.alto / g.ancho + 0.08; // alto relativo + margen
  });
  return cols;
}

/** Cuadrícula tipo álbum de stickers con scroll infinito (offset de la Search API). */
export default function Album(props) {
  const caja = useRef(null);
  const columnas = useColumnas(caja);
  return (
    <div ref={caja}>
      <Contenido {...props} columnas={columnas} />
    </div>
  );
}

function Contenido({ gifs, estado, error, hayMas, cargarMas, reintentar, consulta, porPagina, onAbrir, columnas }) {
  const centinela = useRef(null);
  const reparto = useMemo(() => repartir(gifs, columnas), [gifs, columnas]);

  // Cuando el final del álbum entra en pantalla, pide la siguiente página
  useEffect(() => {
    const el = centinela.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && cargarMas(), { rootMargin: "600px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, [cargarMas]);

  if (estado === "cargando") {
    return (
      <div className="album" aria-busy="true">
        {Array.from({ length: columnas }, (_, c) => (
          <div key={c} className="album__col">
            {Array.from({ length: 3 }, (_, f) => {
              const i = c * 3 + f;
              return (
                <div
                  key={f}
                  className="sticker sticker--fantasma"
                  style={{ "--giro": `${((i * 7) % 5) - 2}deg`, aspectRatio: `1 / ${0.6 + ((i * 3) % 5) / 6}` }}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  if (estado === "error" && gifs.length === 0) {
    return (
      <div className="aviso aviso--error" role="alert">
        <p className="aviso__titulo">Algo se despegó</p>
        <p>{error}</p>
        <button className="boton" onClick={reintentar}>
          Reintentar
        </button>
      </div>
    );
  }

  if (gifs.length === 0) {
    return (
      <div className="aviso">
        <p className="aviso__titulo">Nada por aquí</p>
        <p>GIPHY no encontró GIFs para “{consulta.trim()}”. Prueba con otra palabra.</p>
      </div>
    );
  }

  return (
    <>
      <div className="album">
        {reparto.map((col, c) => (
          <div key={c} className="album__col">
            {col.items.map(({ gif, indice }) => (
              <Sticker key={gif.id} gif={gif} indice={indice} retraso={(indice % porPagina) * 25} onAbrir={() => onAbrir(indice)} />
            ))}
          </div>
        ))}
      </div>

      <div ref={centinela} className="album__final">
        {estado === "mas" && <span className="cargando-mas">Despegando más stickers…</span>}
        {estado === "error" && (
          <span className="aviso-linea">
            {error}{" "}
            <button className="enlace" onClick={reintentar}>
              Reintentar
            </button>
          </span>
        )}
        {estado === "listo" && hayMas && (
          <button className="boton boton--claro" onClick={cargarMas}>
            Cargar más
          </button>
        )}
        {estado === "listo" && !hayMas && <span className="fin">— fin del álbum —</span>}
      </div>
    </>
  );
}
