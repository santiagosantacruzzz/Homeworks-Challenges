import { useState } from "react";

export default function Cuenta() {
  const [idioma, setIdioma] = useState("es");
  const [guardado, setGuardado] = useState(false);

  return (
    <form
      className="form"
      onSubmit={(e) => {
        e.preventDefault();
        setGuardado(true);
      }}
    >
      <label htmlFor="idioma">Idioma</label>
      <select
        id="idioma"
        value={idioma}
        onChange={(e) => {
          setIdioma(e.target.value);
          setGuardado(false);
        }}
      >
        <option value="es">Español</option>
        <option value="en">Inglés</option>
      </select>
      <label htmlFor="zona">Zona horaria</label>
      <select id="zona" defaultValue="bogota">
        <option value="bogota">Bogotá (UTC−5)</option>
        <option value="mexico">Ciudad de México (UTC−6)</option>
      </select>
      <button type="submit">Guardar cambios</button>
      {guardado && <p className="note note--ok" role="status">Cambios guardados.</p>}
    </form>
  );
}
