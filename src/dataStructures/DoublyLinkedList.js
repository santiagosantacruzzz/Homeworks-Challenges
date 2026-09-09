import { DoubleNode } from "./Node";

export class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
    this.current = null;
  }

  append(value) {
    const node = new DoubleNode(value);

    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      node.previous = this.tail;
      this.tail.next = node;
      this.tail = node;
    }

    this.current = this.tail;
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

  back() {
    if (this.current && this.current.previous) {
      this.current = this.current.previous;
    }
    return this.current ? this.current.value : null;
  }

  forward() {
    if (this.current && this.current.next) {
      this.current = this.current.next;
    }
    return this.current ? this.current.value : null;
  }

  canGoBack() {
    return Boolean(this.current && this.current.previous);
  }

  canGoForward() {
    return Boolean(this.current && this.current.next);
  }
}
