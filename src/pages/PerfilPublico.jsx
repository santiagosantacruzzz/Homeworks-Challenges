import { useState } from "react";

export default function PerfilPublico() {
  const [publico, setPublico] = useState(true);

  return (
    <div className="form">
      <label className="switch">
        <input type="checkbox" checked={publico} onChange={(e) => setPublico(e.target.checked)} />
        <span>Mostrar mi perfil a otras personas</span>
      </label>
      <p className="note">
        {publico
          ? "Cualquier persona con tu usuario puede ver tu nombre y tu ciudad."
          : "Solo tú puedes ver tu perfil."}
      </p>
    </div>
  );
}
