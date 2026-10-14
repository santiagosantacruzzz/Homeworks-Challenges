import { createContext } from "react";

// Contexto de las tareas: comparte los datos entre las páginas
// (lista, nueva tarea y editar tarea). El Provider está en TasksProvider.jsx.
export const TasksContext = createContext(null);
