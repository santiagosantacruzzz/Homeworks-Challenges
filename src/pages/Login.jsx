import { useContext, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import TileWord from "../components/TileWord";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PAGE_NAMES = {
  "/pila": "la pila de libros",
  "/cajero": "la fila del cajero",
};

export default function Login() {
  const { user, loggedOut, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const requested = location.state?.from;
  const from = requested && requested !== "/" ? requested : null;

  // Si ya hay sesión, el login no tiene sentido: se va directo a los ejercicios.
  if (user) {
    return <Navigate to={from ?? "/pila"} replace />;
  }

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Escribe tu correo.";
    else if (!EMAIL_PATTERN.test(email.trim()))
      newErrors.email = "Escribe un correo válido, como user@mail.com.";
    if (!password) newErrors.password = "Escribe tu contraseña.";
    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!login(email, password)) {
      setErrors({ form: "El correo o la contraseña no son correctos." });
      return;
    }

    // replace: true para que "Atrás" no vuelva al login.
    navigate(from ?? "/pila", { replace: true });
  };

  const fillDemo = () => {
    setEmail("user@mail.com");
    setPassword("123");
    setErrors({});
  };

  return (
    <main className="login">
      <section className="login__hero">
        <h1 className="sr-only">Pilas y colas</h1>
        <div className="hero-word" aria-hidden="true">
          <TileWord word="PILAS" variant="stack" />
          <span className="hero-word__and">y</span>
          <TileWord word="COLAS" variant="queue" />
        </div>
        <p className="login__lead">
          Inicia sesión para entrar a la pila de libros y a la fila del cajero.
        </p>
      </section>

      <section className="login__card" aria-labelledby="login-title">
        <h2 id="login-title" className="login__card-title">
          Iniciar sesión
        </h2>

        {from && !loggedOut && !errors.form && (
          <p className="notice" role="status">
            Para entrar a {PAGE_NAMES[from] ?? from} primero inicia sesión.
          </p>
        )}
        {loggedOut && !errors.form && (
          <p className="notice" role="status">
            Cerraste sesión. Las páginas de los ejercicios quedaron bloqueadas.
          </p>
        )}
        {errors.form && (
          <p className="notice notice--error" role="alert">
            {errors.form}
          </p>
        )}

        <form className="login__form" onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label htmlFor="email">Correo</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="user@mail.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setErrors((prev) => ({ ...prev, email: undefined, form: undefined }));
              }}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <span className="login-field__error" id="email-error">
                {errors.email}
              </span>
            )}
          </div>

          <div className="login-field">
            <label htmlFor="password">Contraseña</label>
            <div className="password">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setErrors((prev) => ({ ...prev, password: undefined, form: undefined }));
                }}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              <button
                type="button"
                className="password__toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-pressed={showPassword}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            {errors.password && (
              <span className="login-field__error" id="password-error">
                {errors.password}
              </span>
            )}
          </div>

          <button type="submit" className="btn-mint">
            Iniciar sesión
          </button>
        </form>

        <div className="demo">
          <p>
            Cuenta de prueba: <strong>user@mail.com</strong>, contraseña{" "}
            <strong>123</strong>.
          </p>
          <button type="button" className="demo__fill" onClick={fillDemo}>
            Llenar con la cuenta de prueba
          </button>
        </div>
      </section>
    </main>
  );
}
