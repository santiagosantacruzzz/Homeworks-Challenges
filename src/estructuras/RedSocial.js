import Grafo from "./Grafo";
import Ciudad from "../modelos/Ciudad";
import Persona from "../modelos/Persona";

const normalizar = (texto) =>
  texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase();

/**
 * Grafo de amigos y ciudades. Usa el Grafo de la clase y agrega las reglas del challenge:
 *  - Cada persona vive en UNA sola ciudad (arista persona — ciudad).
 *  - Las amistades son aristas persona — persona.
 *  - Dos ciudades nunca se conectan entre sí.
 */
export default class RedSocial {
  constructor() {
    this.grafo = new Grafo();
    this.siguiente = { persona: 1, ciudad: 1 };
  }

  // ─── Ciudades ───────────────────────────────────────────
  agregarCiudad(nombre) {
    const limpio = nombre.trim();
    if (!limpio) throw new Error("La ciudad necesita un nombre.");
    if (this.ciudades().some((c) => normalizar(c.nombre) === normalizar(limpio))) {
      throw new Error(`${limpio} ya está en el atlas.`);
    }
    const ciudad = new Ciudad(`c${this.siguiente.ciudad++}`, limpio);
    this.grafo.addNode(ciudad);
    return ciudad;
  }

  ciudades() {
    return this.grafo.nodes.filter((n) => n.tipo === "ciudad");
  }

  /** Lo que pide el challenge: personas que viven en una ciudad. */
  personasDe(idCiudad) {
    return this.grafo
      .printAdjacency(idCiudad)
      .filter((n) => n.tipo === "persona")
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  // ─── Personas ───────────────────────────────────────────
  agregarPersona(nombre, edad, idCiudad) {
    const limpio = nombre.trim();
    const anios = Number(edad);
    if (!limpio) throw new Error("La persona necesita un nombre.");
    if (!Number.isInteger(anios) || anios < 0 || anios > 120) throw new Error("La edad debe ser un número entre 0 y 120.");
    const ciudad = this.grafo.searchNode(idCiudad);
    if (ciudad?.tipo !== "ciudad") throw new Error("Escoge la ciudad donde vive.");

    const persona = new Persona(`p${this.siguiente.persona++}`, limpio, anios);
    this.grafo.addNode(persona);
    this.grafo.addEdge(persona.id, ciudad.id);
    return persona;
  }

  personas() {
    return this.grafo.nodes.filter((n) => n.tipo === "persona");
  }

  ciudadDe(idPersona) {
    return this.grafo.printAdjacency(idPersona).find((n) => n.tipo === "ciudad");
  }

  amigosDe(idPersona) {
    return this.grafo.printAdjacency(idPersona).filter((n) => n.tipo === "persona");
  }

  /** Cambia la ciudad: se quita la arista vieja para que siga siendo una sola. */
  mudar(idPersona, idCiudadNueva) {
    const actual = this.ciudadDe(idPersona);
    if (actual?.id === idCiudadNueva) return;
    if (this.grafo.searchNode(idCiudadNueva)?.tipo !== "ciudad") throw new Error("Esa ciudad no existe.");
    if (actual) this.grafo.removeEdge(idPersona, actual.id);
    this.grafo.addEdge(idPersona, idCiudadNueva);
  }

  // ─── Amistades ──────────────────────────────────────────
  hacerAmigos(id1, id2) {
    const a = this.grafo.searchNode(id1);
    const b = this.grafo.searchNode(id2);
    if (a?.tipo !== "persona" || b?.tipo !== "persona") throw new Error("Una amistad une a dos personas.");
    if (id1 === id2) throw new Error("Escoge dos personas distintas.");
    if (!this.grafo.addEdge(id1, id2)) throw new Error(`${a.nombre} y ${b.nombre} ya son amigos.`);
  }

  terminarAmistad(id1, id2) {
    this.grafo.removeEdge(id1, id2);
  }

  // ─── Borrar ─────────────────────────────────────────────
  /** Una ciudad con habitantes no se borra: dejaría personas sin ciudad. */
  eliminar(id) {
    const nodo = this.grafo.searchNode(id);
    if (!nodo) return;
    if (nodo.tipo === "ciudad" && this.personasDe(id).length) {
      throw new Error(`Primero muda a los habitantes de ${nodo.nombre}.`);
    }
    this.grafo.removeNode(id);
  }

  // ─── Guardar / cargar (localStorage) ────────────────────
  aJSON() {
    return { nodos: this.grafo.nodes, aristas: this.grafo.edges(), siguiente: this.siguiente };
  }

  static desdeJSON({ nodos, aristas, siguiente }) {
    const red = new RedSocial();
    for (const n of nodos) {
      red.grafo.addNode(n.tipo === "ciudad" ? new Ciudad(n.id, n.nombre) : new Persona(n.id, n.nombre, n.edad));
    }
    for (const [a, b] of aristas) red.grafo.addEdge(a, b);
    red.siguiente = { ...siguiente };
    return red;
  }
}
