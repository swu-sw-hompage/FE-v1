import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './ChapterNav.css'

// items: [{ id, label }] for in-page anchors (scrollspy) or [{ to, label }] for links to other pages
export default function ChapterNav({ sections }) {
  const location = useLocation()
  const anchorIds = sections.filter((s) => s.id).map((s) => s.id)
  const [activeId, setActiveId] = useState(anchorIds[0])

  useEffect(() => {
    if (anchorIds.length === 0) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible) setActiveId(visible.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )

    anchorIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections, location.pathname])

  const routeSections = sections.filter((s) => s.to)
  const matchingRoute = routeSections
    .filter(
      (s) =>
        location.pathname === s.to ||
        (!s.exact && location.pathname.startsWith(`${s.to}/`)),
    )
    .sort((a, b) => b.to.length - a.to.length)[0]

  return (
    <nav className="chapter-nav" aria-label="페이지 내 이동">
      <p className="chapter-nav__label">ON THIS PAGE</p>
      <ul className="chapter-nav__list">
        {sections.map((section) => {
          const isRoute = Boolean(section.to)
          const isActive = isRoute ? section.to === matchingRoute?.to : section.id === activeId
          return (
            <li key={section.to ?? section.id} className={isActive ? 'is-active' : ''}>
              <span className="chapter-nav__bar" />
              {isRoute ? (
                <Link to={section.to}>{section.label}</Link>
              ) : (
                <a href={`#${section.id}`}>{section.label}</a>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
