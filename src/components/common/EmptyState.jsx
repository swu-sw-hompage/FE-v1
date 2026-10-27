import { Link } from 'react-router-dom'
import './EmptyState.css'

// 찾는 글/페이지가 없거나 불러오지 못했을 때 보여주는 안내 영역 (가운데 정렬, 위아래 구분선).
// actions: [{ label, to } | { label, onClick }] — 첫 번째가 주 버튼(빨간 테두리)
export default function EmptyState({ title, description, actions = [], size }) {
  return (
    <div className={size === 'large' ? 'empty-state empty-state--large' : 'empty-state'} role="status">
      <p className="empty-state__title">{title}</p>
      {description && <p className="empty-state__desc">{description}</p>}

      {actions.length > 0 && (
        <div className="empty-state__actions">
          {actions.map((action, i) => {
            const className = i === 0 ? 'empty-state__action empty-state__action--primary' : 'empty-state__action'
            const label = action.label
            return action.to ? (
              <Link key={action.label} to={action.to} className={className}>
                {label}
              </Link>
            ) : (
              <button key={action.label} type="button" className={className} onClick={action.onClick}>
                {label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
