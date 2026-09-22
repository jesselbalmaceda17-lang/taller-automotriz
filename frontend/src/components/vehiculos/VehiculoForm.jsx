export default function VehiculoForm({
  form,
  editando,
  puedeCrear,
  puedeEditar,
  onChange,
  onSubmit,
  onCancel,
  errors,
  saving,
  clientes,
  clientesLoading,
  clientesError,
}) {
  const puedeGuardar = editando ? puedeEditar : puedeCrear;

  if (!puedeGuardar) {
    return null;
  }

  return (
    <section className="card">
      <div className="card-header">
        <h2>{editando ? 'Editar vehículo' : 'Registrar vehículo'}</h2>
      </div>

      <form className="vehicle-form" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="placa">Placa</label>
          <input
            id="placa"
            name="placa"
            placeholder="Ej. ABC-123"
            value={form.placa}
            onChange={onChange}
            required
          />
          {errors.placa && <small className="field-error">{errors.placa}</small>}
        </div>
        <div className="field">
          <label htmlFor="marca">Marca</label>
          <input
            id="marca"
            name="marca"
            placeholder="Ej. Toyota"
            value={form.marca}
            onChange={onChange}
            required
          />
          {errors.marca && <small className="field-error">{errors.marca}</small>}
        </div>
        <div className="field">
          <label htmlFor="modelo">Modelo</label>
          <input
            id="modelo"
            name="modelo"
            placeholder="Ej. Corolla"
            value={form.modelo}
            onChange={onChange}
            required
          />
          {errors.modelo && <small className="field-error">{errors.modelo}</small>}
        </div>
        <div className="field">
          <label htmlFor="anio">Año</label>
          <input
            id="anio"
            name="anio"
            type="number"
            placeholder="Ej. 2022"
            value={form.anio}
            onChange={onChange}
            required
          />
          {errors.anio && <small className="field-error">{errors.anio}</small>}
        </div>
        <div className="field">
          <label htmlFor="cliente_id">Cliente</label>
          <select
            id="cliente_id"
            name="cliente_id"
            value={form.cliente_id}
            onChange={onChange}
            required
            disabled={clientesLoading}
          >
            <option value="">
              {clientesLoading ? 'Cargando clientes...' : 'Selecciona un cliente'}
            </option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nombre}
              </option>
            ))}
          </select>
          {clientesError && <small className="field-error">{clientesError}</small>}
          {errors.cliente_id && <small className="field-error">{errors.cliente_id}</small>}
        </div>
        <div className="field">
          <label htmlFor="estado">Estado</label>
          <select id="estado" name="estado" value={form.estado} onChange={onChange} required>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
          {errors.estado && <small className="field-error">{errors.estado}</small>}
        </div>
        <div className="form-actions">
          <button className="button" type="submit" disabled={saving}>
            {saving
              ? 'Guardando...'
              : editando
                ? 'Actualizar vehículo'
                : 'Registrar vehículo'}
          </button>
          {editando && (
            <button
              className="button button-secondary"
              type="button"
              onClick={onCancel}
              disabled={saving}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
