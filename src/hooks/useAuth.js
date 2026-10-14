import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/config";

// Solo los datos que la app necesita del usuario de Firebase.
const toUser = (firebaseUser) =>
  firebaseUser
    ? {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
      }
    : null;

// Custom hook con toda la lógica de Firebase Auth.
export function useAuth() {
  const [user, setUser] = useState(null);
  // false hasta que Firebase diga si hay sesión guardada (evita mandar al login al recargar).
  const [authReady, setAuthReady] = useState(false);
  const [isPending, setIsPending] = useState(false);
  // true cuando el usuario cerró sesión con el botón (para avisarle en el login).
  const [loggedOut, setLoggedOut] = useState(false);

  // Firebase recuerda la sesión: onAuthStateChanged avisa si hay usuario al abrir la app
  // y cada vez que se inicia o se cierra sesión.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(toUser(firebaseUser));
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Iniciar sesión con correo y contraseña.
  const login = async (email, password) => {
    setIsPending(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoggedOut(false);
    } finally {
      setIsPending(false);
    }
  };

  // Crear una cuenta nueva. Firebase inicia sesión automáticamente al crearla.
  const register = async (name, email, password) => {
    setIsPending(true);
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(firebaseUser, { displayName: name });
      // onAuthStateChanged ya se disparó sin el nombre; se actualiza aquí.
      setUser(toUser(auth.currentUser));
      setLoggedOut(false);
    } finally {
      setIsPending(false);
    }
  };

  const logout = async () => {
    setLoggedOut(true);
    await signOut(auth);
  };

  return { user, authReady, isPending, loggedOut, login, register, logout };
}
