/**
 * Texto estilo tablero de aeropuerto (split-flap): una paleta por letra.
 * Cada letra arranca su animación con un pequeño retraso para que "caigan" en cascada.
 */
export default function Paletas({ texto, tamano = "grande" }) {
  return (
    <span className={`paletas paletas--${tamano}`} aria-label={texto}>
      {[...texto].map((letra, i) => (
        <span
          key={`${i}-${letra}`}
          className={letra === " " ? "paleta paleta--espacio" : "paleta"}
          style={{ animationDelay: `${i * 45}ms` }}
          aria-hidden="true"
        >
          {letra}
        </span>
      ))}
    </span>
  );
}
