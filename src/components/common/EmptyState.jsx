import { Link } from 'react-router-dom'
import './EmptyState.css'

// 찾는 글/페이지가 없거나 불러오지 못했을 때 보여주는 안내 영역.
// actions: [{ label, to } | { label, onClick }] — 첫 번째가 주 버튼
export default function EmptyState({ code = 'NOT FOUND', title, description, actions = [], icon = 'document', children }) {
  return (
    <div className="empty-state" role="status">
      <div className="empty-state__icon" aria-hidden="true">
        {icon === 'error' ? <ErrorIcon /> : <DocumentIcon />}
      </div>
      <p className="empty-state__code">{code}</p>
      <p className="empty-state__title">{title}</p>
      {description && <p className="empty-state__desc">{description}</p>}

      {actions.length > 0 && (
        <div className="empty-state__actions">
          {actions.map((action, i) => {
            const className = i === 0 ? 'empty-state__btn empty-state__btn--primary' : 'empty-state__btn'
            return action.to ? (
              <Link key={action.label} to={action.to} className={className}>
                {action.label}
              </Link>
            ) : (
              <button key={action.label} type="button" className={className} onClick={action.onClick}>
                {action.label}
              </button>
            )
          })}
        </div>
      )}

      {children}
    </div>
  )
}

function DocumentIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M7 3.5h9.5L22 9v15.5H7V3.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M16.5 3.5V9H22" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M11.5 14.5l5 5M16.5 14.5l-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function ErrorIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="10.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M14 8.5v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="14" cy="19.25" r="1.1" fill="currentColor" />
    </svg>
  )
}
