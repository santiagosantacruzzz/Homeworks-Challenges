import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TasksContext } from "../context/TasksContext";
import TaskForm from "../components/TaskForm";

export default function NewTask() {
  const { createTask } = useContext(TasksContext);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const ok = await createTask(values);
    if (ok) navigate("/tareas", { state: { flash: "Tarea creada." } });
    return ok;
  };

  return (
    <main className="app-container page page--narrow">
      <Link to="/tareas" className="back-link">
        ← Volver a mis tareas
      </Link>
      <h1 className="page-head__title">Nueva tarea</h1>

      <div className="sheet">
        <TaskForm submitLabel="Crear tarea" onSubmit={handleSubmit} />
      </div>
    </main>
  );
}
