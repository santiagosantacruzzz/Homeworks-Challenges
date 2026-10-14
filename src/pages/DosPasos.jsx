import { useState } from "react";

export default function DosPasos() {
  const [activa, setActiva] = useState(false);

  return (
    <div className="form">
      <p className="lead">
        Además de la contraseña, se pide un código que llega a tu celular al iniciar sesión.
      </p>
      <button type="button" onClick={() => setActiva((a) => !a)}>
        {activa ? "Desactivar verificación en dos pasos" : "Activar verificación en dos pasos"}
      </button>
      <p className="note" role="status">
        {activa ? "Verificación en dos pasos activada." : "Está desactivada."}
      </p>
    </div>
  );
}
