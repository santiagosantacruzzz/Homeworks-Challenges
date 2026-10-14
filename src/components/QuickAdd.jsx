import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { PRIORITIES } from "../utils/priorities";

// Agregar una tarea rápido desde la lista (solo título y prioridad).
export default function QuickAdd({ onAdd }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("media");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    const ok = await onAdd({ title: title.trim(), notes: "", priority });
    setSaving(false);
    if (ok) setTitle("");
  };

  return (
    <Form className="quick-add" onSubmit={handleSubmit}>
      <Form.Control
        aria-label="Nueva tarea"
        placeholder="¿Qué tienes que hacer?"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        maxLength={120}
      />
      <Form.Select
        aria-label="Prioridad"
        value={priority}
        onChange={(event) => setPriority(event.target.value)}
      >
        {PRIORITIES.map((p) => (
          <option key={p.value} value={p.value}>
            Prioridad {p.label.toLowerCase()}
          </option>
        ))}
      </Form.Select>
      <Button type="submit" disabled={saving || !title.trim()}>
        {saving ? "Agregando…" : "Agregar"}
      </Button>
    </Form>
  );
}
