import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Portada from "../layouts/Portada";
import useSesion from "../hooks/useSesion";

export default function Registro() {
  const { registrar, enviando, error, limpiarError } = useSesion();
  const [datos, setDatos] = useState({ nombre: "", email: "", clave: "", repetir: "" });
  const [problema, setProblema] = useState("");

  useEffect(() => limpiarError, [limpiarError]);

  const cambiar = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
    setProblema("");
    if (error) limpiarError();
  };

  const enviar = (e) => {
    e.preventDefault();
    if (!datos.nombre.trim()) return setProblema("Escribe tu nombre.");
    if (datos.clave.length < 6) return setProblema("Usa una contraseña de al menos 6 caracteres.");
    if (datos.clave !== datos.repetir) return setProblema("Las contraseñas no son iguales.");
    registrar(datos.nombre, datos.email, datos.clave);
  };

  const mensaje = problema || error;

  return (
    <Portada titulo="Crea tu cuenta">
      <p className="portada__texto">Tu correo quedará guardado en cada carpeta y archivo que crees.</p>
      <form onSubmit={enviar} noValidate>
        <label className="etiqueta" htmlFor="nombre">Nombre</label>
        <input id="nombre" name="nombre" className="campo" autoComplete="name"
          value={datos.nombre} onChange={cambiar} />

        <label className="etiqueta" htmlFor="email">Correo</label>
        <input id="email" name="email" type="email" className="campo" autoComplete="email"
          value={datos.email} onChange={cambiar} />

        <div className="par">
          <div>
            <label className="etiqueta" htmlFor="clave">Contraseña</label>
            <input id="clave" name="clave" type="password" className="campo"
              autoComplete="new-password" value={datos.clave} onChange={cambiar} />
          </div>
          <div>
            <label className="etiqueta" htmlFor="repetir">Repítela</label>
            <input id="repetir" name="repetir" type="password" className="campo"
              autoComplete="new-password" value={datos.repetir} onChange={cambiar} />
          </div>
        </div>

        {mensaje && <p className="aviso" role="alert">{mensaje}</p>}

        <button className="boton boton--principal boton--ancho" disabled={enviando}>
          {enviando ? "Creando cuenta…" : "Crear cuenta"}
        </button>
      </form>
      <p className="portada__cambio">
        ¿Ya tienes cuenta? <Link to="/ingresar">Inicia sesión</Link>
      </p>
    </Portada>
  );
}
