import { normalizeIsbn } from "../models/Book";

// Recibe los libros en el orden de stack.print(): del tope hacia la base.
// El primer libro (el tope) se dibuja con dos "hojas" detrás para que
// se vea como el libro de encima de la pila.
export default function BookStack({ books }) {
  if (books.length === 0) {
    return (
      <div className="stack-empty">
        <p>The stack is empty.</p>
        <span>Add a book with the form to push it onto the stack.</span>
      </div>
    );
  }

  return (
    <ol className="stack-list" aria-label="Books in the stack, from top to bottom">
      {books.map((book, index) => {
        const isTop = index === 0;
        const classes = ["book-card"];
        if (isTop) classes.push("book-card--top");
        if (isTop && books.length > 1) classes.push("book-card--stacked");

        return (
          <li key={normalizeIsbn(book.isbn)} className={classes.join(" ")}>
            <h3 className="book-card__title">{book.name}</h3>
            <p className="book-card__line">
              <strong>Author:</strong> {book.author}
            </p>
            <p className="book-card__line">
              <strong>ISBN:</strong> {book.isbn}
            </p>
            <p className="book-card__line">
              <strong>Editorial:</strong> {book.editorial}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
