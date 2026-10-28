import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getAdminEmail, logout } from '../api/auth'
import './AdminLayout.css'

const NAV_ITEMS = [
  { label: '공지사항', to: '/admin/notices' },
  { label: '졸업프로젝트', to: '/admin/capstone' },
  { label: '학과 행사', to: '/admin/events' },
  { label: '메인 사진', to: '/admin/hero' },
  { label: '알림 신청자', to: '/admin/subscribers' },
  { label: '관리자 계정', to: '/admin/accounts' },
]

export default function AdminLayout({ eyebrow, title, description, breadcrumb, headActions, children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const adminEmail = getAdminEmail()
  // 폰(900px 이하)에서는 사이드바가 화면 밖에 숨어 있다가 우측 상단 메뉴 버튼으로 연다.
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (to) => location.pathname.startsWith(to)

  return (
    <div className="admin">
      <aside id="admin-sidebar" className={menuOpen ? 'admin__sidebar admin__sidebar--open' : 'admin__sidebar'}>
        <div className="admin__brand">
          <Link to="/" className="admin__brand-logo">
            <strong>서울여자대학교</strong>
            <span>소프트웨어학과</span>
          </Link>
          <span className="admin__console-badge">ADMIN CONSOLE</span>
        </div>

        <p className="admin__nav-label">관리 메뉴</p>
        <nav className="admin__nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className={isActive(item.to) ? 'admin__nav-item admin__nav-item--active' : 'admin__nav-item'}
            >
              <span className="admin__nav-dot" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin__sidebar-spacer" />

        <div className="admin__sidebar-account">
          <div className="admin__profile">
            <span className="admin__avatar">{(adminEmail ?? 'A').charAt(0).toUpperCase()}</span>
            <div className="admin__profile-info">
              <p className="admin__profile-name">{adminEmail ?? 'admin'}</p>
              <p className="admin__profile-role">관리자 계정</p>
            </div>
          </div>
          <button type="button" className="admin__logout-btn" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </aside>

      {menuOpen && <div className="admin__backdrop" onClick={() => setMenuOpen(false)} aria-hidden="true" />}

      <div className="admin__body">
        <header className="admin__topbar">
          <div className="admin__breadcrumb">
            <span>관리자</span>
            {breadcrumb && (
              <>
                <span className="admin__breadcrumb-sep">/</span>
                <strong>{breadcrumb}</strong>
              </>
            )}
          </div>
          <div className="admin__topbar-actions">
            <a href="/" className="admin__site-link" target="_blank" rel="noreferrer">
              <span className="admin__site-link-full">학과 홈페이지 바로가기</span>
              <span className="admin__site-link-short">홈페이지</span> ↗
            </a>
            <button
              type="button"
              className="admin__menu-btn"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? '관리 메뉴 닫기' : '관리 메뉴 열기'}
              aria-expanded={menuOpen}
              aria-controls="admin-sidebar"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </header>

        <main className="admin__main">
          {(eyebrow || title) && (
            <div className="admin__page-head">
              <div className="admin__page-head-text">
                {eyebrow && <p className="admin__eyebrow">{eyebrow}</p>}
                {title && <h1 className="admin__title">{title}</h1>}
                {description && <p className="admin__page-desc">{description}</p>}
              </div>
              {headActions && <div className="admin__page-head-actions">{headActions}</div>}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  )
}
