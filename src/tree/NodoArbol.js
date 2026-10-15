export const CARPETA = "carpeta";
export const ARCHIVO = "archivo";

/**
 * Nodo de un árbol n-ario: guarda su valor (los datos del elemento)
 * y la lista de referencias a sus hijos. Cada nodo conoce a su padre.
 */
export default class NodoArbol {
  constructor({ id, nombre, tipo, autorEmail = null, creadoEn = null }) {
    if (tipo !== CARPETA && tipo !== ARCHIVO) {
      throw new Error(`Tipo desconocido: ${tipo}`);
    }
    this.id = id;
    this.nombre = nombre;
    this.tipo = tipo;
    this.autorEmail = autorEmail;
    this.creadoEn = creadoEn;
    this.padre = null;
    this.hijos = [];
  }

  get esCarpeta() {
    return this.tipo === CARPETA;
  }

  get esArchivo() {
    return this.tipo === ARCHIVO;
  }

  get esHoja() {
    return this.hijos.length === 0;
  }

  // Profundidad = número de aristas desde la raíz
  get profundidad() {
    return this.padre ? this.padre.profundidad + 1 : 0;
  }

  hijoConNombre(nombre) {
    const clave = nombre.trim().toLocaleLowerCase("es");
    return this.hijos.find((h) => h.nombre.toLocaleLowerCase("es") === clave) ?? null;
  }

  /**
   * Solo una carpeta puede recibir hijos. Un archivo siempre es hoja.
   */
  agregarHijo(nodo) {
    if (this.esArchivo) {
      throw new Error(`"${this.nombre}" es un archivo: no puede tener hijos.`);
    }
    if (this.hijoConNombre(nodo.nombre)) {
      throw new Error(`"${this.nombre}" ya tiene un elemento llamado "${nodo.nombre}".`);
    }
    nodo.padre = this;
    this.hijos.push(nodo);
    this.hijos.sort(NodoArbol.orden);
    return nodo;
  }

  quitarHijo(nodo) {
    this.hijos = this.hijos.filter((h) => h !== nodo);
    nodo.padre = null;
  }

  // Carpetas primero, luego por nombre
  static orden(a, b) {
    if (a.tipo !== b.tipo) return a.esCarpeta ? -1 : 1;
    return a.nombre.localeCompare(b.nombre, "es", { numeric: true, sensitivity: "base" });
  }
}
