import { Nodo } from "../dataStructures/Nodo";
import { ArbolNario } from "../dataStructures/ArbolNario";
import { MenuItem } from "../models/MenuItem";
import Inicio from "../pages/Inicio";
import Perfil from "../pages/Perfil";
import Mensajes from "../pages/Mensajes";
import SeccionIndice from "../pages/SeccionIndice";
import Cuenta from "../pages/Cuenta";
import PerfilPublico from "../pages/PerfilPublico";
import Contrasena from "../pages/Contrasena";
import DosPasos from "../pages/DosPasos";
import Sesiones from "../pages/Sesiones";
import Notificaciones from "../pages/Notificaciones";
import PreguntasFrecuentes from "../pages/PreguntasFrecuentes";
import EnviarTicket from "../pages/EnviarTicket";
import EstadoServicio from "../pages/EstadoServicio";
import MapaMenu from "../pages/MapaMenu";

// Crea un nodo del árbol cuyo valor es un ítem de menú (title, link, component).
const item = (title, link, component) => new Nodo(new MenuItem(title, link, component));

// ── Se llena el árbol N-ario con los menús y submenús ──
const raiz = item("Inicio", "/", Inicio);

raiz.agregarHijo(item("Perfil", "/perfil", Perfil));
raiz.agregarHijo(item("Mensajes", "/mensajes", Mensajes));

const configuracion = raiz.agregarHijo(item("Configuración", "/configuracion", SeccionIndice));
configuracion.agregarHijo(item("Cuenta", "/configuracion/cuenta", Cuenta));
configuracion.agregarHijo(item("Perfil público", "/configuracion/perfil", PerfilPublico));

const seguridad = configuracion.agregarHijo(
  item("Seguridad y privacidad", "/configuracion/seguridad", SeccionIndice)
);
seguridad.agregarHijo(item("Contraseña", "/configuracion/seguridad/contrasena", Contrasena));
seguridad.agregarHijo(
  item("Verificación en dos pasos", "/configuracion/seguridad/dos-pasos", DosPasos)
);
seguridad.agregarHijo(item("Sesiones activas", "/configuracion/seguridad/sesiones", Sesiones));

configuracion.agregarHijo(
  item("Notificaciones", "/configuracion/notificaciones", Notificaciones)
);

const ayuda = raiz.agregarHijo(item("Ayuda", "/ayuda", SeccionIndice));
ayuda.agregarHijo(item("Preguntas frecuentes", "/ayuda/preguntas", PreguntasFrecuentes));
ayuda.agregarHijo(item("Enviar un ticket", "/ayuda/ticket", EnviarTicket));
ayuda.agregarHijo(item("Estado del servicio", "/ayuda/estado", EstadoServicio));

raiz.agregarHijo(item("Mapa del menú", "/mapa", MapaMenu));

export const arbolMenu = new ArbolNario(raiz);
