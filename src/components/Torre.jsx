import { useMemo, useState } from "react";
import { useTareas } from "../hooks/useTareas";
import Cabecera from "./Cabecera";
import NuevaTarea from "./NuevaTarea";
import Tablero from "./Tablero";

const FILTROS = {
  todas: { etiqueta: "Todos", prueba: () => true },
  pendientes: { etiqueta: "En puerta", prueba: (t) => !t.completada },
  completadas: { etiqueta: "Despegaron", prueba: (t) => t.completada },
};

/** Pantalla principal del usuario autenticado. */
export default function Torre({ usuario }) {
  const { tareas, cargando, error, enVivo, ultimoCambio, crear, editar, borrar } = useTareas(usuario.id);
  const [filtro, setFiltro] = useState("todas");

  const visibles = useMemo(() => tareas.filter(FILTROS[filtro].prueba), [tareas, filtro]);
  const despegadas = tareas.filter((t) => t.completada).length;
  const progreso = tareas.length ? Math.round((despegadas / tareas.length) * 100) : 0;

  return (
    <div className="torre">
      <Cabecera usuario={usuario} enVivo={enVivo} />

      <section className="resumen">
        <Dato etiqueta="Programados" valor={tareas.length} />
        <Dato etiqueta="En puerta" valor={tareas.length - despegadas} />
        <Dato etiqueta="Despegaron" valor={despegadas} />
        <div className="resumen__pista">
          <small>Pista {progreso}%</small>
          <div className="pista">
            <div className="pista__avion" style={{ left: `${progreso}%` }}>
              ✈
            </div>
          </div>
        </div>
      </section>

      <NuevaTarea onCrear={crear} />

      {error && <p className="aviso-linea aviso-linea--error torre__error">⚠ {error}</p>}

      <nav className="filtros" aria-label="Filtrar vuelos">
        {Object.entries(FILTROS).map(([clave, { etiqueta }]) => (
          <button key={clave} className={filtro === clave ? "activa" : ""} onClick={() => setFiltro(clave)}>
            {etiqueta}
          </button>
        ))}
      </nav>

      <Tablero
        tareas={visibles}
        cargando={cargando}
        vacio={tareas.length === 0}
        resaltada={ultimoCambio}
        onEditar={editar}
        onBorrar={borrar}
      />
    </div>
  );
}

function Dato({ etiqueta, valor }) {
  return (
    <div className="dato">
      <small>{etiqueta}</small>
      <b key={valor}>{String(valor).padStart(2, "0")}</b>
    </div>
  );
}
