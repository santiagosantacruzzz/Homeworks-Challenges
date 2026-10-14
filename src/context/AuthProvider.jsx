import { AuthContext } from "./AuthContext";
import { useAuth } from "../hooks/useAuth";

// 2. El Provider comparte el usuario y las funciones de login/logout
//    con todos los componentes que estén dentro de él.
export function AuthProvider({ children }) {
  const { user, loggedOut, login, logout } = useAuth();

  return (
    <AuthContext.Provider value={{ user, loggedOut, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
