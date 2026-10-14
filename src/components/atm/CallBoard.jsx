import { formatMoney, ticketCode } from "../../utils/format";

// Tablero del cajero: muestra quién está al frente de la cola (peek)
// y permite atenderlo (dequeue).
export default function CallBoard({ next, onServe }) {
  return (
    <div className="board">
      <div className="board__info" aria-live="polite">
        <p className="board__label">Siguiente en el cajero</p>
        {next ? (
          <>
            <p className="board__name">{next.name}</p>
            <p className="board__detail">
              Turno {ticketCode(next)}, va a retirar {formatMoney(next.withdrawalAmount)}
            </p>
          </>
        ) : (
          <>
            <p className="board__name board__name--idle">Nadie esperando</p>
            <p className="board__detail">El cajero está libre.</p>
          </>
        )}
      </div>

      <button type="button" className="key key--green" onClick={onServe} disabled={!next}>
        Atender siguiente
      </button>
    </div>
  );
}
