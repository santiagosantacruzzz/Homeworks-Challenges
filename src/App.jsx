import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ArbolProvider from "./context/ArbolProvider";
import RutaPrivada from "./routes/RutaPrivada";
import RutaPublica from "./routes/RutaPublica";
import Explorador from "./pages/Explorador";
import Ingreso from "./pages/Ingreso";
import Registro from "./pages/Registro";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RutaPublica />}>
          <Route path="/ingresar" element={<Ingreso />} />
          <Route path="/registro" element={<Registro />} />
        </Route>

        <Route
          path="/"
          element={
            <RutaPrivada>
              <ArbolProvider>
                <Explorador />
              </ArbolProvider>
            </RutaPrivada>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
