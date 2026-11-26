import { crearCliente } from "./http";

/**
 * API pública de búsqueda de iTunes (no necesita llave).
 * Se usa solo para decorar: carátula y una muestra de 30 segundos.
 * Si falla, la app sigue funcionando con la portada tipográfica.
 */
const itunes = crearCliente({ baseURL: "https://itunes.apple.com", timeout: 6000 });

// Caché en memoria: cada canción se consulta una sola vez por sesión
const cache = new Map();

export function urlBusqueda({ titulo, artista }) {
  const params = new URLSearchParams({
    term: `${titulo} ${artista}`,
    media: "music",
    entity: "song",
    limit: "1",
  });
  return `https://itunes.apple.com/search?${params}`;
}

function aDetalle(json) {
  const r = json?.results?.[0];
  if (!r) return null;
  return {
    caratula: r.artworkUrl100?.replace("100x100bb", "300x300bb") ?? null,
    muestra: r.previewUrl ?? null,
    album: r.collectionName ?? null,
    enlace: r.trackViewUrl ?? null,
  };
}

export async function buscarDetalle(cancion, { signal } = {}) {
  if (cache.has(cancion.id)) return cache.get(cancion.id);

  const json = await itunes.get("/search", {
    signal,
    params: {
      term: `${cancion.titulo} ${cancion.artista}`,
      media: "music",
      entity: "song",
      limit: "1",
    },
  });
  const detalle = aDetalle(json);
  cache.set(cancion.id, detalle);
  return detalle;
}


export { aDetalle };
