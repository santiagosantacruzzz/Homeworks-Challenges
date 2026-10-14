import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import PrivateLayout from "./layouts/PrivateLayout";
import Login from "./pages/Login";
import BookStackPage from "./pages/BookStackPage";
import AtmQueuePage from "./pages/AtmQueuePage";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />

        {/* Rutas privadas: solo con sesión iniciada */}
        <Route element={<PrivateRoute />}>
          <Route element={<PrivateLayout />}>
            <Route path="/" element={<Navigate to="/pila" replace />} />
            <Route path="/pila" element={<BookStackPage />} />
            <Route path="/cajero" element={<AtmQueuePage />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
