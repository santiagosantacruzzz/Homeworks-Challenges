import { useRegistro } from "../hooks/useRegistro";

/** Muestra la última petición que pasó por los interceptores de Axios. */
export default function Registro() {
  const ultima = useRegistro();
  if (!ultima) return null;
  const ok = typeof ultima.status === "number" && ultima.status < 300;

  return (
    <aside className={`registro ${ok ? "" : "registro--error"}`} key={`${ultima.ruta}-${ultima.ms}`} aria-label="Última petición">
      <b>{ultima.status}</b>
      <code>{ultima.ruta}</code>
      <span>{ultima.ms} ms</span>
    </aside>
  );
}
