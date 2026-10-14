const MENSAJES = [
  { de: "Andrés", asunto: "¿Repasamos árboles mañana?", hora: "9:40" },
  { de: "Soporte", asunto: "Tu ticket #1042 fue resuelto", hora: "Ayer" },
  { de: "Valentina", asunto: "Te compartí las diapositivas", hora: "Lun" },
];

export default function Mensajes() {
  return (
    <ul className="rows">
      {MENSAJES.map((m) => (
        <li key={m.asunto}>
          <strong>{m.de}</strong>
          <span>{m.asunto}</span>
          <time>{m.hora}</time>
        </li>
      ))}
    </ul>
  );
}
