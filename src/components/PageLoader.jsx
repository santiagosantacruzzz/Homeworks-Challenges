import Spinner from "react-bootstrap/Spinner";

export default function PageLoader({ label = "Cargando…" }) {
  return (
    <div className="page-loader" role="status">
      <Spinner animation="border" variant="primary" />
      <span>{label}</span>
    </div>
  );
}
