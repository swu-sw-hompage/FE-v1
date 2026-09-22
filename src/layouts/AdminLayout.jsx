import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getAdminEmail, logout } from '../api/auth'
import './AdminLayout.css'

const NAV_ITEMS = [
  { label: '대시보드', to: '/admin' },
  { label: '공지사항', to: '/admin/notices/new' },
  { label: '졸업작품', to: '/admin/capstone/new' },
  { label: '알림 신청자', to: null },
  { label: '관리자 계정', to: '/admin/accounts' },
]

export default function AdminLayout({ title, children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const adminEmail = getAdminEmail()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="admin">
      <aside className="admin__sidebar">
        <div className="admin__brand">
          <strong>SWU ADMIN</strong>
          <span>소프트웨어융합학과</span>
        </div>

        <p className="admin__nav-label">관리 메뉴</p>
        <nav className="admin__nav">
          {NAV_ITEMS.map((item) => {
            const isActive = item.to && location.pathname === item.to
            const content = (
              <>
                <span className="admin__nav-dot" />
                {item.label}
              </>
            )
            return item.to ? (
              <Link
                key={item.label}
                to={item.to}
                className={isActive ? 'admin__nav-item admin__nav-item--active' : 'admin__nav-item'}
              >
                {content}
              </Link>
            ) : (
              <span key={item.label} className="admin__nav-item admin__nav-item--disabled">
                {content}
              </span>
            )
          })}
        </nav>

        <div className="admin__sidebar-footer">
          <div>
            <p>{adminEmail ?? '관리자'}</p>
            <p>관리자 계정</p>
          </div>
          <button type="button" className="admin__logout-btn" onClick={handleLogout}>
            로그아웃 ↗
          </button>
        </div>
      </aside>

      <div className="admin__body">
        <header className="admin__topbar">
          <h1>{title}</h1>
          <div className="admin__avatar">
            <span>김</span>
          </div>
        </header>

        <main className="admin__main">{children}</main>
      </div>
    </div>
  )
}
