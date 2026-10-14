import { useRef, useState } from "react";
import { AMOUNT_STEP, MAX_AMOUNT, MIN_AMOUNT, Person } from "../../models/Person";
import { formatMoney, formatThousands } from "../../utils/format";

const QUICK_AMOUNTS = [50000, 100000, 200000, 500000];

// El turnero (kiosco) donde cada persona pide su turno.
export default function PersonForm({ onAddPerson }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(""); // solo dígitos
  const [errors, setErrors] = useState({});
  const nameRef = useRef(null);

  const validate = () => {
    const newErrors = {};
    const value = Number(amount);

    if (!name.trim()) {
      newErrors.name = "Escribe el nombre de la persona.";
    } else if (name.trim().length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 letras.";
    }

    if (!amount) {
      newErrors.amount = "Elige o escribe cuánto va a retirar.";
    } else if (value < MIN_AMOUNT || value > MAX_AMOUNT) {
      newErrors.amount = `El retiro va de ${formatMoney(MIN_AMOUNT)} a ${formatMoney(MAX_AMOUNT)}.`;
    } else if (value % AMOUNT_STEP !== 0) {
      newErrors.amount = `El cajero solo entrega múltiplos de ${formatMoney(AMOUNT_STEP)}.`;
    }

    return newErrors;
  };

  const clearError = (field) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleAmountChange = (event) => {
    const digits = event.target.value.replace(/\D/g, "").slice(0, 9);
    setAmount(digits.replace(/^0+/, ""));
    clearError("amount");
  };

  const handleQuickAmount = (value) => {
    setAmount(String(value));
    clearError("amount");
  };

  const handleClear = () => {
    setName("");
    setAmount("");
    setErrors({});
    nameRef.current?.focus();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // La fecha de llegada no la escribe el usuario: la asigna el sistema al crear la persona.
    onAddPerson(new Person(name.trim(), Number(amount)));
    handleClear();
  };

  return (
    <form className="kiosk" onSubmit={handleSubmit} noValidate>
      <div className="kiosk__screen">
        <h2 className="kiosk__title">Pedir turno</h2>

        <div className="field">
          <label className="field__label" htmlFor="name">
            Nombre
          </label>
          <input
            ref={nameRef}
            id="name"
            className="field__input"
            placeholder="Mariana López"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              clearError("name");
            }}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            autoComplete="off"
          />
          {errors.name && (
            <span className="field__error" id="name-error">
              {errors.name}
            </span>
          )}
        </div>

        <div className="field">
          <label className="field__label" htmlFor="amount">
            ¿Cuánto va a retirar?
          </label>
          <div className="money-input">
            <span aria-hidden="true">$</span>
            <input
              id="amount"
              className="money-input__field"
              inputMode="numeric"
              placeholder="0"
              value={amount ? formatThousands(amount) : ""}
              onChange={handleAmountChange}
              aria-invalid={Boolean(errors.amount)}
              aria-describedby={errors.amount ? "amount-error" : "amount-hint"}
              autoComplete="off"
            />
          </div>

          <div className="amounts" role="group" aria-label="Montos rápidos">
            {QUICK_AMOUNTS.map((value) => (
              <button
                type="button"
                key={value}
                className="amount-option"
                aria-pressed={Number(amount) === value}
                onClick={() => handleQuickAmount(value)}
              >
                {formatMoney(value)}
              </button>
            ))}
          </div>

          {errors.amount ? (
            <span className="field__error" id="amount-error">
              {errors.amount}
            </span>
          ) : (
            <span className="field__hint" id="amount-hint">
              Múltiplos de {formatMoney(AMOUNT_STEP)}, hasta {formatMoney(MAX_AMOUNT)}.
            </span>
          )}
        </div>

        <p className="kiosk__note">La hora de llegada la pone el turnero al imprimir.</p>
      </div>

      <div className="kiosk__keys">
        <button type="button" className="key key--yellow" onClick={handleClear}>
          Borrar
        </button>
        <button type="submit" className="key key--green">
          Imprimir turno
        </button>
      </div>

      <p className="caption">
        Imprimir turno crea la persona y llama a <code>enqueue()</code>.
      </p>
    </form>
  );
}
