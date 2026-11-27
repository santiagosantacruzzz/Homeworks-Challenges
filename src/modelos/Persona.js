/** Vértice persona: nombre y edad. Su ciudad es una arista persona — ciudad. */
export default class Persona {
  constructor(id, nombre, edad) {
    this.id = id;
    this.tipo = "persona";
    this.nombre = nombre;
    this.edad = edad;
  }
}
