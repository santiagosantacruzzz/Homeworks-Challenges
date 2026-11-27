/**
 * Nodo del Trie (Clase 12, diapositiva 6).
 * La información no está en el nodo sino en el camino: cada arista es una letra.
 *  - value:       la letra que llega a este nodo (null en la raíz)
 *  - children:    mapa letra -> TrieNode
 *  - isEndOfWord: true si aquí termina el nombre de un producto
 *  - producto:    el producto guardado al final de la palabra
 */
export default class TrieNode {
  constructor(value = null) {
    this.value = value;
    this.children = new Map();
    this.isEndOfWord = false;
    this.producto = null;
  }
}
