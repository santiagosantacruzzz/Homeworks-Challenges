import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import Nav from "react-bootstrap/Nav";
import ProgressBar from "react-bootstrap/ProgressBar";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import { AuthContext } from "../context/AuthContext";
import { TasksContext } from "../context/TasksContext";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import PageLoader from "../components/PageLoader";
import QuickAdd from "../components/QuickAdd";
import TaskItem from "../components/TaskItem";

// Filtros por query param (?filtro=pendientes), como se vio en clase con useSearchParams.
const FILTERS = [
  { value: "todas", label: "Todas" },
  { value: "pendientes", label: "Pendientes" },
  { value: "hechas", label: "Hechas" },
];

const EMPTY_TEXT = {
  todas: "Todavía no tienes tareas. Escribe la primera arriba.",
  pendientes: "No tienes nada pendiente.",
  hechas: "Aún no has terminado ninguna tarea.",
};

export default function Tasks() {
  const { user } = useContext(AuthContext);
  const { tasks, counts, loaded, error, createTask, toggleTask, deleteTask } =
    useContext(TasksContext);
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [toDelete, setToDelete] = useState(null);
  const [toast, setToast] = useState(location.state?.flash ?? "");

  // El mensaje que llega desde Nueva/Editar tarea se muestra una vez y se limpia del historial.
  useEffect(() => {
    if (location.state?.flash) {
      navigate(location.pathname + location.search, { replace: true, state: null });
    }
  }, [location, navigate]);

  const filter = FILTERS.some((f) => f.value === params.get("filtro"))
    ? params.get("filtro")
    : "todas";

  const visible = tasks.filter((task) => {
    if (filter === "pendientes") return !task.done;
    if (filter === "hechas") return task.done;
    return true;
  });

  const countFor = { todas: counts.total, pendientes: counts.pending, hechas: counts.done };
  const progress = counts.total ? Math.round((counts.done / counts.total) * 100) : 0;

  const handleAdd = async (data) => {
    const ok = await createTask(data);
    if (ok) setToast("Tarea agregada.");
    return ok;
  };

  const handleDelete = async (task) => {
    const ok = await deleteTask(task.id);
    setToDelete(null);
    if (ok) setToast("Tarea eliminada.");
  };

  return (
    <main className="app-container page">
      <header className="page-head">
        <p className="page-head__hello">Hola, {user.name}</p>
        <h1 className="page-head__title">Tus tareas</h1>

        {loaded && counts.total > 0 && (
          <div className="summary">
            <p className="summary__text">
              <strong>{counts.pending}</strong> {counts.pending === 1 ? "pendiente" : "pendientes"} y{" "}
              <strong>{counts.done}</strong> {counts.done === 1 ? "hecha" : "hechas"}
            </p>
            <ProgressBar
              now={progress}
              className="summary__bar"
              aria-label={`${progress} % de las tareas hechas`}
            />
          </div>
        )}
      </header>

      <QuickAdd onAdd={handleAdd} />

      {error && (
        <Alert variant="danger" className="mt-3">
          No se pudo hablar con Firestore: {error}
        </Alert>
      )}

      <Nav variant="pills" className="filters" as="nav" aria-label="Filtrar tareas">
        {FILTERS.map((f) => (
          <Nav.Item key={f.value}>
            <Nav.Link
              as="button"
              type="button"
              active={filter === f.value}
              onClick={() => setParams(f.value === "todas" ? {} : { filtro: f.value })}
            >
              {f.label} <span className="filters__count">{countFor[f.value]}</span>
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      {!loaded ? (
        <PageLoader label="Cargando tus tareas…" />
      ) : visible.length === 0 ? (
        <div className="empty">
          <p>{EMPTY_TEXT[filter]}</p>
          {filter === "todas" && <Link to="/tareas/nueva">Crear una tarea con notas</Link>}
        </div>
      ) : (
        <ul className="task-list">
          {visible.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={setToDelete} />
          ))}
        </ul>
      )}

      <ConfirmDeleteModal
        task={toDelete}
        onCancel={() => setToDelete(null)}
        onConfirm={handleDelete}
      />

      <ToastContainer position="bottom-center" className="p-3 position-fixed">
        <Toast show={Boolean(toast)} onClose={() => setToast("")} delay={2500} autohide bg="dark">
          <Toast.Body className="text-white">{toast}</Toast.Body>
        </Toast>
      </ToastContainer>
    </main>
  );
}
