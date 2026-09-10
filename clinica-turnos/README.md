# Sistema de Turnos, Historial y Guardias — Clínica

Proyecto completo: backend en Node/Express + Socket.IO (con las 4 estructuras
de datos implementadas desde cero, siguiendo la convención de la Clase 03 —
`Node`, `append`, `peek`, `size`, `remove`, `print`) y un panel web en
React + Vite + TypeScript (igual al flujo de la Clase 02 — componentes
funcionales, hooks, `interface` para props/estado) que las visualiza y
manipula en tiempo real.

## Estructura del proyecto

```
clinica-turnos/
├── backend/
│   ├── estructuras/
│   │   ├── ListaSimple.js         -> 1. Pacientes en espera
│   │   ├── ListaDoble.js          -> 2. Historial de atención
│   │   ├── ListaCircular.js       -> 3. Rotación de médicos de guardia
│   │   └── ListaCircularDoble.js  -> 4. Comité administrativo
│   ├── server.js                  -> API REST + WebSocket + rotación automática
│   └── package.json
└── frontend/                      -> 5. Panel en React + Vite + TypeScript
    ├── index.html
    ├── src/
    │   ├── main.tsx
    │   ├── App.tsx
    │   ├── index.css
    │   ├── api/clinica.ts          -> cliente fetch hacia el backend
    │   ├── types/index.ts          -> interfaces (Paciente, Medico, ...)
    │   └── components/
    │       ├── Loader.tsx          -> loader de carga inicial
    │       ├── SalaEspera.tsx
    │       ├── Historial.tsx       -> incluye navegación Anterior/Siguiente
    │       ├── Guardia.tsx
    │       ├── Comite.tsx
    │       └── Ring.tsx            -> diagrama de anillo para las listas circulares
    └── package.json
```

## Cómo ejecutarlo

1. Backend:
   ```
   cd backend
   npm install
   npm start
   ```
   Queda escuchando en `http://localhost:4000`.

2. Frontend:
   ```
   cd frontend
   npm install
   npm run dev
   ```
   Se abre en `http://localhost:5173` y se conecta solo al backend por
   HTTP y WebSocket.

## Convención de nombres (Clase 03 — Listas)

Cada estructura implementa primero la interfaz genérica vista en clase, y
encima una capa de dominio con nombres en español para el resto del sistema:

| Método de clase | Qué hace | Wrapper de dominio (ej. sala de espera) |
|---|---|---|
| `append(value)` | Agrega un nodo al final | `agregarPaciente(p)` |
| `peek()` | Retorna un nodo de la lista | `proximoPaciente()` |
| `size()` | Número de elementos | `totalEnEspera()` |
| `remove(predicado)` | Quita un nodo y reconecta anterior/siguiente | `atender(id)` |
| `print()` | Imprime y retorna el contenido | `listar()` |

Las listas circulares agregan `rotate()` (o `rotateForward`/`rotateBackward`
en la circular doble). La lista doble agrega, además, un cursor de
navegación `anterior()` / `siguiente()` / `actual()` — la misma idea del
Challenge 03 de "navegar atrás y adelante entre páginas visitadas", aplicada
aquí al historial de atención.

## Cómo se mapea cada estructura al problema

| Requisito                          | Estructura                          | Por qué esa estructura |
|-------------------------------------|--------------------------------------|--------------------------|
| Pacientes en espera                 | Lista enlazada simple                | Solo se necesita avanzar en un sentido (FIFO): llega al final, se atiende desde el inicio. |
| Historial de atención                | Lista doblemente enlazada            | Se necesita recorrer en ambos sentidos (más antiguo→reciente y viceversa) y podría eliminarse un registro puntual sin recorrer toda la lista. |
| Rotación de médicos de guardia       | Lista circular enlazada              | La rotación nunca "termina": el último médico enlaza de nuevo con el primero. |
| Comité administrativo               | Lista circular doblemente enlazada   | Rotación en ambos sentidos (adelante/atrás) y sin fin, útil para turnos de presidencia o revisión cíclica de miembros. |

## Flujo de "atender paciente"

1. `POST /api/espera/atender` saca al paciente de la **lista simple**
   (`atenderSiguiente()` o `atenderPorId(id)`).
2. Se toma el médico de guardia actual de la **lista circular**.
3. Se arma un registro `{ paciente, medico, fechaAtencion }` y se agrega
   al final de la **lista doble** (`agregarAtencion`).
4. Se emite el nuevo estado por WebSocket a todos los paneles conectados.

## Rotación automática cada 10 segundos

En `server.js`:
```js
setInterval(() => {
  const nuevoDeGuardia = rotacionMedicos.rotar();
  io.emit("rotacion-automatica", { deGuardia: nuevoDeGuardia, hora: new Date().toISOString() });
  emitirEstado();
}, 10000);
```
El panel React también dibuja una barra de progreso local que se sincroniza
con cada snapshot de estado, para mostrar visualmente cuánto falta para el
próximo cambio de guardia.

## Endpoints principales

- `GET /api/estado` — snapshot completo (las 4 estructuras a la vez)
- `GET/POST /api/espera`, `POST /api/espera/atender`
- `GET /api/historial`, `GET /api/historial/paciente/:id`
- `GET /api/historial/cursor`, `POST /api/historial/cursor/anterior`, `POST /api/historial/cursor/siguiente`
- `GET/POST /api/medicos`, `DELETE /api/medicos/:id`, `POST /api/medicos/rotar`
- `GET/POST /api/comite`, `DELETE /api/comite/:id`, `POST /api/comite/rotar`

## Posibles extensiones para sustentar

- Persistir el estado en una base de datos (ya trabajaste con MongoDB en
  Databases 2; encajaría bien reemplazar el estado en memoria).
- Agregar autenticación para el panel administrativo.
- Priorizar automáticamente a los pacientes "urgentes" dentro de la lista
  simple (insertar antes que los normales en vez de solo al final).
