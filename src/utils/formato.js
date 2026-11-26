const compacto = new Intl.NumberFormat("es-CO", { notation: "compact", maximumFractionDigits: 1 });
const completo = new Intl.NumberFormat("es-CO");

export const cifra = (n) => completo.format(n);
export const cifraCorta = (n) => compacto.format(n);

export const recortar = (texto, max) => (texto.length > max ? `${texto.slice(0, max - 1)}…` : texto);

export function fechaEdicion(fecha = new Date()) {
  return fecha.toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Número de la semana del año, usado como "Edición N.º"
export function numeroEdicion(fecha = new Date()) {
  const inicio = new Date(fecha.getFullYear(), 0, 1);
  return Math.ceil(((fecha - inicio) / 86400000 + inicio.getDay() + 1) / 7);
}
