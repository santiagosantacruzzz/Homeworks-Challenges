import axios from "axios";

export const API_KEY = import.meta.env.VITE_GIPHY_KEY;
export const hayLlave = Boolean(API_KEY);

/**
 * Una instancia por backend (Clase 13, diapositiva 28).
 * Nunca se repite la URL base ni la api_key por todo el proyecto.
 */
export const giphy = axios.create({
  baseURL: "https://api.giphy.com/v1",
  timeout: 8000,
  headers: { Accept: "application/json" },
});

/* ─── Registro de peticiones (para la barra inferior) ──────────── */
const oyentes = new Set();
export function escucharPeticiones(fn) {
  oyentes.add(fn);
  return () => oyentes.delete(fn);
}
const avisar = (registro) => oyentes.forEach((fn) => fn(registro));

const rutaLegible = (config) => {
  const params = new URLSearchParams(config.params);
  params.delete("api_key"); // la llave no se muestra en pantalla
  const query = params.toString();
  return `${config.method.toUpperCase()} ${config.url}${query ? `?${query}` : ""}`;
};

/* ─── Interceptor de request: llave, idioma, rating y tiempo ─────── */
giphy.interceptors.request.use((config) => {
  config.params = { api_key: API_KEY, rating: "g", lang: "es", ...config.params };
  config.inicio = performance.now();
  return config;
});

/* ─── Interceptor de response: desempaca data, mide y traduce errores ─ */
const MENSAJES = {
  400: "La búsqueda no es válida.",
  401: "La API key no es válida. Revisa VITE_GIPHY_KEY en el .env.",
  403: "GIPHY rechazó la API key. Revisa que la app esté activa.",
  404: "No se encontró el recurso.",
  414: "La búsqueda es demasiado larga.",
  429: "Llegaste al límite de peticiones de la key (100 por hora en beta). Espera un rato.",
};

giphy.interceptors.response.use(
  (res) => {
    avisar({
      ruta: rutaLegible(res.config),
      status: res.status,
      ms: Math.round(performance.now() - res.config.inicio),
    });
    return res.data; // desempaca: los servicios reciben el JSON directo
  },
  (error) => {
    if (axios.isCancel(error)) return Promise.reject(error); // cancelada a propósito: no es error

    const status = error.response?.status;
    if (error.config) {
      avisar({
        ruta: rutaLegible(error.config),
        status: status ?? "ERR",
        ms: Math.round(performance.now() - error.config.inicio),
      });
    }

    let mensaje = MENSAJES[status];
    if (!mensaje && status >= 500) mensaje = "GIPHY tiene problemas en este momento. Intenta más tarde.";
    if (!mensaje && error.code === "ECONNABORTED") mensaje = "La petición tardó demasiado (timeout).";
    if (!mensaje && !error.response) mensaje = "Sin conexión con GIPHY. Revisa tu internet.";

    return Promise.reject(new Error(mensaje ?? error.message));
  }
);

export const esCancelacion = (e) => axios.isCancel(e) || e?.name === "CanceledError";
