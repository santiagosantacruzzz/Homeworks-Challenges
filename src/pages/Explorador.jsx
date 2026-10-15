import { useState } from "react";
import useArbol from "../hooks/useArbol";
import useSesion from "../hooks/useSesion";
import DiagramaArbol from "../components/DiagramaArbol";
import Inspector from "../components/Inspector";
import Migas from "../components/Migas";
import Consulta from "../components/Consulta";
import { resolverConsulta } from "../utils/consulta";

export default function Explorador() {
  const { usuario, salir } = useSesion();
  const { arbol, seleccionado, cargando, error } = useArbol();
  const { carpetas, archivos } = arbol.estadisticas();
  const [consulta, setConsulta] = useState({ texto: "", autor: "" });

  // Consulta sobre el árbol guardado: por nombre y/o por correo del creador
  const resultados = resolverConsulta(arbol, consulta, usuario.email);

  return (
    <div className="explorador">
      <header className="barra">
        <span className="barra__marca">Ramas</span>
        <Migas />
        <p className="barra__cifras">
          <span><b>{carpetas}</b> {carpetas === 1 ? "carpeta" : "carpetas"}</span>
          <span><b>{archivos}</b> {archivos === 1 ? "archivo" : "archivos"}</span>
          <span>altura <b>{arbol.altura()}</b></span>
        </p>
        <div className="barra__usuario">
          <span title={usuario.email}>{usuario.email}</span>
          <button className="boton boton--chico" onClick={salir}>Cerrar sesión</button>
        </div>
      </header>

      <main className="explorador__cuerpo">
        <section className="explorador__diagrama" aria-busy={cargando}>
          {!arbol.raiz.esHoja && (
            <Consulta consulta={consulta} onCambio={setConsulta} resultados={resultados} />
          )}
          <div className="explorador__lienzo">
            {error && <p className="aviso aviso--flotante">Firestore respondió: {error}</p>}
            {!cargando && arbol.raiz.esHoja && (
              <p className="vacio">
                El árbol está vacío. Usa el panel de la derecha para crear tu primera carpeta.
              </p>
            )}
            <DiagramaArbol resaltados={resultados && new Set(resultados.map((n) => n.id))} />
          </div>
        </section>
        <Inspector key={seleccionado.id} />
      </main>
    </div>
  );
}
