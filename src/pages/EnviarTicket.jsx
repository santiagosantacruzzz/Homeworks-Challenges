import { useState } from "react";

export default function EnviarTicket() {
  const [asunto, setAsunto] = useState("");
  const [enviado, setEnviado] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!asunto.trim()) return;
    setEnviado(asunto.trim());
    setAsunto("");
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label htmlFor="asunto">¿En qué te ayudamos?</label>
      <input id="asunto" value={asunto} onChange={(e) => setAsunto(e.target.value)} placeholder="No me llegan las notificaciones" />
      <label htmlFor="detalle">Detalles (opcional)</label>
      <textarea id="detalle" rows={3} />
      <button type="submit" disabled={!asunto.trim()}>Enviar ticket</button>
      {enviado && <p className="note note--ok" role="status">Ticket creado: «{enviado}». Te responderemos por mensaje.</p>}
    </form>
  );
}
