import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import type { EstadoClinica } from "./types";
import {
  API_URL,
  agregarPaciente,
  atenderPaciente,
  rotarMedicoManual,
  agregarMedico,
  eliminarMedico,
  rotarComite,
  agregarMiembro,
  eliminarMiembro,
  historialAnterior,
  historialSiguiente,
} from "./api/clinica";
import Loader from "./components/Loader";
import SalaEspera from "./components/SalaEspera";
import Historial from "./components/Historial";
import Guardia from "./components/Guardia";
import Comite from "./components/Comite";
import "./index.css";

const ESTADO_INICIAL: EstadoClinica = {
  espera: [],
  historial: [],
  historialActual: null,
  medicos: [],
  medicoDeGuardia: null,
  comite: [],
  presidenteComite: null,
  proximaRotacionMs: 10000,
};

function App() {
  const [estado, setEstado] = useState<EstadoClinica>(ESTADO_INICIAL);
  const [cargando, setCargando] = useState(true);
  const [conectado, setConectado] = useState(false);

  useEffect(() => {
    const socket = io(API_URL);

    socket.on("connect", () => setConectado(true));
    socket.on("disconnect", () => setConectado(false));

    socket.on("estado", (data: EstadoClinica) => {
      setEstado(data);
      setCargando(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (cargando) return <Loader />;

  return (
    <div className="app">
      <div className="topbar">
        <h1>Clínica San Rafael</h1>
        <div className="status">
          <span className={"dot" + (conectado ? " on" : "")}></span>
          <span>{conectado ? "Conectado" : "Sin conexión"}</span>
        </div>
      </div>

      <div className="grid">
        <div>
          <SalaEspera espera={estado.espera} onAtender={atenderPaciente} onAgregar={agregarPaciente} />
          <Historial
            historial={estado.historial}
            actual={estado.historialActual}
            onAnterior={historialAnterior}
            onSiguiente={historialSiguiente}
          />
        </div>
        <div>
          <Guardia
            medicos={estado.medicos}
            deGuardia={estado.medicoDeGuardia}
            cicloMs={estado.proximaRotacionMs}
            onRotarManual={rotarMedicoManual}
            onAgregar={agregarMedico}
            onEliminar={eliminarMedico}
          />
          <Comite
            comite={estado.comite}
            presidente={estado.presidenteComite}
            onAdelante={() => rotarComite("adelante")}
            onAtras={() => rotarComite("atras")}
            onAgregar={agregarMiembro}
            onEliminar={eliminarMiembro}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
