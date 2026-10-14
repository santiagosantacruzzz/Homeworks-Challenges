// Prioridades de una tarea. Los colores están en SASS ($priorities en _variables.scss).
export const PRIORITIES = [
  { value: "alta", label: "Alta" },
  { value: "media", label: "Media" },
  { value: "baja", label: "Baja" },
];

export const priorityLabel = (value) =>
  PRIORITIES.find((priority) => priority.value === value)?.label ?? "Media";
