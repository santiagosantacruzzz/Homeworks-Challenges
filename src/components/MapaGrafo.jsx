import { recortar } from "../utils/formato";

const ANCHO = 680;
const ALTO = 470;
const CX = ANCHO / 2;
const CY = ALTO / 2;
const R1 = 112; // anillo de vecinos directos
const R2 = 198; // anillo de vecinos a 2 saltos

const polar = (angulo, radio) => ({ x: CX + radio * Math.cos(angulo), y: CY + radio * Math.sin(angulo) });

/**
 * Dibuja el vecindario de la canción elegida como anillos concéntricos:
 * centro = la canción, anillo 1 = nivel 1 del BFS, anillo 2 = nivel 2.
 * Cada nodo del anillo 2 se ubica cerca de los vecinos que comparte.
 */
export default function MapaGrafo({ centro, recomendaciones, adyacencia, alElegir }) {
  const nivel1 = recomendaciones.filter((r) => r.nivel === 1);
  const nivel2 = recomendaciones.filter((r) => r.nivel === 2);

  // Anillo 1: repartido de forma pareja, empezando arriba
  const pos = new Map();
  nivel1.forEach((r, i) => {
    const angulo = -Math.PI / 2 + (2 * Math.PI * i) / Math.max(nivel1.length, 1);
    pos.set(r.id, { ...polar(angulo, R1), angulo });
  });

  // Anillo 2: ángulo promedio de sus vecinos en común, luego se separan
  const deseados = nivel2
    .map((r) => {
      const angulos = r.enComun.map((v) => pos.get(v)?.angulo).filter((a) => a !== undefined);
      const x = angulos.reduce((s, a) => s + Math.cos(a), 0);
      const y = angulos.reduce((s, a) => s + Math.sin(a), 0);
      return { r, angulo: angulos.length ? Math.atan2(y, x) : 0 };
    })
    .sort((a, b) => a.angulo - b.angulo);
  const separacion = (2 * Math.PI) / Math.max(deseados.length, 10);
  deseados.forEach((d, i) => {
    if (i > 0) d.angulo = Math.max(d.angulo, deseados[i - 1].angulo + separacion);
    pos.set(d.r.id, { ...polar(d.angulo, R2), angulo: d.angulo });
  });

  pos.set(centro.id, { x: CX, y: CY, angulo: 0 });

  // Aristas visibles: solo entre nodos que están en el dibujo
  const aristas = [];
  for (const [id, p] of pos) {
    for (const vecino of adyacencia(id)) {
      if (id < vecino && pos.has(vecino)) {
        const q = pos.get(vecino);
        const tocaCentro = id === centro.id || vecino === centro.id;
        aristas.push({ clave: `${id}-${vecino}`, p, q, tocaCentro });
      }
    }
  }

  const etiqueta = (r, p, radio) => {
    const derecha = Math.cos(p.angulo) >= -0.01;
    const dx = Math.cos(p.angulo) * (radio + 7);
    const dy = Math.sin(p.angulo) * (radio + 7);
    return (
      <text
        x={p.x + dx}
        y={p.y + dy}
        textAnchor={Math.abs(Math.cos(p.angulo)) < 0.2 ? "middle" : derecha ? "start" : "end"}
        dominantBaseline={Math.sin(p.angulo) > 0.8 ? "hanging" : Math.sin(p.angulo) < -0.8 ? "auto" : "middle"}
        className="mapa__texto"
      >
        {recortar(r.cancion.titulo, 18)}
      </text>
    );
  };

  return (
    <svg className="mapa" viewBox={`0 0 ${ANCHO} ${ALTO}`} role="img" aria-label={`Canciones conectadas con ${centro.titulo}`}>
      <circle cx={CX} cy={CY} r={R1} className="mapa__orbita" />
      <circle cx={CX} cy={CY} r={R2} className="mapa__orbita" />
      <text x={CX + R1 * 0.72} y={CY - R1 * 0.72} className="mapa__rotulo">1 salto</text>
      <text x={CX + R2 * 0.72} y={CY - R2 * 0.72} className="mapa__rotulo">2 saltos</text>

      {aristas.map(({ clave, p, q, tocaCentro }) => (
        <line key={clave} x1={p.x} y1={p.y} x2={q.x} y2={q.y} className={`mapa__arista ${tocaCentro ? "mapa__arista--directa" : ""}`} />
      ))}

      {[...nivel2, ...nivel1].map((r) => {
        const p = pos.get(r.id);
        const radio = r.nivel === 1 ? 11 : 7;
        return (
          <g
            key={r.id}
            className={`mapa__nodo mapa__nodo--n${r.nivel} genero--${r.cancion.genero}`}
            onClick={() => alElegir(r.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && alElegir(r.id)}
            aria-label={`${r.cancion.titulo}, nivel ${r.nivel}`}
          >
            <circle cx={p.x} cy={p.y} r={radio} />
            {etiqueta(r, p, radio)}
          </g>
        );
      })}

      <g className={`mapa__centro genero--${centro.genero}`}>
        <circle cx={CX} cy={CY} r={30} />
        <text x={CX} y={CY} textAnchor="middle" dominantBaseline="middle">
          ★
        </text>
      </g>
    </svg>
  );
}
