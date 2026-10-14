import { useState } from "react";
import { StructuresContext } from "./StructuresContext";
import { Stack } from "../dataStructures/Stack";
import { AtmQueue } from "../dataStructures/AtmQueue";
import { mockBooks } from "../data/mockBooks";
import { mockPeople } from "../data/mockPeople";

// Pila de libros del Challenge 04, llena con los datos de prueba.
function createBookStack() {
  const stack = new Stack();
  mockBooks.forEach((book) => stack.push(book));
  return stack;
}

// Cola del cajero del Challenge 05, llena con los datos de prueba.
function createAtmQueue() {
  const queue = new AtmQueue();
  mockPeople.forEach((person) => queue.enqueue(person));
  return queue;
}

// Las estructuras viven aquí y no dentro de cada página: así, al pasar de una
// página privada a la otra, la pila y la cola conservan lo que se les agregó.
export function StructuresProvider({ children }) {
  const [bookStack] = useState(createBookStack);
  const [atmQueue] = useState(createAtmQueue);

  return (
    <StructuresContext.Provider value={{ bookStack, atmQueue }}>
      {children}
    </StructuresContext.Provider>
  );
}
