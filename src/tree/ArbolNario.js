import NodoArbol, { CARPETA } from "./NodoArbol";

export const ID_RAIZ = "raiz";

/**
 * Árbol n-ario de carpetas y archivos, implementado sin librerías.
 */
export default class ArbolNario {
  constructor() {
    this.raiz = new NodoArbol({ id: ID_RAIZ, nombre: "Raíz", tipo: CARPETA });
  }

  /** Búsqueda en profundidad (DFS) recursiva por id. */
  buscar(id, actual = this.raiz) {
    if (actual.id === id) return actual;
    for (const hijo of actual.hijos) {
      const hallado = this.buscar(id, hijo);
      if (hallado) return hallado;
    }
    return null;
  }

  agregar(idPadre, nodo) {
    const padre = this.buscar(idPadre);
    if (!padre) throw new Error("No existe la carpeta de destino.");
    return padre.agregarHijo(nodo);
  }

  /** Quita un nodo con toda su rama y devuelve los nodos eliminados (hijos primero). */
  podar(id) {
    const nodo = this.buscar(id);
    if (!nodo || nodo === this.raiz) return [];
    const rama = this.postorden(nodo);
    nodo.padre.quitarHijo(nodo);
    return rama;
  }

  /** DFS (preorden): visita el nodo y luego cada hijo hasta el fondo. */
  dfs(desde = this.raiz) {
    const visitados = [];
    const visitar = (nodo) => {
      visitados.push(nodo);
      nodo.hijos.forEach(visitar);
    };
    visitar(desde);
    return visitados;
  }

  /** BFS: visita por niveles usando una cola. */
  bfs(desde = this.raiz) {
    const visitados = [];
    const cola = [desde];
    while (cola.length) {
      const nodo = cola.shift();
      visitados.push(nodo);
      for (const hijo of nodo.hijos) cola.push(hijo);
    }
    return visitados;
  }

  /** Postorden: hijos antes que el padre (orden seguro para borrar). */
  postorden(desde = this.raiz) {
    const visitados = [];
    const visitar = (nodo) => {
      nodo.hijos.forEach(visitar);
      visitados.push(nodo);
    };
    visitar(desde);
    return visitados;
  }

  /** Altura: la mayor profundidad que alcanza el árbol (o una rama). */
  altura(desde = this.raiz) {
    if (desde.esHoja) return 0;
    return 1 + Math.max(...desde.hijos.map((h) => this.altura(h)));
  }

  /** Nodos desde la raíz hasta el indicado. */
  camino(id) {
    const camino = [];
    for (let n = this.buscar(id); n; n = n.padre) camino.unshift(n);
    return camino;
  }

  ruta(id) {
    const partes = this.camino(id).slice(1).map((n) => n.nombre);
    return "/" + partes.join("/");
  }

  /** Cuenta lo que hay DENTRO de una rama (sin contar el nodo de inicio). */
  estadisticas(desde = this.raiz) {
    const nodos = this.dfs(desde).filter((n) => n !== desde);
    const carpetas = nodos.filter((n) => n.esCarpeta).length;
    return { carpetas, archivos: nodos.length - carpetas, total: nodos.length };
  }

  /** Autores distintos al correo dado dentro de una rama. */
  autoresAjenos(id, correo) {
    const nodo = this.buscar(id);
    return nodo ? this.dfs(nodo).filter((n) => n.autorEmail && n.autorEmail !== correo) : [];
  }

  /**
   * Reconstruye el árbol desde los documentos planos de Firestore.
   * Cada documento trae su id y el id de su padre.
   */
  static desdeDocumentos(documentos) {
    const arbol = new ArbolNario();
    const porId = new Map([[ID_RAIZ, arbol.raiz]]);

    for (const d of documentos) {
      porId.set(d.id, new NodoArbol(d));
    }

    for (const d of documentos) {
      const padre = porId.get(d.padre);
      const nodo = porId.get(d.id);
      // Se descartan datos inválidos: padre inexistente, padre archivo o nombre repetido
      if (!padre || padre.esArchivo || padre.hijoConNombre(nodo.nombre)) continue;
      padre.agregarHijo(nodo);
    }
    return arbol;
  }
}
