import Trie from "./Trie";
import MinHeap from "./MinHeap";

/**
 * Menos popular = "menor". Si empatan, va abajo el que va después alfabéticamente,
 * para que el resultado sea siempre el mismo.
 */
const menosPopular = (a, b) => a.popularity - b.popularity || b.name.localeCompare(a.name);

/** Smart search engine + Top results (Challenge 12). */
export default class Buscador {
  constructor() {
    this.trie = new Trie();
  }

  insert(name, popularity) {
    const p = Number(popularity);
    if (!name.trim()) throw new Error("El producto necesita un nombre.");
    if (!Number.isFinite(p) || p < 0 || p > 100) throw new Error("La popularidad va de 0 a 100.");
    return this.trie.insert(name, Math.round(p));
  }

  /**
   * searchTopK(prefix, k):
   *  1. El Trie devuelve los productos que empiezan por el prefijo.
   *  2. Un Min Heap de tamaño k guarda los mejores: si se pasa de k,
   *     pop() saca el menos popular (está en la raíz).
   *  3. Al final se vacía el heap (sale de menor a mayor) y se invierte.
   * Costo: O(m log k) con m = productos con ese prefijo.
   */
  searchTopK(prefix, k) {
    const candidatos = this.trie.searchPrefix(prefix);
    const heap = new MinHeap(menosPopular);

    for (const producto of candidatos) {
      heap.push(producto);
      if (heap.size() > k) heap.pop();
    }

    const heapFinal = heap.toArray(); // así quedó el arreglo del heap (para mostrarlo)
    const top = [];
    while (!heap.isEmpty()) top.push(heap.pop());

    return { resultados: top.reverse(), candidatos: candidatos.length, heapFinal };
  }

  productos() {
    return this.trie.searchPrefix("").sort((a, b) => b.popularity - a.popularity || a.name.localeCompare(b.name));
  }
}
