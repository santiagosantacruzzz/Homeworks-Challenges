import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { PRIORITIES } from "../utils/priorities";

const EMPTY = { title: "", notes: "", priority: "media", done: false };

// Formulario de tarea, compartido por "Nueva tarea" y "Editar tarea".
export default function TaskForm({ initialValues, submitLabel, onSubmit, showDone = false, children }) {
  const [values, setValues] = useState({ ...EMPTY, ...initialValues });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (field) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setValues((prev) => ({ ...prev, [field]: value }));
    if (field === "title") setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const title = values.title.trim();

    if (!title) {
      setError("Escribe qué tienes que hacer.");
      return;
    }

    setSaving(true);
    const ok = await onSubmit({ ...values, title, notes: values.notes.trim() });
    if (!ok) setSaving(false);
  };

  return (
    <Form onSubmit={handleSubmit} noValidate className="task-form">
      <Form.Group className="mb-4" controlId="title">
        <Form.Label>Tarea</Form.Label>
        <Form.Control
          size="lg"
          placeholder="Ej: Estudiar colas para el parcial"
          value={values.title}
          onChange={set("title")}
          isInvalid={Boolean(error)}
          maxLength={120}
          autoFocus={!initialValues}
        />
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-4" controlId="notes">
        <Form.Label>
          Notas <span className="text-body-secondary fw-normal">(opcional)</span>
        </Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Detalles, links, fecha de entrega…"
          value={values.notes}
          onChange={set("notes")}
          maxLength={500}
        />
      </Form.Group>

      <fieldset className="mb-4">
        <legend className="form-label">Prioridad</legend>
        <div className="priority-picker">
          {PRIORITIES.map((priority) => (
            <label key={priority.value} className={`priority-option priority-option--${priority.value}`}>
              <input
                type="radio"
                name="priority"
                value={priority.value}
                checked={values.priority === priority.value}
                onChange={set("priority")}
              />
              <span>{priority.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {showDone && (
        <Form.Check
          type="switch"
          id="done"
          className="mb-4"
          label="Ya está hecha"
          checked={values.done}
          onChange={set("done")}
        />
      )}

      <div className="d-flex flex-wrap gap-2 align-items-center">
        <Button type="submit" size="lg" disabled={saving}>
          {saving ? "Guardando…" : submitLabel}
        </Button>
        {children}
      </div>
    </Form>
  );
}
