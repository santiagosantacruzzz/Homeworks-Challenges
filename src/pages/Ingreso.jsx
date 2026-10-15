import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Portada from "../layouts/Portada";
import useSesion from "../hooks/useSesion";

export default function Ingreso() {
  const { ingresar, enviando, error, limpiarError } = useSesion();
  const [datos, setDatos] = useState({ email: "", clave: "" });

  useEffect(() => limpiarError, [limpiarError]);

  const cambiar = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
    if (error) limpiarError();
  };

  const enviar = (e) => {
    e.preventDefault();
    ingresar(datos.email, datos.clave); // RutaPublica lleva al árbol cuando hay sesión
  };

  return (
    <Portada titulo="Inicia sesión">
      <p className="portada__texto">Necesitas una cuenta para crear carpetas y archivos.</p>
      <form onSubmit={enviar} noValidate>
        <label className="etiqueta" htmlFor="email">Correo</label>
        <input id="email" name="email" type="email" className="campo" autoComplete="email"
          value={datos.email} onChange={cambiar} required />

        <label className="etiqueta" htmlFor="clave">Contraseña</label>
        <input id="clave" name="clave" type="password" className="campo"
          autoComplete="current-password" value={datos.clave} onChange={cambiar} required />

        {error && <p className="aviso" role="alert">{error}</p>}

        <button className="boton boton--principal boton--ancho" disabled={enviando}>
          {enviando ? "Entrando…" : "Entrar"}
        </button>
      </form>
      <p className="portada__cambio">
        ¿Aún no tienes cuenta? <Link to="/registro">Crear una cuenta</Link>
      </p>
    </Portada>
  );
}
