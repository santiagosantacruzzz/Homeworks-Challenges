class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.previous = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
    this.cursor = null;
  }

  append(value) {
    const node = new Node(value);
    if (!this.tail) {
      this.head = node;
      this.tail = node;
    } else {
      node.previous = this.tail;
      this.tail.next = node;
      this.tail = node;
    }
    this.length++;
    this.cursor = node;
    return node;
  }

  peek() {
    return this.tail ? this.tail.value : null;
  }

  size() {
    return this.length;
  }

  remove(predicado) {
    let current = this.head;
    while (current) {
      if (predicado(current.value)) {
        if (current.previous) current.previous.next = current.next;
        else this.head = current.next;

        if (current.next) current.next.previous = current.previous;
        else this.tail = current.previous;

        if (this.cursor === current) this.cursor = current.previous || current.next;
        this.length--;
        return current.value;
      }
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

  printReverse() {
    const resultado = [];
    let current = this.tail;
    while (current) {
      resultado.push(current.value);
      current = current.previous;
    }
    return resultado;
  }

  anterior() {
    if (this.cursor && this.cursor.previous) this.cursor = this.cursor.previous;
    return this.cursor ? this.cursor.value : null;
  }

  siguiente() {
    if (this.cursor && this.cursor.next) this.cursor = this.cursor.next;
    return this.cursor ? this.cursor.value : null;
  }

  actual() {
    return this.cursor ? this.cursor.value : null;
  }
}

class HistorialAtencion extends DoublyLinkedList {
  agregarAtencion(registro) {
    this.append(registro);
    return registro;
  }

  buscarPorPaciente(idPaciente) {
    const resultado = [];
    let current = this.head;
    while (current) {
      if (current.value.paciente.id === idPaciente) resultado.push(current.value);
      current = current.next;
    }
    return resultado;
  }

  eliminarPorId(idRegistro) {
    return this.remove((r) => r.id === idRegistro);
  }

  listarAscendente() {
    return this.print();
  }

  listarDescendente() {
    return this.printReverse();
  }

  totalRegistros() {
    return this.size();
  }
}

module.exports = HistorialAtencion;
