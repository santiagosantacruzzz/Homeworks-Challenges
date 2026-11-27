import { normalizar } from "../estructuras/Trie";

/** Pinta en verde la parte del nombre que coincide con el prefijo. */
function Nombre({ name, consulta }) {
  const largo = normalizar(consulta).length;
  if (!largo) return name;
  // El nombre guardado no tiene espacios dobles, así que las posiciones coinciden
  return (
    <>
      <mark>{name.slice(0, largo)}</mark>
      {name.slice(largo)}
    </>
  );
}

export default function Resultados({ consulta, k, resultados, candidatos, onSumar, onQuitar }) {
  const llamada = `searchTopK("${normalizar(consulta)}", ${k})`;

  return (
    <section className="resultados" aria-live="polite">
      <div className="resultados__cabeza">
        <code>{llamada}</code>
        <span>
          {candidatos === 0
            ? "sin coincidencias"
            : `${resultados.length} de ${candidatos} ${candidatos === 1 ? "coincidencia" : "coincidencias"}`}
        </span>
      </div>

      {resultados.length === 0 ? (
        <div className="vacio">
          <p>Ningún producto empieza por “{consulta.trim()}”.</p>
          <small>Prueba con menos letras, o agrégalo abajo.</small>
        </div>
      ) : (
        <ol className="lista">
          {resultados.map((p, i) => (
            <li key={p.name} className="item" style={{ animationDelay: `${i * 40}ms` }}>
              <span className="item__puesto">{i + 1}</span>
              <div className="item__cuerpo">
                <span className="item__nombre">
                  <Nombre name={p.name} consulta={consulta} />
                </span>
                <span className="item__barra">
                  <span style={{ width: `${p.popularity}%` }} />
                </span>
              </div>
              <span className="item__pop">{p.popularity}</span>
              <span className="item__acciones">
                <button onClick={() => onSumar(p, 5)} title="Subir popularidad (+5)" disabled={p.popularity >= 100}>
                  ▲
                </button>
                <button onClick={() => onSumar(p, -5)} title="Bajar popularidad (−5)" disabled={p.popularity <= 0}>
                  ▼
                </button>
                <button onClick={() => onQuitar(p)} title="Quitar del Trie" className="item__quitar">
                  ×
                </button>
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
