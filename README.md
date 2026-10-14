# Challenge 05 — Colas (Queues)

Proyecto en React que resuelve el Challenge 05 de Estructuras de Datos II:

1. **Cola de personas en un cajero** — cada persona (`Person`) tiene **nombre, monto a retirar y una fecha de llegada aleatoria asignada por el sistema**.
2. **Datos mock** — la fila arranca con 6 personas de prueba (`mockData.js`). Sus horas de llegada se generan al azar cada vez que se carga la página.
3. **Pantalla con formulario** — el formulario crea una persona nueva (nombre y monto). El sistema le asigna la hora de llegada y la agrega a la cola con `enqueue()`.
4. **Fila impresa por fecha de llegada** — `print()` muestra la cola del frente hacia el final, que es el orden de llegada.

Además, el tablero del cajero muestra quién sigue con `peek()`, y el botón **Atender siguiente** lo saca de la cola con `dequeue()`.

## Interfaz

La pantalla imita el vestíbulo de un banco:

- **Turnero (kiosco):** pantalla azul de cajero donde se pide el turno. Los botones verde y amarillo son los del teclado de un cajero.
- **Tablero:** muestra a la persona que sigue en el cajero.
- **Rollo de turnos:** la fila se dibuja como un rollo de papel térmico. Cada persona es un tiquete con su hora de llegada. Al pedir turno, el tiquete nuevo se "imprime" en el puesto que le toca. Al atender, el tiquete de arriba se arranca del rollo.

Tipografías: Archivo (condensada en los títulos) y Courier Prime en los tiquetes. Están incluidas con `@fontsource`, así que funcionan sin internet.

## ¿Por qué la cola queda ordenada por llegada?

Como la hora de llegada es aleatoria, una persona que se registra después puede haber llegado antes que otras. En un cajero real se atiende primero a quien llegó primero (FIFO por hora de llegada). Por eso `AtmQueue` extiende la `Queue` vista en clase y cambia solo `enqueue()`: ubica a la persona detrás de todos los que llegaron antes que ella. Así:

- el frente de la cola (`peek()`) siempre es quien llegó primero,
- `dequeue()` atiende a esa persona,
- `print()` ya sale ordenado por fecha de llegada.

Cada tiquete muestra también su **número de turno** (C-001, C-002…), que es el orden en que se registró la persona. Así se ve que el orden de registro y el de llegada no siempre coinciden.

## Estructura del proyecto

```
src/
├── dataStructures/
│   ├── Queue.js           # enqueue, dequeue, peek, size, isEmpty, print (como en clase)
│   └── AtmQueue.js        # cola del cajero: enqueue ordenado por hora de llegada
├── models/
│   └── Person.js          # clase Person (name, withdrawalAmount, arrivalDate) + reglas del monto
├── utils/
│   ├── randomArrivalDate.js  # fecha de llegada aleatoria (hoy, entre 6:00 y 22:00)
│   └── format.js          # formato de pesos colombianos, fecha, hora y código de turno
├── data/
│   └── mockData.js        # personas de prueba (punto 2)
├── components/
│   ├── PersonForm.jsx     # turnero: formulario para crear una persona (punto 3)
│   ├── CallBoard.jsx      # tablero: peek() y botón dequeue()
│   └── TicketRoll.jsx     # rollo de tiquetes, ordenado por llegada (punto 4)
├── pages/
│   └── AtmQueuePage.jsx   # pantalla que crea la cola y conecta todo
└── App.jsx
```

### Validaciones del formulario

- El nombre es obligatorio (mínimo 3 letras).
- El monto debe estar entre $10.000 y $2.000.000 y ser múltiplo de $10.000, como en un cajero real.
- La fecha de llegada no se pide: la asigna el sistema.

## Cómo ejecutarlo

```bash
npm install
npm run dev
```

Abre la URL que muestra la terminal (por defecto `http://localhost:5173`).

## Cómo compilarlo para producción

```bash
npm run build
npm run preview
```
