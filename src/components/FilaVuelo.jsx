import { useState } from "react";
import { codigoVuelo, fechaCorta, hora } from "../utils/formato";

/** Una tarea = un vuelo. Update (título y estado) y Delete del CRUD. */
export default function FilaVuelo({ tarea, resaltada, onEditar, onBorrar }) {
  const [editando, setEditando] = useState(false);
  const [borrador, setBorrador] = useState(tarea.titulo);
  const [confirmar, setConfirmar] = useState(false);

  async function guardar(e) {
    e.preventDefault();
    const limpio = borrador.trim();
    if (limpio && limpio !== tarea.titulo) await onEditar(tarea.id, { titulo: limpio });
    setEditando(false);
  }

  function abrirEdicion() {
    setBorrador(tarea.titulo); // por si el título cambió en vivo desde otra pestaña
    setEditando(true);
  }

  function cancelar() {
    setBorrador(tarea.titulo);
    setEditando(false);
  }

  const clases = ["vuelo", tarea.completada && "vuelo--despego", resaltada && "vuelo--nuevo"].filter(Boolean).join(" ");

  return (
    <li className={clases}>
      <span className="vuelo__hora" title={fechaCorta(tarea.created_at)}>
        {hora(tarea.created_at)}
      </span>
      <span className="vuelo__codigo">{codigoVuelo(tarea.id)}</span>

      {editando ? (
        <form className="vuelo__edicion" onSubmit={guardar}>
          <input
            value={borrador}
            onChange={(e) => setBorrador(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && cancelar()}
            maxLength={120}
            autoFocus
          />
          <button className="mini">Guardar</button>
          <button type="button" className="mini mini--gris" onClick={cancelar}>
            ✕
          </button>
        </form>
      ) : (
        <span className="vuelo__destino" onDoubleClick={abrirEdicion}>
          {tarea.titulo}
        </span>
      )}

      <button
        className="vuelo__estado"
        onClick={() => onEditar(tarea.id, { completada: !tarea.completada })}
        title={tarea.completada ? "Regresar a puerta" : "Marcar como despegado"}
      >
        {tarea.completada ? "Despegó" : "En puerta"}
      </button>

      <span className="vuelo__acciones">
        {!editando && (
          <button className="mini mini--gris" onClick={abrirEdicion} title="Editar">
            Editar
          </button>
        )}
        {confirmar ? (
          <>
            <button className="mini mini--rojo" onClick={() => onBorrar(tarea.id)}>
              ¿Cancelar vuelo?
            </button>
            <button className="mini mini--gris" onClick={() => setConfirmar(false)}>
              No
            </button>
          </>
        ) : (
          <button className="mini mini--gris" onClick={() => setConfirmar(true)} title="Borrar">
            Borrar
          </button>
        )}
      </span>
    </li>
  );
}
