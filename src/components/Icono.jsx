export function IconoCarpeta(props) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="ico ico--carpeta" {...props}>
      <path d="M2.5 5.2c0-.9.7-1.7 1.7-1.7h3.6l1.7 1.9h6.3c.9 0 1.7.7 1.7 1.7v7.7c0 .9-.8 1.7-1.7 1.7H4.2c-1 0-1.7-.8-1.7-1.7z" />
    </svg>
  );
}

export function IconoArchivo(props) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="ico ico--archivo" {...props}>
      <path d="M5.2 2.5h6.2l4.1 4.1v9.2c0 .9-.7 1.7-1.7 1.7H5.2c-.9 0-1.7-.8-1.7-1.7V4.2c0-.9.8-1.7 1.7-1.7z" />
      <path d="M11.2 2.7v3.6c0 .4.3.7.7.7h3.5" />
    </svg>
  );
}

export function IconoNodo({ nodo }) {
  return nodo.esCarpeta ? <IconoCarpeta /> : <IconoArchivo />;
}
