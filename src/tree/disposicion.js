/**
 * Calcula dónde dibujar cada nodo del árbol (diagrama horizontal):
 *  - x según la profundidad del nodo
 *  - y: las hojas visibles se apilan en filas; un padre queda centrado
 *    entre su primer y su último hijo.
 * Es un recorrido en profundidad (DFS) en postorden sobre el árbol n-ario.
 */
export const COLUMNA = 210;
export const FILA = 58;
export const ANCHO_NODO = 168;
export const ALTO_NODO = 40;

export function disponer(arbol, abiertos) {
  const posiciones = [];
  const enlaces = [];
  let fila = 0;

  const ubicar = (nodo) => {
    const x = nodo.profundidad * COLUMNA;
    const visiblesHijos = nodo.esCarpeta && abiertos.has(nodo.id) ? nodo.hijos : [];

    let y;
    if (visiblesHijos.length === 0) {
      y = fila * FILA;
      fila += 1;
    } else {
      const ys = visiblesHijos.map((hijo) => {
        const pos = ubicar(hijo);
        enlaces.push({ desde: nodo.id, hasta: hijo.id });
        return pos.y;
      });
      y = (ys[0] + ys[ys.length - 1]) / 2;
    }

    const pos = { nodo, x, y };
    posiciones.push(pos);
    return pos;
  };

  ubicar(arbol.raiz);

  const porId = new Map(posiciones.map((p) => [p.nodo.id, p]));
  const maxX = Math.max(...posiciones.map((p) => p.x));

  return {
    posiciones,
    enlaces: enlaces.map(({ desde, hasta }) => ({ desde: porId.get(desde), hasta: porId.get(hasta) })),
    ancho: maxX + ANCHO_NODO,
    alto: Math.max(fila, 1) * FILA - (FILA - ALTO_NODO),
  };
}
