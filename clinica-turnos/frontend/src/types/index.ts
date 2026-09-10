export interface Paciente {
  id: number;
  nombre: string;
  motivo: string;
  prioridad: "normal" | "urgente";
  horaLlegada: string;
}

export interface Medico {
  id: number;
  nombre: string;
  especialidad: string;
}

export interface MiembroComite {
  id: number;
  nombre: string;
  cargo: string;
}

export interface RegistroAtencion {
  id: number;
  paciente: Paciente;
  medico: Medico | { nombre: string };
  fechaAtencion: string;
}

export interface EstadoClinica {
  espera: Paciente[];
  historial: RegistroAtencion[];
  historialActual: RegistroAtencion | null;
  medicos: Medico[];
  medicoDeGuardia: Medico | null;
  comite: MiembroComite[];
  presidenteComite: MiembroComite | null;
  proximaRotacionMs: number;
}
