import { formatDate, formatMoney, formatTime, ticketCode } from "../../utils/format";

function Ticket({ person, position }) {
  return (
    <>
      <div className="ticket__head">
        <span className="ticket__code">Turno {ticketCode(person)}</span>
        {position && <span>Puesto {position}</span>}
      </div>

      {position === 1 && <span className="ticket__next">Siguiente</span>}

      <p className="ticket__label">Llegó a las</p>
      <p className="ticket__time">{formatTime(person.arrivalDate)}</p>
      <p className="ticket__date">{formatDate(person.arrivalDate)}</p>

      <p className="ticket__name">{person.name}</p>
      <p className="ticket__line">
        <span>Retiro</span>
        <span className="ticket__leader" aria-hidden="true" />
        <span>{formatMoney(person.withdrawalAmount)}</span>
      </p>
    </>
  );
}

// La fila se dibuja como un rollo de papel térmico: cada persona es un tiquete,
// en el orden de queue.print() (del frente hacia el final = orden de llegada).
// Al atender, el tiquete de arriba se arranca; al pedir turno, el nuevo se
// imprime en el puesto que le corresponde por su hora de llegada.
export default function TicketRoll({ people, printedTicket, torn, onTornAway }) {
  return (
    <div className="roll">
      <div className="roll__cutter" aria-hidden="true" />

      {torn && (
        <div
          key={torn.ticket}
          className="ticket ticket--torn"
          aria-hidden="true"
          onAnimationEnd={onTornAway}
        >
          <Ticket person={torn} />
        </div>
      )}

      {people.length === 0 ? (
        <div className="roll__paper roll__paper--empty">
          <p>No hay nadie en la fila.</p>
          <p>Pide un turno en el turnero para empezar.</p>
        </div>
      ) : (
        <ol className="roll__paper" aria-label="Fila del cajero, ordenada por hora de llegada">
          {people.map((person, index) => (
            <li
              key={person.ticket}
              className={`ticket${person.ticket === printedTicket ? " ticket--printed" : ""}`}
            >
              <Ticket person={person} position={index + 1} />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
