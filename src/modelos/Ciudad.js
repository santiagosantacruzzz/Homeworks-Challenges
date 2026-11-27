/** Vértice ciudad: solo tiene nombre. */
export default class Ciudad {
  constructor(id, nombre) {
    this.id = id;
    this.tipo = "ciudad";
    this.nombre = nombre;
  }
}
