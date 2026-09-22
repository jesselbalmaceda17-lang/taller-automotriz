import { Navigate, Route, Routes } from 'react-router';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardPage from '../pages/DashboardPage';
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import ItemsPage from '../pages/ItemsPage';
import VehiculoEditPage from '../pages/VehiculoEditPage';
import VehiculosPage from '../pages/VehiculosPage';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes({ user, onLogin, onLogout }) {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage onLogin={onLogin} />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout user={user} onLogout={onLogout} />}>
          <Route index element={<DashboardPage />} />
          <Route path="items" element={<ItemsPage />} />
          <Route path="vehiculos" element={<VehiculosPage />} />
          <Route path="vehiculos/:id" element={<VehiculoEditPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
