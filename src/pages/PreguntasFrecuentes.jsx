const PREGUNTAS = [
  [
    "¿De dónde sale este menú?",
    "De un árbol N-ario: cada ítem es un Nodo cuyo valor es un MenuItem (title, link, component) y cuyos hijos son sus submenús.",
  ],
  [
    "¿Cómo se dibuja el panel lateral?",
    "Con un recorrido en profundidad (DFS): se pinta un nodo y, debajo, sus hijos, de forma recursiva.",
  ],
  [
    "¿Cómo sabe la app qué mostrar en cada link?",
    "Las rutas también se generan recorriendo el árbol: cada link apunta al componente de su ítem.",
  ],
];

export default function PreguntasFrecuentes() {
  return (
    <div className="faq">
      {PREGUNTAS.map(([pregunta, respuesta]) => (
        <details key={pregunta}>
          <summary>{pregunta}</summary>
          <p>{respuesta}</p>
        </details>
      ))}
    </div>
  );
}
