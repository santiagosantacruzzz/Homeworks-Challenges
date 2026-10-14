// Imprime el árbol del menú con los dos recorridos vistos en clase.
export default function MapaMenu({ arbol }) {
  const dfs = [];
  const bfs = [];
  arbol.dfs((nodo, nivel) => dfs.push({ nodo, nivel }));
  arbol.bfs((nodo, nivel) => bfs.push({ nodo, nivel }));

  return (
    <div className="map">
      <section>
        <h2>DFS: en profundidad</h2>
        <p className="note">Una rama hasta el fondo antes de pasar a la siguiente. Es el orden del panel lateral.</p>
        <ol>
          {dfs.map(({ nodo, nivel }) => (
            <li key={nodo.valor.link} style={{ "--nivel": nivel }}>
              <span className="lvl">N{nivel}</span>
              {nodo.valor.title}
            </li>
          ))}
        </ol>
      </section>
      <section>
        <h2>BFS: por niveles</h2>
        <p className="note">Nivel por nivel, de izquierda a derecha, usando una cola.</p>
        <ol>
          {bfs.map(({ nodo, nivel }) => (
            <li key={nodo.valor.link}>
              <span className="lvl">N{nivel}</span>
              {nodo.valor.title}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
