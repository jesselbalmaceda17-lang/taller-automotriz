import { Outlet } from 'react-router';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout({ user, onLogout }) {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <div className="dashboard-main">
        <Header user={user} onLogout={onLogout} />
        <Outlet />
      </div>
    </div>
  );
}
