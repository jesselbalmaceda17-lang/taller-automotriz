import { NavLink } from 'react-router';
import { hasPermission } from '../services/authService';

const menuItems = [
  { to: '/', label: 'Inicio' },
  { to: '/items', label: 'Items', permission: 'items.ver' },
  { to: '/vehiculos', label: 'Vehículos', permission: 'vehiculos.ver' },
];

export default function Sidebar() {
  const visibleItems = menuItems.filter(
    (item) => !item.permission || hasPermission(item.permission),
  );

  return (
    <aside className="sidebar">
      <p className="sidebar-label">Navegación</p>
      <nav className="sidebar-nav" aria-label="Navegación principal">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
