/**
 * Catálogo: lo más escuchado en Spotify Colombia, semana del 19 de noviembre de 2026
 * (fuente: Spotify Charts vía soundcharts.com). `reproducciones` son los streams
 * semanales en Colombia de esa semana, redondeados como los publica el chart.
 * Se dejaron por fuera dos entradas: una sin artista identificado y una de título explícito.
 *
 * Se usan cuando no hay .env de Supabase y son también la semilla de supabase/semilla.sql.
 * Varios títulos comparten prefijo ("PARADIXE", "pa", "co", "s", "t", "e") y así
 * se ve cómo el Trie reutiliza el mismo camino.
 */
export const GENEROS = {
  urbano: "Urbano",
  plena: "Plena panameña",
  regional: "Regional mexicano",
  "reggaeton-clasico": "Reggaetón clásico",
  tropical: "Tropical",
  kpop: "K-pop",
};

const c = (id, titulo, artista, genero, reproducciones, anio = null) => ({
  id: String(id),
  titulo,
  artista,
  genero,
  anio,
  reproducciones,
});

export const CANCIONES = [
  c(1, "Peli De Terror", "Køddy G & THE FAVORITES & Fharid On the Beat", "plena", 2300000),
  c(2, "PARADIXE", "Feid", "urbano", 1900000),
  c(3, "CAPCANA COCOA", "Blessd & Anuel AA", "urbano", 1400000),
  c(4, "BbY WOW", "KAROL G & Judeline & rusowsky", "urbano", 1300000),
  c(5, "Happy Monday (W Sound 10)", "W Sound & Hades66 & Ovy On The Drums", "urbano", 1100000),
  c(6, "GALACTICOS", "Bigg Danny & El Americano 4KT & El Goldo", "urbano", 971000),
  c(7, "50 MIL PIEX", "Feid & Granuja", "urbano", 869000),
  c(8, "MERO TOTE", "Blessd & De La Rose & Los Money Makers", "urbano", 856000),
  c(9, "Te Imagino", "Myke Towers", "urbano", 851000),
  c(10, "GAMINA", "Kris R. & Los Money Makers", "urbano", 838000),
  c(11, "PARADIXE (REMIX)", "Feid & El Americano 4KT & Omar Courtz & Pirlo & Myke Towers", "urbano", 786000),
  c(12, "Hagalo", "Køddy G & COLVISION COMPANY & Pty Audio & Frvnz_la_F", "plena", 771000),
  c(13, "El Beneficio De La Duda", "Grupo Firme", "regional", 757000),
  c(14, "Todo Lo Fue", "Lenin Ramírez", "regional", 733000),
  c(15, "Lento", "Køddy G & THE FAVORITES & 1cewayz", "plena", 714000),
  c(16, "Cuando No Era Cantante RMX", "Yung Beef & Anuel AA & Fuerza Regida & El Bogueto", "urbano", 708000),
  c(17, "Solos", "Tony Dize & Plan B", "reggaeton-clasico", 702000),
  c(18, "SUPERSTAR", "Blessd & Los Money Makers", "urbano", 696000),
  c(19, "COQUETA", "Fuerza Regida & Grupo Frontera", "regional", 692000),
  c(20, "COMPA COLETO (uy_como)", "ARIA VEGA", "urbano", 692000),
  c(21, "Bachateo", "Køddy G & COLVISION COMPANY & Pty Audio & Frvnz_la_F", "plena", 678000),
  c(22, "SWIM", "BTS", "kpop", 673000),
  c(23, "Hace Mucho Tiempo", "Ele A El Dominio", "urbano", 647000),
  c(24, "Dichavate", "Ya Ice Dilan & Rey Tony & Helabusador & JipMusic Global & Dj Honda", "urbano", 645000),
  c(25, "Tu Boda", "Oscar Maydon & Fuerza Regida", "regional", 644000),
  c(26, "POR SI MAÑANA NO ESTOY", "Omar Courtz", "urbano", 609000),
  c(27, "Es un Secreto", "Plan B", "reggaeton-clasico", 605000),
  c(28, "Las Muñequitas", "Mr Plata & El Americano 4KT", "urbano", 603000),
  c(29, "Dame Hombro", "Bulin 47 & Kevin Wai & Breyco En Producidera", "urbano", 595000),
  c(30, "El Telefono", "Héctor \"El Father\" & Wisin & Yandel", "reggaeton-clasico", 590000),
  c(31, "Suzuki (from GTAVI: The Album)", "Fuerza Regida & Grand Theft Auto VI", "regional", 589000),
  c(32, "Tormentos", "Rodolfo Aicardi", "tropical", 586000),
  c(33, "TUKI TUKI", "Kris R. & GeezyDee", "urbano", 585000),
  c(34, "UNA BABY EN SANTIAGO", "Lil Naay", "urbano", 581000),
  c(35, "EXCESOS", "Fuerza Regida", "regional", 579000),
  c(36, "SORNERO", "Blessd", "urbano", 576000),
];

/**
 * Aristas del grafo no dirigido ("estas dos canciones son similares").
 * Regla para armarlas, en este orden:
 *   1. Comparten al menos un artista (Feid, Blessd, Køddy G, Fuerza Regida…).
 *   2. Son del mismo género y quedan seguidas en el chart (cadena por género).
 *   3. Unos pocos puentes entre géneros, puestos a mano.
 */
const artistas = (cancion) => cancion.artista.split(/\s*&\s*/).map((a) => a.toLowerCase());

const PUENTES = [
  [22, 4], // SWIM ↔ BbY WOW (los dos hits globales del momento)
  [1, 5], // Peli De Terror ↔ Happy Monday
  [30, 3], // El Telefono ↔ CAPCANA COCOA
  [32, 13], // Tormentos ↔ El Beneficio De La Duda
  [17, 9], // Solos ↔ Te Imagino
  [16, 25], // Cuando No Era Cantante RMX ↔ Tu Boda
];

function armarRelaciones(canciones) {
  const aristas = new Set();
  const agregar = (a, b) => {
    if (a === b) return;
    const [x, y] = [Number(a), Number(b)].sort((p, q) => p - q);
    aristas.add(`${x}-${y}`);
  };

  // 1. artista en común
  for (let i = 0; i < canciones.length; i++) {
    for (let j = i + 1; j < canciones.length; j++) {
      const ai = artistas(canciones[i]);
      if (artistas(canciones[j]).some((a) => ai.includes(a))) agregar(canciones[i].id, canciones[j].id);
    }
  }

  // 2. cadena por género, en orden del chart (cada una con la siguiente)
  const porGenero = {};
  for (const cancion of canciones) (porGenero[cancion.genero] ??= []).push(cancion.id);
  for (const ids of Object.values(porGenero)) {
    for (let i = 0; i + 1 < ids.length; i++) agregar(ids[i], ids[i + 1]);
  }

  // 3. puentes
  for (const [a, b] of PUENTES) agregar(a, b);

  return [...aristas].map((par) => par.split("-"));
}

export const RELACIONES = armarRelaciones(CANCIONES);
