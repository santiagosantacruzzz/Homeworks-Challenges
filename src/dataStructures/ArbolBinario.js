import { Nodo } from "./Nodo";

// Imprime cada valor en la consola del navegador (F12 → Console).
const imprimirEnConsola = (valor) => console.log(valor);

// Árbol binario de búsqueda (BST): los menores van a la izquierda y los mayores a la derecha.
export class ArbolBinario {
  constructor() {
    this.raiz = null;
  }

  // Inserta un valor recorriendo el árbol desde la raíz.
  // Como dice la clase, no se permiten valores repetidos: en ese caso retorna false.
  insertar(valor) {
    const nuevoNodo = new Nodo(valor);

    if (!this.raiz) {
      this.raiz = nuevoNodo;
      return true;
    }

    let actual = this.raiz;
    while (true) {
      if (valor === actual.valor) return false; // repetido: no se inserta

      if (valor < actual.valor) {
        if (!actual.izquierda) {
          actual.izquierda = nuevoNodo;
          return true;
        }
        actual = actual.izquierda;
      } else {
        if (!actual.derecha) {
          actual.derecha = nuevoNodo;
          return true;
        }
        actual = actual.derecha;
      }
    }
  }

  // Deja el árbol sin nodos.
  vaciar() {
    this.raiz = null;
  }

  // ── Recorridos (recursivos) ──
  // Por defecto imprimen en consola, como en clase. Si se les pasa otra función
  // en "visitar", la usan en lugar de console.log (así la pantalla obtiene la misma secuencia).

  // PreOrden: Nodo → Izquierda → Derecha (N-L-R)
  preorden(nodo = this.raiz, visitar = imprimirEnConsola) {
    if (!nodo) return;
    visitar(nodo.valor);
    this.preorden(nodo.izquierda, visitar);
    this.preorden(nodo.derecha, visitar);
  }

  // InOrden: Izquierda → Nodo → Derecha (L-N-R). En un BST sale ordenado de menor a mayor.
  inorden(nodo = this.raiz, visitar = imprimirEnConsola) {
    if (!nodo) return;
    this.inorden(nodo.izquierda, visitar);
    visitar(nodo.valor);
    this.inorden(nodo.derecha, visitar);
  }

  // PostOrden: Izquierda → Derecha → Nodo (L-R-N)
  postorden(nodo = this.raiz, visitar = imprimirEnConsola) {
    if (!nodo) return;
    this.postorden(nodo.izquierda, visitar);
    this.postorden(nodo.derecha, visitar);
    visitar(nodo.valor);
  }

  // Devuelve un recorrido como arreglo (para mostrarlo en pantalla).
  recorrido(tipo) {
    const valores = [];
    this[tipo](this.raiz, (valor) => valores.push(valor));
    return valores;
  }

  // Imprime los tres recorridos en la consola, agrupados.
  imprimirRecorridos() {
    console.group("Árbol binario");
    for (const tipo of ["inorden", "postorden", "preorden"]) {
      console.groupCollapsed(`${tipo}: ${this.recorrido(tipo).join(" ")}`);
      this[tipo]();
      console.groupEnd();
    }
    console.groupEnd();
  }

  // ── Búsqueda ──

  // ¿Está el valor en el árbol? Baja por la izquierda o la derecha comparando: O(altura).
  contiene(valor) {
    let actual = this.raiz;
    while (actual) {
      if (valor === actual.valor) return true;
      actual = valor < actual.valor ? actual.izquierda : actual.derecha;
    }
    return false;
  }

  // Igual que contiene(), pero además devuelve los nodos visitados (para animar la búsqueda)
  // y, si no está, en qué nodo y de qué lado se colgaría.
  buscar(valor) {
    const camino = [];
    let actual = this.raiz;
    let padre = null;
    let lado = null;

    while (actual) {
      camino.push(actual.valor);
      if (valor === actual.valor) return { encontrado: true, camino };
      padre = actual.valor;
      lado = valor < actual.valor ? "izquierda" : "derecha";
      actual = actual[lado];
    }
    return { encontrado: false, camino, padre, lado };
  }

  // ── Datos del árbol (terminología de la clase) ──

  tamaño(nodo = this.raiz) {
    if (!nodo) return 0;
    return 1 + this.tamaño(nodo.izquierda) + this.tamaño(nodo.derecha);
  }

  // Altura: el nivel máximo (la raíz está en el nivel 0). Árbol vacío: -1.
  altura(nodo = this.raiz) {
    if (!nodo) return -1;
    return 1 + Math.max(this.altura(nodo.izquierda), this.altura(nodo.derecha));
  }

  hojas(nodo = this.raiz) {
    if (!nodo) return [];
    if (nodo.isLeaf()) return [nodo.valor];
    return [...this.hojas(nodo.izquierda), ...this.hojas(nodo.derecha)];
  }

  minimo() {
    let actual = this.raiz;
    while (actual?.izquierda) actual = actual.izquierda;
    return actual?.valor ?? null;
  }

  maximo() {
    let actual = this.raiz;
    while (actual?.derecha) actual = actual.derecha;
    return actual?.valor ?? null;
  }
}
