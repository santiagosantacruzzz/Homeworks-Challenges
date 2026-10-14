import { useState } from "react";

const INICIALES = [
  { id: 1, equipo: "Portátil con Windows (Chrome)", lugar: "Cali", actual: true },
  { id: 2, equipo: "Celular Android", lugar: "Cali", actual: false },
  { id: 3, equipo: "Computador de la biblioteca", lugar: "Jamundí", actual: false },
];

export default function Sesiones() {
  const [sesiones, setSesiones] = useState(INICIALES);

  return (
    <ul className="rows">
      {sesiones.map((s) => (
        <li key={s.id}>
          <strong>{s.equipo}</strong>
          <span>{s.lugar}</span>
          {s.actual ? (
            <em>Esta sesión</em>
          ) : (
            <button type="button" onClick={() => setSesiones((l) => l.filter((x) => x.id !== s.id))}>
              Cerrar
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
