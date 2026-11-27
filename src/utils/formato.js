/** TK-0007 a partir del id de la tarea */
export const codigoVuelo = (id) => `TK-${String(id).padStart(4, "0")}`;

/** Hora HH:MM en formato 24 h */
export const hora = (fecha) =>
  new Date(fecha).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", hour12: false });

export const fechaCorta = (fecha) =>
  new Date(fecha).toLocaleDateString("es-CO", { day: "2-digit", month: "short" }).replace(".", "").toUpperCase();

/** Iniciales para el avatar cuando no hay foto */
export const iniciales = (texto = "") =>
  texto
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("") || "?";
