export class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

export class DoubleNode {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.previous = null;
  }
}
