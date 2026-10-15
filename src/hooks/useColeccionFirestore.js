import { useCallback, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

/**
 * CRUD genérico de una colección de Firestore con escucha en tiempo real.
 * Mientras `activo` sea true, `documentos` se actualiza solo con onSnapshot.
 */
export default function useColeccionFirestore(nombre, activo) {
  const [documentos, setDocumentos] = useState([]);
  const [cargando, setCargando] = useState(activo);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!activo) return undefined;

    const dejarDeEscuchar = onSnapshot(
      collection(db, nombre),
      (snap) => {
        setDocumentos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setCargando(false);
      },
      (e) => {
        setError(e.message);
        setCargando(false);
      }
    );
    return dejarDeEscuchar;
  }, [nombre, activo]);

  const proteger = useCallback(async (operacion) => {
    setError(null);
    try {
      return await operacion();
    } catch (e) {
      setError(e.message);
      return null;
    }
  }, []);

  const crear = useCallback(
    (datos) =>
      proteger(async () => {
        const ref = await addDoc(collection(db, nombre), { ...datos, creadoEn: serverTimestamp() });
        return ref.id;
      }),
    [nombre, proteger]
  );

  const actualizar = useCallback(
    (id, cambios) =>
      proteger(async () => {
        await updateDoc(doc(db, nombre, id), { ...cambios, editadoEn: serverTimestamp() });
        return true;
      }),
    [nombre, proteger]
  );

  // Borra varios documentos en una sola operación atómica
  const eliminarVarios = useCallback(
    (ids) =>
      proteger(async () => {
        const lote = writeBatch(db);
        ids.forEach((id) => lote.delete(doc(db, nombre, id)));
        await lote.commit();
        return true;
      }),
    [nombre, proteger]
  );

  return { documentos: activo ? documentos : [], cargando, error, crear, actualizar, eliminarVarios };
}
