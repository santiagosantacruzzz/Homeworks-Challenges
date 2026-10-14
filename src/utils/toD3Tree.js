// react-d3-tree no conoce "izquierda" y "derecha": espera nodos con esta forma:
//   { name: "25", children: [ {...}, {...} ] }
// Además, si un nodo tiene un solo hijo, la librería lo dibuja centrado debajo del padre
// y ya no se ve si era el izquierdo o el derecho. Por eso, cuando falta un hijo,
// se pone un "hueco" (attributes.hueco = true) que se dibuja invisible y guarda su lado.
export function toD3Tree(nodo) {
  if (!nodo) return null;

  const datum = { name: String(nodo.valor), attributes: { valor: nodo.valor } };

  if (nodo.izquierda || nodo.derecha) {
    datum.children = [
      toD3Tree(nodo.izquierda) ?? hueco("izquierda", nodo.valor),
      toD3Tree(nodo.derecha) ?? hueco("derecha", nodo.valor),
    ];
  }

  return datum;
}

function hueco(lado, padre) {
  return { name: "", attributes: { hueco: true, lado, padre } };
}
