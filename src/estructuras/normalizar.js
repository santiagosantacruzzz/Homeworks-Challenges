/**
 * Lleva un texto a la forma en que se guarda en el Trie:
 * minúsculas, sin tildes y con un solo espacio entre palabras.
 * Así "Canción", "cancion" y "  CANCIÓN " recorren el mismo camino.
 * La ñ se conserva porque es una letra distinta del alfabeto español.
 */
const TILDES = /[̀-ͯ]/g;

export function normalizar(texto = "") {
  return texto
    .normalize("NFC")
    .toLocaleLowerCase("es")
    .split("ñ")
    .map((parte) => parte.normalize("NFD").replace(TILDES, ""))
    .join("ñ")
    .replace(/\s+/g, " ")
    .trim();
}
