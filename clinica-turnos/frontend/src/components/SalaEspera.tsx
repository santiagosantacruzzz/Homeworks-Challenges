import { useState } from "react";
import type { Paciente } from "../types";

interface Props {
  espera: Paciente[];
  onAtender: (id?: number) => void;
  onAgregar: (datos: Pick<Paciente, "nombre" | "motivo" | "prioridad">) => void;
}

function formatoHora(iso: string) {
  return new Date(iso).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function SalaEspera({ espera, onAtender, onAgregar }: Props) {
  const [nombre, setNombre] = useState("");
  const [motivo, setMotivo] = useState("");
  const [prioridad, setPrioridad] = useState<"normal" | "urgente">("normal");

  const agregar = () => {
    if (!nombre.trim()) return;
    onAgregar({ nombre, motivo, prioridad });
    setNombre("");
    setMotivo("");
  };

  return (
    <div className="panel">
      <h2>Sala de espera</h2>

      <div className="row">
        <input
          placeholder="Nombre del paciente"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{ flex: "1 1 160px" }}
        />
        <input
          placeholder="Motivo de consulta"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          style={{ flex: "1 1 160px" }}
        />
        <select value={prioridad} onChange={(e) => setPrioridad(e.target.value as "normal" | "urgente")}>
          <option value="normal">Normal</option>
          <option value="urgente">Urgente</option>
        </select>
        <button onClick={agregar}>Agregar</button>
      </div>

      <div className="row">
        <button onClick={() => onAtender()} disabled={espera.length === 0}>
          Atender siguiente
        </button>
      </div>

      {espera.length === 0 && <div className="empty">No hay pacientes esperando.</div>}

      {espera.map((p, i) => (
        <div key={p.id} className="ticket">
          <div className="info">
            <b>
              {i + 1}. {p.nombre}
              {p.prioridad === "urgente" && <span className="badge">Urgente</span>}
            </b>
            <span>
              {p.motivo} · llegó a las {formatoHora(p.horaLlegada)}
            </span>
          </div>
          <button className="secondary" onClick={() => onAtender(p.id)}>
            Atender
          </button>
        </div>
      ))}
    </div>
  );
}

export default SalaEspera;
