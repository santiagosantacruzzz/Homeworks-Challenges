class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  append(value) {
    const node = new Node(value);
    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    this.length++;
    return node;
  }

  peek() {
    return this.head ? this.head.value : null;
  }

  size() {
    return this.length;
  }

  remove(predicado) {
    if (!this.head) return null;

    let current = this.head;
    const coincide = predicado ? predicado(current.value) : true;
    if (coincide) {
      this.head = current.next;
      if (!this.head) this.tail = null;
      this.length--;
      return current.value;
    }

    let previous = this.head;
    current = current.next;
    while (current) {
      if (predicado(current.value)) {
        previous.next = current.next;
        if (current === this.tail) this.tail = previous;
        this.length--;
        return current.value;
      }
      previous = current;
      current = current.next;
    }
    return null;
  }

  print() {
    const resultado = [];
    let current = this.head;
    while (current) {
      resultado.push(current.value);
      current = current.next;
    }
    return resultado;
  }
}

class SalaEspera extends LinkedList {
  agregarPaciente(paciente) {
    this.append(paciente);
    return paciente;
  }

  atender(id) {
    if (id) return this.remove((p) => p.id === id);
    return this.remove();
  }

  proximoPaciente() {
    return this.peek();
  }

  totalEnEspera() {
    return this.size();
  }

  listar() {
    return this.print();
  }
}

module.exports = SalaEspera;
