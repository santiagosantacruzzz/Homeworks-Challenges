import { useContext, useState } from "react";
import { StructuresContext } from "../context/StructuresContext";
import { formatMoney, formatTime, ticketCode } from "../utils/format";
import CallBoard from "../components/atm/CallBoard";
import PersonForm from "../components/atm/PersonForm";
import TicketRoll from "../components/atm/TicketRoll";

export default function AtmQueuePage() {
  // La cola viene del contexto, así conserva su fila al cambiar de página.
  const { atmQueue: queue } = useContext(StructuresContext);
  // Copia de queue.print() que React usa para volver a pintar la pantalla.
  const [people, setPeople] = useState(() => queue.print());
  const [lastAction, setLastAction] = useState(null);
  const [torn, setTorn] = useState(null);

  const handleAddPerson = (person) => {
    const position = queue.enqueue(person);
    setPeople(queue.print());
    setLastAction({
      type: "enqueue",
      person,
      position: position + 1,
      total: queue.size(),
    });
  };

  const handleServe = () => {
    const served = queue.dequeue();
    if (!served) return;
    setPeople(queue.print());
    setTorn(served);
    setLastAction({ type: "dequeue", person: served });
  };

  const total = people.reduce((sum, person) => sum + person.withdrawalAmount, 0);
  const size = queue.size();

  return (
    <div className="atm-app">
      <main className="content">
        <div className="vestibule">
          <div className="vestibule__side">
            <header className="intro">
              <h1>Fila del cajero</h1>
              <p>
                El turnero le asigna a cada persona una hora de llegada al azar, y la fila
                se ordena por esa hora: quien llegó primero, retira primero.
              </p>
              <p className="intro__course">Challenge 05, Estructuras de Datos II</p>
            </header>

            <PersonForm onAddPerson={handleAddPerson} />
          </div>

          <section className="line" aria-label="Fila">
            <CallBoard next={queue.peek()} onServe={handleServe} />
            <p className="caption">
              El tablero muestra a quien sigue con <code>peek()</code> y el botón lo
              atiende con <code>dequeue()</code>.
            </p>

            <p className="line__log" aria-live="polite">
              {lastAction?.type === "enqueue" &&
                `${lastAction.person.name} recibió el turno ${ticketCode(lastAction.person)}: llegó a las ${formatTime(lastAction.person.arrivalDate)} y quedó en el puesto ${lastAction.position} de ${lastAction.total}.`}
              {lastAction?.type === "dequeue" &&
                `${lastAction.person.name} pasó al cajero y retiró ${formatMoney(lastAction.person.withdrawalAmount)}.`}
            </p>

            <p className="line__count">
              {size === 0
                ? "La fila está vacía"
                : `${size} ${size === 1 ? "persona" : "personas"} en la fila, ${formatMoney(total)} por retirar`}{" "}
              <span className="line__method">
                (<code>size()</code> = {size})
              </span>
            </p>

            <TicketRoll
              people={people}
              printedTicket={
                lastAction?.type === "enqueue" ? lastAction.person.ticket : null
              }
              torn={torn}
              onTornAway={() => setTorn(null)}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
