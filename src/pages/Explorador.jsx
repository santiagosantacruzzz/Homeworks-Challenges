import useArbol from "../hooks/useArbol";
import useSesion from "../hooks/useSesion";
import DiagramaArbol from "../components/DiagramaArbol";
import Inspector from "../components/Inspector";
import Migas from "../components/Migas";

export default function Explorador() {
  const { usuario, salir } = useSesion();
  const { arbol, seleccionado, cargando, error } = useArbol();
  const { carpetas, archivos } = arbol.estadisticas();

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
          {error && <p className="aviso aviso--flotante">Firestore respondió: {error}</p>}
          {!cargando && arbol.raiz.esHoja && (
            <p className="vacio">
              El árbol está vacío. Usa el panel de la derecha para crear tu primera carpeta.
            </p>
          )}
          <DiagramaArbol />
        </section>
        <Inspector key={seleccionado.id} />
      </main>
    </div>
  );
}
