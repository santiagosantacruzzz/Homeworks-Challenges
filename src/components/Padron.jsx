import { colorCiudad } from "../utils/colores";

/** Lo que pide el challenge: imprimir las personas que viven en una ciudad. */
export default function Padron({ red, ciudad, onCiudad, onElegir, seleccion }) {
  const ciudades = red.ciudades();
  const actual = red.grafo.searchNode(ciudad);
  const habitantes = actual ? red.personasDe(ciudad) : [];
  const color = colorCiudad(ciudades, ciudad);

  return (
    <section className="tarjeta padron" style={{ "--tinta-ciudad": color }}>
      <h2 className="tarjeta__titulo">Padrón de habitantes</h2>

      {ciudades.length === 0 ? (
        <p className="nota">No hay ciudades registradas.</p>
      ) : (
        <>
          <select className="padron__select" value={ciudad} onChange={(e) => onCiudad(e.target.value)} aria-label="Ciudad">
            {ciudades.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>

          <p className="padron__conteo">
            {habitantes.length === 0
              ? `Nadie vive en ${actual?.nombre} todavía.`
              : `${habitantes.length} ${habitantes.length === 1 ? "persona vive" : "personas viven"} en ${actual?.nombre}`}
          </p>

          <ol className="padron__lista">
            {habitantes.map((p, i) => (
              <li key={p.id}>
                <button className={p.id === seleccion ? "activa" : ""} onClick={() => onElegir(p.id)}>
                  <span className="padron__num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="padron__nombre">{p.nombre}</span>
                  <span className="padron__edad">{p.edad} años</span>
                </button>
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  );
}
