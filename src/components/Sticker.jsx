import { useState } from "react";

/** Un GIF con borde blanco y una inclinación distinta, como sticker pegado a mano. */
export default function Sticker({ gif, indice, retraso, onAbrir }) {
  const [cargado, setCargado] = useState(false);
  const giro = ((indice * 37) % 7) - 3; // entre -3° y 3°, siempre igual para el mismo puesto

  return (
    <button
      className={`sticker ${cargado ? "sticker--listo" : ""}`}
      style={{ "--giro": `${giro * 0.7}deg`, animationDelay: `${retraso}ms` }}
      onClick={onAbrir}
      title={gif.titulo}
    >
      <img
        src={gif.miniatura}
        alt={gif.titulo}
        width={gif.ancho}
        height={gif.alto}
        loading="lazy"
        decoding="async"
        onLoad={() => setCargado(true)}
      />
    </button>
  );
}
