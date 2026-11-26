# Parcial 3 — Repertorio: Trie, Max Heap y grafo

Mini plataforma de música educativa hecha en React + Vite. Tiene tres partes:

- un **buscador predictivo** con un Trie,
- un **TOP de canciones** con un Max Heap,
- **recomendaciones** con un grafo no dirigido.

Todo se muestra en un **panel con Sass** con forma de cartelera impresa. Los datos vienen de **Supabase** (Clase 10) y las carátulas de la **API de iTunes** (Clase 13).

## Cómo cumple el enunciado

| Requisito | Implementación |
|---|---|
| **Trie:** insertar canciones | `src/estructuras/Trie.js` → `insert(word, cancion)`. Usa el `Node` de la clase: `value`, `isEndOfWord` y `children`. Parte el título en letras, crea los nodos que falten y marca el último. |
| **Trie:** buscar si existe | `search(word)` sigue las letras desde la raíz. Devuelve `true` solo si llega al final del camino y ese nodo tiene `isEndOfWord`. En pantalla se ve `search("…") → true/false`. |
| **Trie:** sugerencias por prefijo | `sugerencias(prefijo)` baja hasta el nodo del prefijo y hace un DFS para juntar los títulos. `camino(prefijo)` dibuja letra por letra hasta dónde llegó la búsqueda (✕ = el camino se corta). |
| **Max Heap:** TOP canciones | `src/estructuras/MaxHeap.js` usa los métodos de la clase: `push`, `pop`, `peek`, `heapify`, `percolateDown`, `percolateUp`, `swap`, `size` y `toArray`. El criterio es más reproducciones arriba. `topK(k)` hace K `pop` sobre una copia, así no daña el heap. `actualizar()` reacomoda una canción cuando suma reproducciones. |
| **Grafo no dirigido:** recomendaciones | `src/estructuras/Graph.js` tiene `nodes` + `adjList`, igual que la diapositiva. Métodos: `addNode`, `addEdge` (guarda la arista en los dos sentidos), `searchNode`, `printAdjacency`, `removeNode`, `isEmpty` y `print`. `recomendar()` hace un BFS de 2 niveles: primero los vecinos directos y luego los de 2 saltos, ordenados por vecinos en común. |
| **Panel visual con Sass** | `src/styles/`. Los **tokens** están en `abstracts/_tokens.scss` (colores, mapa `$generos`, escala tipográfica). Hay **funciones** (`rem`, `t`, `s`, `genero`, `diluir`), **mixins** (`desde`, `titular`, `dato`, `boton`, `barra`, `regla-doble`, `foco`) y **placeholders** con `@extend`. `base/_base.scss` usa `@each` para generar los colores por género. Todo entra por `@use` / `@forward`. |

### Extras de las clases

- **Challenge 12 (Trie + Heap):** el buscador ordena las sugerencias "por popularidad" con `trie.searchTopK(prefijo, k)`, que mete las coincidencias en un Max Heap y saca las K mejores.
- **Clase 10, Supabase:**
  - Tiene las tablas `canciones` y `relaciones` con **RLS**: cualquiera lee y agrega, pero las canciones nuevas arrancan en 0 reproducciones.
  - El contador solo cambia con la función `reproducir()`.
  - Con **Realtime** el ranking se reacomoda en vivo.
  - Hay un cliente único en `src/lib/supabase.js`.
- **Clase 13, API requests:**
  - `src/api/http.js` es un cliente `fetch` reutilizable: revisa `res.ok` y usa timeout con `AbortSignal`.
  - `useFetch` cancela la petición anterior con `AbortController`.
  - Las carátulas del TOP se piden con `Promise.allSettled`: si iTunes falla, se dibuja una portada tipográfica y el panel sigue funcionando.
  - Las consultas a Supabase se lanzan juntas con `Promise.all`.

## Complejidad

| Operación | Costo |
|---|---|
| `trie.insert` / `trie.search` | O(L), L = letras del título |
| `trie.sugerencias` | O(P + S), S = nodos del subárbol del prefijo |
| `heap.peek` | O(1) |
| `heap.push` / `heap.pop` | O(log n) |
| `heap.heapify` (carga inicial) | O(n) |
| TOP K | O(n + K log n) |
| `grafo.recomendar` | O(V + E) |

## Estructura

```
src/
├── estructuras/        Node, Trie, MaxHeap, Graph, Catalogo (une las tres), normalizar
├── data/mock.js        36 canciones y 53 relaciones de ejemplo
├── lib/supabase.js     cliente único
├── services/           consultas, inserciones, rpc y Realtime de Supabase
├── api/                cliente http (fetch) y API de iTunes
├── hooks/              useCatalogo, useFetch, useCaratulas
├── context/            CatalogoContext + CatalogoProvider
├── components/         Cabecera, Teletipo, Buscador, Ranking, VistaHeap,
│                       Recomendaciones, MapaGrafo, NuevaCancion, FichaTecnica, Portada
└── styles/             abstracts/ (tokens, funciones, mixins, placeholders), base/, componentes/
supabase/               schema.sql (tablas, RLS, función, Realtime) y semilla.sql
pruebas/                pruebas de las estructuras con node:test
```

## Cómo correrlo

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # pruebas de Trie, MaxHeap, Graph y Catalogo
```

Sin `.env`, la app usa los datos de ejemplo. Para conectarla a Supabase:

1. Crear el proyecto en supabase.com (región São Paulo).
2. En **SQL Editor**, ejecutar `supabase/schema.sql` y después `supabase/semilla.sql`.
3. Copiar `.env.example` como `.env` y poner la URL y la llave *publishable* (Project Settings → API Keys).
4. Reiniciar `npm run dev`. La cabecera debe decir **● En vivo · Supabase**.

Para probar Realtime se abren dos pestañas. Al reproducir o simular una tendencia en una, el ranking se reordena en la otra.

## Uso rápido

- Escribe en el buscador, por ejemplo `la`, `la b` o `lax`, para ver el camino del Trie, las letras que siguen y `search()`.
- **Ver el heap por dentro** muestra el arreglo y el árbol por niveles. Al pasar el cursor se marcan el padre y los hijos.
- **Simular tendencia** le suma reproducciones a una canción del TOP 16. El heap hace `percolateUp` y aparecen las flechas ▲ ▼.
- Haz clic en cualquier canción para ver sus recomendaciones en el mapa de anillos. El nivel 1 son los vecinos directos y el nivel 2 sus vecinos.
- **Agregar al repertorio** inserta la canción en el Trie, en el heap y en el grafo, con aristas hacia las canciones similares que elijas.
