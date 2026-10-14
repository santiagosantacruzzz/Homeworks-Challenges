import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

// Pide confirmación antes de eliminar una tarea.
export default function ConfirmDeleteModal({ task, onCancel, onConfirm }) {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    await onConfirm(task);
    setDeleting(false);
  };

  return (
    <Modal show={Boolean(task)} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>¿Eliminar esta tarea?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        «{task?.title}» se borra de Firebase y no se puede recuperar.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={onCancel} disabled={deleting}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleConfirm} disabled={deleting}>
          {deleting ? "Eliminando…" : "Eliminar tarea"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
