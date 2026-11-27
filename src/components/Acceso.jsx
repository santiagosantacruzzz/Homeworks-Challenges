import { useState } from "react";
import { iniciarSesion, mensajeAuth, registrar } from "../services/authService";
import Paletas from "./Paletas";

/** Login y registro con Supabase Auth, diseñados como un pase de abordar. */
export default function Acceso() {
  const [modo, setModo] = useState("abordar"); // "abordar" = login · "checkin" = registro
  const [form, setForm] = useState({ nombre: "", correo: "", clave: "" });
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState(null); // { tipo: "error" | "ok", texto }

  const esRegistro = modo === "checkin";
  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function enviar(e) {
    e.preventDefault();
    setEnviando(true);
    setAviso(null);
    try {
      if (esRegistro) {
        const { requiereConfirmacion } = await registrar(form);
        if (requiereConfirmacion) {
          setAviso({ tipo: "ok", texto: "Check-in hecho. Confirma tu correo y luego aborda con tu contraseña." });
          setModo("abordar");
        }
      } else {
        await iniciarSesion(form);
      }
      // Si hay sesión, useSesion se entera solo (onAuthStateChange) y App cambia de pantalla.
    } catch (error) {
      setAviso({ tipo: "error", texto: mensajeAuth(error) });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="pantalla-centro acceso">
      <header className="acceso__marca">
        <Paletas texto="TORRE DE CONTROL" tamano="mediano" />
        <p>Tus tareas despegan desde aquí.</p>
      </header>

      <section className="pase">
        <div className="pase__cuerpo">
          <div className="pase__pestanas" role="tablist">
            <button role="tab" aria-selected={!esRegistro} className={!esRegistro ? "activa" : ""} onClick={() => setModo("abordar")}>
              Abordar
            </button>
            <button role="tab" aria-selected={esRegistro} className={esRegistro ? "activa" : ""} onClick={() => setModo("checkin")}>
              Check-in
            </button>
          </div>

          <h1 className="pase__titulo">{esRegistro ? "Nuevo pasajero" : "Pase de abordar"}</h1>

          <form onSubmit={enviar} className="pase__form">
            {esRegistro && (
              <label className="campo">
                <span>Nombre del pasajero</span>
                <input name="nombre" value={form.nombre} onChange={cambiar} required maxLength={40} autoComplete="name" />
              </label>
            )}
            <label className="campo">
              <span>Correo</span>
              <input name="correo" type="email" value={form.correo} onChange={cambiar} required autoComplete="email" />
            </label>
            <label className="campo">
              <span>Contraseña</span>
              <input
                name="clave"
                type="password"
                value={form.clave}
                onChange={cambiar}
                required
                minLength={6}
                autoComplete={esRegistro ? "new-password" : "current-password"}
              />
            </label>

            {aviso && <p className={`aviso-linea aviso-linea--${aviso.tipo}`}>{aviso.texto}</p>}

            <button className="boton boton--ambar" disabled={enviando}>
              {enviando ? "Procesando…" : esRegistro ? "Hacer check-in" : "Abordar"}
            </button>
          </form>
        </div>

        <aside className="pase__talon" aria-hidden="true">
          <div>
            <small>Vuelo</small>
            <b>CH-10</b>
          </div>
          <div>
            <small>Puerta</small>
            <b>{esRegistro ? "A1" : "B7"}</b>
          </div>
          <div>
            <small>Destino</small>
            <b>SUPABASE</b>
          </div>
          <div className="codigo-barras" />
        </aside>
      </section>
    </main>
  );
}
