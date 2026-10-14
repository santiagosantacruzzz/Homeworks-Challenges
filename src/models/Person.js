import { randomArrivalDate } from "../utils/randomArrivalDate";

let nextTicket = 1;

// Cada persona en el cajero tiene: nombre, monto a retirar y una
// fecha de llegada aleatoria que asigna el sistema (no el usuario).
// El ticket es el orden en que se registró, para comparar con el orden de llegada.
export class Person {
  constructor(name, withdrawalAmount) {
    this.ticket = nextTicket++;
    this.name = name;
    this.withdrawalAmount = withdrawalAmount;
    this.arrivalDate = randomArrivalDate();
  }
}

// Reglas del monto a retirar (múltiplos de 10.000, como en un cajero real).
export const MIN_AMOUNT = 10000;
export const MAX_AMOUNT = 2000000;
export const AMOUNT_STEP = 10000;
