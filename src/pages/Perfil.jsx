export default function Perfil() {
  return (
    <div className="profile">
      <span className="profile__avatar" aria-hidden="true">LG</span>
      <dl className="facts">
        <div><dt>Nombre</dt><dd>Laura Gómez</dd></div>
        <div><dt>Usuario</dt><dd>@lauragomez</dd></div>
        <div><dt>Correo</dt><dd>laura.gomez@correo.com</dd></div>
        <div><dt>Ciudad</dt><dd>Cali, Colombia</dd></div>
      </dl>
    </div>
  );
}
