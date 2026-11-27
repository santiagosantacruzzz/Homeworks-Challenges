import { useCallback, useEffect, useState } from "react";
import * as api from "../services/tareasService";

const porFecha = (a, b) => new Date(a.created_at) - new Date(b.created_at);

/** Inserta o reemplaza una tarea en la lista (sirve para la respuesta del CRUD y para Realtime). */
function ponerTarea(lista, tarea) {
  const existe = lista.some((t) => t.id === tarea.id);
  const nueva = existe ? lista.map((t) => (t.id === tarea.id ? tarea : t)) : [...lista, tarea];
  return nueva.sort(porFecha);
}

/**
 * Lista de tareas del usuario + CRUD + suscripción en vivo.
 * Los cambios hechos desde otra pestaña o dispositivo llegan por Realtime.
 */
export function useTareas(userId) {
  const [tareas, setTareas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [enVivo, setEnVivo] = useState("CONNECTING");
  const [ultimoCambio, setUltimoCambio] = useState(null);

  useEffect(() => {
    if (!userId) return;
    let activo = true;

    api
      .listarTareas()
      .then((data) => activo && setTareas(data))
      .catch((e) => activo && setError(e.message))
      .finally(() => activo && setCargando(false));

    const cancelar = api.escucharTareas(userId, {
      alCambiar: (tarea) => {
        setTareas((lista) => ponerTarea(lista, tarea));
        setUltimoCambio(tarea.id);
      },
      alBorrar: (id) => setTareas((lista) => lista.filter((t) => t.id !== id)),
      alEstado: setEnVivo,
    });

    return () => {
      activo = false;
      cancelar();
    };
  }, [userId]);

  const ejecutar = useCallback(async (accion) => {
    setError(null);
    try {
      return await accion();
    } catch (e) {
      setError(e.message);
      return null;
    }
  }, []);

  const crear = (titulo) =>
    ejecutar(async () => {
      const t = await api.crearTarea(titulo);
      setTareas((lista) => ponerTarea(lista, t));
      setUltimoCambio(t.id);
      return t;
    });

  const editar = (id, cambios) =>
    ejecutar(async () => {
      const t = await api.editarTarea(id, cambios);
      setTareas((lista) => ponerTarea(lista, t));
      return t;
    });

  const borrar = (id) =>
    ejecutar(async () => {
      await api.borrarTarea(id);
      setTareas((lista) => lista.filter((t) => t.id !== id));
      return true;
    });

  return { tareas, cargando, error, enVivo, ultimoCambio, crear, editar, borrar };
}
