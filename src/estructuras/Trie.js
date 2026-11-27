import TrieNode from "./TrieNode";

/** Minúsculas, sin tildes y sin espacios repetidos: "Air  Máx" -> "air max" */
export const normalizar = (texto) =>
  texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

/** Trie con raíz nula (diapositiva 7). */
export default class Trie {
  constructor() {
    this.root = new TrieNode();
    this.total = 0;
  }

  /**
   * insert: parte la palabra en letras, crea un nodo por cada letra que falte
   * y marca isEndOfWord en el último. Si el producto ya existía, actualiza su popularidad.
   */
  insert(name, popularity) {
    const palabra = normalizar(name);
    if (!palabra) return null;

    let actual = this.root;
    for (const letra of palabra) {
      if (!actual.children.has(letra)) actual.children.set(letra, new TrieNode(letra));
      actual = actual.children.get(letra);
    }

    if (!actual.isEndOfWord) this.total++;
    actual.isEndOfWord = true;
    actual.producto = { name: name.trim().replace(/\s+/g, " "), popularity };
    return actual.producto;
  }

  /** Baja letra por letra desde la raíz. Devuelve el último nodo o null si el camino se corta. */
  findNode(texto) {
    let actual = this.root;
    for (const letra of normalizar(texto)) {
      actual = actual.children.get(letra);
      if (!actual) return null;
    }
    return actual;
  }

  /** search: true solo si todas las letras existen en orden Y ahí termina una palabra. */
  search(word) {
    const nodo = this.findNode(word);
    return Boolean(nodo?.isEndOfWord);
  }

  /** ¿Algún producto empieza por este prefijo? */
  startsWith(prefix) {
    return this.findNode(prefix) !== null;
  }

  /** Todos los productos debajo del prefijo (recorrido en profundidad). */
  searchPrefix(prefix) {
    const inicio = this.findNode(prefix);
    if (!inicio) return [];
    const encontrados = [];
    const pila = [inicio];
    while (pila.length) {
      const nodo = pila.pop();
      if (nodo.isEndOfWord) encontrados.push(nodo.producto);
      for (const hijo of nodo.children.values()) pila.push(hijo);
    }
    return encontrados;
  }

  /**
   * Para el panel "cómo lo encontró": cada letra del prefijo con
   * si existe en el Trie y cuántos hijos tiene ese nodo.
   */
  camino(prefix) {
    const pasos = [];
    let actual = this.root;
    for (const letra of normalizar(prefix)) {
      actual = actual?.children.get(letra) ?? null;
      pasos.push({ letra, existe: actual !== null, hijos: actual ? actual.children.size : 0 });
    }
    return pasos;
  }

  /** Quita un producto: desmarca el final y poda los nodos que quedaron sin uso. */
  remove(name) {
    const palabra = normalizar(name);
    const pila = [this.root];
    for (const letra of palabra) {
      const sig = pila.at(-1).children.get(letra);
      if (!sig) return false;
      pila.push(sig);
    }
    const final = pila.at(-1);
    if (!final.isEndOfWord) return false;
    final.isEndOfWord = false;
    final.producto = null;
    this.total--;

    for (let i = palabra.length - 1; i >= 0; i--) {
      const nodo = pila[i + 1];
      if (nodo.isEndOfWord || nodo.children.size) break;
      pila[i].children.delete(palabra[i]);
    }
    return true;
  }

  /** Cuántos nodos tiene el Trie (sin contar la raíz). */
  contarNodos() {
    let cuenta = 0;
    const pila = [...this.root.children.values()];
    while (pila.length) {
      const nodo = pila.pop();
      cuenta++;
      pila.push(...nodo.children.values());
    }
    return cuenta;
  }
}
