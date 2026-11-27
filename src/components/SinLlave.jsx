export default function SinLlave() {
  return (
    <main className="sin-llave">
      <div className="sin-llave__tarjeta">
        <span className="logo__sticker logo__sticker--grande">pe</span>
        <h1>Falta la API key de GIPHY</h1>
        <ol>
          <li>
            Crea una app en <a href="https://developers.giphy.com/dashboard/" target="_blank" rel="noreferrer">developers.giphy.com</a>.
          </li>
          <li>
            Copia <code>.env.example</code> como <code>.env</code> en la raíz del proyecto.
          </li>
          <li>
            Pega la llave en <code>VITE_GIPHY_KEY=</code> y reinicia <code>npm run dev</code>.
          </li>
        </ol>
      </div>
    </main>
  );
}
