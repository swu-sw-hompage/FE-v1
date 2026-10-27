import { Link } from 'react-router-dom'
import './SegmentTabs.css'

// 졸업 요건 · 전공로드맵 · 졸업 후 진로에서 같이 쓰는 분류 탭.
// item.to가 있으면 링크(라우트 이동), 없으면 버튼(onChange 호출)으로 동작한다.
export default function SegmentTabs({ items, active, onChange, label }) {
  return (
    <div className="segment-tabs" role="group" aria-label={label}>
      {items.map((item) => {
        const isActive = item.id === active
        const className = isActive ? 'segment-tabs__tab segment-tabs__tab--active' : 'segment-tabs__tab'
        const content = (
          <>
            {item.no && <span className="segment-tabs__no">{item.no}</span>}
            <span className="segment-tabs__label">{item.label}</span>
          </>
        )

        return item.to ? (
          <Link key={item.id} to={item.to} className={className} aria-current={isActive ? 'page' : undefined}>
            {content}
          </Link>
        ) : (
          <button
            key={item.id}
            type="button"
            className={className}
            aria-pressed={isActive}
            onClick={() => onChange?.(item.id)}
          >
            {content}
          </button>
        )
      })}
    </div>
  )
}
