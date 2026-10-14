const currency = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const dateFormat = new Intl.DateTimeFormat("es-CO", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const timeFormat = new Intl.DateTimeFormat("es-CO", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

export const formatMoney = (value) => currency.format(value);
export const formatDate = (date) => dateFormat.format(date);
export const formatTime = (date) => timeFormat.format(date);
export const formatThousands = (value) => Number(value).toLocaleString("es-CO");

// Código del turno impreso en el tiquete, a partir del orden de registro: C-007.
export const ticketCode = (person) => `C-${String(person.ticket).padStart(3, "0")}`;
