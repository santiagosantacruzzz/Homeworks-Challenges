import { Node } from "./Node.js";
import MaxHeap, { porReproducciones } from "./MaxHeap.js";
import { normalizar } from "./normalizar.js";

/**
 * Trie de títulos de canciones (Clase 12).
 * La información no está en los nodos sino en el CAMINO:
 * cada arista es una letra y el recorrido desde la raíz forma el título.
 */
export default class Trie {
  constructor() {
    this.root = new Node(null);
    this.totalPalabras = 0;
    this.totalNodos = 1; // la raíz
  }

  /**
   * 1. Insertar: parte el título en letras, crea los nodos que falten
   * y marca isEndOfWord en la última. O(L), L = largo del título.
   */
  insert(word, cancion = null) {
    const clave = normalizar(word);
    if (!clave) return false;

    let current = this.root;

    for (let character of clave) {
      if (current.children[character] === undefined) {
        current.children[character] = new Node(character);
        this.totalNodos++;
      }

      current = current.children[character];
    }

    if (!current.isEndOfWord) this.totalPalabras++;
    current.isEndOfWord = true;

    if (cancion && !current.canciones.some((c) => c.id === cancion.id)) {
      current.canciones.push(cancion);
    }
    return true;
  }

  /**
   * 2. Buscar: sigue las letras una por una desde la raíz.
   * Si falta una letra, el título no está. Si llega al final,
   * el título existe solo si ese nodo tiene isEndOfWord. O(L)
   */
  search(word) {
    const nodo = this.nodoDe(word);
    return nodo !== null && nodo.isEndOfWord;
  }

  /**
   * Quita una canción del título. Si ya no queda ninguna con ese título,
   * se desmarca isEndOfWord y se podan hacia arriba los nodos que
   * quedaron sin hijos y sin palabra.
   */
  remove(word, id) {
    const clave = normalizar(word);
    const camino = [this.root];
    let current = this.root;
    for (let character of clave) {
      current = current.children[character];
      if (current === undefined) return false;
      camino.push(current);
    }
    if (!current.isEndOfWord) return false;

    current.canciones = current.canciones.filter((c) => c.id !== id);
    if (current.canciones.length > 0) return true;

    current.isEndOfWord = false;
    this.totalPalabras--;
    for (let i = camino.length - 1; i > 0; i--) {
      const nodo = camino[i];
      if (nodo.isEndOfWord || Object.keys(nodo.children).length > 0) break;
      delete camino[i - 1].children[nodo.value];
      this.totalNodos--;
    }
    return true;
  }

  // Igual que search, pero devuelve las canciones con ese título exacto
  buscar(word) {
    const nodo = this.nodoDe(word);
    return nodo && nodo.isEndOfWord ? [...nodo.canciones] : [];
  }

  // Nodo al que se llega siguiendo el prefijo, o null si se corta el camino
  nodoDe(prefijo) {
    let current = this.root;
    for (let character of normalizar(prefijo)) {
      if (current.children[character] === undefined) {
        return null;
      }
      current = current.children[character];
    }
    return current;
  }

  startsWith(prefijo) {
    return this.nodoDe(prefijo) !== null;
  }

  /**
   * 3. Sugerencias por prefijo: baja hasta el nodo del prefijo y desde
   * ahí hace un recorrido en profundidad (DFS) juntando cada título que
   * termina en el subárbol. Devuelve { titulo, canciones }.
   */
  sugerencias(prefijo) {
    const clave = normalizar(prefijo);
    const inicio = this.nodoDe(clave);
    if (!inicio) return [];

    const resultado = [];
    const dfs = (nodo, armado) => {
      if (nodo.isEndOfWord) {
        resultado.push({ titulo: armado, canciones: [...nodo.canciones] });
      }
      // Recorre los hijos en orden alfabético para que la lista sea estable
      for (const letra of Object.keys(nodo.children).sort((a, b) => a.localeCompare(b, "es"))) {
        dfs(nodo.children[letra], armado + letra);
      }
    };
    dfs(inicio, clave);
    return resultado;
  }

  /**
   * Challenge 12 aplicado: sugerencias del prefijo ordenadas por
   * popularidad con un Max Heap y recortadas a las K mejores.
   */
  searchTopK(prefijo, k) {
    const canciones = this.sugerencias(prefijo).flatMap((s) => s.canciones);
    const heap = new MaxHeap(canciones, porReproducciones);
    return heap.topK(k);
  }

  /**
   * Camino de letras que se recorre al escribir el prefijo.
   * Sirve para dibujar en pantalla qué tan lejos llegó la búsqueda:
   * cada paso dice si la letra existe, cuántas ramas salen y si ahí
   * termina un título.
   */
  camino(prefijo) {
    const pasos = [];
    let current = this.root;
    let cortado = false;

    for (let character of normalizar(prefijo)) {
      const siguiente = cortado ? undefined : current.children[character];
      if (siguiente === undefined) {
        cortado = true;
        pasos.push({ letra: character, existe: false, ramas: 0, finDePalabra: false });
        continue;
      }
      current = siguiente;
      pasos.push({
        letra: character,
        existe: true,
        ramas: Object.keys(current.children).length,
        finDePalabra: current.isEndOfWord,
      });
    }
    return pasos;
  }

  // Letras con las que puede seguir el prefijo (ramas del nodo actual)
  siguientesLetras(prefijo) {
    const nodo = this.nodoDe(prefijo);
    return nodo ? Object.keys(nodo.children).sort((a, b) => a.localeCompare(b, "es")) : [];
  }
}
