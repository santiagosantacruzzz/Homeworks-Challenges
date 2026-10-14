import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";
import AppLayout from "./layouts/AppLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";
import NewTask from "./pages/NewTask";
import EditTask from "./pages/EditTask";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas: si ya hay sesión, redirigen a /tareas */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Rutas privadas: solo con sesión iniciada */}
        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/tareas" replace />} />
            <Route path="/tareas" element={<Tasks />} />
            <Route path="/tareas/nueva" element={<NewTask />} />
            <Route path="/tareas/:id" element={<EditTask />} />
            <Route path="/*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
