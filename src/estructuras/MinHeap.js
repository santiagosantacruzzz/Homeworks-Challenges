/**
 * Min Heap guardado en un arreglo (Clase 12, diapositivas 10–19).
 * Para el índice i:  padre = (i - 1) / 2,  hijo izq = 2i + 1,  hijo der = 2i + 2.
 *
 * `compare(a, b)` devuelve < 0 si a debe ir ARRIBA de b (a es "menor").
 */
export default class MinHeap {
  constructor(compare = (a, b) => a - b) {
    this.heap = [];
    this.compare = compare;
  }

  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  /** peek: el mínimo sin sacarlo. */
  peek() {
    return this.heap[0];
  }

  /** push: inserta al final y lo sube con percolateUp. */
  push(valor) {
    this.heap.push(valor);
    this.percolateUp(this.heap.length - 1);
  }

  /** pop: saca el mínimo; el último pasa a la raíz y baja con percolateDown. */
  pop() {
    if (this.isEmpty()) return undefined;
    const minimo = this.heap[0];
    const ultimo = this.heap.pop();
    if (!this.isEmpty()) {
      this.heap[0] = ultimo;
      this.percolateDown(0);
    }
    return minimo;
  }

  /** heapify: convierte un arreglo desordenado en heap (de los padres hacia la raíz). */
  heapify(arreglo) {
    this.heap = [...arreglo];
    for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) this.percolateDown(i);
    return this;
  }

  /** Sube el nodo mientras sea menor que su padre. */
  percolateUp(i) {
    while (i > 0) {
      const padre = Math.floor((i - 1) / 2);
      if (this.compare(this.heap[i], this.heap[padre]) >= 0) break;
      this.swap(i, padre);
      i = padre;
    }
  }

  /** Baja el nodo mientras alguno de sus hijos sea menor que él. */
  percolateDown(i) {
    const n = this.heap.length;
    while (true) {
      const izq = 2 * i + 1;
      const der = 2 * i + 2;
      let menor = i;
      if (izq < n && this.compare(this.heap[izq], this.heap[menor]) < 0) menor = izq;
      if (der < n && this.compare(this.heap[der], this.heap[menor]) < 0) menor = der;
      if (menor === i) break;
      this.swap(i, menor);
      i = menor;
    }
  }

  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  toArray() {
    return [...this.heap];
  }
}
