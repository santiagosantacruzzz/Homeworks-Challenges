import Trie from "./Trie.js";
import MaxHeap, { porReproducciones } from "./MaxHeap.js";
import Graph from "./Graph.js";

/**
 * Une las tres estructuras del parcial sobre el mismo conjunto de canciones:
 *   - trie:    buscador predictivo por título
 *   - ranking: Max Heap por reproducciones (TOP canciones)
 *   - grafo:   grafo no dirigido de canciones similares (recomendaciones)
 *
 * Las tres guardan la MISMA referencia de cada canción. Cuando una canción
 * suma reproducciones se actualiza el objeto y el heap se reacomoda.
 */
export default class Catalogo {
  constructor() {
    this.porId = new Map();
    this.trie = new Trie();
    this.ranking = new MaxHeap([], porReproducciones);
    this.grafo = new Graph();
  }

  static desde(canciones = [], relaciones = []) {
    const catalogo = new Catalogo();
    for (const cancion of canciones) catalogo.agregar(cancion, { reacomodar: false });
    // heapify una sola vez: O(n) en vez de n pushes O(n log n)
    catalogo.ranking.heapify();
    for (const [a, b] of relaciones) catalogo.conectar(a, b);
    return catalogo;
  }

  get tamano() {
    return this.porId.size;
  }

  obtener(id) {
    return this.porId.get(String(id)) ?? null;
  }

  agregar(datos, { reacomodar = true } = {}) {
    const id = String(datos.id);
    if (this.porId.has(id)) return this.porId.get(id);

    const cancion = { ...datos, id, reproducciones: Number(datos.reproducciones) || 0 };
    this.porId.set(id, cancion);
    this.trie.insert(cancion.titulo, cancion);
    this.grafo.addNode(id);

    if (reacomodar) {
      this.ranking.push(cancion);
    } else {
      this.ranking.heap.push(cancion); // se ordena después con heapify
    }
    return cancion;
  }

  conectar(a, b) {
    return this.grafo.addEdge(String(a), String(b));
  }

  /** Cambia los datos de una canción (por ejemplo, nuevas reproducciones). */
  actualizar(datos) {
    const cancion = this.obtener(datos.id);
    if (!cancion) return this.agregar(datos);

    Object.assign(cancion, datos, {
      id: cancion.id,
      reproducciones: Number(datos.reproducciones) || 0,
    });
    this.ranking.actualizar((x) => x.id === cancion.id, cancion);
    return cancion;
  }

  eliminar(id) {
    const cancion = this.obtener(id);
    if (!cancion) return false;
    this.porId.delete(cancion.id);
    this.trie.remove(cancion.titulo, cancion.id);
    this.ranking.eliminar((x) => x.id === cancion.id);
    this.grafo.removeNode(cancion.id);
    return true;
  }

  top(k) {
    return this.ranking.topK(k);
  }

  /** Puesto de cada canción en el ranking completo (1 = más escuchada). */
  posiciones() {
    const puestos = new Map();
    this.ranking.topK(this.ranking.size()).forEach((c, i) => puestos.set(c.id, i + 1));
    return puestos;
  }

  recomendar(id, limite = 8) {
    return this.grafo
      .recomendar(String(id), {
        limite,
        desempate: (a, b) => porReproducciones(this.obtener(b), this.obtener(a)),
      })
      .map((r) => ({ ...r, cancion: this.obtener(r.id) }));
  }
}
