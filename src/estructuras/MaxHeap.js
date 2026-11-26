/**
 * Max Heap representado con un arreglo (Clase 12).
 *
 * Es un árbol binario completo guardado por niveles:
 *   hijo izquierdo  = 2i + 1
 *   hijo derecho    = 2i + 2
 *   padre           = floor((i - 1) / 2)
 *
 * Propiedad del Max Heap: cada padre es MAYOR O IGUAL que sus hijos,
 * por eso el elemento más grande siempre está en heap[0].
 *
 * `comparar(a, b)` devuelve un número > 0 cuando `a` debe quedar por
 * encima de `b`. Por defecto compara números. Para las canciones se
 * compara por reproducciones (ver `porReproducciones`).
 */
export default class MaxHeap {
  constructor(initial = [], comparar = (a, b) => a - b) {
    this.comparar = comparar;
    this.heap = [];

    if (initial.length > 0) {
      this.heap = [...initial];
      this.heapify();
    }
  }

  // true si el elemento en i debe ir por encima del elemento en j
  mayor(i, j) {
    return this.comparar(this.heap[i], this.heap[j]) > 0;
  }

  // Inserta al final y lo sube hasta su lugar. O(log n)
  push(value) {
    this.heap.push(value);
    this.percolateUp();
  }

  // Saca el máximo: lo cambia con el último, lo quita y baja la nueva raíz. O(log n)
  pop() {
    if (this.heap.length === 0) return undefined;

    const n = this.heap.length;
    this.swap(0, n - 1);

    const max = this.heap.pop();
    this.percolateDown(0);

    return max;
  }

  // Mira el máximo sin sacarlo. O(1)
  peek() {
    return this.heap[0];
  }

  // Convierte un arreglo desordenado en heap, desde el último padre hacia la raíz. O(n)
  heapify() {
    const start = Math.floor((this.heap.length - 2) / 2);

    for (let i = start; i >= 0; i--) {
      this.percolateDown(i);
    }
  }

  // Baja el elemento mientras algún hijo sea mayor que él
  percolateDown(index) {
    let curr = index;

    while (2 * curr + 1 < this.heap.length) {
      const left = 2 * curr + 1;
      const right = 2 * curr + 2;

      const maxChild =
        right < this.heap.length && this.mayor(right, left) ? right : left;

      if (this.mayor(maxChild, curr)) {
        this.swap(curr, maxChild);
        curr = maxChild;
      } else {
        break;
      }
    }
  }

  // Sube el elemento mientras sea mayor que su padre.
  // Recibe el índice para poder reutilizarlo al aumentar una prioridad.
  percolateUp(index = this.heap.length - 1) {
    let curr = index;

    while (curr > 0) {
      const parent = Math.floor((curr - 1) / 2);

      if (this.mayor(curr, parent)) {
        this.swap(curr, parent);
        curr = parent;
      } else {
        break;
      }
    }
  }

  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  toArray() {
    return [...this.heap];
  }

  /**
   * TOP K sin dañar el heap original: se copia y se hace pop K veces.
   * O(n + k log n)
   */
  topK(k) {
    const copia = new MaxHeap([], this.comparar);
    copia.heap = [...this.heap]; // ya es un heap válido, no hace falta heapify
    const top = [];
    while (top.length < k && copia.size() > 0) {
      top.push(copia.pop());
    }
    return top;
  }

  /**
   * Reemplaza un elemento por una versión nueva y lo reacomoda.
   * Se usa cuando una canción suma reproducciones: si subió, percolateUp;
   * si bajó, percolateDown. Devuelve false si no lo encuentra.
   */
  actualizar(esElemento, nuevo) {
    const i = this.heap.findIndex(esElemento);
    if (i === -1) return false;

    this.heap[i] = nuevo;
    const parent = Math.floor((i - 1) / 2);
    if (i > 0 && this.mayor(i, parent)) {
      this.percolateUp(i);
    } else {
      this.percolateDown(i);
    }
    return true;
  }

  // Saca un elemento cualquiera: se cambia por el último y se reacomoda
  eliminar(esElemento) {
    const i = this.heap.findIndex(esElemento);
    if (i === -1) return undefined;

    const ultimo = this.heap.length - 1;
    this.swap(i, ultimo);
    const sacado = this.heap.pop();
    if (i < this.heap.length) {
      this.percolateDown(i);
      this.percolateUp(i);
    }
    return sacado;
  }
}

/**
 * Criterio del ranking: más reproducciones va arriba.
 * Si empatan, va primero el título que va antes en orden alfabético,
 * para que el TOP no cambie de orden entre una carga y otra.
 */
export function porReproducciones(a, b) {
  if (a.reproducciones !== b.reproducciones) {
    return a.reproducciones - b.reproducciones;
  }
  return b.titulo.localeCompare(a.titulo, "es");
}
