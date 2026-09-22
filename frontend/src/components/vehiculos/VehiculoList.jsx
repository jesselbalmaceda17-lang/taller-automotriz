export default function VehiculoList({
  vehiculos,
  totalVehiculos,
  totalResultados,
  loading,
  busqueda,
  estadoFiltro,
  estados,
  paginaActual,
  totalPaginas,
  onBusquedaChange,
  onEstadoChange,
  onPaginaChange,
  puedeEditar,
  puedeEliminar,
  onEdit,
  onDelete,
}) {
  return (
    <section className="card">
      <div className="card-header">
        <h2>Vehículos registrados</h2>
        <span className="eyebrow">{totalResultados} resultados</span>
      </div>

      {loading ? (
        <p className="loading-state">Cargando vehículos...</p>
      ) : (
        <>
          <div className="vehicle-filters">
            <div className="field">
              <label htmlFor="busqueda-vehiculos">Buscar vehículos</label>
              <input
                id="busqueda-vehiculos"
                type="search"
                placeholder="Placa, marca, modelo o cliente"
                value={busqueda}
                onChange={(event) => onBusquedaChange(event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="estado-vehiculos">Filtrar por estado</label>
              <select
                id="estado-vehiculos"
                value={estadoFiltro}
                onChange={(event) => onEstadoChange(event.target.value)}
              >
                <option value="">Todos los estados</option>
                {estados.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado.charAt(0).toUpperCase() + estado.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {totalVehiculos === 0 ? (
            <p className="empty-state">No hay vehículos registrados.</p>
          ) : totalResultados === 0 ? (
            <p className="empty-state">
              No se encontraron vehículos con los filtros aplicados.
            </p>
          ) : (
            <>
              <div className="vehicle-list">
                {vehiculos.map((vehiculo) => (
                  <article className="vehicle-item" key={vehiculo.id}>
                    <div className="vehicle-main">
                      <span className="vehicle-plate">{vehiculo.placa}</span>
                      <p className="vehicle-title">{vehiculo.marca} {vehiculo.modelo}</p>
                      <p className="vehicle-meta">
                        {vehiculo.anio} · {vehiculo.cliente?.nombre || vehiculo.cliente} · {vehiculo.estado}
                      </p>
                    </div>
                    <div className="vehicle-actions">
                      {puedeEditar && (
                        <button className="text-button" onClick={() => onEdit(vehiculo)}>
                          Editar
                        </button>
                      )}
                      {puedeEliminar && (
                        <button className="text-button danger" onClick={() => onDelete(vehiculo)}>
                          Eliminar
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
              {totalPaginas > 1 && (
                <div className="vehicle-pagination">
                  <button
                    className="text-button"
                    type="button"
                    onClick={() => onPaginaChange(paginaActual - 1)}
                    disabled={paginaActual === 1}
                  >
                    Anterior
                  </button>
                  <span>
                    Página {paginaActual} de {totalPaginas}
                  </span>
                  <button
                    className="text-button"
                    type="button"
                    onClick={() => onPaginaChange(paginaActual + 1)}
                    disabled={paginaActual === totalPaginas}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </section>
  );
}
