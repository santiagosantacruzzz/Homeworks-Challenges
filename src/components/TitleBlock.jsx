// Rótulo del plano: los datos del árbol con la terminología de la clase.
export default function TitleBlock({ stats }) {
  const vacio = stats.nodos === 0;
  const filas = [
    ["Nodos", stats.nodos],
    ["Raíz", vacio ? "—" : stats.raiz],
    ["Altura", vacio ? "—" : stats.altura],
    ["Hojas", vacio ? "—" : stats.hojas.join(", ")],
    ["Mínimo", vacio ? "—" : stats.minimo],
    ["Máximo", vacio ? "—" : stats.maximo],
  ];

  return (
    <aside className="title-block" aria-label="Datos del árbol">
      <p className="title-block__head">
        <span>Challenge 08</span>
        <span>Árbol binario de búsqueda</span>
      </p>
      <dl>
        {filas.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
