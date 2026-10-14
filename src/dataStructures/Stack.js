// Pila (Stack) - LIFO: el último elemento en entrar es el primero en salir.
// Implementación vista en clase sobre un arreglo: el final del arreglo es el tope.
export class Stack {
  constructor() {
    this.items = [];
  }

  // Agrega un nuevo elemento en el tope de la pila.
  push(value) {
    this.items.push(value);
  }

  // Saca y retorna el elemento del tope (null si la pila está vacía).
  pop() {
    return this.items.length > 0 ? this.items.pop() : null;
  }

  // Retorna el elemento del tope sin sacarlo (null si la pila está vacía).
  peek() {
    return this.items.length > 0 ? this.items[this.items.length - 1] : null;
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  // Retorna el contenido de la pila del tope hacia la base,
  // que es el orden en que se imprime en pantalla.
  print() {
    return this.items.slice().reverse();
  }
}
