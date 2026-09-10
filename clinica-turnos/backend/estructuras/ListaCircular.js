class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class CircularLinkedList {
  constructor() {
    this.head = null;
    this.current = null;
    this.length = 0;
  }

  append(value) {
    const node = new Node(value);
    if (!this.head) {
      this.head = node;
      this.current = node;
      node.next = node;
    } else {
      let ultimo = this.head;
      while (ultimo.next !== this.head) ultimo = ultimo.next;
      ultimo.next = node;
      node.next = this.head;
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
          let anterior = this.head;
          while (anterior.next !== current) anterior = anterior.next;
          anterior.next = current.next;
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

  rotate() {
    if (!this.current) return null;
    this.current = this.current.next;
    return this.current.value;
  }
}

class RotacionMedicos extends CircularLinkedList {
  agregarMedico(medico) {
    this.append(medico);
    return medico;
  }

  eliminarMedico(id) {
    return this.remove((m) => m.id === id);
  }

  medicoDeGuardia() {
    return this.peek();
  }

  rotar() {
    return this.rotate();
  }

  listar() {
    return this.print();
  }

  totalMedicos() {
    return this.size();
  }
}

module.exports = RotacionMedicos;
