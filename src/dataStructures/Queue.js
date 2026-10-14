// Cola (Queue) - FIFO: el primer elemento en entrar es el primero en salir.
// Implementación vista en clase sobre un arreglo: la posición 0 es el frente.
export class Queue {
  constructor() {
    this.items = [];
  }

  // Agrega un elemento al final de la cola.
  enqueue(item) {
    this.items.push(item);
  }

  // Saca y retorna el elemento del frente (null si la cola está vacía).
  dequeue() {
    return this.items.length > 0 ? this.items.shift() : null;
  }

  // Retorna el elemento del frente sin sacarlo (null si la cola está vacía).
  peek() {
    return this.items.length > 0 ? this.items[0] : null;
  }

  size() {
    return this.items.length;
  }

  isEmpty() {
    return this.items.length === 0;
  }

  // Retorna el contenido de la cola del frente hacia el final,
  // que es el orden en que se imprime en pantalla.
  print() {
    return this.items.slice();
  }
}
