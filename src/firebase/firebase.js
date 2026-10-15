import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Proyecto Firebase "parcial2-ramas" (cuenta santiago.santacruz@uao.edu.co), app web "ramas-web"
const firebaseConfig = {
  apiKey: "AIzaSyDBmDjrvnI2zIbft7SLEzKV-3p2F9UK_vk",
  authDomain: "parcial2-ramas.firebaseapp.com",
  projectId: "parcial2-ramas",
  storageBucket: "parcial2-ramas.firebasestorage.app",
  messagingSenderId: "304391362372",
  appId: "1:304391362372:web:f82e2106c74c132b81a911",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
