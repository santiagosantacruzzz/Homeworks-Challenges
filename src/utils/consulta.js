export const MIOS = "__mios";

/**
 * Nodos del árbol que cumplen la consulta (por nombre y/o por correo del creador).
 * Devuelve null cuando no hay ninguna consulta activa.
 */
export function resolverConsulta(arbol, { texto, autor }, correoUsuario) {
  if (!texto.trim() && !autor) return null;
  const porAutor = autor ? arbol.creadosPor(autor === MIOS ? correoUsuario : autor) : null;
  const porNombre = texto.trim() ? arbol.buscarPorNombre(texto) : null;
  if (porAutor && porNombre) return porNombre.filter((n) => porAutor.includes(n));
  return porNombre ?? porAutor;
}
