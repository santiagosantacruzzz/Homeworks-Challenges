// src/components/Ring.tsx
interface NodoConId {
  id: number;
  nombre: string;
}

interface Props {
  items: NodoConId[];
  currentId: number | null | undefined;
  size?: number;
}

// Dibuja los nodos de una lista circular como un anillo real, con el
// nodo "actual" resaltado — así la visualización coincide con la
// estructura de datos en vez de ser una lista plana.
function Ring({ items, currentId, size = 190 }: Props) {
  const radius = size / 2 - 34;
  const cx = size / 2;
  const cy = size / 2;
  const n = items.length;

  if (n === 0) return null;

  return (
    <div className="ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="var(--line)" strokeWidth={1.5} />
        {items.map((item, i) => {
          const angle = (2 * Math.PI * i) / n - Math.PI / 2;
          const x = cx + radius * Math.cos(angle);
          const y = cy + radius * Math.sin(angle);
          const esActual = item.id === currentId;
          return (
            <circle
              key={item.id}
              cx={x}
              cy={y}
              r={esActual ? 9 : 6.5}
              fill={esActual ? "var(--teal)" : "#fff"}
              stroke={esActual ? "var(--teal)" : "var(--ink-soft)"}
              strokeWidth={1.6}
            />
          );
        })}
      </svg>
      <div className="ring-labels">
        {items.map((item, i) => {
          const angle = (2 * Math.PI * i) / n - Math.PI / 2;
          const labelRadius = radius + 26;
          const x = cx + labelRadius * Math.cos(angle);
          const y = cy + labelRadius * Math.sin(angle);
          const esActual = item.id === currentId;
          return (
            <div
              key={item.id}
              className={"ring-label" + (esActual ? " active" : "")}
              style={{ left: x, top: y }}
            >
              {item.nombre}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Ring;
