import { Navigate, Outlet, useLocation } from 'react-router';
import { getToken } from '../services/authService';

export default function ProtectedRoute() {
  const location = useLocation();

  if (!getToken()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
