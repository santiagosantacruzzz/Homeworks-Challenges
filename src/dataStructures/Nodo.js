// Nodo de un árbol binario: un valor y dos referencias (hijo izquierdo y derecho).
export class Nodo {
  constructor(valor) {
    this.valor = valor;
    this.izquierda = null;
    this.derecha = null;
  }

  // Un nodo es hoja cuando no tiene hijos.
  isLeaf() {
    return this.izquierda === null && this.derecha === null;
  }
}
