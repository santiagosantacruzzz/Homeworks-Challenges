export default function Cabecera({ red, onReiniciar }) {
  const personas = red.personas().length;
  const ciudades = red.ciudades().length;
  const amistades = red.grafo.edges().length - personas; // cada persona tiene 1 arista de residencia

  return (
    <header className="cabecera">
      <div>
        <p className="cabecera__volumen">Vol. XI · Estructuras de Datos II</p>
        <h1>
          Atlas de <em>amigos</em>
        </h1>
      </div>
      <dl className="cabecera__cifras">
        <div>
          <dt>Personas</dt>
          <dd>{personas}</dd>
        </div>
        <div>
          <dt>Ciudades</dt>
          <dd>{ciudades}</dd>
        </div>
        <div>
          <dt>Amistades</dt>
          <dd>{amistades}</dd>
        </div>
      </dl>
      <button className="enlace" onClick={onReiniciar} title="Vuelve a los datos de ejemplo">
        Reimprimir atlas
      </button>
    </header>
  );
}
