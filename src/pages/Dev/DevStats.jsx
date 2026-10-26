import { useCallback, useEffect, useState } from 'react'
import { getDevStats } from '../../api/analytics'
import './DevStats.css'

// 개발자용 통계 페이지. 관리자 로그인과 별개로, 서버 .env의 STATS_ACCESS_KEY를 아는 사람만 볼 수 있다.
// 입력한 키는 이 탭(sessionStorage)에만 남는다.
const KEY_STORAGE = 'swu_stats_key'
const RANGES = [7, 30, 90]

const readKey = () => {
  try {
    return sessionStorage.getItem(KEY_STORAGE) ?? ''
  } catch {
    return ''
  }
}

const saveKey = (key) => {
  try {
    if (key) sessionStorage.setItem(KEY_STORAGE, key)
    else sessionStorage.removeItem(KEY_STORAGE)
  } catch {
    // 저장 못 해도 이번 화면에서는 계속 쓸 수 있다.
  }
}

const fmt = (n) => n.toLocaleString('ko-KR')
const pct = (part, whole) => (whole ? `${Math.round((part / whole) * 100)}%` : '–')
const shortDate = (iso) => {
  const [, m, d] = iso.split('-')
  return `${Number(m)}/${Number(d)}`
}

const SOURCE_LABELS = { direct: '직접 접속', email: '알림 메일', internal: '사이트 내부' }

function StatTile({ label, value, sub }) {
  return (
    <div className="dev-stats__tile">
      <p className="dev-stats__tile-label">{label}</p>
      <p className="dev-stats__tile-value">{value}</p>
      {sub && <p className="dev-stats__tile-sub">{sub}</p>}
    </div>
  )
}

function DailyChart({ daily }) {
  const [hover, setHover] = useState(null)
  const [showTable, setShowTable] = useState(false)
  const max = Math.max(1, ...daily.map((d) => d.visits))
  // 눈금은 0, 절반, 최대 세 개만 둔다.
  const ticks = [max, Math.round(max / 2), 0]
  const labelEvery = Math.ceil(daily.length / 8)

  return (
    <section className="dev-stats__card">
      <div className="dev-stats__card-head">
        <div>
          <h2 className="dev-stats__card-title">일별 방문</h2>
          <p className="dev-stats__card-desc">탭(세션)마다 처음 들어온 한 번을 방문 1회로 셉니다.</p>
        </div>
        <button type="button" className="dev-stats__link-btn" onClick={() => setShowTable((v) => !v)}>
          {showTable ? '차트로 보기' : '표로 보기'}
        </button>
      </div>

      {showTable ? (
        <div className="dev-stats__table-wrap">
          <table className="dev-stats__table">
            <thead>
              <tr>
                <th>날짜</th>
                <th>방문</th>
                <th>순방문자</th>
                <th>신청 페이지</th>
                <th>신청 완료</th>
              </tr>
            </thead>
            <tbody>
              {[...daily].reverse().map((d) => (
                <tr key={d.date}>
                  <td>{d.date}</td>
                  <td>{fmt(d.visits)}</td>
                  <td>{fmt(d.uniqueVisitors)}</td>
                  <td>{fmt(d.subscribePageViews)}</td>
                  <td>{fmt(d.subscribed)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="dev-stats__chart">
          <div className="dev-stats__chart-axis" aria-hidden="true">
            {ticks.map((t, i) => (
              <span key={i}>{fmt(t)}</span>
            ))}
          </div>
          <div className="dev-stats__chart-plot" onMouseLeave={() => setHover(null)}>
            <div className="dev-stats__chart-grid" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="dev-stats__bars">
              {daily.map((d, i) => (
                <div
                  key={d.date}
                  className={hover === i ? 'dev-stats__bar-slot is-active' : 'dev-stats__bar-slot'}
                  onMouseEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  tabIndex={0}
                  aria-label={`${d.date} 방문 ${d.visits}회, 순방문자 ${d.uniqueVisitors}명`}
                >
                  <div className="dev-stats__bar" style={{ height: `${(d.visits / max) * 100}%` }} />
                  {i % labelEvery === 0 && <span className="dev-stats__bar-label">{shortDate(d.date)}</span>}
                </div>
              ))}
            </div>
            {hover !== null && (
              <div
                className="dev-stats__tooltip"
                style={{ left: `${((hover + 0.5) / daily.length) * 100}%` }}
                role="status"
              >
                <p className="dev-stats__tooltip-date">{daily[hover].date}</p>
                <p>
                  방문 <strong>{fmt(daily[hover].visits)}</strong>
                </p>
                <p>
                  순방문자 <strong>{fmt(daily[hover].uniqueVisitors)}</strong>
                </p>
                <p>
                  신청 완료 <strong>{fmt(daily[hover].subscribed)}</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

function Funnel({ totals }) {
  const steps = [
    { label: '신청 페이지 조회', value: totals.subscribePageViews },
    { label: '인증번호 요청', value: totals.verificationRequested },
    { label: '이메일 인증 완료', value: totals.emailVerified },
    { label: '알림 신청 완료', value: totals.subscribed },
  ]
  const top = Math.max(1, steps[0].value)

  return (
    <section className="dev-stats__card">
      <h2 className="dev-stats__card-title">알림 신청 단계</h2>
      <p className="dev-stats__card-desc">
        비율은 신청 페이지 조회 대비입니다. 같은 기간 해지 {fmt(totals.unsubscribed)}건.
      </p>
      <ul className="dev-stats__funnel">
        {steps.map((s) => (
          <li key={s.label} className="dev-stats__funnel-row">
            <span className="dev-stats__funnel-label">{s.label}</span>
            <span className="dev-stats__funnel-track">
              <span
                className="dev-stats__funnel-bar"
                style={{ width: `${Math.min(100, (s.value / top) * 100)}%` }}
              />
            </span>
            <span className="dev-stats__funnel-value">
              {fmt(s.value)}
              <small>{pct(s.value, steps[0].value)}</small>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function RankList({ title, desc, rows, labelOf }) {
  const top = Math.max(1, ...rows.map((r) => r.count))
  return (
    <section className="dev-stats__card">
      <h2 className="dev-stats__card-title">{title}</h2>
      <p className="dev-stats__card-desc">{desc}</p>
      {rows.length === 0 ? (
        <p className="dev-stats__empty">아직 데이터가 없습니다.</p>
      ) : (
        <ul className="dev-stats__rank">
          {rows.map((r) => (
            <li key={r.key} className="dev-stats__rank-row">
              <span className="dev-stats__rank-label" title={r.key}>
                {labelOf(r.key)}
              </span>
              <span className="dev-stats__rank-track">
                <span className="dev-stats__rank-bar" style={{ width: `${(r.count / top) * 100}%` }} />
              </span>
              <span className="dev-stats__rank-value">{fmt(r.count)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default function DevStats() {
  const [key, setKey] = useState(readKey)
  const [keyInput, setKeyInput] = useState('')
  const [days, setDays] = useState(30)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async (accessKey, range) => {
    setLoading(true)
    setError('')
    try {
      setStats(await getDevStats({ key: accessKey, days: range }))
    } catch (err) {
      setStats(null)
      setError(err.message)
      setKey('')
      saveKey('')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    document.title = '개발자 통계 | 서울여대 소프트웨어학과'
  }, [])

  useEffect(() => {
    if (key) load(key, days)
  }, [key, days, load])

  const handleLogin = (e) => {
    e.preventDefault()
    const trimmed = keyInput.trim()
    if (!trimmed) return
    saveKey(trimmed)
    setKey(trimmed)
    setKeyInput('')
  }

  const handleLogout = () => {
    saveKey('')
    setKey('')
    setStats(null)
  }

  if (!key) {
    return (
      <div className="dev-stats dev-stats--gate">
        <form className="dev-stats__gate" onSubmit={handleLogin}>
          <h1 className="dev-stats__gate-title">개발자 통계</h1>
          <p className="dev-stats__gate-desc">접근 키를 입력하세요. 키는 이 탭을 닫으면 지워집니다.</p>
          <input
            type="password"
            className="dev-stats__input"
            placeholder="STATS_ACCESS_KEY"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            autoComplete="off"
          />
          {error && (
            <p className="dev-stats__error" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="dev-stats__primary-btn" disabled={!keyInput.trim()}>
            확인
          </button>
        </form>
      </div>
    )
  }

  const t = stats?.totals
  return (
    <div className="dev-stats">
      <header className="dev-stats__header">
        <div>
          <h1 className="dev-stats__title">개발자 통계</h1>
          {stats && (
            <p className="dev-stats__range-text">
              {stats.from} ~ {stats.to}
            </p>
          )}
        </div>
        <div className="dev-stats__controls">
          <div className="dev-stats__segmented" role="group" aria-label="기간">
            {RANGES.map((r) => (
              <button
                key={r}
                type="button"
                className={r === days ? 'is-active' : undefined}
                aria-pressed={r === days}
                onClick={() => setDays(r)}
              >
                {r}일
              </button>
            ))}
          </div>
          <button type="button" className="dev-stats__link-btn" onClick={handleLogout}>
            나가기
          </button>
        </div>
      </header>

      {loading && !stats && <p className="dev-stats__empty">불러오는 중...</p>}

      {stats && (
        <div className={loading ? 'dev-stats__body is-loading' : 'dev-stats__body'}>
          <div className="dev-stats__tiles">
            <StatTile label="방문" value={fmt(t.visits)} sub={`순방문자 ${fmt(t.uniqueVisitors)}명`} />
            <StatTile
              label="알림 메일로 들어온 방문"
              value={fmt(t.emailVisits)}
              sub={`전체 방문의 ${pct(t.emailVisits, t.visits)}`}
            />
            <StatTile
              label="알림 신청 완료"
              value={fmt(t.subscribed)}
              sub={`신청 페이지 조회 ${fmt(t.subscribePageViews)}회`}
            />
            <StatTile
              label="현재 구독자"
              value={fmt(stats.subscribers.total)}
              sub={`학사 ${fmt(stats.subscribers.academic)} · 취업 ${fmt(stats.subscribers.employment)}`}
            />
          </div>

          <DailyChart daily={stats.daily} />

          <div className="dev-stats__grid">
            <Funnel totals={t} />
            <RankList
              title="유입 경로"
              desc="방문이 어디서 왔는지 (상위 10개)"
              rows={stats.sources}
              labelOf={(k) => SOURCE_LABELS[k] ?? k}
            />
          </div>

          <RankList
            title="첫 방문 페이지"
            desc="방문이 시작된 페이지 (상위 10개)"
            rows={stats.landingPaths}
            labelOf={(k) => k}
          />
        </div>
      )}
    </div>
  )
}
