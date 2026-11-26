import { useCatalogo } from "../hooks/useCatalogo";

export default function Teletipo() {
  const { eventos, simularTendencia, fuente } = useCatalogo();

  return (
    <div className="teletipo" role="status" aria-live="polite">
      <span className="teletipo__rotulo">Última hora</span>
      <p className="teletipo__texto">
        {eventos[0] ? (
          <>
            <time>{eventos[0].hora.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</time>{" "}
            {eventos[0].texto}
          </>
        ) : fuente === "supabase" ? (
          "Escuchando cambios de la base de datos en tiempo real…"
        ) : (
          "Sin novedades. Reproduce una canción o simula una tendencia para mover el ranking."
        )}
      </p>
      <button type="button" className="boton boton--tinta" onClick={simularTendencia}>
        Simular tendencia
      </button>
    </div>
  );
}
