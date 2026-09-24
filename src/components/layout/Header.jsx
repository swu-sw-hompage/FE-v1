import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { NAV_ITEMS, MEGA_MENU_COLUMNS } from '../../constants/nav'
import logoFull from '../../assets/images/brand/logo-full.svg'
import './Header.css'

export default function Header() {
  const navigate = useNavigate()
  const [hoveredKey, setHoveredKey] = useState(null)

  const dropdownItems = NAV_ITEMS.filter((item) => item.path === '/about' || item.path === '/curriculum')

  return (
    <header className="header" onMouseLeave={() => setHoveredKey(null)}>
      <div className="header__inner">
        <Link to="/" className="header__logo">
          <img className="header__logo-full" src={logoFull} alt="서울여자대학교 소프트웨어학과" />
        </Link>

        <div className="header__mobile-subnav">
          {dropdownItems.map((item) => {
            const column = MEGA_MENU_COLUMNS.find((c) => c.key === item.path)
            return (
              <select
                key={item.path}
                className="header__mobile-select"
                aria-label={item.label}
                defaultValue={item.path}
                onChange={(e) => navigate(e.target.value)}
              >
                {column.links.map((link) => (
                  <option key={link.to} value={link.to}>
                    {link.label}
                  </option>
                ))}
              </select>
            )
          })}
        </div>

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
    </header>
  )
}
