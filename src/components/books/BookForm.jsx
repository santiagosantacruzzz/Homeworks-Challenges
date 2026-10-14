import { useRef, useState } from "react";
import { Book, isValidIsbn13Format } from "../../models/Book";

const FIELDS = [
  {
    id: "name",
    label: "Book Name",
    placeholder: "Enter book title...",
    required: "Book name is required.",
  },
  {
    id: "isbn",
    label: "ISBN-13",
    placeholder: "e.g., 978-X-XXXXX-XXXX-X",
    required: "ISBN is required.",
  },
  {
    id: "author",
    label: "Author",
    placeholder: "Author's full name...",
    required: "Author is required.",
  },
  {
    id: "editorial",
    label: "Editorial",
    placeholder: "Publisher name...",
    required: "Editorial is required.",
  },
];

const EMPTY_FORM = { name: "", isbn: "", author: "", editorial: "" };

export default function BookForm({ onAddBook, isbnExists }) {
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const firstInputRef = useRef(null);

  const validate = () => {
    const newErrors = {};

    FIELDS.forEach(({ id, required }) => {
      if (!values[id].trim()) newErrors[id] = required;
    });

    if (!newErrors.isbn) {
      if (!isValidIsbn13Format(values.isbn)) {
        newErrors.isbn = "ISBN-13 must have 13 digits (dashes are allowed).";
      } else if (isbnExists(values.isbn)) {
        newErrors.isbn = "A book with this ISBN is already in the stack.";
      }
    }

    return newErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const book = new Book(
      values.name.trim(),
      values.isbn.trim(),
      values.author.trim(),
      values.editorial.trim()
    );

    onAddBook(book);
    setValues(EMPTY_FORM);
    setErrors({});
    firstInputRef.current?.focus();
  };

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      <h2 className="section-title">Add New Book</h2>

      {FIELDS.map(({ id, label, placeholder }, index) => (
        <div className="field" key={id}>
          <label className="field__label" htmlFor={id}>
            {label}
          </label>
          <input
            ref={index === 0 ? firstInputRef : undefined}
            id={id}
            name={id}
            className={`field__input${errors[id] ? " field__input--error" : ""}`}
            placeholder={placeholder}
            value={values[id]}
            onChange={handleChange}
            aria-invalid={Boolean(errors[id])}
            aria-describedby={errors[id] ? `${id}-error` : undefined}
            autoComplete="off"
          />
          {errors[id] && (
            <span className="field__error" id={`${id}-error`}>
              {errors[id]}
            </span>
          )}
        </div>
      ))}

      <button type="submit" className="btn btn--primary">
        Add to Stack
      </button>
    </form>
  );
}
