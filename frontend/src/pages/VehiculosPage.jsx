import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  getVehiculos,
  createVehiculo,
  deleteVehiculo,
} from '../services/vehiculoService';
import { getClientes } from '../services/clienteService';
import { hasPermission } from '../services/authService';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import VehiculoForm from '../components/vehiculos/VehiculoForm';
import VehiculoList from '../components/vehiculos/VehiculoList';

const formularioInicial = {
  placa: '',
  marca: '',
  modelo: '',
  anio: '',
  cliente_id: '',
  estado: 'activo',
};

const VEHICULOS_POR_PAGINA = 5;
const ESTADOS_VEHICULO = ['activo', 'inactivo'];

export default function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState(formularioInicial);
  const [vehiculoParaEliminar, setVehiculoParaEliminar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [clientesLoading, setClientesLoading] = useState(true);
  const [clientesError, setClientesError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const navigate = useNavigate();

  const puedeCrear = hasPermission('vehiculos.crear');
  const puedeEditar = hasPermission('vehiculos.editar');
  const puedeEliminar = hasPermission('vehiculos.eliminar');

  const estados = useMemo(
    () => [
      ...new Set([
        ...ESTADOS_VEHICULO,
        ...vehiculos.map((vehiculo) => vehiculo.estado).filter(Boolean),
      ]),
    ],
    [vehiculos],
  );

  const vehiculosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return vehiculos.filter((vehiculo) => {
      const cliente = vehiculo.cliente?.nombre || vehiculo.cliente || '';
      const coincideBusqueda =
        !termino ||
        [vehiculo.placa, vehiculo.marca, vehiculo.modelo, cliente]
          .filter(Boolean)
          .some((valor) => String(valor).toLowerCase().includes(termino));
      const coincideEstado = !estadoFiltro || vehiculo.estado === estadoFiltro;

      return coincideBusqueda && coincideEstado;
    });
  }, [busqueda, estadoFiltro, vehiculos]);

  const totalPaginas = Math.ceil(vehiculosFiltrados.length / VEHICULOS_POR_PAGINA);
  const vehiculosVisibles = vehiculosFiltrados.slice(
    (paginaActual - 1) * VEHICULOS_POR_PAGINA,
    paginaActual * VEHICULOS_POR_PAGINA,
  );

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, estadoFiltro]);

  useEffect(() => {
    if (totalPaginas > 0 && paginaActual > totalPaginas) {
      setPaginaActual(totalPaginas);
    }
  }, [paginaActual, totalPaginas]);

  async function loadVehiculos() {
    try {
      setLoading(true);
      setError('');

      const data = await getVehiculos();
      setVehiculos(data);
    } catch (err) {
      setError(getRequestErrorMessage(err, 'No se pudieron cargar los vehículos.'));
    } finally {
      setLoading(false);
    }
  }

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

  function validateForm() {
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

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setError('');
      setMessage('');
      setErrors({});
      setSaving(true);

      const datos = {
        ...form,
        anio: Number(form.anio),
      };

      await createVehiculo(datos);

      setForm(formularioInicial);
      setMessage('Vehículo registrado correctamente.');
      await loadVehiculos();
    } catch (err) {
      if (err.status === 422) {
        setErrors(normalizeFieldErrors(err.errors));
      } else {
        setError(getRequestErrorMessage(err, 'No se pudo guardar el vehículo.'));
      }
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(vehiculo) {
    navigate(`/vehiculos/${vehiculo.id}`);
  }

  async function handleDelete() {
    if (!vehiculoParaEliminar) {
      return;
    }

    try {
      setError('');
      setMessage('');
      setDeleting(true);
      await deleteVehiculo(vehiculoParaEliminar.id);
      setVehiculoParaEliminar(null);
      setMessage('Vehículo eliminado correctamente.');
      await loadVehiculos();
    } catch (err) {
      setVehiculoParaEliminar(null);
      setError(getRequestErrorMessage(err, 'No se pudo eliminar el vehículo.'));
    } finally {
      setDeleting(false);
    }
  }

  useEffect(() => {
    loadVehiculos();
    loadClientes();
  }, []);

  async function loadClientes() {
    try {
      setClientesLoading(true);
      setClientesError('');
      setClientes(await getClientes());
    } catch (err) {
      setClientesError(getRequestErrorMessage(err, 'No se pudieron cargar los clientes.'));
    } finally {
      setClientesLoading(false);
    }
  }

  return (
    <main className="page-container">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Panel de control</p>
          <h1>Vehículos</h1>
          <p className="subtitle">Administra los vehículos de tus clientes</p>
        </div>
      </div>

      {error && <p className="alert">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      <div className="content-grid">
        <VehiculoForm
          form={form}
          editando={null}
          puedeCrear={puedeCrear}
          puedeEditar={puedeEditar}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => {}}
          errors={errors}
          saving={saving}
          clientes={clientes}
          clientesLoading={clientesLoading}
          clientesError={clientesError}
        />
        <VehiculoList
          vehiculos={vehiculosVisibles}
          totalVehiculos={vehiculos.length}
          totalResultados={vehiculosFiltrados.length}
          loading={loading}
          busqueda={busqueda}
          estadoFiltro={estadoFiltro}
          estados={estados}
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          onBusquedaChange={(value) => setBusqueda(value)}
          onEstadoChange={(value) => setEstadoFiltro(value)}
          onPaginaChange={setPaginaActual}
          puedeEditar={puedeEditar}
          puedeEliminar={puedeEliminar || puedeEditar}
          onEdit={handleEdit}
          onDelete={setVehiculoParaEliminar}
        />
      </div>

      <ConfirmDialog
        open={Boolean(vehiculoParaEliminar)}
        title="Eliminar vehículo"
        message={
          vehiculoParaEliminar
            ? `¿Deseas eliminar el vehículo ${vehiculoParaEliminar.placa}?`
            : ''
        }

        onConfirm={handleDelete}
        onCancel={() => setVehiculoParaEliminar(null)}
        confirming={deleting}
      />
    </main>
  );
}

function normalizeFieldErrors(fieldErrors = {}) {
  return Object.fromEntries(
    Object.entries(fieldErrors).map(([field, messages]) => [
      field,
      Array.isArray(messages) ? messages[0] : messages,
    ]),
  );
}

function getRequestErrorMessage(error, fallback) {
  if (error.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('permissions');
    window.location.assign('/login');
    return 'Tu sesión expiró. Inicia sesión nuevamente.';
  }

  if (error.status === 403) {
    return 'No tienes permiso para realizar esta acción.';
  }

  if (error.status === 404) {
    return 'El recurso solicitado no existe.';
  }

  if (error.status === 500) {
    return 'El servidor encontró un error. Intenta nuevamente.';
  }

  return error.message || fallback;
}
