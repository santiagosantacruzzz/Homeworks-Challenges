/**
 * Carátula de la canción. Si la API de iTunes devolvió imagen se usa;
 * si no, se dibuja una portada tipográfica con el color del género.
 */
export default function Portada({ cancion, detalle, tamano = "md" }) {
  const iniciales = cancion.titulo
    .split(/\s+/)
    .filter((p) => p.length > 2 || /^[A-ZÁÉÍÓÚÑ]/.test(p))
    .slice(0, 2)
    .map((p) => p[0])
    .join("");

  return (
    <div className={`portada portada--${tamano} genero--${cancion.genero}`} aria-hidden="true">
      {detalle?.caratula ? (
        <img src={detalle.caratula} alt="" loading="lazy" />
      ) : (
        <span className="portada__iniciales">{iniciales}</span>
      )}
    </div>
  );
}
