/**
 * Nodo del Trie (igual al de la Clase 12).
 * - value: la letra que representa el nodo (la raíz es null).
 * - isEndOfWord: true si en este nodo termina un título.
 * - children: mapa letra -> Node.
 *
 * Dato extra para el parcial: en el nodo donde termina un título
 * se guardan las canciones con ese título (dos artistas pueden tener
 * una canción con el mismo nombre).
 */
export function Node(value) {
  this.value = value;
  this.isEndOfWord = false;
  this.children = {};
  this.canciones = [];
}
