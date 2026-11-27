import { hayConexion } from "./lib/supabase";
import { useSesion } from "./hooks/useSesion";
import Acceso from "./components/Acceso";
import Torre from "./components/Torre";
import Paletas from "./components/Paletas";

export default function App() {
  if (!hayConexion) return <SinConexion />;
  return <ConSupabase />;
}

function ConSupabase() {
  const sesion = useSesion();

  if (sesion === undefined) {
    return (
      <main className="pantalla-centro">
        <Paletas texto="CARGANDO" />
      </main>
    );
  }
  return sesion ? <Torre key={sesion.user.id} usuario={sesion.user} /> : <Acceso />;
}

function SinConexion() {
  return (
    <main className="pantalla-centro">
      <div className="aviso">
        <Paletas texto="SIN RADAR" />
        <p>
          Falta el archivo <code>.env</code> en la raíz del proyecto. Cópialo desde <code>.env.example</code> con la{" "}
          <b>Project URL</b> y la <b>Publishable key</b> de Supabase (Project Settings → API Keys) y reinicia{" "}
          <code>npm run dev</code>.
        </p>
      </div>
    </main>
  );
}
