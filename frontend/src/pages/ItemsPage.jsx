import { useEffect, useState } from 'react';
import { hasPermission } from '../services/authService';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import {
  createItem,
  deleteItem,
  getItems,
  updateItem,
} from '../services/itemService';

const formularioInicial = {
  title: '',
  description: '',
  status: 'active',
};

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(formularioInicial);
  const [itemEditando, setItemEditando] = useState(null);
  const [itemParaEliminar, setItemParaEliminar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const puedeCrear = hasPermission('items.crear');
  const puedeEditar = hasPermission('items.editar');
  const puedeEliminar = hasPermission('items.eliminar');

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    try {
      setLoading(true);
      setError('');
      setItems(await getItems());
    } catch (requestError) {
      setError(getRequestErrorMessage(requestError, 'No se pudieron cargar los items.'));
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

  function handleEdit(item) {
    setItemEditando(item);
    setForm({
      title: item.title || '',
      description: item.description || '',
      status: item.status || 'active',
    });
    setErrors({});
    setError('');
    setMessage('');
  }

  function handleCancelEdit() {
    setItemEditando(null);
    setForm(formularioInicial);
    setErrors({});
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

      if (itemEditando) {
        await updateItem(itemEditando.id, form);
        setMessage('Item actualizado correctamente.');
      } else {
        await createItem(form);
        setMessage('Item creado correctamente.');
      }

      handleCancelEdit();
      await loadItems();
    } catch (requestError) {
      if (requestError.status === 422) {
        setErrors(normalizeFieldErrors(requestError.errors));
      } else {
        setError(getRequestErrorMessage(requestError, 'No se pudo guardar el item.'));
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!itemParaEliminar) {
      return;
    }

    try {
      setDeleting(true);
      setError('');
      setMessage('');
      await deleteItem(itemParaEliminar.id);
      setItemParaEliminar(null);
      setMessage('Item eliminado correctamente.');
      await loadItems();
    } catch (requestError) {
      setError(getRequestErrorMessage(requestError, 'No se pudo eliminar el item.'));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <main className="page-container">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Panel de control</p>
          <h1>Items</h1>
          <p className="subtitle">Administra el catálogo del taller</p>
        </div>
      </div>

      {error && <p className="alert">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      <div className="content-grid">
        {(puedeCrear || (itemEditando && puedeEditar)) && (
          <section className="card">
            <div className="card-header">
              <h2>{itemEditando ? 'Editar item' : 'Registrar item'}</h2>
            </div>

            <form className="vehicle-form" onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="item-title">Título</label>
                <input
                  id="item-title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
                {errors.title && <small className="field-error">{errors.title}</small>}
              </div>

              <div className="field">
                <label htmlFor="item-description">Descripción</label>
                <input
                  id="item-description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                />
                {errors.description && (
                  <small className="field-error">{errors.description}</small>
                )}
              </div>

              <div className="field">
                <label htmlFor="item-status">Estado</label>
                <select
                  id="item-status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  required
                >
                  <option value="active">Activo</option>
                </select>
                {errors.status && <small className="field-error">{errors.status}</small>}
              </div>

              <div className="form-actions">
                <button className="button" type="submit" disabled={saving}>
                  {saving ? 'Guardando...' : itemEditando ? 'Actualizar item' : 'Guardar'}
                </button>
                {itemEditando && (
                  <button
                    className="button button-secondary"
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={saving}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </section>
        )}

        <section className="card">
          <div className="card-header">
            <h2>Items registrados</h2>
          </div>

          {loading ? (
            <p className="loading-state">Cargando items...</p>
          ) : items.length === 0 ? (
            <p className="empty-state">No hay items registrados.</p>
          ) : (
            <div className="vehicle-list">
              {items.map((item) => (
                <article className="vehicle-item" key={item.id}>
                  <div className="vehicle-main">
                    <p className="vehicle-title">{item.title}</p>
                    <p className="vehicle-meta">
                      {item.description || 'Sin descripción'} · {item.status}
                    </p>
                  </div>
                  <div className="vehicle-actions">
                    {puedeEditar && (
                      <button className="text-button" onClick={() => handleEdit(item)}>
                        Editar
                      </button>
                    )}
                    {puedeEliminar && (
                      <button
                        className="text-button danger"
                        onClick={() => setItemParaEliminar(item)}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <ConfirmDialog
        open={Boolean(itemParaEliminar)}
        title="Eliminar item"
        message={
          itemParaEliminar
            ? `¿Deseas eliminar el item ${itemParaEliminar.title}?`
            : ''
        }
        onConfirm={handleDelete}
        onCancel={() => setItemParaEliminar(null)}
        confirming={deleting}
      />
    </main>
  );
}

function validateForm(form) {
  const validationErrors = {};

  if (!form.title.trim()) {
    validationErrors.title = 'El título es obligatorio.';
  }

  if (form.title.length > 255) {
    validationErrors.title = 'El título no puede superar los 255 caracteres.';
  }

  return validationErrors;
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
    return 'El item solicitado no existe.';
  }

  if (error.status === 500) {
    return 'El servidor encontró un error. Intenta nuevamente.';
  }

  return error.message || fallback;
}
