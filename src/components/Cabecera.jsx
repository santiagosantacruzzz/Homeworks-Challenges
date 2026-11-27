import { useEffect, useState } from "react";
import { cerrarSesion } from "../services/authService";
import Paletas from "./Paletas";
import Pasaporte from "./Pasaporte";

const ESTADOS = {
  SUBSCRIBED: { texto: "En vivo", clase: "vivo" },
  CONNECTING: { texto: "Conectando", clase: "espera" },
  CLOSED: { texto: "Sin señal", clase: "caido" },
  CHANNEL_ERROR: { texto: "Sin señal", clase: "caido" },
  TIMED_OUT: { texto: "Sin señal", clase: "caido" },
};

export default function Cabecera({ usuario, enVivo }) {
  const [ahora, setAhora] = useState(() => new Date());
  const estado = ESTADOS[enVivo] ?? ESTADOS.CONNECTING;

  useEffect(() => {
    const t = setInterval(() => setAhora(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="cabecera">
      <div className="cabecera__titulo">
        <Paletas texto="SALIDAS" />
        <span className={`radar radar--${estado.clase}`}>{estado.texto}</span>
      </div>

      <div className="cabecera__reloj" aria-label="Hora local">
        {ahora.toLocaleTimeString("es-CO", { hour12: false })}
        <small>Cali · COT</small>
      </div>

      <div className="cabecera__usuario">
        <Pasaporte usuario={usuario} />
        <button className="boton boton--fantasma" onClick={() => cerrarSesion()}>
          Salir
        </button>
      </div>
    </header>
  );
}
