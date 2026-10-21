import './ConfirmModal.css'

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = '삭제',
  cancelLabel = '취소',
  danger = true,
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null

  return (
    <div className="confirm-modal__overlay" role="presentation" onClick={onCancel}>
      <div
        className="confirm-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <p id="confirm-modal-title" className="confirm-modal__title">
          {title}
        </p>
        {description && <p className="confirm-modal__desc">{description}</p>}
        <div className="confirm-modal__actions">
          <button type="button" className="confirm-modal__btn" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={danger ? 'confirm-modal__btn confirm-modal__btn--danger' : 'confirm-modal__btn confirm-modal__btn--primary'}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? '처리 중...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
