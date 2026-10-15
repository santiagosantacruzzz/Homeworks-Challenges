import { useCallback, useMemo, useState } from "react";
import ArbolContext from "./ArbolContext";
import useSesion from "../hooks/useSesion";
import useColeccionFirestore from "../hooks/useColeccionFirestore";
import ArbolNario, { ID_RAIZ } from "../tree/ArbolNario";

const COLECCION = "elementos";
const exito = (extra) => ({ ok: true, ...extra });
const falla = (mensaje) => ({ ok: false, mensaje });

const validarNombre = (nombre) => {
  if (!nombre) return "Escribe un nombre.";
  if (nombre.length > 60) return "Usa un nombre de máximo 60 caracteres.";
  if (/[\\/]/.test(nombre)) return "El nombre no puede llevar / ni \\.";
  return null;
};

export default function ArbolProvider({ children }) {
  const { usuario } = useSesion();
  const { documentos, cargando, error, crear, actualizar, eliminarVarios } =
    useColeccionFirestore(COLECCION, !!usuario);

  const [idSeleccionado, setIdSeleccionado] = useState(ID_RAIZ);
  const [abiertos, setAbiertos] = useState(() => new Set([ID_RAIZ]));

  // El árbol n-ario se reconstruye con cada cambio que llega de Firestore
  const arbol = useMemo(() => ArbolNario.desdeDocumentos(documentos), [documentos]);
  const seleccionado = arbol.buscar(idSeleccionado) ?? arbol.raiz;

  const abrirCamino = useCallback(
    (id) =>
      setAbiertos((prev) => {
        const sig = new Set(prev);
        arbol.camino(id).forEach((n) => n.esCarpeta && sig.add(n.id));
        return sig;
      }),
    [arbol]
  );

  const seleccionar = useCallback(
    (id) => {
      setIdSeleccionado(id);
      const nodo = arbol.buscar(id);
      if (nodo?.padre) abrirCamino(nodo.padre.id);
    },
    [arbol, abrirCamino]
  );

  const alternar = useCallback((id) => {
    setAbiertos((prev) => {
      const sig = new Set(prev);
      if (sig.has(id)) sig.delete(id);
      else sig.add(id);
      return sig;
    });
  }, []);

  const esDelUsuario = (nodo) => !!usuario && nodo.autorEmail === usuario.email;

  /** Crea una carpeta o archivo dentro del nodo seleccionado. */
  const crearElemento = async ({ nombre, tipo }) => {
    if (!usuario) return falla("Inicia sesión para crear carpetas o archivos.");
    const limpio = nombre.trim();
    const destino = seleccionado;

    const problema = validarNombre(limpio);
    if (problema) return falla(problema);
    if (destino.esArchivo) return falla(`"${destino.nombre}" es un archivo: no puede tener hijos.`);
    if (destino.hijoConNombre(limpio)) return falla(`Ya existe "${limpio}" en "${destino.nombre}".`);

    const id = await crear({
      nombre: limpio,
      tipo,
      padre: destino.id,
      profundidad: destino.profundidad + 1,
      autorEmail: usuario.email, // dato validador
      autorUid: usuario.uid,
    });
    if (!id) return falla("Firebase no aceptó el cambio. Revisa tu conexión.");

    abrirCamino(destino.id);
    return exito({ id });
  };

  const renombrar = async (nodo, nombre) => {
    const limpio = nombre.trim();
    if (!esDelUsuario(nodo)) return falla(`Solo ${nodo.autorEmail} puede renombrarlo.`);
    const problema = validarNombre(limpio);
    if (problema) return falla(problema);
    const repetido = nodo.padre.hijoConNombre(limpio);
    if (repetido && repetido !== nodo) return falla(`Ya existe "${limpio}" en esta carpeta.`);

    return (await actualizar(nodo.id, { nombre: limpio }))
      ? exito()
      : falla("No se pudo renombrar.");
  };

  /** Elimina el nodo y toda su rama (postorden: hijos antes que el padre). */
  const eliminar = async (nodo) => {
    if (!esDelUsuario(nodo)) return falla(`Solo ${nodo.autorEmail} puede eliminarlo.`);
    const ajenos = arbol.autoresAjenos(nodo.id, usuario.email);
    if (ajenos.length)
      return falla(`Dentro hay ${ajenos.length} elemento(s) de otras personas; no se puede eliminar.`);

    const ids = arbol.postorden(nodo).map((n) => n.id);
    const idPadre = nodo.padre.id;
    if (!(await eliminarVarios(ids))) return falla("No se pudo eliminar.");
    setIdSeleccionado(idPadre);
    return exito({ cantidad: ids.length });
  };

  return (
    <ArbolContext.Provider
      value={{
        arbol,
        seleccionado,
        seleccionar,
        abiertos,
        alternar,
        cargando,
        error,
        esDelUsuario,
        crearElemento,
        renombrar,
        eliminar,
      }}
    >
      {children}
    </ArbolContext.Provider>
  );
}
