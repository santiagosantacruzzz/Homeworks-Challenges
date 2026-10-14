import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { AuthContext } from "../context/AuthContext";
import AuthShell from "../components/AuthShell";
import { authErrorMessage } from "../utils/authErrors";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { login, isPending, loggedOut } = useContext(AuthContext);
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const from = location.state?.from;
  const cameFromPrivatePage = from && from !== "/" && !loggedOut;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = {};
    if (!email.trim()) newErrors.email = "Escribe tu correo.";
    else if (!EMAIL_PATTERN.test(email.trim())) newErrors.email = "Escribe un correo válido.";
    if (!password) newErrors.password = "Escribe tu contraseña.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      // Si sale bien, PublicOnlyRoute redirige a las tareas.
      await login(email.trim(), password);
    } catch (error) {
      setErrors({ form: authErrorMessage(error) });
    }
  };

  return (
    <AuthShell>
      <h1 className="auth__title">Iniciar sesión</h1>
      <p className="auth__lead">Entra para ver tus tareas.</p>

      {loggedOut && !errors.form && <Alert variant="info">Cerraste sesión.</Alert>}
      {cameFromPrivatePage && !errors.form && (
        <Alert variant="info">Inicia sesión para entrar a esa página.</Alert>
      )}
      {errors.form && <Alert variant="danger">{errors.form}</Alert>}

      <Form onSubmit={handleSubmit} noValidate>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Correo</Form.Label>
          <Form.Control
            type="email"
            autoComplete="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            isInvalid={Boolean(errors.email)}
          />
          <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-4" controlId="password">
          <Form.Label>Contraseña</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              isInvalid={Boolean(errors.password)}
            />
            <Button
              variant="outline-secondary"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-pressed={showPassword}
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </Button>
            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
          </InputGroup>
        </Form.Group>

        <Button type="submit" size="lg" className="w-100" disabled={isPending}>
          {isPending ? "Entrando…" : "Iniciar sesión"}
        </Button>
      </Form>

      <p className="auth__switch">
        ¿No tienes cuenta? <Link to="/register" state={location.state}>Regístrate</Link>
      </p>
    </AuthShell>
  );
}
