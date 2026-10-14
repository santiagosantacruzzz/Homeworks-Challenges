import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { arbolMenu } from "./data/menu";
import Layout from "./components/Layout";
import Pagina from "./components/Pagina";
import "./styles/app.css";

// Imprime el árbol del menú en la consola con los dos recorridos de la clase (una vez).
function imprimirMenu(arbol) {
  console.group("Menú: DFS (en profundidad)");
  arbol.dfs((nodo, nivel) => console.log(`${"  ".repeat(nivel)}${nodo.valor.title}  →  ${nodo.valor.link}`));
  console.groupEnd();
  console.group("Menú: BFS (por niveles)");
  arbol.bfs((nodo, nivel) => console.log(`nivel ${nivel}: ${nodo.valor.title}`));
  console.groupEnd();
}
imprimirMenu(arbolMenu);

function NoEncontrada() {
  return (
    <article className="page">
      <h1>Esta página no está en el menú</h1>
      <p className="lead">Ningún nodo del árbol tiene ese link.</p>
      <Link to="/">Volver al inicio</Link>
    </article>
  );
}

export default function App() {
  // Las rutas salen del mismo árbol: cada nodo aporta su link y su componente.
  const nodos = arbolMenu.nodos();

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout arbol={arbolMenu} />}>
          {nodos.map((nodo) => (
            <Route
              key={nodo.valor.link}
              path={nodo.valor.link}
              element={<Pagina nodo={nodo} arbol={arbolMenu} />}
            />
          ))}
          <Route path="*" element={<NoEncontrada />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
