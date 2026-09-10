import { useState } from "react";
import type { MiembroComite } from "../types";

interface Props {
  comite: MiembroComite[];
  presidente: MiembroComite | null;
  onAdelante: () => void;
  onAtras: () => void;
  onAgregar: (datos: Pick<MiembroComite, "nombre" | "cargo">) => void;
  onEliminar: (id: number) => void;
}

function Comite({ comite, presidente, onAdelante, onAtras, onAgregar, onEliminar }: Props) {
  const [nombre, setNombre] = useState("");
  const [cargo, setCargo] = useState("");

  const agregar = () => {
    if (!nombre.trim()) return;
    onAgregar({ nombre, cargo });
    setNombre("");
    setCargo("");
  };

  return (
    <div className="panel">
      <h2>Comité administrativo</h2>

      {presidente ? (
        <>
          <div className="oncall-name">{presidente.nombre}</div>
          <div className="oncall-spec">Preside actualmente · {presidente.cargo}</div>
        </>
      ) : (
        <div className="empty">No hay miembros registrados.</div>
      )}

      <div className="row">
        <button className="secondary" onClick={onAtras} disabled={!presidente}>
          Anterior
        </button>
        <button className="secondary" onClick={onAdelante} disabled={!presidente}>
          Siguiente
        </button>
      </div>

      <div className="list-compact">
        {comite.map((m) => (
          <div key={m.id} className={"li" + (presidente?.id === m.id ? " current" : "")}>
            <span>
              {m.nombre} · {m.cargo}
            </span>
            <button className="ghost" onClick={() => onEliminar(m.id)}>
              Quitar
            </button>
          </div>
        ))}
      </div>

      <div className="row" style={{ marginTop: 14 }}>
        <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} style={{ flex: "1 1 120px" }} />
        <input placeholder="Cargo" value={cargo} onChange={(e) => setCargo(e.target.value)} style={{ flex: "1 1 100px" }} />
        <button onClick={agregar}>Añadir</button>
      </div>
    </div>
  );
}

export default Comite;
