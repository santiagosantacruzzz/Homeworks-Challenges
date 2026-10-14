# Challenge 04 — Pilas (Stacks)

Proyecto en React que resuelve el Challenge 04 de Estructuras de Datos II:

1. **Pila de libros** — se crea y maneja una pila (`Stack`) donde cada libro (`Book`) tiene **Nombre, ISBN, Autor y Editorial**.
2. **Datos mock** — la pila arranca llena con 6 libros de prueba (`mockData.js`).
3. **Pantalla con formulario** — el panel *Add New Book* crea un libro nuevo y lo agrega a la pila con `push()`.
4. **Pila impresa en pantalla** — el panel *Current Book Stack List* la muestra con `print()`, del tope hacia la base. El libro del tope se dibuja con las hojas de los libros de abajo asomando detrás.

Además, el botón **Pop Top Book** saca el libro del tope con `pop()` y el contador usa `size()`, para comprobar el comportamiento LIFO (último en entrar, primero en salir).

## Estructura del proyecto

```
src/
├── dataStructures/
│   └── Stack.js          # push, pop, peek, isEmpty, size, print
├── models/
│   └── Book.js           # clase Book (name, isbn, author, editorial) + validación del ISBN-13
├── data/
│   └── mockData.js       # libros de prueba (punto 2)
├── components/
│   ├── TopBar.jsx        # barra superior con logo y avatar
│   ├── BookForm.jsx      # formulario para crear un libro (punto 3)
│   └── BookStack.jsx     # lista de tarjetas, del tope a la base (punto 4)
├── pages/
│   └── BookStackPage.jsx # pantalla que crea la pila y conecta todo
└── App.jsx
```

La pila está implementada desde cero sobre un arreglo, siguiendo la convención de métodos vista en clase: `push`, `pop`, `peek`, `isEmpty`, `size` y `print`. El final del arreglo es el tope; `print()` retorna los elementos del tope hacia la base para pintarlos en pantalla.

### Validaciones del formulario

- Los cuatro campos son obligatorios.
- El ISBN-13 debe tener 13 dígitos (se permiten guiones).
- No se puede apilar un libro con un ISBN que ya esté en la pila.

### Interfaz

Basada en el diseño de Figma del challenge: paleta teal claro, tipografía **Roboto** (incluida con `@fontsource/roboto`, así que funciona sin internet) y diseño responsive (en celular el formulario queda arriba y la pila abajo).

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
