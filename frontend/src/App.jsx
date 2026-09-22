import { useState } from 'react';
import { logout, getUser } from './services/authService';
import AppRoutes from './routes/AppRoutes';

function App() {
  const [user, setUser] = useState(getUser());

  function handleLogin(userData) {
    setUser(userData);
  }

  async function handleLogout() {
    await logout();
    setUser(null);
  }

  return (
    <div className="app-shell">
      <AppRoutes
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </div>
  );
}

export default App;
