# Challenge 06 — Login, Context API y rutas privadas

Proyecto en React que resuelve el Challenge 06 de Estructuras de Datos II:

1. **Página de login de prueba** con correo, contraseña y botón para iniciar sesión.
2. **Validación del usuario de prueba**: solo entra `user@mail.com` con la contraseña `123`.
3. **Context, Providers y estados**: la sesión se maneja con `AuthContext` + `AuthProvider` y el custom hook `useAuth`, como en la clase.
4. **Dos páginas privadas**, una por cada ejercicio del challenge anterior:
   - `/pila`: Challenge 04, pila de libros.
   - `/cajero`: Challenge 05, fila del cajero.
5. **Prueba de rutas privadas**: sin sesión, cualquier página privada redirige al login. Al cerrar sesión, vuelven a quedar bloqueadas.
6. **Usuario actual en pantalla**: el encabezado de las páginas privadas muestra el usuario con sesión iniciada y el botón para cerrar sesión.

## Rutas

| Ruta      | Tipo    | Qué muestra                                    |
|-----------|---------|------------------------------------------------|
| `/login`  | Pública | Login. Si ya hay sesión, redirige a `/pila`.   |
| `/`       | Privada | Redirige a `/pila`.                            |
| `/pila`   | Privada | Challenge 04: pila de libros.                  |
| `/cajero` | Privada | Challenge 05: fila del cajero.                 |
| `/*`      | Pública | Página 404.                                    |

```jsx
<Routes>
  {/* Rutas públicas */}
  <Route path="/login" element={<Login />} />

  {/* Rutas privadas */}
  <Route element={<PrivateRoute />}>
    <Route element={<PrivateLayout />}>
      <Route path="/" element={<Navigate to="/pila" replace />} />
      <Route path="/pila" element={<BookStackPage />} />
      <Route path="/cajero" element={<AtmQueuePage />} />
    </Route>
  </Route>

  {/* 404 */}
  <Route path="/*" element={<NotFound />} />
</Routes>
```

## Cómo funciona la sesión

1. **Crear el contexto**: `context/AuthContext.js` crea `AuthContext` con `createContext`.
2. **Provider**: `context/AuthProvider.jsx` usa el custom hook `useAuth` y comparte `user`, `login` y `logout`.
3. **Envolver la app**: en `main.jsx`, toda la app queda dentro de `<AuthProvider>`.
4. **Consumir el contexto**: `Login`, `PrivateRoute` y `PrivateLayout` usan `useContext(AuthContext)`.

`useAuth` guarda el usuario en `localStorage`, así la sesión sigue activa si se recarga la página. A diferencia del ejemplo de clase, el usuario guardado se lee en el `useState` y no en un `useEffect`. Si se leyera en el `useEffect`, al recargar en `/pila` el primer render tendría `user = null` y `PrivateRoute` mandaría al login aunque sí hubiera sesión.

Al iniciar y al cerrar sesión se navega con `useNavigate(..., { replace: true })`, así el botón "Atrás" del navegador no regresa al login ni a una página privada. Si alguien intenta entrar a `/cajero` sin sesión, después de iniciar sesión vuelve a `/cajero`.

## Las estructuras de datos también van en un Context

La pila (`Stack`) y la cola (`AtmQueue`) se crean una sola vez en `StructuresProvider`. Las páginas las toman con `useContext(StructuresContext)`. Así, al pasar de `/pila` a `/cajero` y volver, la pila y la cola conservan lo que se les agregó o sacó.

## Estructura del proyecto

```
src/
├── context/
│   ├── AuthContext.js          # createContext de la sesión
│   ├── AuthProvider.jsx        # Provider de la sesión (usa useAuth)
│   ├── StructuresContext.js    # createContext de la pila y la cola
│   └── StructuresProvider.jsx  # crea la pila y la cola con los datos de prueba
├── hooks/
│   └── useAuth.js              # custom hook: user, login, logout + localStorage
├── routes/
│   └── PrivateRoute.jsx        # sin sesión → /login; con sesión → <Outlet />
├── layouts/
│   └── PrivateLayout.jsx       # encabezado: navegación, usuario y cerrar sesión
├── pages/
│   ├── Login.jsx
│   ├── BookStackPage.jsx       # Challenge 04
│   ├── AtmQueuePage.jsx        # Challenge 05
│   └── NotFound.jsx
├── components/
│   ├── TileWord.jsx            # palabra armada con fichas (pila o cola)
│   ├── books/                  # componentes del Challenge 04
│   └── atm/                    # componentes del Challenge 05
├── dataStructures/             # Stack, Queue, AtmQueue
├── models/                     # Book, Person
├── data/                       # mockBooks, mockPeople
├── utils/                      # formato de dinero/fecha y hora aleatoria
└── styles/
    ├── app.css                 # login, encabezado y 404
    ├── books.css               # estilos del Challenge 04, limitados a .stack-app
    └── atm.css                 # estilos del Challenge 05, limitados a .atm-app
```

Los dos ejercicios tenían clases CSS con el mismo nombre (`.field`, `.btn`, `.content`…). Por eso cada hoja quedó limitada a su página (`.stack-app` y `.atm-app`) para que no se mezclen.

## Interfaz

El login, el encabezado y el 404 usan fichas: en el login, "PILAS" se apila en vertical (fichas lila, como una pila) y "COLAS" va en fila (fichas menta, como una cola). Al cargar, las fichas de la pila caen una sobre otra (push) y las de la cola entran en fila desde la derecha (enqueue). Fondo índigo y tipografía Bricolage Grotesque (incluida con `@fontsource`). Las dos páginas privadas conservan el diseño de su challenge.

## Cómo probarlo

1. Abre `http://localhost:5173/cajero` sin haber iniciado sesión: te manda al login.
2. Prueba un correo o una contraseña incorrectos: muestra el error y no entra.
3. Entra con `user@mail.com` / `123`: vuelve a `/cajero` y el encabezado muestra el usuario.
4. Pasa entre "Pila de libros" y "Fila del cajero" desde el encabezado.
5. Recarga la página: la sesión sigue activa.
6. Pulsa "Cerrar sesión": vuelve al login y `/pila` y `/cajero` quedan bloqueadas otra vez.

## Cómo ejecutarlo

```bash
npm install
npm run dev
```

> Se usa `react-router-dom` 7.18 en lugar de la 6 de la diapositiva: la 6 tiene avisos de seguridad que se corrigieron en la 7.18, y las funciones usadas (`BrowserRouter`, `Routes`, `Route`, `Navigate`, `Outlet`, `useNavigate`, `useLocation`) funcionan igual.

## Cómo compilarlo para producción

```bash
npm run build
npm run preview
```
