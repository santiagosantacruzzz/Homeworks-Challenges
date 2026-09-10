class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.previous = null;
  }
}

class CircularDoublyLinkedList {
  constructor() {
    this.head = null;
    this.current = null;
    this.length = 0;
  }

  append(value) {
    const node = new Node(value);
    if (!this.head) {
      node.next = node;
      node.previous = node;
      this.head = node;
      this.current = node;
    } else {
      const ultimo = this.head.previous;
      ultimo.next = node;
      node.previous = ultimo;
      node.next = this.head;
      this.head.previous = node;
    }
    this.length++;
    return node;
  }

  peek() {
    return this.current ? this.current.value : null;
  }

  size() {
    return this.length;
  }

  remove(predicado) {
    if (!this.head) return null;
    let current = this.head;
    let recorridos = 0;

    do {
      if (predicado(current.value)) {
        if (this.length === 1) {
          this.head = null;
          this.current = null;
        } else {
          current.previous.next = current.next;
          current.next.previous = current.previous;
          if (this.head === current) this.head = current.next;
          if (this.current === current) this.current = current.next;
        }
        this.length--;
        return current.value;
      }
      current = current.next;
      recorridos++;
    } while (current !== this.head && recorridos <= this.length);

    return null;
  }

  print() {
    const resultado = [];
    if (!this.head) return resultado;
    let current = this.head;
    do {
      resultado.push(current.value);
      current = current.next;
    } while (current !== this.head);
    return resultado;
  }

  rotateForward() {
    if (!this.current) return null;
    this.current = this.current.next;
    return this.current.value;
  }

  rotateBackward() {
    if (!this.current) return null;
    this.current = this.current.previous;
    return this.current.value;
  }
}

class ComiteAdministrativo extends CircularDoublyLinkedList {
  agregarMiembro(miembro) {
    this.append(miembro);
    return miembro;
  }

  eliminarMiembro(id) {
    return this.remove((m) => m.id === id);
  }

  presidente() {
    return this.peek();
  }

  rotarAdelante() {
    return this.rotateForward();
  }

  rotarAtras() {
    return this.rotateBackward();
  }

  listar() {
    return this.print();
  }

  totalMiembros() {
    return this.size();
  }
}

module.exports = ComiteAdministrativo;
