import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import VehiculoForm from '../components/vehiculos/VehiculoForm';
import { getVehiculo, updateVehiculo } from '../services/vehiculoService';
import { getClientes } from '../services/clienteService';
import { hasPermission } from '../services/authService';

const formularioInicial = {
  placa: '',
  marca: '',
  modelo: '',
  anio: '',
  cliente_id: '',
  estado: 'activo',
};

export default function VehiculoEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(formularioInicial);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [clientes, setClientes] = useState([]);
  const [clientesLoading, setClientesLoading] = useState(true);
  const [clientesError, setClientesError] = useState('');
  const puedeEditar = hasPermission('vehiculos.editar');

  useEffect(() => {
    async function loadVehiculo() {
      try {
        setLoading(true);
        setError('');
        const vehiculo = await getVehiculo(id);
        setForm({
          placa: vehiculo.placa,
          marca: vehiculo.marca,
          modelo: vehiculo.modelo,
          anio: vehiculo.anio,
          cliente_id: String(vehiculo.cliente_id),
          estado: vehiculo.estado,
        });
      } catch (requestError) {
        setError(getRequestErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    }

    loadVehiculo();
  }, [id]);

  useEffect(() => {
    async function loadClientes() {
      try {
        setClientesLoading(true);
        setClientesError('');
        setClientes(await getClientes());
      } catch (requestError) {
        setClientesError(getRequestErrorMessage(requestError));
      } finally {
        setClientesLoading(false);
      }
    }

    loadClientes();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: '',
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSaving(true);
      setError('');
      setMessage('');
      setErrors({});
      await updateVehiculo(id, {
        ...form,
        anio: Number(form.anio),
      });
      setMessage('Vehículo actualizado correctamente.');
    } catch (requestError) {
      if (requestError.status === 422) {
        setErrors(normalizeFieldErrors(requestError.errors));
      } else {
        setError(getRequestErrorMessage(requestError));
      }
    } finally {
      setSaving(false);
    }
  }

  if (!puedeEditar) {
    return (
      <main className="page-container">
        <section className="card not-found">
          <p className="eyebrow">Acceso restringido</p>
          <h1>Sin permiso</h1>
          <p className="subtitle">
            No tienes permiso para editar vehículos.
          </p>
          <Link className="button dashboard-link" to="/vehiculos">
            Volver a vehículos
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page-container">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Vehículos / Editar</p>
          <h1>Editar vehículo</h1>
          <p className="subtitle">Actualiza la información del vehículo seleccionado.</p>
        </div>
      </div>

      {loading && <p className="loading-state">Cargando vehículo...</p>}
      {error && <p className="alert">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      {!loading && !error && (
        <div className="edit-form-container">
          <VehiculoForm
            form={form}
            editando={id}
            puedeCrear={false}
            puedeEditar={puedeEditar}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/vehiculos')}
            errors={errors}
            saving={saving}
            clientes={clientes}
            clientesLoading={clientesLoading}
            clientesError={clientesError}
          />
        </div>
      )}
    </main>
  );
}

function validateForm(form) {
  const nextErrors = {};
  const anio = Number(form.anio);

  if (!form.placa.trim()) nextErrors.placa = 'La placa es obligatoria.';
  if (!form.marca.trim()) nextErrors.marca = 'La marca es obligatoria.';
  if (!form.modelo.trim()) nextErrors.modelo = 'El modelo es obligatorio.';
  if (!form.anio) {
    nextErrors.anio = 'El año es obligatorio.';
  } else if (!Number.isInteger(anio) || anio < 1900 || anio > 2100) {
    nextErrors.anio = 'El año debe estar entre 1900 y 2100.';
  }
  if (!form.cliente_id) nextErrors.cliente_id = 'Debes seleccionar un cliente.';

  return nextErrors;
}

function normalizeFieldErrors(fieldErrors = {}) {
  return Object.fromEntries(
    Object.entries(fieldErrors).map(([field, messages]) => [
      field,
      Array.isArray(messages) ? messages[0] : messages,
    ]),
  );
}

function getRequestErrorMessage(error) {
  if (error.status === 401) return 'Tu sesión expiró. Inicia sesión nuevamente.';
  if (error.status === 403) return 'No tienes permiso para editar este vehículo.';
  if (error.status === 404) return 'El vehículo solicitado no existe.';
  if (error.status === 500) return 'El servidor encontró un error al procesar la solicitud.';
  if (error.status === 0) return error.message;
  return error.message || 'No se pudo cargar el vehículo.';
}
