# Parcial 2 — Ramas: carpetas y archivos en un árbol n-ario

Aplicación web en React que gestiona un sistema jerárquico de carpetas y archivos con un
**árbol n-ario implementado desde cero**, autenticación con **Firebase Auth** y persistencia
en **Cloud Firestore**. El árbol se dibuja en pantalla como un diagrama de nodos y ramas.

## Cómo cumple el enunciado

| Requisito | Implementación |
|---|---|
| Árbol n-ario desde cero | `src/tree/NodoArbol.js` (valor + lista de `hijos`, `agregarHijo`) y `src/tree/ArbolNario.js` (`buscar` DFS, `agregar`, `podar`, `dfs`, `bfs`, `postorden`, `altura`, `camino`, `estadisticas`, `desdeDocumentos`) |
| Login con Firebase | `src/hooks/useAutenticacion.js`: `signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `signOut` |
| Validar que el usuario esté registrado para crear | `RutaPrivada`, validación en `ArbolProvider.crearElemento` y reglas de Firestore (`firestore.rules`) |
| Registrar el árbol en base de datos y consultarlo a futuro | Colección `elementos`: cada documento guarda `nombre`, `tipo`, `padre`, `profundidad`, `autorEmail`, `autorUid`, `creadoEn`. `ArbolNario.desdeDocumentos` reconstruye el árbol, y `onSnapshot` lo mantiene sincronizado en tiempo real |
| Correo de quien creó como dato validador | Campo `autorEmail`; las reglas exigen que sea el correo de la sesión y solo ese correo puede renombrar o eliminar |
| Un archivo no puede tener hijos, una carpeta sí | `NodoArbol.agregarHijo` lanza un error en archivos, la interfaz bloquea la creación y las reglas verifican que el padre sea una carpeta |
| Presentación visual con SASS | `src/tree/disposicion.js` calcula la posición de cada nodo recorriendo el árbol; `src/styles/` usa variables, mapas, funciones, mixins, `@each` y nesting |

### Buenas prácticas
- Custom hooks para Firebase: `useAutenticacion`, `useColeccionFirestore` (CRUD genérico en tiempo real).
- Dos contextos: `SesionContext` (autenticación) y `ArbolContext` (datos del árbol).
- Rutas públicas y privadas con React Router.

## Firebase

Proyecto **parcial2-ramas**, ya configurado en `src/firebase/firebase.js`.
Las reglas publicadas están en `firestore.rules`.

## Ejecutar

```bash
npm install
npm run dev
```
