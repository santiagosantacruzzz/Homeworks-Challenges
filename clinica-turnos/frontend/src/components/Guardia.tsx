import { useEffect, useRef, useState } from "react";
import type { Medico } from "../types";

interface Props {
  medicos: Medico[];
  deGuardia: Medico | null;
  cicloMs: number;
  onRotarManual: () => void;
  onAgregar: (datos: Pick<Medico, "nombre" | "especialidad">) => void;
  onEliminar: (id: number) => void;
}

function Guardia({ medicos, deGuardia, cicloMs, onRotarManual, onAgregar, onEliminar }: Props) {
  const [restante, setRestante] = useState(cicloMs);
  const inicioRef = useRef(Date.now());

  useEffect(() => {
    inicioRef.current = Date.now();
    setRestante(cicloMs);

    const timer = setInterval(() => {
      const transcurrido = Date.now() - inicioRef.current;
      setRestante(Math.max(0, cicloMs - transcurrido));
    }, 200);

    return () => clearInterval(timer);
  }, [deGuardia?.id, cicloMs]);

  const [nombre, setNombre] = useState("");
  const [especialidad, setEspecialidad] = useState("");

  const agregar = () => {
    if (!nombre.trim()) return;
    onAgregar({ nombre, especialidad });
    setNombre("");
    setEspecialidad("");
  };

  const porcentaje = cicloMs > 0 ? (restante / cicloMs) * 100 : 0;

  return (
    <div className="panel">
      <h2>Médico de guardia</h2>

      {deGuardia ? (
        <>
          <div className="oncall-name">{deGuardia.nombre}</div>
          <div className="oncall-spec">{deGuardia.especialidad}</div>
        </>
      ) : (
        <div className="empty">No hay médicos registrados.</div>
      )}

      <div className="bar">
        <div style={{ width: porcentaje + "%" }} />
      </div>

      <div className="row" style={{ marginBottom: 16 }}>
        <button className="secondary" onClick={onRotarManual} disabled={!deGuardia}>
          Rotar ahora
        </button>
      </div>

      <div className="list-compact">
        {medicos.map((m) => (
          <div key={m.id} className={"li" + (deGuardia?.id === m.id ? " current" : "")}>
            <span>
              {m.nombre} · {m.especialidad}
            </span>
            <button className="ghost" onClick={() => onEliminar(m.id)}>
              Quitar
            </button>
          </div>
        ))}
      </div>

      <div className="row" style={{ marginTop: 14 }}>
        <input
          placeholder="Nombre del médico"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{ flex: "1 1 120px" }}
        />
        <input
          placeholder="Especialidad"
          value={especialidad}
          onChange={(e) => setEspecialidad(e.target.value)}
          style={{ flex: "1 1 100px" }}
        />
        <button onClick={agregar}>Añadir</button>
      </div>
    </div>
  );
}

export default Guardia;
