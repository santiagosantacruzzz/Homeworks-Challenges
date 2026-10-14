import { useState } from "react";
import { Link } from "react-router-dom";
import { priorityLabel } from "../utils/priorities";
import { CheckIcon, PencilIcon, TrashIcon } from "./Icons";
import styles from "./TaskItem.module.scss";

// Una tarea de la lista. Usa un CSS Module (TaskItem.module.scss) escrito en SASS.
export default function TaskItem({ task, onToggle, onDelete }) {
  const [busy, setBusy] = useState(false);

  const handleToggle = async () => {
    setBusy(true);
    await onToggle(task);
    setBusy(false);
  };

  return (
    <li className={`${styles.item} ${task.done ? styles.done : ""}`} aria-busy={busy}>
      <button
        type="button"
        role="checkbox"
        aria-checked={task.done}
        aria-label={task.done ? `Marcar "${task.title}" como pendiente` : `Marcar "${task.title}" como hecha`}
        className={styles.check}
        onClick={handleToggle}
        disabled={busy}
      >
        <CheckIcon className={styles.checkIcon} />
      </button>

      <div className={styles.body}>
        <p className={styles.title}>
          <span className={styles.titleText}>{task.title}</span>
        </p>
        <p className={styles.meta}>
          <span className={`priority priority--${task.priority}`}>{priorityLabel(task.priority)}</span>
          {task.notes && <span className={styles.notes}>{task.notes}</span>}
        </p>
      </div>

      <div className={styles.actions}>
        <Link to={`/tareas/${task.id}`} className={styles.action} aria-label={`Editar "${task.title}"`}>
          <PencilIcon />
        </Link>
        <button
          type="button"
          className={`${styles.action} ${styles.danger}`}
          onClick={() => onDelete(task)}
          aria-label={`Eliminar "${task.title}"`}
        >
          <TrashIcon />
        </button>
      </div>
    </li>
  );
}
