import { Person } from "../models/Person";

// Personas de prueba. El sistema les asigna la fecha de llegada al azar
// cada vez que se carga la página, así que el orden de la fila cambia.
export const mockPeople = [
  new Person("Valentina Ríos", 200000),
  new Person("Andrés Mejía", 50000),
  new Person("Camila Ospina", 700000),
  new Person("Juan David Muñoz", 100000),
  new Person("Laura Cardona", 300000),
  new Person("Sebastián Castaño", 1500000),
];
