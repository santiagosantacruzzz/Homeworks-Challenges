import { useState } from "react";
import { Stack } from "../dataStructures/Stack";
import { normalizeIsbn } from "../models/Book";
import { mockBooks } from "../data/mockData";
import BookForm from "../components/BookForm";
import BookStack from "../components/BookStack";

// Crea la pila y la llena con los datos de prueba (punto 2 del challenge).
function createBookStack() {
  const stack = new Stack();
  mockBooks.forEach((book) => stack.push(book));
  return stack;
}

export default function BookStackPage() {
  // La instancia de Stack se crea una sola vez y se conserva entre renders.
  const [stack] = useState(createBookStack);
  // Copia de stack.print() que React usa para volver a pintar la pantalla
  // cada vez que la pila cambia.
  const [books, setBooks] = useState(() => stack.print());
  const [lastAction, setLastAction] = useState(null);

  const handleAddBook = (book) => {
    stack.push(book);
    setBooks(stack.print());
    setLastAction({ type: "push", book });
  };

  const handlePop = () => {
    const removed = stack.pop();
    if (!removed) return;
    setBooks(stack.print());
    setLastAction({ type: "pop", book: removed });
  };

  const isbnExists = (isbn) =>
    books.some((book) => normalizeIsbn(book.isbn) === normalizeIsbn(isbn));

  const size = stack.size();

  return (
    <div className="workspace">
      <aside className="panel panel--form">
        <BookForm onAddBook={handleAddBook} isbnExists={isbnExists} />
      </aside>

      <section className="panel panel--stack">
        <div className="stack-column">
          <h2 className="section-title">Current Book Stack List</h2>

          <div className="stack-toolbar">
            <span className="stack-toolbar__count">
              {size} {size === 1 ? "book" : "books"}
              {size > 1 && " · top first"}
            </span>
            <button
              type="button"
              className="btn btn--outline"
              onClick={handlePop}
              disabled={stack.isEmpty()}
            >
              Pop Top Book
            </button>
          </div>

          <p className="action-log" aria-live="polite">
            {lastAction?.type === "push" &&
              `“${lastAction.book.name}” was pushed onto the top of the stack.`}
            {lastAction?.type === "pop" &&
              `“${lastAction.book.name}” was popped from the top of the stack.`}
          </p>

          <BookStack books={books} />
        </div>
      </section>
    </div>
  );
}
