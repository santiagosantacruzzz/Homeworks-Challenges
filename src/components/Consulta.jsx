import useArbol from "../hooks/useArbol";
import useSesion from "../hooks/useSesion";
import { IconoNodo } from "./Icono";
import { MIOS, resolverConsulta } from "../utils/consulta";

export default function Consulta({ consulta, onCambio, resultados }) {
  const { arbol, seleccionar, mostrarNodos } = useArbol();
  const { usuario } = useSesion();
  const otros = arbol.autores().filter((c) => c !== usuario.email);

  const cambiar = (campo) => (e) => {
    const nueva = { ...consulta, [campo]: e.target.value };
    onCambio(nueva);
    // Abre las carpetas para que las coincidencias se vean en el diagrama
    const encontrados = resolverConsulta(arbol, nueva, usuario.email);
    if (encontrados) mostrarNodos(encontrados);
  };

  return (
    <div className="consulta">
      <div className="consulta__campos" role="search">
        <input
          className="campo"
          type="search"
          placeholder="Buscar por nombre"
          value={consulta.texto}
          onChange={cambiar("texto")}
          aria-label="Buscar por nombre"
        />
        <select
          className="campo"
          value={consulta.autor}
          onChange={cambiar("autor")}
          aria-label="Filtrar por quién lo creó"
        >
          <option value="">Creado por cualquiera</option>
          <option value={MIOS}>Creado por mí</option>
          {otros.map((c) => (
            <option key={c} value={c}>
              Creado por {c}
            </option>
          ))}
        </select>
      </div>

      {resultados && (
        <div className="consulta__resultados" aria-live="polite">
          <div className="consulta__cabeza">
            <span>
              {resultados.length === 0
                ? "Nada coincide con la consulta"
                : `${resultados.length} ${resultados.length === 1 ? "coincidencia" : "coincidencias"}`}
            </span>
            <button type="button" onClick={() => onCambio({ texto: "", autor: "" })}>
              Limpiar
            </button>
          </div>
          <ul>
            {resultados.slice(0, 8).map((n) => (
              <li key={n.id}>
                <button type="button" onClick={() => seleccionar(n.id)}>
                  <IconoNodo nodo={n} />
                  <span className="consulta__nombre">{n.nombre}</span>
                  <span className="consulta__ruta">{arbol.ruta(n.id)}</span>
                </button>
              </li>
            ))}
          </ul>
          {resultados.length > 8 && (
            <p className="consulta__mas">Y {resultados.length - 8} más resaltados en el árbol.</p>
          )}
        </div>
      )}
    </div>
  );
}
