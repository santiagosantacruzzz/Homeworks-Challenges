import { useContext, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { TasksContext } from "../context/TasksContext";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import PageLoader from "../components/PageLoader";
import TaskForm from "../components/TaskForm";

const dateFormat = new Intl.DateTimeFormat("es-CO", { dateStyle: "long", timeStyle: "short" });
const formatDate = (timestamp) => (timestamp?.toDate ? dateFormat.format(timestamp.toDate()) : null);

// /tareas/:id — el id es el que generó Firestore para el documento.
export default function EditTask() {
  const { id } = useParams();
  const { loaded, getTask, updateTask, deleteTask } = useContext(TasksContext);
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);

  if (!loaded) return <PageLoader label="Cargando la tarea…" />;

  const task = getTask(id);

  if (!task) {
    return (
      <main className="app-container page page--narrow">
        <h1 className="page-head__title">No encontramos esa tarea</h1>
        <p className="text-body-secondary">Puede que ya la hayas eliminado.</p>
        <Link to="/tareas" className="btn btn-primary">
          Ir a mis tareas
        </Link>
      </main>
    );
  }

  const handleSubmit = async ({ title, notes, priority, done }) => {
    const ok = await updateTask(task.id, { title, notes, priority, done });
    if (ok) navigate("/tareas", { state: { flash: "Cambios guardados." } });
    return ok;
  };

  const handleDelete = async () => {
    const ok = await deleteTask(task.id);
    if (ok) navigate("/tareas", { replace: true, state: { flash: "Tarea eliminada." } });
  };

  const created = formatDate(task.createdAt);
  const updated = formatDate(task.updatedAt);

  return (
    <main className="app-container page page--narrow">
      <Link to="/tareas" className="back-link">
        ← Volver a mis tareas
      </Link>
      <h1 className="page-head__title">Editar tarea</h1>
      {created && (
        <p className="page-head__meta">
          Creada el {created}
          {updated && (
            <>
              <br />
              Último cambio: {updated}
            </>
          )}
        </p>
      )}

      <div className="sheet">
        {/* key: si cambia la tarea, el formulario arranca con sus datos */}
        <TaskForm
          key={task.id}
          initialValues={{
            title: task.title,
            notes: task.notes ?? "",
            priority: task.priority ?? "media",
            done: Boolean(task.done),
          }}
          submitLabel="Guardar cambios"
          onSubmit={handleSubmit}
          showDone
        >
          <Button variant="link" className="text-danger ms-auto" onClick={() => setConfirming(true)}>
            Eliminar tarea
          </Button>
        </TaskForm>
      </div>

      <ConfirmDeleteModal
        task={confirming ? task : null}
        onCancel={() => setConfirming(false)}
        onConfirm={handleDelete}
      />
    </main>
  );
}
