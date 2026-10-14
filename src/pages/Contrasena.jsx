import { useState } from "react";

export default function Contrasena() {
  const [nueva, setNueva] = useState("");
  const [repetida, setRepetida] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nueva.length < 8) setMensaje("La contraseña debe tener al menos 8 caracteres.");
    else if (nueva !== repetida) setMensaje("Las contraseñas no coinciden.");
    else {
      setMensaje("Contraseña actualizada.");
      setNueva("");
      setRepetida("");
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="nueva">Contraseña nueva</label>
      <input id="nueva" type="password" value={nueva} onChange={(e) => setNueva(e.target.value)} />
      <label htmlFor="repetida">Repite la contraseña</label>
      <input id="repetida" type="password" value={repetida} onChange={(e) => setRepetida(e.target.value)} />
      <button type="submit">Cambiar contraseña</button>
      {mensaje && (
        <p className={mensaje === "Contraseña actualizada." ? "note note--ok" : "note note--error"} role="status">
          {mensaje}
        </p>
      )}
    </form>
  );
}
