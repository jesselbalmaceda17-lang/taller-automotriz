export default function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirming = false,
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="dialog-backdrop" role="presentation">
      <section className="confirm-dialog" role="alertdialog" aria-modal="true">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="form-actions">
          <button
            className="button button-secondary"
            type="button"
            onClick={onCancel}
            disabled={confirming}
          >
            Cancelar
          </button>
          <button
            className="button button-danger"
            type="button"
            onClick={onConfirm}
            disabled={confirming}
          >
            {confirming ? 'Eliminando...' : 'Confirmar eliminación'}
          </button>
        </div>
      </section>
    </div>
  );
}
