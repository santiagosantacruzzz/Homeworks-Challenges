import { Node } from "./Node";

export class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
    this.current = null;
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

    if (!this.current) {
      this.current = this.head;
    }

    this.length++;
    return this;
  }

  print() {
    const values = [];
    let node = this.head;

    while (node) {
      values.push(node.value);
      node = node.next;
    }

    return values;
  }

  next() {
    if (!this.current) return null;
    this.current = this.current.next ?? this.head;
    return this.current.value;
  }
}
