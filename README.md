# Challenge 03 — Listas Enlazadas

Proyecto en React que resuelve el Challenge 03 de Estructuras de Datos II:

1. **Reproductor de canciones** — lista simplemente enlazada (`LinkedList`), con datos mock, recorrida con un puntero `current` y el método `next()`.
2. **Historial de navegación** — lista doblemente enlazada (`DoublyLinkedList`), con datos falsos, recorrida en ambos sentidos con `back()` / `forward()`.
3. Proyecto React con 2 páginas (rutas `/` y `/historial`) que usan cada estructura.
4. Botones dentro de cada página para navegar por los nodos de la lista.

## Estructura del proyecto

```
src/
├── dataStructures/
│   ├── Node.js              # Node (simple) y DoubleNode (doble)
│   ├── LinkedList.js        # append, peek, size, remove, print, next, reset
│   └── DoublyLinkedList.js  # append, peek, size, remove, print, back, forward
├── data/
│   └── mockData.js          # canciones y páginas simuladas
├── components/
│   └── NodeChain.jsx        # visualización de la cadena de nodos
├── pages/
│   ├── SongPlayer.jsx       # Challenge 03 - punto 1
│   └── BrowserHistory.jsx   # Challenge 03 - punto 2
└── App.jsx                  # rutas y navegación (puntos 3 y 4)
```

Las estructuras de datos están implementadas desde cero (sin librerías de listas enlazadas), siguiendo la convención de métodos vista en clase: `append`, `peek`, `size`, `remove`, `print`.

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
