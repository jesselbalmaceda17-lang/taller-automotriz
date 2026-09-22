import { Link } from 'react-router';

export default function DashboardPage() {
  return (
    <main className="page-container dashboard-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Panel principal</p>
          <h1>Bienvenido</h1>
          <p className="subtitle">
            Administra la información de tu taller desde un solo lugar.
          </p>
        </div>
      </div>

      <section className="card dashboard-welcome">
        <h2>Gestión de vehículos</h2>
        <p className="subtitle">
          Consulta, registra y administra los vehículos de tus clientes.
        </p>
        <Link className="button dashboard-link" to="/vehiculos">
          Ver vehículos
        </Link>
      </section>
    </main>
  );
}
