import { giphy } from "../api/giphy";

export const POR_PAGINA = 24;

/** Deja solo lo que la interfaz necesita de cada GIF. */
function aGif(g) {
  const chico = g.images?.fixed_width ?? {};
  const grande = g.images?.original ?? chico;
  return {
    id: g.id,
    titulo: (g.title || "GIF sin título").replace(/\s+GIF.*$/i, "").trim() || "GIF",
    usuario: g.user?.display_name || g.username || null,
    ancho: Number(chico.width) || 200,
    alto: Number(chico.height) || 200,
    miniatura: chico.webp || chico.url,
    grande: grande.webp || grande.url,
    enlace: g.url,
    fuente: g.source_tld || null,
  };
}

const aPagina = (r) => ({
  gifs: r.data.map(aGif),
  total: r.pagination?.total_count ?? r.data.length,
  offset: r.pagination?.offset ?? 0,
});

/** Search API: GET /gifs/search?q=…&limit=…&offset=… */
export async function buscarGifs(q, offset = 0, signal) {
  const r = await giphy.get("/gifs/search", { params: { q, limit: POR_PAGINA, offset }, signal });
  return aPagina(r);
}

/** GIFs en tendencia (pantalla de inicio). */
export async function gifsTendencia(offset = 0, signal) {
  const r = await giphy.get("/gifs/trending", { params: { limit: POR_PAGINA, offset }, signal });
  return aPagina(r);
}

/** Términos que más se están buscando. */
export async function busquedasTendencia(signal) {
  const r = await giphy.get("/trending/searches", { signal });
  return r.data.slice(0, 10);
}

/** Categorías de GIPHY (solo los nombres). */
export async function categorias(signal) {
  const r = await giphy.get("/gifs/categories", { signal });
  return r.data.map((c) => c.name).slice(0, 10);
}
