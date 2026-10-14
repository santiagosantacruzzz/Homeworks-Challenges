import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import { TasksContext } from "./TasksContext";
import useCollection from "../hooks/useCollection";

const toMillis = (timestamp) => timestamp?.toMillis?.() ?? Number.MAX_SAFE_INTEGER;

// Maneja las tareas del usuario con sesión iniciada y las comparte entre páginas.
// La lógica de Firestore vive en el custom hook useCollection("tasks").
export function TasksProvider({ children }) {
  const { user } = useContext(AuthContext);
  const { results, isPending, error, getAll, add, update, remove } = useCollection("tasks");
  // uid del usuario cuyas tareas ya se cargaron (así "loaded" se reinicia al cambiar de cuenta).
  const [loadedUid, setLoadedUid] = useState(null);

  const uid = user?.uid;
  const loaded = Boolean(uid) && loadedUid === uid;

  // Cada usuario solo ve sus tareas: filtro uid == usuario actual.
  const reload = useCallback(() => getAll([["uid", "==", uid]]), [getAll, uid]);

  // Cargar las tareas de Firestore cada vez que inicia sesión un usuario.
  useEffect(() => {
    if (!uid) return;

    let active = true;
    reload().then(() => {
      if (active) setLoadedUid(uid);
    });
    return () => {
      active = false;
    };
  }, [uid, reload]);

  // Las más nuevas primero. Sin sesión (o mientras cargan) no se muestra ninguna,
  // así nunca aparecen las tareas de la cuenta anterior.
  const tasks = useMemo(
    () =>
      loaded ? [...results].sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt)) : [],
    [results, loaded]
  );

  const counts = useMemo(() => {
    const done = tasks.filter((task) => task.done).length;
    return { total: tasks.length, done, pending: tasks.length - done };
  }, [tasks]);

  const createTask = async ({ title, notes, priority }) => {
    const ref = await add({ title, notes, priority, done: false, uid });
    if (ref) await reload();
    return Boolean(ref);
  };

  const updateTask = async (id, data) => {
    const ok = await update(id, data);
    if (ok) await reload();
    return ok;
  };

  const toggleTask = (task) => updateTask(task.id, { done: !task.done });

  const deleteTask = async (id) => {
    const ok = await remove(id);
    if (ok) await reload();
    return ok;
  };

  const getTask = (id) => tasks.find((task) => task.id === id) ?? null;

  const value = {
    tasks,
    counts,
    loaded,
    isPending,
    error,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
    getTask,
    reload,
  };

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}
