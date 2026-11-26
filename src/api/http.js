/**
 * Cliente HTTP reutilizable con fetch (Clase 13).
 * Centraliza en un solo lugar: URL base, headers, query params,
 * timeout, cancelación y manejo de errores.
 *
 * Recordatorio de la clase: fetch NO lanza error con 404 o 500,
 * solo con fallas de red. Por eso siempre se revisa res.ok.
 */
export class HttpError extends Error {
  constructor(status, statusText, url) {
    super(`HTTP ${status} ${statusText}`);
    this.name = "HttpError";
    this.status = status;
    this.url = url;
  }
}

export function crearCliente({ baseURL = "", headers = {}, timeout = 8000 } = {}) {
  async function request(ruta, { params, signal, method = "GET", body, ...opciones } = {}) {
    const url = new URL(ruta, baseURL || window.location.origin);
    if (params) {
      url.search = new URLSearchParams(params).toString();
    }

    // Se cancela si el componente se desmonta (signal) o si pasa el timeout
    const señales = [AbortSignal.timeout(timeout)];
    if (signal) señales.push(signal);

    const res = await fetch(url, {
      method,
      headers: {
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.any(señales),
      ...opciones,
    });

    if (!res.ok) {
      throw new HttpError(res.status, res.statusText, url.toString());
    }

    const tipo = res.headers.get("content-type") ?? "";
    // iTunes responde JSON con content-type text/javascript
    return tipo.includes("json") || tipo.includes("javascript") ? res.json() : res.text();
  }

  return {
    get: (ruta, opciones) => request(ruta, { ...opciones, method: "GET" }),
    post: (ruta, body, opciones) => request(ruta, { ...opciones, method: "POST", body }),
    put: (ruta, body, opciones) => request(ruta, { ...opciones, method: "PUT", body }),
    patch: (ruta, body, opciones) => request(ruta, { ...opciones, method: "PATCH", body }),
    delete: (ruta, opciones) => request(ruta, { ...opciones, method: "DELETE" }),
  };
}

// Cliente sin URL base, para pasarle URLs completas (lo usa useFetch)
export const http = crearCliente();
