/**
 * Grafo NO dirigido con lista de adyacencia (Clase 11).
 * - nodes: lista con el id de cada canción (vértices).
 * - adjList: objeto id -> arreglo de ids conectados (aristas).
 *
 * Al ser no dirigido, addEdge(a, b) guarda la arista en los dos
 * sentidos: a conoce a b y b conoce a a.
 */
export default class Graph {
  constructor() {
    this.nodes = [];
    this.adjList = {};
  }

  addNode(node) {
    if (!this.searchNode(node)) {
      this.nodes.push(node);
      this.adjList[node] = [];
      return true;
    }
    return false;
  }

  addEdge(node1, node2) {
    if (node1 === node2) return false; // una canción no se recomienda a sí misma
    if (!this.searchNode(node1) || !this.searchNode(node2)) return false;
    if (this.adjList[node1].includes(node2)) return false; // arista repetida

    this.adjList[node1].push(node2);
    this.adjList[node2].push(node1);
    return true;
  }

  searchNode(node) {
    if (!this.nodes.length) return undefined;
    return this.nodes.find((n) => n == node);
  }

  // Aristas (vecinos) de un nodo
  printAdjacency(node) {
    if (this.searchNode(node)) {
      return [...this.adjList[node]];
    }
    return [];
  }

  isEmpty() {
    return this.nodes.length === 0;
  }

  // Quita el nodo y todas las aristas que llegaban a él
  removeNode(node) {
    if (!this.searchNode(node)) return false;
    for (const vecino of this.adjList[node]) {
      this.adjList[vecino] = this.adjList[vecino].filter((n) => n !== node);
    }
    delete this.adjList[node];
    this.nodes = this.nodes.filter((n) => n !== node);
    return true;
  }

  removeEdge(node1, node2) {
    if (!this.searchNode(node1) || !this.searchNode(node2)) return false;
    this.adjList[node1] = this.adjList[node1].filter((n) => n !== node2);
    this.adjList[node2] = this.adjList[node2].filter((n) => n !== node1);
    return true;
  }

  totalAristas() {
    // Cada arista está guardada dos veces (una por extremo)
    return this.nodes.reduce((suma, n) => suma + this.adjList[n].length, 0) / 2;
  }

  // Lista de adyacencia en texto, como el console.log de la clase
  print() {
    return this.nodes.map((n) => `${n} -> [${this.adjList[n].join(", ")}]`).join("\n");
  }

  /**
   * Recorrido en anchura (BFS) desde `inicio`, hasta `profundidad` saltos.
   * Devuelve cada nodo con su nivel (1 = vecino directo, 2 = vecino de un vecino).
   */
  bfs(inicio, profundidad = Infinity) {
    if (!this.searchNode(inicio)) return [];

    const nivel = { [inicio]: 0 };
    const cola = [inicio];
    const orden = [];

    while (cola.length > 0) {
      const actual = cola.shift();
      if (nivel[actual] >= profundidad) continue;

      for (const vecino of this.adjList[actual]) {
        if (nivel[vecino] === undefined) {
          nivel[vecino] = nivel[actual] + 1;
          orden.push({ id: vecino, nivel: nivel[vecino] });
          cola.push(vecino);
        }
      }
    }
    return orden;
  }

  /**
   * Recomendación de canciones relacionadas.
   * 1. Vecinos directos (nivel 1): son similares a la canción elegida.
   * 2. Vecinos de los vecinos (nivel 2): se ordenan por cuántos vecinos
   *    comparten con la canción elegida; más conexiones en común = más afines.
   * `desempate(a, b)` ordena los empates (por ejemplo, por popularidad).
   */
  recomendar(inicio, { limite = 8, desempate = () => 0 } = {}) {
    const visitados = this.bfs(inicio, 2);
    const directos = new Set(this.printAdjacency(inicio));

    const recomendaciones = visitados.map(({ id, nivel }) => {
      const enComun = this.adjList[id].filter((v) => directos.has(v));
      return { id, nivel, enComun };
    });

    recomendaciones.sort(
      (a, b) =>
        a.nivel - b.nivel ||
        b.enComun.length - a.enComun.length ||
        desempate(a.id, b.id)
    );
    return recomendaciones.slice(0, limite);
  }
}
