import { AuthContext } from "./AuthContext";
import { useAuth } from "../hooks/useAuth";

// Comparte con toda la app el usuario de Firebase y las funciones de la sesión.
// La lógica de Firebase vive en el custom hook useAuth.
export function AuthProvider({ children }) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
