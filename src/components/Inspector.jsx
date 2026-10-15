import { useState } from "react";
import useArbol from "../hooks/useArbol";
import { IconoNodo } from "./Icono";
import NuevoElemento from "./NuevoElemento";
import Recorridos from "./Recorridos";

const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

const fecha = (ts) =>
  ts?.toDate
    ? ts.toDate().toLocaleString("es-CO", { dateStyle: "long", timeStyle: "short" })
    : "Guardando…";

export default function Inspector() {
  const { arbol, seleccionado: nodo, esDelUsuario, renombrar, eliminar } = useArbol();
  const [modo, setModo] = useState(null); // null | "renombrar" | "eliminar"
  const [nombre, setNombre] = useState(nodo.nombre);
  const [aviso, setAviso] = useState(null);

  const esRaiz = !nodo.padre;
  const propio = esDelUsuario(nodo);
  const rama = nodo.esCarpeta ? arbol.estadisticas(nodo) : null;

  const guardarNombre = async (e) => {
    e.preventDefault();
    const r = await renombrar(nodo, nombre);
    if (r.ok) setModo(null);
    else setAviso(r.mensaje);
  };

  const confirmarEliminar = async () => {
    const r = await eliminar(nodo);
    if (!r.ok) {
      setAviso(r.mensaje);
      setModo(null);
    }
  };

  return (
    <aside className="inspector" aria-label="Elemento seleccionado">
      <header className={`ficha ficha--${nodo.tipo}`}>
        <IconoNodo nodo={nodo} />
        <div>
          <h2>{nodo.nombre}</h2>
          <p>{esRaiz ? "Carpeta raíz" : nodo.esCarpeta ? "Carpeta" : "Archivo"}</p>
        </div>
      </header>

      <dl className="datos">
        <div><dt>Ruta</dt><dd>{arbol.ruta(nodo.id)}</dd></div>
        <div><dt>Profundidad</dt><dd>{nodo.profundidad}</dd></div>
        <div>
          <dt>Hijos</dt>
          <dd>{nodo.esArchivo ? "Ninguno (es hoja)" : nodo.hijos.length}</dd>
        </div>
        {rama && (
          <div>
            <dt>En esta rama</dt>
            <dd>
              {rama.total === 0
                ? "Vacía"
                : `${plural(rama.carpetas, "carpeta", "carpetas")}, ${plural(rama.archivos, "archivo", "archivos")}, altura ${arbol.altura(nodo)}`}
            </dd>
          </div>
        )}
        {!esRaiz && (
          <>
            <div><dt>Creado por</dt><dd>{nodo.autorEmail}</dd></div>
            <div><dt>Fecha</dt><dd>{fecha(nodo.creadoEn)}</dd></div>
          </>
        )}
      </dl>

      {!esRaiz && propio && (
        <div className="acciones">
          {modo === "renombrar" && (
            <form onSubmit={guardarNombre} className="acciones__form">
              <input
                className="campo"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  setAviso(null);
                }}
                maxLength={60}
                aria-label="Nuevo nombre"
                autoFocus
              />
              <button className="boton boton--principal">Guardar nombre</button>
              <button type="button" className="boton" onClick={() => setModo(null)}>
                Cancelar
              </button>
            </form>
          )}

          {modo === "eliminar" && (
            <div className="acciones__form acciones__form--peligro">
              <p>
                Se eliminará <strong>{nodo.nombre}</strong>
                {rama && rama.total > 0 && ` junto con ${rama.total} elemento(s) que contiene`}.
              </p>
              <button className="boton boton--peligro" onClick={confirmarEliminar}>
                Eliminar definitivamente
              </button>
              <button className="boton" onClick={() => setModo(null)}>
                Cancelar
              </button>
            </div>
          )}

          {modo === null && (
            <>
              <button className="boton" onClick={() => setModo("renombrar")}>Renombrar</button>
              <button className="boton boton--texto-peligro" onClick={() => setModo("eliminar")}>
                Eliminar
              </button>
            </>
          )}
        </div>
      )}

      {!esRaiz && !propio && (
        <p className="nota">Solo {nodo.autorEmail} puede renombrar o eliminar este elemento.</p>
      )}
      {aviso && <p className="aviso" role="alert">{aviso}</p>}

      <NuevoElemento key={`nuevo-${nodo.id}`} />
      <Recorridos />
    </aside>
  );
}
