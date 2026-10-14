// Nodo de un árbol N-ario: un valor y una lista de hijos (puede tener cuantos quiera).
export class Nodo {
  constructor(valor) {
    this.valor = valor;
    this.hijos = [];
  }

  agregarHijo(nodo) {
    this.hijos.push(nodo);
    return nodo; // se retorna para poder seguir agregándole hijos
  }

  esHoja() {
    return this.hijos.length === 0;
  }
}
