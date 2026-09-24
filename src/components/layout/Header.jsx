import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { NAV_ITEMS, MEGA_MENU_COLUMNS } from '../../constants/nav'
import logoFull from '../../assets/images/brand/logo-full.svg'
import './Header.css'

export default function Header() {
  const [hoveredKey, setHoveredKey] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname, location.search])

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
                isActive ? 'header__link header__link--active' : 'header__link'
              }
              onMouseEnter={() => setHoveredKey(item.path)}
            >
              {item.label}
              <span
                className={
                  hoveredKey === item.path ? 'header__hover-bar header__hover-bar--visible' : 'header__hover-bar'
                }
              />
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className={mobileMenuOpen ? 'header__menu-btn header__menu-btn--open' : 'header__menu-btn'}
          aria-label="메뉴 열기"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((v) => !v)}
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
            <p className="header__mega-title">소프트웨어융합학과</p>
          </div>
          {MEGA_MENU_COLUMNS.map((column) => (
            <div
              key={column.key}
              className={
                hoveredKey === column.key ? 'header__mega-column header__mega-column--active' : 'header__mega-column'
              }
            >
              <p className="header__mega-column-title">{column.title}</p>
              <div className="header__mega-column-underline" />
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
        <div className="header__mobile-menu">
          {MEGA_MENU_COLUMNS.map((column) => (
            <div key={column.key} className="header__mobile-menu-group">
              <p className="header__mobile-menu-title">{column.title}</p>
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
      )}
    </header>
  )
}
