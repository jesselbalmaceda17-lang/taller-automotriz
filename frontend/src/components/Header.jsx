export default function Header({ user, onLogout }) {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">T</span>
        <span>Taller Automotriz</span>
      </div>
      <div className="user-menu">
        <span className="user-name">{user.name}</span>
        <button className="logout-button" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
