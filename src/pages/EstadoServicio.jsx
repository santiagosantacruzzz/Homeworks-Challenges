const SERVICIOS = [
  ["Inicio de sesión", "Funcionando"],
  ["Mensajes", "Funcionando"],
  ["Notificaciones", "Lentas desde las 11:20"],
];

export default function EstadoServicio() {
  return (
    <ul className="rows">
      {SERVICIOS.map(([servicio, estado]) => (
        <li key={servicio}>
          <strong>{servicio}</strong>
          <span className={estado === "Funcionando" ? "ok" : "warn"}>{estado}</span>
        </li>
      ))}
    </ul>
  );
}
