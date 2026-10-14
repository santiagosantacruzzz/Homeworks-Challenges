import { Book } from "../models/Book";

// Libros de prueba. Se apilan en este orden, así que el último
// de la lista es el que queda en el tope de la pila.
export const mockBooks = [
  new Book("Cien años de soledad", "9780525562443", "Gabriel García Márquez", "Vintage Español"),
  new Book("Clean Code", "9780132350884", "Robert C. Martin", "Prentice Hall"),
  new Book("Dune", "9780441172719", "Frank Herbert", "Ace"),
  new Book("Atomic Habits", "9780735211292", "James Clear", "Avery"),
  new Book("Project Hail Mary", "9780593135204", "Andy Weir", "Ballantine Books"),
  new Book("The Midnight Library", "9780525559474", "Matt Haig", "Viking"),
];
