import { Queue } from "./Queue";

// Cola del cajero: sigue siendo FIFO, pero por HORA DE LLEGADA.
// Como el sistema asigna la fecha de llegada al azar, una persona registrada
// después puede haber llegado antes. Por eso enqueue() la ubica detrás de
// todos los que llegaron antes que ella; así el frente siempre es quien llegó
// primero, dequeue() lo atiende a él y print() queda ordenado por llegada.
export class AtmQueue extends Queue {
  enqueue(person) {
    const index = this.items.findIndex(
      (queued) => queued.arrivalDate > person.arrivalDate
    );

    if (index === -1) {
      this.items.push(person); // llegó después de todos: va al final
    } else {
      this.items.splice(index, 0, person); // llegó antes que alguien: se ubica en su lugar
    }

    return index === -1 ? this.items.length - 1 : index;
  }
}
