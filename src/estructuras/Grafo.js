/**
 * Grafo NO dirigido con lista de adyacencia (Clase 11).
 *  - nodes:   lista con los vértices (personas y ciudades).
 *  - adjList: objeto  id -> arreglo de ids conectados (aristas).
 *
 * Al ser no dirigido, addEdge(a, b) guarda la arista en los dos sentidos.
 * Los métodos se llaman como en la diapositiva 8.
 */
export default class Grafo {
  constructor() {
    this.nodes = [];
    this.adjList = {};
  }

  /** Agrega un vértice. El nodo es un objeto con `id` (Persona o Ciudad). */
  addNode(node) {
    if (this.searchNode(node.id)) return false;
    this.nodes.push(node);
    this.adjList[node.id] = [];
    return true;
  }

  /** Devuelve el nodo con ese id, o undefined si no está. */
  searchNode(id) {
    return this.nodes.find((n) => n.id === id);
  }

  /** Conecta dos nodos en ambos sentidos. */
  addEdge(id1, id2) {
    if (id1 === id2) return false;
    if (!this.searchNode(id1) || !this.searchNode(id2)) return false;
    if (this.adjList[id1].includes(id2)) return false; // arista repetida

    this.adjList[id1].push(id2);
    this.adjList[id2].push(id1);
    return true;
  }

  removeEdge(id1, id2) {
    if (!this.searchNode(id1) || !this.searchNode(id2)) return false;
    this.adjList[id1] = this.adjList[id1].filter((n) => n !== id2);
    this.adjList[id2] = this.adjList[id2].filter((n) => n !== id1);
    return true;
  }

  /** Aristas (vecinos) de un nodo, como objetos. */
  printAdjacency(id) {
    if (!this.searchNode(id)) return [];
    return this.adjList[id].map((vecino) => this.searchNode(vecino));
  }

  isEmpty() {
    return this.nodes.length === 0;
  }

  /** Quita el nodo y todas las aristas que llegaban a él. */
  removeNode(id) {
    if (!this.searchNode(id)) return false;
    for (const vecino of this.adjList[id]) {
      this.adjList[vecino] = this.adjList[vecino].filter((n) => n !== id);
    }
    delete this.adjList[id];
    this.nodes = this.nodes.filter((n) => n.id !== id);
    return true;
  }

  /** Lista de adyacencia en texto, como el console.log de la clase. */
  print() {
    return this.nodes
      .map((n) => `${n.nombre} -> [${this.printAdjacency(n.id).map((v) => v.nombre).join(", ")}]`)
      .join("\n");
  }

  /** Aristas sin repetir (cada una está guardada dos veces). */
  edges() {
    const vistas = [];
    for (const id of Object.keys(this.adjList)) {
      for (const vecino of this.adjList[id]) {
        if (id < vecino) vistas.push([id, vecino]);
      }
    }
    return vistas;
  }
}
