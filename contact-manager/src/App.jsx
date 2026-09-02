import { useState, useEffect } from "react";

// ==========================================================
// DATOS SIMULADOS (lo que "vendría" de un servidor)
// ==========================================================
const CONTACTOS_INICIALES = [
  { id: 1, nombre: "Santiago Santacruz", telefono: "317 528 4936" },
];

// ==========================================================
// COMPONENTE: Loader
// Solo se encarga de mostrar el estado de carga.
// ==========================================================
function Loader() {
  return (
    <div style={styles.loaderWrap}>
      <p style={styles.loaderText}>Cargando contactos...</p>
    </div>
  );
}

// ==========================================================
// COMPONENTE: ContactForm
// Formulario controlado para agregar un contacto nuevo.
// Recibe onAdd (función) como prop.
// ==========================================================
function ContactForm({ onAdd }) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (nombre.trim() === "" || telefono.trim() === "") return;

    onAdd({ nombre: nombre.trim(), telefono: telefono.trim() });

    setNombre("");
    setTelefono("");
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        style={styles.input}
      />
      <input
        type="text"
        placeholder="Teléfono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        style={styles.input}
      />
      <button type="submit" style={styles.addButton}>
        Agregar
      </button>
    </form>
  );
}

// ==========================================================
// COMPONENTE: ContactItem
// Representa una fila individual de contacto.
// Recibe el contacto y onDelete (función) como props.
// ==========================================================
function ContactItem({ contacto, onDelete }) {
  return (
    <li style={styles.item}>
      <div>
        <p style={styles.itemName}>{contacto.nombre}</p>
        <p style={styles.itemPhone}>{contacto.telefono}</p>
      </div>
      <button onClick={() => onDelete(contacto.id)} style={styles.deleteButton}>
        Eliminar
      </button>
    </li>
  );
}

// ==========================================================
// COMPONENTE: ContactList
// Recorre la lista de contactos y renderiza un ContactItem
// por cada uno.
// ==========================================================
function ContactList({ contactos, onDelete }) {
  if (contactos.length === 0) {
    return <p style={styles.empty}>No hay contactos todavía.</p>;
  }

  return (
    <ul style={styles.list}>
      {contactos.map((contacto) => (
        <ContactItem key={contacto.id} contacto={contacto} onDelete={onDelete} />
      ))}
    </ul>
  );
}

// ==========================================================
// COMPONENTE PRINCIPAL: App
// Contiene el estado global y coordina los demás componentes.
// ==========================================================
export default function App() {
  const [contactos, setContactos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simula la carga inicial de datos (ej. una llamada a una API)
  useEffect(() => {
    const timer = setTimeout(() => {
      setContactos(CONTACTOS_INICIALES);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  function handleAdd(nuevoContacto) {
    const contactoConId = {
      id: Date.now(),
      ...nuevoContacto,
    };
    setContactos((prev) => [...prev, contactoConId]);
  }

  function handleDelete(id) {
    setContactos((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Gestor de Contactos</h1>

        {loading ? (
          <Loader />
        ) : (
          <>
            <ContactForm onAdd={handleAdd} />
            <ContactList contactos={contactos} onDelete={handleDelete} />
          </>
        )}
      </div>
    </div>
  );
}

// ==========================================================
// ESTILOS (inline, simples, sin librerías externas)
// ==========================================================
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: "48px",
    background: "#ffffff",
    fontFamily: "Arial, Helvetica, sans-serif",
    color: "#000000",
  },
  card: {
    width: "360px",
    background: "#ffffff",
    border: "1px solid #000000",
    padding: "20px",
    color: "#000000",
  },
  title: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "16px",
    textAlign: "left",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "20px",
  },
  input: {
    padding: "8px",
    border: "1px solid #000000",
    background: "#ffffff",
    color: "#000000",
    fontSize: "14px",
    fontFamily: "Arial, Helvetica, sans-serif",
    outline: "none",
  },
  addButton: {
    padding: "8px",
    border: "1px solid #000000",
    background: "#000000",
    color: "#ffffff",
    fontSize: "14px",
    fontFamily: "Arial, Helvetica, sans-serif",
    cursor: "pointer",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px",
    border: "1px solid #000000",
  },
  itemName: {
    margin: 0,
    fontSize: "14px",
    fontWeight: "bold",
  },
  itemPhone: {
    margin: 0,
    fontSize: "12px",
    color: "#000000",
  },
  deleteButton: {
    padding: "4px 8px",
    border: "1px solid #000000",
    background: "#ffffff",
    color: "#000000",
    fontSize: "12px",
    fontFamily: "Arial, Helvetica, sans-serif",
    cursor: "pointer",
  },
  empty: {
    fontSize: "13px",
    color: "#000000",
    textAlign: "left",
  },
  loaderWrap: {
    padding: "16px 0",
  },
  loaderText: {
    fontSize: "14px",
    color: "#000000",
  },
};
