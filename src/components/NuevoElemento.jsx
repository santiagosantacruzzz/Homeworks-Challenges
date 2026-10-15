import { useState } from "react";
import useArbol from "../hooks/useArbol";
import { ARCHIVO, CARPETA } from "../tree/NodoArbol";
import { IconoArchivo, IconoCarpeta } from "./Icono";

export default function NuevoElemento() {
  const { seleccionado, crearElemento, seleccionar } = useArbol();
  const [tipo, setTipo] = useState(CARPETA);
  const [nombre, setNombre] = useState("");
  const [aviso, setAviso] = useState(null);
  const [guardando, setGuardando] = useState(false);

  // Un archivo es hoja: no se le pueden agregar hijos
  if (seleccionado.esArchivo) {
    return (
      <section className="bloque bloque--hoja">
        <h3>Agregar dentro</h3>
        <p>
          Los archivos son hojas del árbol: no pueden contener carpetas ni archivos. Selecciona
          una carpeta para agregar algo.
        </p>
      </section>
    );
  }

  const enviar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    const r = await crearElemento({ nombre, tipo });
    setGuardando(false);
    if (!r.ok) return setAviso(r.mensaje);
    setNombre("");
    setAviso(null);
    if (tipo === ARCHIVO) seleccionar(r.id);
  };

  return (
    <section className="bloque">
      <h3>Agregar dentro de {seleccionado.nombre}</h3>
      <form className="nuevo" onSubmit={enviar}>
        <fieldset className="nuevo__tipo">
          <legend className="sr-only">Tipo de elemento</legend>
          {[
            [CARPETA, "Carpeta", IconoCarpeta],
            [ARCHIVO, "Archivo", IconoArchivo],
          ].map(([valor, texto, Icono]) => (
            <label key={valor} className={tipo === valor ? "es-elegido" : ""}>
              <input
                type="radio"
                name="tipo"
                value={valor}
                checked={tipo === valor}
                onChange={() => setTipo(valor)}
              />
              <Icono /> {texto}
            </label>
          ))}
        </fieldset>

        <input
          className="campo"
          value={nombre}
          onChange={(e) => {
            setNombre(e.target.value);
            setAviso(null);
          }}
          placeholder={tipo === CARPETA ? "Nombre de la carpeta" : "Nombre del archivo, ej. notas.txt"}
          maxLength={60}
          aria-label="Nombre"
        />

        <button className="boton boton--principal" disabled={guardando || !nombre.trim()}>
          {tipo === CARPETA ? "Crear carpeta" : "Crear archivo"}
        </button>
        {aviso && <p className="aviso" role="alert">{aviso}</p>}
      </form>
    </section>
  );
}
