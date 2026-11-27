import { useRef, useState } from "react";
import { actualizarPerfil } from "../services/authService";
import { subirAvatar, urlAvatar } from "../services/avatarService";
import { iniciales } from "../utils/formato";

/** Foto de perfil guardada en el bucket "avatars" (Storage). */
export default function Pasaporte({ usuario }) {
  const meta = usuario.user_metadata ?? {};
  const [ruta, setRuta] = useState(meta.avatar_path ?? null);
  const [version, setVersion] = useState(meta.avatar_version ?? null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState(null);
  const entrada = useRef(null);

  const nombre = meta.nombre || usuario.email;
  const foto = urlAvatar(ruta, version);

  async function elegirFoto(e) {
    const archivo = e.target.files?.[0];
    e.target.value = "";
    if (!archivo) return;

    setSubiendo(true);
    setError(null);
    try {
      const nuevaRuta = await subirAvatar(usuario.id, archivo);
      const nuevaVersion = Date.now();
      await actualizarPerfil({ avatar_path: nuevaRuta, avatar_version: nuevaVersion });
      setRuta(nuevaRuta);
      setVersion(nuevaVersion);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubiendo(false);
    }
  }

  return (
    <div className="pasaporte">
      <button
        className={`pasaporte__foto ${subiendo ? "subiendo" : ""}`}
        onClick={() => entrada.current?.click()}
        title="Cambiar foto"
        disabled={subiendo}
      >
        {foto ? <img src={foto} alt={`Foto de ${nombre}`} /> : <span>{iniciales(nombre)}</span>}
        <i>{subiendo ? "…" : "Cambiar"}</i>
      </button>
      <input ref={entrada} type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden onChange={elegirFoto} />
      <div className="pasaporte__datos">
        <small>Pasajero</small>
        <b>{nombre}</b>
        {error && <em>{error}</em>}
      </div>
    </div>
  );
}
