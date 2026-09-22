import { useState } from 'react';
import { useNavigate } from 'react-router';
import { login } from '../services/authService';

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      const data = await login(email, password);

      onLogin(data.user);
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="brand login-brand">
          <span className="brand-mark" aria-hidden="true">T</span>
          <span>Taller Automotriz</span>
        </div>
        <h1>Bienvenido de nuevo</h1>
        <p className="subtitle">Ingresa a tu panel de gestión</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@taller.com"
            required
          />
          </div>
          <div className="field">
            <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
          />
          </div>
          <button className="button" type="submit">Iniciar sesión</button>

          {error && <p className="alert">{error}</p>}
        </form>
      </section>
    </main>
  );
}