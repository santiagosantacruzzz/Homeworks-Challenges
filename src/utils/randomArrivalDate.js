// Horario en que funciona el cajero.
const OPENING_HOUR = 6;
const CLOSING_HOUR = 22;

// Fecha de llegada aleatoria asignada por el sistema:
// hoy, a cualquier hora (con segundos) entre la apertura y el cierre.
export function randomArrivalDate() {
  const date = new Date();
  const totalSeconds = (CLOSING_HOUR - OPENING_HOUR) * 60 * 60;
  const offset = Math.floor(Math.random() * totalSeconds);

  date.setHours(OPENING_HOUR, 0, 0, 0);
  date.setSeconds(offset);
  return date;
}
