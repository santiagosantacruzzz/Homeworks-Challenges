import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

// Los datos del proyecto se copian de la consola de Firebase
// (Configuración del proyecto → Tus apps → SDK config) al archivo .env.local.
// Ver .env.example.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Si falta la configuración, la app muestra cómo completarla en vez de fallar.
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

let app = null;
let auth = null;
let db = null;

if (isFirebaseConfigured) {
  // Inicializar Firebase
  app = initializeApp(firebaseConfig);
  // Inicializar Firebase Auth (login / registro)
  auth = getAuth(app);
  // Inicializar Firestore (base de datos de las tareas)
  db = getFirestore(app);

  // Opcional: usar los emuladores locales de Firebase para probar sin tocar el proyecto real.
  if (import.meta.env.VITE_USE_FIREBASE_EMULATORS === "true") {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
    connectFirestoreEmulator(db, "127.0.0.1", 8080);
  }
}

export { app, auth, db };
