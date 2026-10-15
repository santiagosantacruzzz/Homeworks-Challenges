import { useCallback, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase";

const ERRORES = {
  "auth/invalid-credential": "El correo o la contraseña no coinciden.",
  "auth/invalid-email": "Ese correo no tiene un formato válido.",
  "auth/email-already-in-use": "Ya hay una cuenta con ese correo. Inicia sesión.",
  "auth/weak-password": "Usa una contraseña de al menos 6 caracteres.",
  "auth/missing-password": "Falta la contraseña.",
  "auth/too-many-requests": "Demasiados intentos seguidos. Espera un momento.",
  "auth/network-request-failed": "No hay conexión con Firebase. Revisa tu internet.",
  "auth/operation-not-allowed": "El acceso con correo no está activado en Firebase.",
};

const mensajeDe = (error) => ERRORES[error?.code] ?? "No se pudo completar. Intenta de nuevo.";

const aUsuario = (u) => (u ? { uid: u.uid, email: u.email, nombre: u.displayName } : null);

/** Lógica de Firebase Authentication: sesión, ingreso, registro y salida. */
export default function useAutenticacion() {
  const [usuario, setUsuario] = useState(null);
  const [verificando, setVerificando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(
    () =>
      onAuthStateChanged(auth, (u) => {
        setUsuario(aUsuario(u));
        setVerificando(false);
      }),
    []
  );

  const ejecutar = async (accion) => {
    setEnviando(true);
    setError(null);
    try {
      await accion();
      return true;
    } catch (e) {
      setError(mensajeDe(e));
      return false;
    } finally {
      setEnviando(false);
    }
  };

  const ingresar = (email, clave) =>
    ejecutar(() => signInWithEmailAndPassword(auth, email.trim(), clave));

  const registrar = (nombre, email, clave) =>
    ejecutar(async () => {
      const { user } = await createUserWithEmailAndPassword(auth, email.trim(), clave);
      await updateProfile(user, { displayName: nombre.trim() });
      setUsuario({ uid: user.uid, email: user.email, nombre: nombre.trim() });
    });

  const salir = () => ejecutar(() => signOut(auth));

  const limpiarError = useCallback(() => setError(null), []);

  return { usuario, verificando, enviando, error, ingresar, registrar, salir, limpiarError };
}
