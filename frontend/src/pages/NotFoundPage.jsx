import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <main className="page-container">
      <section className="card not-found">
        <p className="eyebrow">Error 404</p>
        <h1>Página no encontrada</h1>
        <p className="subtitle">
          La dirección que buscas no existe en esta aplicación.
        </p>
        <Link className="button dashboard-link" to="/">
          Volver al inicio
        </Link>
      </section>
    </main>
  );
}
