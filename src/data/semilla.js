import RedSocial from "../estructuras/RedSocial";

/** Datos de arranque para que el mapa no salga vacío. */
export function crearSemilla() {
  const red = new RedSocial();

  const cali = red.agregarCiudad("Cali");
  const bogota = red.agregarCiudad("Bogotá");
  const medellin = red.agregarCiudad("Medellín");
  const pasto = red.agregarCiudad("Pasto");
  const barranquilla = red.agregarCiudad("Barranquilla");

  const p = (nombre, edad, ciudad) => red.agregarPersona(nombre, edad, ciudad.id).id;

  const santiago = p("Santiago", 19, cali);
  const valentina = p("Valentina", 20, cali);
  const juan = p("Juan Pablo", 21, cali);
  const camila = p("Camila", 22, bogota);
  const andres = p("Andrés", 25, bogota);
  const mariana = p("Mariana", 19, medellin);
  const sebastian = p("Sebastián", 23, medellin);
  const daniela = p("Daniela", 20, pasto);
  const carlos = p("Carlos", 27, barranquilla);
  const laura = p("Laura", 24, barranquilla);

  const amigos = [
    [santiago, valentina],
    [santiago, juan],
    [santiago, daniela],
    [valentina, mariana],
    [juan, camila],
    [camila, andres],
    [andres, carlos],
    [mariana, sebastian],
    [sebastian, laura],
    [daniela, juan],
    [carlos, laura],
  ];
  amigos.forEach(([a, b]) => red.hacerAmigos(a, b));

  return red;
}
