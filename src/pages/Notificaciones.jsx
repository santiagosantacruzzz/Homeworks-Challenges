import { useState } from "react";

const OPCIONES = [
  ["mensajes", "Mensajes nuevos"],
  ["tickets", "Respuestas a mis tickets"],
  ["novedades", "Novedades del servicio"],
];

export default function Notificaciones() {
  const [activas, setActivas] = useState({ mensajes: true, tickets: true, novedades: false });

  return (
    <div className="form">
      {OPCIONES.map(([id, texto]) => (
        <label key={id} className="switch">
          <input
            type="checkbox"
            checked={activas[id]}
            onChange={(e) => setActivas((a) => ({ ...a, [id]: e.target.checked }))}
          />
          <span>{texto}</span>
        </label>
      ))}
    </div>
  );
}
