import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { NAV_ITEMS, MEGA_MENU_COLUMNS, MOBILE_MENU_COLUMNS } from '../../constants/nav'
import useRecentEvent from '../../hooks/useRecentEvent'
import logoFull from '../../assets/images/brand/logo-full.svg'
import './Header.css'

const MOBILE_BREAKPOINT = '(max-width: 900px)'

// 현재 위치가 속한 대분류 (예: /about/history → '/about')
const findSectionKey = (pathname) =>
  MOBILE_MENU_COLUMNS.find((c) => pathname === c.key || pathname.startsWith(`${c.key}/`))?.key ?? null

// 링크의 경로가 같고, 링크에 붙은 쿼리(filter 등)가 현재 주소에도 똑같이 있으면 현재 페이지로 본다
const isLinkActive = (to, location) => {
  const [path, query = ''] = to.split('?')
  if (path !== location.pathname) return false
  const current = new URLSearchParams(location.search)
  return [...new URLSearchParams(query)].every(([k, v]) => current.get(k) === v)
}

export default function Header() {
  const [hoveredKey, setHoveredKey] = useState(null)
  // 새 학과 행사가 올라온 뒤 7일 동안 '학과 활동' 옆에 작은 점
  const hasNewEvent = Boolean(useRecentEvent())
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedKey, setExpandedKey] = useState(null)
  const location = useLocation()

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname, location.search])

  // 메뉴가 열려 있는 동안 뒤 페이지가 같이 스크롤되지 않게 막고, ESC로 닫을 수 있게 한다.
  // 화면을 넓혀 PC 레이아웃이 되면 메뉴를 닫아 스크롤 잠금이 남지 않게 한다.
  useEffect(() => {
    if (!mobileMenuOpen) return undefined
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    const media = window.matchMedia(MOBILE_BREAKPOINT)
    const onMediaChange = (e) => {
      if (!e.matches) setMobileMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    media.addEventListener('change', onMediaChange)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
      media.removeEventListener('change', onMediaChange)
    }
  }, [mobileMenuOpen])

  const toggleMobileMenu = () => {
    // 열 때는 지금 보고 있는 페이지가 속한 그룹을 펼친 상태로 시작
    if (!mobileMenuOpen) setExpandedKey(findSectionKey(location.pathname))
    setMobileMenuOpen((v) => !v)
  }

  const currentSectionKey = findSectionKey(location.pathname)

  return (
    <header className="header" onMouseLeave={() => setHoveredKey(null)}>
      <div className="header__inner">
        <Link to="/" className="header__logo">
          <img className="header__logo-full" src={logoFull} alt="서울여자대학교 소프트웨어학과" />
        </Link>

        <nav className="header__nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  'header__link',
                  isActive && 'header__link--active',
                  hoveredKey === item.path && 'header__link--hovered',
                ]
                  .filter(Boolean)
                  .join(' ')
              }
              onMouseEnter={() => setHoveredKey(item.path)}
            >
              {item.label}
              {item.path === '/activities' && hasNewEvent && (
                <span className="header__new-dot" aria-label="새 학과 행사" />
              )}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className={mobileMenuOpen ? 'header__menu-btn header__menu-btn--open' : 'header__menu-btn'}
          aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          onClick={toggleMobileMenu}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={hoveredKey ? 'header__mega header__mega--open' : 'header__mega'}>
        <div className="header__mega-inner">
          <div className="header__mega-intro">
            <p className="header__mega-eyebrow">SEOUL WOMEN&apos;S UNIVERSITY</p>
            <p className="header__mega-title">소프트웨어학과</p>
          </div>
          {MEGA_MENU_COLUMNS.map((column) => (
            <div
              key={column.key}
              className={
                hoveredKey === column.key ? 'header__mega-column header__mega-column--active' : 'header__mega-column'
              }
              onMouseEnter={() => setHoveredKey(column.key)}
            >
              <p className="header__mega-column-title">{column.title}</p>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {mobileMenuOpen && (
        <nav id="mobile-menu" className="header__mobile-menu" aria-label="전체 메뉴">
          <ul className="header__mobile-menu-list">
            {MOBILE_MENU_COLUMNS.map((column) => {
              const isCurrent = column.key === currentSectionKey

              // 하위 메뉴가 하나뿐이면 펼칠 필요 없이 바로 이동
              if (column.links.length === 1) {
                const link = column.links[0]
                return (
                  <li key={column.key} className="header__mobile-menu-group">
                    <Link
                      to={link.to}
                      className={
                        isCurrent ? 'header__mobile-menu-head header__mobile-menu-head--current' : 'header__mobile-menu-head'
                      }
                      aria-current={isCurrent ? 'page' : undefined}
                    >
                      {column.title}
                    </Link>
                  </li>
                )
              }

              const isOpen = expandedKey === column.key
              const panelId = `mobile-menu-panel-${column.key.slice(1)}`
              return (
                <li
                  key={column.key}
                  className={isOpen ? 'header__mobile-menu-group header__mobile-menu-group--open' : 'header__mobile-menu-group'}
                >
                  <button
                    type="button"
                    className={
                      isCurrent ? 'header__mobile-menu-head header__mobile-menu-head--current' : 'header__mobile-menu-head'
                    }
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setExpandedKey(isOpen ? null : column.key)}
                  >
                    {column.title}
                    <span className="header__mobile-menu-chevron" aria-hidden="true" />
                  </button>
                  <div id={panelId} className="header__mobile-menu-panel" inert={!isOpen}>
                    <ul>
                      {column.links.map((link) => {
                        const active = isLinkActive(link.to, location)
                        return (
                          <li key={link.label}>
                            <Link
                              to={link.to}
                              className={active ? 'header__mobile-menu-link--active' : undefined}
                              aria-current={active ? 'page' : undefined}
                            >
                              {link.label}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
    </header>
  )
}
