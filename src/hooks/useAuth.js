import { useState } from "react";

// Usuario de prueba del challenge.
const DEMO_USER = {
  email: "user@mail.com",
  password: "123",
  name: "user",
};

const STORAGE_KEY = "user";

// Lee la sesión guardada. Se hace dentro del useState (y no en un useEffect como
// en el ejemplo de clase) para que, al recargar la página estando en una ruta
// privada, el usuario ya exista en el primer render y PrivateRoute no lo mande al login.
function readStoredUser() {
  try {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}

// Custom hook con toda la lógica de la sesión: el componente solo la usa.
export function useAuth() {
  const [user, setUser] = useState(readStoredUser);
  // true cuando el usuario cerró sesión con el botón (para avisarle en el login).
  const [loggedOut, setLoggedOut] = useState(false);

  // Valida las credenciales contra el usuario de prueba.
  // Retorna true si el login fue correcto.
  const login = (email, password) => {
    const isValid =
      email.trim().toLowerCase() === DEMO_USER.email && password === DEMO_USER.password;

    if (!isValid) return false;

    const userData = { name: DEMO_USER.name, email: DEMO_USER.email };
    setUser(userData);
    setLoggedOut(false);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } catch {
      // Si el navegador bloquea localStorage, la sesión dura mientras la pestaña esté abierta.
    }
    return true;
  };

  const logout = () => {
    setUser(null);
    setLoggedOut(true);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nada que limpiar.
    }
  };

  return { user, loggedOut, login, logout };
}
