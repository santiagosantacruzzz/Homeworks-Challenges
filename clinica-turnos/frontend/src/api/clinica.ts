import type { EstadoClinica, Paciente, Medico, MiembroComite } from "../types";

export const API_URL = "http://localhost:4000";

async function peticion<T>(ruta: string, opciones?: RequestInit): Promise<T> {
  const respuesta = await fetch(API_URL + ruta, {
    headers: { "Content-Type": "application/json" },
    ...opciones,
  });
  return respuesta.json();
}

export const obtenerEstado = () => peticion<EstadoClinica>("/api/estado");

export const agregarPaciente = (datos: Pick<Paciente, "nombre" | "motivo" | "prioridad">) =>
  peticion("/api/espera", { method: "POST", body: JSON.stringify(datos) });

export const atenderPaciente = (id?: number) =>
  peticion("/api/espera/atender", { method: "POST", body: JSON.stringify(id ? { id } : {}) });

export const rotarMedicoManual = () => peticion("/api/medicos/rotar", { method: "POST" });

export const agregarMedico = (datos: Pick<Medico, "nombre" | "especialidad">) =>
  peticion("/api/medicos", { method: "POST", body: JSON.stringify(datos) });

export const eliminarMedico = (id: number) => peticion(`/api/medicos/${id}`, { method: "DELETE" });

export const rotarComite = (direccion: "adelante" | "atras") =>
  peticion("/api/comite/rotar", { method: "POST", body: JSON.stringify({ direccion }) });

export const agregarMiembro = (datos: Pick<MiembroComite, "nombre" | "cargo">) =>
  peticion("/api/comite", { method: "POST", body: JSON.stringify(datos) });

export const eliminarMiembro = (id: number) => peticion(`/api/comite/${id}`, { method: "DELETE" });

export const historialAnterior = () =>
  peticion<{ actual: EstadoClinica["historialActual"] }>("/api/historial/cursor/anterior", { method: "POST" });

export const historialSiguiente = () =>
  peticion<{ actual: EstadoClinica["historialActual"] }>("/api/historial/cursor/siguiente", { method: "POST" });
