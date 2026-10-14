// Árbol N-ario: una raíz de la que salen todos los nodos.
export class ArbolNario {
  constructor(raiz) {
    this.raiz = raiz;
  }

  // DFS (Depth-First Search): baja por cada rama hasta el fondo antes de seguir con la otra.
  // Recursivo, como en clase. "visitar" recibe el nodo y su nivel (la raíz es el nivel 0).
  dfs(visitar, nodo = this.raiz, nivel = 0) {
    if (!nodo) return;
    visitar(nodo, nivel);
    for (const hijo of nodo.hijos) {
      this.dfs(visitar, hijo, nivel + 1);
    }
  }

  // BFS (Breadth-First Search): recorre nivel por nivel, de izquierda a derecha, con una cola.
  bfs(visitar) {
    if (!this.raiz) return;
    const cola = [{ nodo: this.raiz, nivel: 0 }];
    while (cola.length > 0) {
      const { nodo, nivel } = cola.shift();
      visitar(nodo, nivel);
      cola.push(...nodo.hijos.map((hijo) => ({ nodo: hijo, nivel: nivel + 1 })));
    }
  }

  // Camino desde la raíz hasta el primer nodo que cumpla la condición (DFS).
  // Sirve para saber qué ramas del menú abrir y para la ruta de migas de pan.
  camino(condicion, nodo = this.raiz, recorrido = []) {
    if (!nodo) return null;
    const actual = [...recorrido, nodo];
    if (condicion(nodo)) return actual;
    for (const hijo of nodo.hijos) {
      const encontrado = this.camino(condicion, hijo, actual);
      if (encontrado) return encontrado;
    }
    return null;
  }

  // Todos los nodos en orden DFS (para generar las rutas).
  nodos() {
    const lista = [];
    this.dfs((nodo) => lista.push(nodo));
    return lista;
  }

  altura(nodo = this.raiz) {
    if (!nodo) return -1;
    return 1 + Math.max(-1, ...nodo.hijos.map((hijo) => this.altura(hijo)));
  }
}
