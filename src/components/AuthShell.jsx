import { CheckIcon } from "./Icons";

const SAMPLE = [
  { title: "Leer la clase de Firebase", done: true },
  { title: "Configurar Authentication", done: true },
  { title: "Terminar el Challenge 07", done: false },
];

// Marco de las páginas de login y registro: a un lado, una lista de ejemplo;
// al otro, el formulario.
export default function AuthShell({ children }) {
  return (
    <main className="auth">
      <section className="auth__intro" aria-hidden="true">
        <p className="auth__brand">Tareas</p>
        <ul className="auth__sample">
          {SAMPLE.map((item) => (
            <li key={item.title} className={item.done ? "is-done" : ""}>
              <span className="auth__box">{item.done && <CheckIcon />}</span>
              <span className="auth__text">{item.title}</span>
            </li>
          ))}
        </ul>
        <p className="auth__tagline">Tus pendientes, guardados en Firebase y a salvo con tu cuenta.</p>
      </section>

      <section className="auth__panel">{children}</section>
    </main>
  );
}
