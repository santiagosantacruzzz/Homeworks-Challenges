// Se muestra solo si falta el archivo .env.local con los datos de Firebase.
export default function SetupFirebase() {
  return (
    <main className="app-container page page--narrow setup">
      <h1 className="page-head__title">Falta conectar Firebase</h1>
      <p>
        La app no encontró los datos de tu proyecto de Firebase. Para conectarla:
      </p>
      <ol>
        <li>
          En <a href="https://console.firebase.google.com/">console.firebase.google.com</a>, crea un
          proyecto y una app web.
        </li>
        <li>
          En Authentication, activa el método <strong>Correo electrónico/contraseña</strong>.
        </li>
        <li>En Firestore Database, crea la base de datos.</li>
        <li>
          Copia <code>.env.example</code> como <code>.env.local</code> y pega los valores de{" "}
          <code>firebaseConfig</code>.
        </li>
        <li>
          Detén y vuelve a ejecutar <code>npm run dev</code>.
        </li>
      </ol>
    </main>
  );
}
