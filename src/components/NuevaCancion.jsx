import { useMemo, useState } from "react";
import { useCatalogo } from "../hooks/useCatalogo";
import { GENEROS } from "../data/mock";

const MAX_RELACIONADAS = 4;
const VACIO = { titulo: "", artista: "", genero: "pop-latino", anio: "" };

/**
 * Inserta una canción en las tres estructuras a la vez:
 * Trie (título), Max Heap (arranca en 0) y Grafo (nodo + aristas).
 * Las canciones relacionadas se buscan con el mismo Trie.
 */
export default function NuevaCancion() {
  const { catalogo, version, agregarCancion, fuente } = useCatalogo();
  const [datos, setDatos] = useState(VACIO);
  const [busqueda, setBusqueda] = useState("");
  const [relacionadas, setRelacionadas] = useState([]);
  const [estado, setEstado] = useState({ tipo: null, texto: "" });
  const [enviando, setEnviando] = useState(false);

  const cambiar = (e) => setDatos((d) => ({ ...d, [e.target.name]: e.target.value }));

  const opciones = useMemo(
    () =>
      busqueda.trim()
        ? catalogo.trie.searchTopK(busqueda, 6).filter((c) => !relacionadas.includes(c.id))
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [busqueda, relacionadas, version, catalogo]
  );

  const tituloRepetido = datos.titulo.trim() && catalogo.trie.search(datos.titulo);

  async function enviar(e) {
    e.preventDefault();
    const titulo = datos.titulo.trim();
    const artista = datos.artista.trim();
    if (!titulo || !artista) {
      setEstado({ tipo: "error", texto: "El título y el artista son obligatorios." });
      return;
    }
    setEnviando(true);
    try {
      const nueva = await agregarCancion(
        { titulo, artista, genero: datos.genero, anio: datos.anio ? Number(datos.anio) : null },
        relacionadas
      );
      setEstado({
        tipo: "ok",
        texto: `«${nueva.titulo}» quedó en el Trie, en el heap (0 reproducciones) y con ${relacionadas.length} arista(s) en el grafo.`,
      });
      setDatos(VACIO);
      setRelacionadas([]);
      setBusqueda("");
    } catch (error) {
      setEstado({ tipo: "error", texto: error.message });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="panel nueva" aria-labelledby="nueva-t">
      <header className="panel__cabeza">
        <h2 id="nueva-t" className="panel__titulo">
          <span className="panel__seccion">D</span> Agregar al repertorio
        </h2>
        <p className="panel__estructura">
          trie.insert · heap.push · grafo.addNode + addEdge
          {fuente === "ejemplo" && " · se guarda solo en esta sesión"}
        </p>
      </header>

      <form className="formulario" onSubmit={enviar} noValidate>
        <label className="campo campo--ancho">
          <span>Título</span>
          <input name="titulo" value={datos.titulo} onChange={cambiar} maxLength={80} required />
          {tituloRepetido && <small className="aviso">Ese título ya existe: quedará como otra versión.</small>}
        </label>
        <label className="campo">
          <span>Artista</span>
          <input name="artista" value={datos.artista} onChange={cambiar} maxLength={80} required />
        </label>
        <label className="campo">
          <span>Género</span>
          <select name="genero" value={datos.genero} onChange={cambiar}>
            {Object.entries(GENEROS).map(([clave, nombre]) => (
              <option key={clave} value={clave}>
                {nombre}
              </option>
            ))}
          </select>
        </label>
        <label className="campo campo--corto">
          <span>Año</span>
          <input name="anio" type="number" min="1000" max="2100" value={datos.anio} onChange={cambiar} />
        </label>

        <fieldset className="campo campo--ancho relacionadas">
          <legend>
            Canciones similares <small>({relacionadas.length}/{MAX_RELACIONADAS}) · serán sus aristas</small>
          </legend>
          <ul className="fichas">
            {relacionadas.map((id) => (
              <li key={id}>
                {catalogo.obtener(id)?.titulo}
                <button
                  type="button"
                  aria-label="Quitar"
                  onClick={() => setRelacionadas((r) => r.filter((x) => x !== id))}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
          {relacionadas.length < MAX_RELACIONADAS && (
            <>
              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Busca por el inicio del título…"
                aria-label="Buscar canción similar"
              />
              {opciones.length > 0 && (
                <ul className="opciones">
                  {opciones.map((c) => (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setRelacionadas((r) => [...r, c.id]);
                          setBusqueda("");
                        }}
                      >
                        {c.titulo} <small>{c.artista}</small>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </fieldset>

        <div className="formulario__pie">
          <button type="submit" className="boton boton--azul" disabled={enviando}>
            {enviando ? "Guardando…" : "Insertar canción"}
          </button>
          {estado.tipo && (
            <p className={`mensaje mensaje--${estado.tipo}`} role={estado.tipo === "error" ? "alert" : "status"}>
              {estado.texto}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
