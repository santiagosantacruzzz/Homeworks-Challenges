import { supabase } from "../lib/supabase";

const BUCKET = "avatars";
const TIPOS = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX_BYTES = 2 * 1024 * 1024;

/**
 * Sube la foto a avatars/<uid>/avatar.<ext>.
 * La primera carpeta es el uid: eso es lo que revisan las políticas de storage.objects.
 */
export async function subirAvatar(userId, archivo) {
  if (!TIPOS.includes(archivo.type)) throw new Error("Solo imágenes PNG, JPG, WEBP o GIF.");
  if (archivo.size > MAX_BYTES) throw new Error("La imagen pesa más de 2 MB.");

  const ext = archivo.name.split(".").pop().toLowerCase();
  const ruta = `${userId}/avatar.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(ruta, archivo, { upsert: true, contentType: archivo.type, cacheControl: "60" });
  if (error) throw error;
  return ruta;
}

/** URL pública del archivo (el bucket es público). `v` evita que el navegador muestre la foto vieja. */
export function urlAvatar(ruta, version) {
  if (!ruta) return null;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(ruta);
  return version ? `${data.publicUrl}?v=${version}` : data.publicUrl;
}

export async function borrarAvatar(ruta) {
  const { error } = await supabase.storage.from(BUCKET).remove([ruta]);
  if (error) throw error;
}
