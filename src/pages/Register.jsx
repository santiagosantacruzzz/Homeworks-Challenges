import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { AuthContext } from "../context/AuthContext";
import AuthShell from "../components/AuthShell";
import { authErrorMessage } from "../utils/authErrors";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY = { name: "", email: "", password: "", confirm: "" };

export default function Register() {
  const { register, isPending } = useContext(AuthContext);
  const location = useLocation();

  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const set = (field) => (event) => setValues((prev) => ({ ...prev, [field]: event.target.value }));

  const validate = () => {
    const newErrors = {};
    if (!values.name.trim()) newErrors.name = "Escribe tu nombre.";
    if (!values.email.trim()) newErrors.email = "Escribe tu correo.";
    else if (!EMAIL_PATTERN.test(values.email.trim())) newErrors.email = "Escribe un correo válido.";
    if (values.password.length < 6)
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
    if (values.confirm !== values.password) newErrors.confirm = "Las contraseñas no coinciden.";
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      // Firebase crea la cuenta e inicia sesión; PublicOnlyRoute redirige a las tareas.
      await register(values.name.trim(), values.email.trim(), values.password);
    } catch (error) {
      setErrors({ form: authErrorMessage(error) });
    }
  };

  const field = (id, label, type, autoComplete, placeholder) => (
    <Form.Group className="mb-3" controlId={id}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={values[id]}
        onChange={set(id)}
        isInvalid={Boolean(errors[id])}
      />
      <Form.Control.Feedback type="invalid">{errors[id]}</Form.Control.Feedback>
    </Form.Group>
  );

  return (
    <AuthShell>
      <h1 className="auth__title">Crear cuenta</h1>
      <p className="auth__lead">Regístrate con tu correo para guardar tus tareas.</p>

      {errors.form && <Alert variant="danger">{errors.form}</Alert>}

      <Form onSubmit={handleSubmit} noValidate>
        {field("name", "Nombre", "text", "name", "Cómo quieres que te saludemos")}
        {field("email", "Correo", "email", "email", "tu@correo.com")}
        {field("password", "Contraseña", "password", "new-password", "Mínimo 6 caracteres")}
        {field("confirm", "Repite la contraseña", "password", "new-password", "")}

        <Button type="submit" size="lg" className="w-100 mt-2" disabled={isPending}>
          {isPending ? "Creando cuenta…" : "Crear cuenta"}
        </Button>
      </Form>

      <p className="auth__switch">
        ¿Ya tienes cuenta? <Link to="/login" state={location.state}>Inicia sesión</Link>
      </p>
    </AuthShell>
  );
}
