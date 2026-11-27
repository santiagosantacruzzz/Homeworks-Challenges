import FilaVuelo from "./FilaVuelo";

/** Read del CRUD: tablero de salidas con la lista en vivo. */
export default function Tablero({ tareas, cargando, vacio, resaltada, onEditar, onBorrar }) {
  return (
    <section className="tablero" aria-live="polite">
      <div className="tablero__encabezado" aria-hidden="true">
        <span>Hora</span>
        <span>Vuelo</span>
        <span>Destino</span>
        <span>Estado</span>
        <span />
      </div>

      {cargando && <p className="tablero__vacio">Recibiendo datos del radar…</p>}
      {!cargando && vacio && <p className="tablero__vacio">Pista despejada. Programa tu primer vuelo arriba.</p>}
      {!cargando && !vacio && tareas.length === 0 && <p className="tablero__vacio">Ningún vuelo con ese filtro.</p>}

      <ol>
        {tareas.map((t) => (
          <FilaVuelo key={t.id} tarea={t} resaltada={t.id === resaltada} onEditar={onEditar} onBorrar={onBorrar} />
        ))}
      </ol>
    </section>
  );
}
