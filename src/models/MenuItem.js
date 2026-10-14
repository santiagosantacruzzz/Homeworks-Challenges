// Cada ítem del menú tiene un título, un link (ruta) y el componente que se muestra al abrirlo.
export class MenuItem {
  constructor(title, link, component) {
    this.title = title;
    this.link = link;
    this.component = component;
  }
}
