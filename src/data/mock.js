/**
 * Datos de ejemplo. Se usan cuando no hay .env de Supabase y también
 * son la semilla de supabase/schema.sql (mismo contenido).
 * Los títulos se escogieron para que compartan prefijos ("la", "c", "b", "he")
 * y así se note cómo el Trie reutiliza el camino.
 */
export const GENEROS = {
  salsa: "Salsa",
  "rock-es": "Rock en español",
  "pop-latino": "Pop latino",
  rock: "Rock clásico",
  jazz: "Jazz",
  clasica: "Clásica",
  bolero: "Bolero y folclor",
};

const c = (id, titulo, artista, genero, anio, reproducciones) => ({
  id: String(id),
  titulo,
  artista,
  genero,
  anio,
  reproducciones,
});

export const CANCIONES = [
  c(1, "La Vida es un Carnaval", "Celia Cruz", "salsa", 1998, 912400),
  c(2, "Cali Pachanguero", "Grupo Niche", "salsa", 1984, 874300),
  c(3, "Pedro Navaja", "Rubén Blades", "salsa", 1978, 655200),
  c(4, "Vivir mi Vida", "Marc Anthony", "salsa", 2013, 1203900),
  c(5, "Llorarás", "Oscar D'León", "salsa", 1975, 431800),
  c(6, "Rebelión", "Joe Arroyo", "salsa", 1986, 702100),
  c(7, "De Música Ligera", "Soda Stereo", "rock-es", 1990, 988600),
  c(8, "Persiana Americana", "Soda Stereo", "rock-es", 1986, 712900),
  c(9, "Lamento Boliviano", "Enanitos Verdes", "rock-es", 1994, 645700),
  c(10, "La Flaca", "Jarabe de Palo", "rock-es", 1996, 523400),
  c(11, "Labios Compartidos", "Maná", "rock-es", 2006, 598800),
  c(12, "La Camisa Negra", "Juanes", "pop-latino", 2004, 1065300),
  c(13, "Despacito", "Luis Fonsi", "pop-latino", 2017, 1498200),
  c(14, "Danza Kuduro", "Don Omar", "pop-latino", 2010, 1144700),
  c(15, "Tusa", "Karol G", "pop-latino", 2019, 1321500),
  c(16, "La Bicicleta", "Carlos Vives y Shakira", "pop-latino", 2016, 957200),
  c(17, "Hips Don't Lie", "Shakira", "pop-latino", 2006, 1187600),
  c(18, "Bachata Rosa", "Juan Luis Guerra", "pop-latino", 1990, 488900),
  c(19, "Suavemente", "Elvis Crespo", "pop-latino", 1998, 611300),
  c(20, "Bohemian Rhapsody", "Queen", "rock", 1975, 1376400),
  c(21, "Hotel California", "Eagles", "rock", 1976, 1012800),
  c(22, "Hey Jude", "The Beatles", "rock", 1968, 934500),
  c(23, "Let It Be", "The Beatles", "rock", 1970, 902300),
  c(24, "Imagine", "John Lennon", "rock", 1971, 1095100),
  c(25, "Billie Jean", "Michael Jackson", "rock", 1982, 1254800),
  c(26, "La Bamba", "Ritchie Valens", "rock", 1958, 566100),
  c(27, "Take Five", "Dave Brubeck Quartet", "jazz", 1959, 402700),
  c(28, "So What", "Miles Davis", "jazz", 1959, 356900),
  c(29, "Fly Me to the Moon", "Frank Sinatra", "jazz", 1964, 811200),
  c(30, "What a Wonderful World", "Louis Armstrong", "jazz", 1967, 968700),
  c(31, "Clair de Lune", "Claude Debussy", "clasica", 1905, 742600),
  c(32, "Para Elisa", "Ludwig van Beethoven", "clasica", 1810, 618300),
  c(33, "Canon en Re", "Johann Pachelbel", "clasica", 1680, 589400),
  c(34, "Las Cuatro Estaciones", "Antonio Vivaldi", "clasica", 1725, 677500),
  c(35, "Bésame Mucho", "Consuelo Velázquez", "bolero", 1940, 721900),
  c(36, "Gracias a la Vida", "Mercedes Sosa", "bolero", 1971, 503600),
];

/**
 * Aristas del grafo no dirigido: [idA, idB] = "estas dos canciones son similares".
 * Cada género forma un grupo y algunas aristas cruzan géneros (puentes),
 * para que las recomendaciones a 2 saltos descubran música nueva.
 */
export const RELACIONES = [
  // salsa
  [1, 2], [1, 4], [1, 6], [2, 3], [2, 6], [3, 5], [3, 6], [4, 5],
  // rock en español
  [7, 8], [7, 9], [8, 9], [9, 10], [10, 11], [7, 11],
  // pop latino
  [12, 16], [12, 13], [13, 14], [13, 15], [14, 17], [15, 17], [16, 17], [18, 19], [14, 19],
  // rock clásico
  [20, 21], [20, 22], [22, 23], [22, 24], [23, 24], [21, 25], [25, 20], [26, 21],
  // jazz
  [27, 28], [27, 29], [29, 30], [28, 30],
  // clásica
  [31, 32], [31, 33], [32, 34], [33, 34],
  // bolero y folclor
  [35, 36],
  // puentes entre géneros
  [12, 10], [12, 11], [16, 1], [18, 35], [19, 4], [26, 1], [24, 30],
  [29, 35], [31, 27], [36, 9], [25, 17], [7, 20], [33, 23],
].map(([a, b]) => [String(a), String(b)]);
