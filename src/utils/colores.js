/** Tintas de risografía: cada ciudad toma una en el orden en que se creó. */
const TINTAS = ["#e4473a", "#1b8a8f", "#e8a317", "#6b4fbb", "#2f7d32", "#d9488f", "#3a66c4", "#9a5b2f"];

export function colorCiudad(ciudades, idCiudad) {
  const i = ciudades.findIndex((c) => c.id === idCiudad);
  return i === -1 ? "#8c8577" : TINTAS[i % TINTAS.length];
}
