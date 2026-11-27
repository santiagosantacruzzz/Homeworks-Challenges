import { useState } from "react";
import { colorCiudad } from "../utils/colores";

/** Detalle del nodo elegido en el mapa: sus aristas y acciones. */
export default function Ficha({ red, nodo, hacer, onElegir, onCerrar }) {
  const [confirmar, setConfirmar] = useState(false);
  const ciudades = red.ciudades();
  const esPersona = nodo.tipo === "persona";
  const ciudad = esPersona ? red.ciudadDe(nodo.id) : nodo;
  const color = colorCiudad(ciudades, ciudad?.id);

  function eliminar() {
    if (hacer((r) => r.eliminar(nodo.id))) onCerrar();
    setConfirmar(false);
  }

  return (
    <section className="tarjeta ficha" style={{ "--tinta-ciudad": color }} key={nodo.id}>
      <button className="ficha__cerrar" onClick={onCerrar} aria-label="Cerrar ficha">
        ×
      </button>
      <p className="ficha__tipo">{esPersona ? "Ficha de persona" : "Ficha de ciudad"}</p>
      <h2 className="ficha__nombre">{nodo.nombre}</h2>

      {esPersona ? (
        <>
          <dl className="ficha__datos">
            <div>
              <dt>Edad</dt>
              <dd>{nodo.edad} años</dd>
            </div>
            <div>
              <dt>Vive en</dt>
              <dd>
                <select value={ciudad?.id ?? ""} onChange={(e) => hacer((r) => r.mudar(nodo.id, e.target.value))}>
                  {ciudades.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </dd>
            </div>
          </dl>
          <h3>Amigos ({red.amigosDe(nodo.id).length})</h3>
          <ul className="chips">
            {red.amigosDe(nodo.id).map((a) => (
              <li key={a.id}>
                <button onClick={() => onElegir(a.id)}>{a.nombre}</button>
                <button
                  className="chips__quitar"
                  title={`Terminar amistad con ${a.nombre}`}
                  onClick={() => hacer((r) => r.terminarAmistad(nodo.id, a.id))}
                >
                  ×
                </button>
              </li>
            ))}
            {red.amigosDe(nodo.id).length === 0 && <li className="nota">Sin amistades todavía.</li>}
          </ul>
        </>
      ) : (
        <p className="nota">
          {red.personasDe(nodo.id).length} habitantes. La lista completa está en el padrón.
        </p>
      )}

      <div className="ficha__acciones">
        {confirmar ? (
          <>
            <button className="boton boton--rojo" onClick={eliminar}>
              Sí, borrar del atlas
            </button>
            <button className="enlace" onClick={() => setConfirmar(false)}>
              Cancelar
            </button>
          </>
        ) : (
          <button className="enlace enlace--rojo" onClick={() => setConfirmar(true)}>
            Borrar {esPersona ? "persona" : "ciudad"}
          </button>
        )}
      </div>
    </section>
  );
}
