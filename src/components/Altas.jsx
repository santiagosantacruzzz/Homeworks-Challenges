import { useState } from "react";

const PESTANAS = [
  ["persona", "Persona"],
  ["ciudad", "Ciudad"],
  ["amistad", "Amistad"],
];

/** Formularios para agregar nodos (personas, ciudades) y aristas (amistades). */
export default function Altas({ red, hacer, error, limpiarError, onCreado }) {
  const [pestana, setPestana] = useState("persona");

  return (
    <section className="tarjeta altas">
      <h2 className="tarjeta__titulo">Registrar</h2>
      <div className="pestanas" role="tablist">
        {PESTANAS.map(([clave, texto]) => (
          <button
            key={clave}
            role="tab"
            aria-selected={pestana === clave}
            className={pestana === clave ? "activa" : ""}
            onClick={() => {
              setPestana(clave);
              limpiarError();
            }}
          >
            {texto}
          </button>
        ))}
      </div>

      {pestana === "persona" && <FormPersona red={red} hacer={hacer} onCreado={onCreado} />}
      {pestana === "ciudad" && <FormCiudad hacer={hacer} onCreado={onCreado} />}
      {pestana === "amistad" && <FormAmistad red={red} hacer={hacer} />}

      {error && (
        <p className="sello-error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}

function FormPersona({ red, hacer, onCreado }) {
  const ciudades = red.ciudades();
  const [form, setForm] = useState({ nombre: "", edad: "", ciudad: "" });
  const ciudad = ciudades.some((c) => c.id === form.ciudad) ? form.ciudad : (ciudades[0]?.id ?? "");
  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  function enviar(e) {
    e.preventDefault();
    const persona = hacer((r) => r.agregarPersona(form.nombre, form.edad, ciudad));
    if (persona) {
      setForm({ nombre: "", edad: "", ciudad });
      onCreado(persona.id);
    }
  }

  if (!ciudades.length) return <p className="nota">Primero registra una ciudad.</p>;

  return (
    <form className="form" onSubmit={enviar}>
      <label>
        Nombre
        <input name="nombre" value={form.nombre} onChange={cambiar} maxLength={30} required />
      </label>
      <label>
        Edad
        <input name="edad" type="number" min="0" max="120" value={form.edad} onChange={cambiar} required />
      </label>
      <label>
        Vive en
        <select name="ciudad" value={ciudad} onChange={cambiar}>
          {ciudades.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </label>
      <button className="boton">Clavar alfiler</button>
    </form>
  );
}

function FormCiudad({ hacer, onCreado }) {
  const [nombre, setNombre] = useState("");

  function enviar(e) {
    e.preventDefault();
    const ciudad = hacer((r) => r.agregarCiudad(nombre));
    if (ciudad) {
      setNombre("");
      onCreado(ciudad.id);
    }
  }

  return (
    <form className="form" onSubmit={enviar}>
      <label>
        Nombre de la ciudad
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={30} required />
      </label>
      <button className="boton">Sellar ciudad</button>
    </form>
  );
}

function FormAmistad({ red, hacer }) {
  const personas = [...red.personas()].sort((a, b) => a.nombre.localeCompare(b.nombre));
  const [a, setA] = useState("");
  const [b, setB] = useState("");

  function enviar(e) {
    e.preventDefault();
    if (hacer((r) => r.hacerAmigos(a, b))) {
      setA("");
      setB("");
    }
  }

  if (personas.length < 2) return <p className="nota">Se necesitan al menos dos personas.</p>;

  const opciones = (excluir) =>
    personas
      .filter((p) => p.id !== excluir)
      .map((p) => (
        <option key={p.id} value={p.id}>
          {p.nombre} · {red.ciudadDe(p.id)?.nombre}
        </option>
      ));

  return (
    <form className="form" onSubmit={enviar}>
      <label>
        Persona
        <select value={a} onChange={(e) => setA(e.target.value)} required>
          <option value="">— escoge —</option>
          {opciones(b)}
        </select>
      </label>
      <label>
        es amiga de
        <select value={b} onChange={(e) => setB(e.target.value)} required>
          <option value="">— escoge —</option>
          {opciones(a)}
        </select>
      </label>
      <button className="boton">Trazar ruta</button>
    </form>
  );
}
