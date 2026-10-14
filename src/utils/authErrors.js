// Firebase responde con códigos de error en inglés (auth/...).
// Aquí se traducen a un mensaje que el usuario entienda y sepa cómo resolver.
const MESSAGES = {
  "auth/invalid-credential": "El correo o la contraseña no son correctos.",
  "auth/wrong-password": "El correo o la contraseña no son correctos.",
  "auth/user-not-found": "No hay una cuenta con ese correo. Regístrate primero.",
  "auth/invalid-email": "Ese correo no es válido.",
  "auth/email-already-in-use": "Ya existe una cuenta con ese correo. Inicia sesión.",
  "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
  "auth/too-many-requests": "Demasiados intentos seguidos. Espera un momento y vuelve a intentar.",
  "auth/network-request-failed": "No hay conexión con Firebase. Revisa tu internet.",
  "auth/operation-not-allowed":
    "El inicio de sesión con correo no está activado en Firebase (Authentication → Sign-in method).",
  "auth/configuration-not-found":
    "Authentication no está activado en tu proyecto de Firebase.",
};

export function authErrorMessage(error) {
  return MESSAGES[error?.code] ?? "No se pudo completar. Intenta de nuevo.";
}
