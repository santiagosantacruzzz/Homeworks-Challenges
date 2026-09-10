const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const ListaSimple = require("./estructuras/ListaSimple");
const ListaDoble = require("./estructuras/ListaDoble");
const ListaCircular = require("./estructuras/ListaCircular");
const ListaCircularDoble = require("./estructuras/ListaCircularDoble");

const app = express();
app.use(cors());
app.use(express.json());

const servidor = http.createServer(app);
const io = new Server(servidor, { cors: { origin: "*" } });

const espera = new ListaSimple();
const historial = new ListaDoble();
const rotacionMedicos = new ListaCircular();
const comite = new ListaCircularDoble();

let contadorPaciente = 1;
let contadorRegistro = 1;
let contadorMedico = 1;
let contadorMiembro = 1;

const ROTACION_MS = 10000;

function sembrarDatos() {
  espera.agregarPaciente({ id: contadorPaciente++, nombre: "Laura Gómez", motivo: "Control general", prioridad: "normal", horaLlegada: new Date().toISOString() });
  espera.agregarPaciente({ id: contadorPaciente++, nombre: "Carlos Pérez", motivo: "Dolor abdominal", prioridad: "urgente", horaLlegada: new Date().toISOString() });
  espera.agregarPaciente({ id: contadorPaciente++, nombre: "Ana Ruiz", motivo: "Control post-operatorio", prioridad: "normal", horaLlegada: new Date().toISOString() });

  rotacionMedicos.agregarMedico({ id: contadorMedico++, nombre: "Dr. Iván Marín", especialidad: "Medicina general" });
  rotacionMedicos.agregarMedico({ id: contadorMedico++, nombre: "Dra. Paula Rentería", especialidad: "Pediatría" });
  rotacionMedicos.agregarMedico({ id: contadorMedico++, nombre: "Dr. Julián Cárdenas", especialidad: "Medicina interna" });

  comite.agregarMiembro({ id: contadorMiembro++, nombre: "Marisol Gordillo", cargo: "Directora médica" });
  comite.agregarMiembro({ id: contadorMiembro++, nombre: "Héctor Salazar", cargo: "Coordinador de enfermería" });
  comite.agregarMiembro({ id: contadorMiembro++, nombre: "Diana Ortiz", cargo: "Gestión administrativa" });
}
sembrarDatos();

function estadoCompleto() {
  return {
    espera: espera.listar(),
    historial: historial.listarDescendente(),
    historialActual: historial.actual(),
    medicos: rotacionMedicos.listar(),
    medicoDeGuardia: rotacionMedicos.medicoDeGuardia(),
    comite: comite.listar(),
    presidenteComite: comite.presidente(),
    proximaRotacionMs: ROTACION_MS,
  };
}

function emitirEstado() {
  io.emit("estado", estadoCompleto());
}

app.get("/api/espera", (req, res) => res.json(espera.listar()));

app.post("/api/espera", (req, res) => {
  const { nombre, motivo, prioridad } = req.body;
  if (!nombre) return res.status(400).json({ error: "El nombre del paciente es obligatorio" });
  const paciente = espera.agregarPaciente({
    id: contadorPaciente++,
    nombre,
    motivo: motivo || "Sin especificar",
    prioridad: prioridad || "normal",
    horaLlegada: new Date().toISOString(),
  });
  emitirEstado();
  res.status(201).json(paciente);
});

app.post("/api/espera/atender", (req, res) => {
  const { id } = req.body;
  const paciente = espera.atender(id);
  if (!paciente) return res.status(404).json({ error: "No hay pacientes en espera con ese criterio" });

  const medico = rotacionMedicos.medicoDeGuardia();
  const registro = historial.agregarAtencion({
    id: contadorRegistro++,
    paciente,
    medico: medico || { nombre: "Sin médico de guardia asignado" },
    fechaAtencion: new Date().toISOString(),
  });

  emitirEstado();
  res.json({ atendido: paciente, registro });
});

app.get("/api/historial", (req, res) => {
  const orden = req.query.orden === "asc" ? historial.listarAscendente() : historial.listarDescendente();
  res.json(orden);
});

app.get("/api/historial/paciente/:id", (req, res) => {
  res.json(historial.buscarPorPaciente(Number(req.params.id)));
});

app.get("/api/historial/cursor", (req, res) => {
  res.json({ actual: historial.actual() });
});

app.post("/api/historial/cursor/anterior", (req, res) => {
  const actual = historial.anterior();
  emitirEstado();
  res.json({ actual });
});

app.post("/api/historial/cursor/siguiente", (req, res) => {
  const actual = historial.siguiente();
  emitirEstado();
  res.json({ actual });
});

app.get("/api/medicos", (req, res) => {
  res.json({ lista: rotacionMedicos.listar(), deGuardia: rotacionMedicos.medicoDeGuardia() });
});

app.post("/api/medicos", (req, res) => {
  const { nombre, especialidad } = req.body;
  if (!nombre) return res.status(400).json({ error: "El nombre del médico es obligatorio" });
  const medico = rotacionMedicos.agregarMedico({ id: contadorMedico++, nombre, especialidad: especialidad || "General" });
  emitirEstado();
  res.status(201).json(medico);
});

app.delete("/api/medicos/:id", (req, res) => {
  const medico = rotacionMedicos.eliminarMedico(Number(req.params.id));
  if (!medico) return res.status(404).json({ error: "Médico no encontrado en la rotación" });
  emitirEstado();
  res.json(medico);
});

app.post("/api/medicos/rotar", (req, res) => {
  const medico = rotacionMedicos.rotar();
  emitirEstado();
  res.json({ deGuardia: medico });
});

app.get("/api/comite", (req, res) => {
  res.json({ lista: comite.listar(), presidente: comite.presidente() });
});

app.post("/api/comite", (req, res) => {
  const { nombre, cargo } = req.body;
  if (!nombre) return res.status(400).json({ error: "El nombre del miembro es obligatorio" });
  const miembro = comite.agregarMiembro({ id: contadorMiembro++, nombre, cargo: cargo || "Vocal" });
  emitirEstado();
  res.status(201).json(miembro);
});

app.delete("/api/comite/:id", (req, res) => {
  const miembro = comite.eliminarMiembro(Number(req.params.id));
  if (!miembro) return res.status(404).json({ error: "Miembro no encontrado en el comité" });
  emitirEstado();
  res.json(miembro);
});

app.post("/api/comite/rotar", (req, res) => {
  const direccion = req.body.direccion === "atras" ? comite.rotarAtras() : comite.rotarAdelante();
  emitirEstado();
  res.json({ presidente: direccion });
});

app.get("/api/estado", (req, res) => res.json(estadoCompleto()));

setInterval(() => {
  const nuevoDeGuardia = rotacionMedicos.rotar();
  io.emit("rotacion-automatica", { deGuardia: nuevoDeGuardia, hora: new Date().toISOString() });
  emitirEstado();
}, ROTACION_MS);

io.on("connection", (socket) => {
  socket.emit("estado", estadoCompleto());
});

const PUERTO = process.env.PORT || 4000;
servidor.listen(PUERTO, () => {
  console.log(`Servidor de la clínica escuchando en http://localhost:${PUERTO}`);
  console.log(`El médico de guardia rota automáticamente cada ${ROTACION_MS / 1000} segundos.`);
});
