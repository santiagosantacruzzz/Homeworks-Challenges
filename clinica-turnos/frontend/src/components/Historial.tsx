import type { RegistroAtencion } from "../types";

interface Props {
  historial: RegistroAtencion[];
  actual: RegistroAtencion | null;
  onAnterior: () => void;
  onSiguiente: () => void;
}

function formatoHora(iso: string) {
  return new Date(iso).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function Historial({ historial, actual, onAnterior, onSiguiente }: Props) {
  return (
    <div className="panel">
      <h2>Historial de atención</h2>

      {historial.length === 0 && <div className="empty">Aún no se ha atendido a ningún paciente.</div>}

      {actual && (
        <div className="row" style={{ marginBottom: 14 }}>
          <button className="secondary" onClick={onAnterior}>
            Anterior
          </button>
          <button className="secondary" onClick={onSiguiente}>
            Siguiente
          </button>
        </div>
      )}

      {historial.map((r) => (
        <div className={"list-item" + (actual && actual.id === r.id ? " current" : "")} key={r.id}>
          <div>
            <b>{r.paciente.nombre}</b>
            <span className="meta">
              Atendido por {r.medico.nombre} · {formatoHora(r.fechaAtencion)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Historial;
