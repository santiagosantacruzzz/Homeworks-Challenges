// Palabra armada con fichas. "stack" las apila en vertical (como una pila)
// y "queue" las pone en fila (como una cola). Solo es decorativa: el texto
// real lo lee el lector de pantalla desde el aria-label.
export default function TileWord({ word, variant, size = "lg" }) {
  return (
    <span className={`tiles tiles--${variant} tiles--${size}`} role="img" aria-label={word}>
      {word.split("").map((letter, index) => (
        <span
          key={index}
          className="tile"
          aria-hidden="true"
          style={{ "--i": variant === "stack" ? word.length - 1 - index : index }}
        >
          {letter}
        </span>
      ))}
    </span>
  );
}
