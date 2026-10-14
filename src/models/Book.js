// Cada libro de la pila tiene: Nombre, ISBN, Autor y Editorial.
export class Book {
  constructor(name, isbn, author, editorial) {
    this.name = name;
    this.isbn = isbn;
    this.author = author;
    this.editorial = editorial;
  }
}

// Quita guiones y espacios para poder comparar ISBN escritos de distinta forma.
export const normalizeIsbn = (isbn) => isbn.replace(/[-\s]/g, "");

// ISBN-13: 13 dígitos (con o sin guiones).
export const isValidIsbn13Format = (isbn) => /^\d{13}$/.test(normalizeIsbn(isbn));
