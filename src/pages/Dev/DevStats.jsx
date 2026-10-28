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

// 홍보 링크 채널. value가 utm_source로 들어가고 통계의 유입 경로 이름이 된다.
const CHANNELS = [
  { value: 'everytime', label: '에브리타임' },
  { value: 'kakao', label: '카카오톡 단톡방' },
  { value: 'instagram_story', label: '인스타 스토리' },
  { value: 'instagram', label: '인스타 게시물' },
]

const LINK_TARGETS = [
  { path: '/', label: '홈' },
  { path: '/notice/subscribe', label: '공지 알림 신청' },
  { path: '/notice', label: '공지사항' },
]

const SOURCE_LABELS = {
  unknown: '알 수 없음',
  direct: '직접 접속',
  email: '알림 메일',
  internal: '사이트 내부',
  ...Object.fromEntries(CHANNELS.map((c) => [c.value, c.label])),
}

// "채널:캠페인" 형태면 "에브리타임 · 캠페인"으로 보여준다.
const sourceLabel = (key) => {
  const [channel, ...rest] = key.split(':')
  const name = SOURCE_LABELS[channel] ?? channel
  return rest.length ? `${name} · ${rest.join(':')}` : name
}

// utm 값은 영문 소문자·숫자·-·_만 남긴다 (공백은 -로).
const slug = (text) =>
  text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, 40)

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

function LinkBuilder() {
  const [channel, setChannel] = useState(CHANNELS[0].value)
  const [customChannel, setCustomChannel] = useState('')
  const [target, setTarget] = useState(LINK_TARGETS[0].path)
  const [campaign, setCampaign] = useState('')
  const [copied, setCopied] = useState(false)

  const source = channel === 'custom' ? slug(customChannel) : channel
  const params = new URLSearchParams()
  if (source) params.set('utm_source', source)
  if (slug(campaign)) params.set('utm_campaign', slug(campaign))
  const url = source ? `${window.location.origin}${target}?${params.toString()}` : ''

  useEffect(() => setCopied(false), [url])

  const copy = async () => {
    if (!url) return
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="dev-stats__card">
      <h2 className="dev-stats__card-title">홍보 링크 만들기</h2>
      <p className="dev-stats__card-desc">
        채널마다 다른 링크를 붙이면 위 유입 경로에 채널 이름으로 따로 집계됩니다. 캠페인 이름은 영문·숫자만
        들어갑니다.
      </p>

      <div className="dev-stats__builder">
        <label className="dev-stats__field">
          <span>채널</span>
          <select value={channel} onChange={(e) => setChannel(e.target.value)} className="dev-stats__input">
            {CHANNELS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
            <option value="custom">직접 입력</option>
          </select>
        </label>
        {channel === 'custom' && (
          <label className="dev-stats__field">
            <span>채널 이름 (영문)</span>
            <input
              className="dev-stats__input"
              placeholder="예: poster"
              value={customChannel}
              onChange={(e) => setCustomChannel(e.target.value)}
            />
          </label>
        )}
        <label className="dev-stats__field">
          <span>연결할 페이지</span>
          <select value={target} onChange={(e) => setTarget(e.target.value)} className="dev-stats__input">
            {LINK_TARGETS.map((t) => (
              <option key={t.path} value={t.path}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className="dev-stats__field">
          <span>캠페인 이름 (선택)</span>
          <input
            className="dev-stats__input"
            placeholder="예: alert-launch"
            value={campaign}
            onChange={(e) => setCampaign(e.target.value)}
          />
        </label>
      </div>

      <div className="dev-stats__link-result">
        <code className="dev-stats__link-url">{url || '채널 이름을 입력하세요'}</code>
        <button type="button" className="dev-stats__primary-btn" onClick={copy} disabled={!url}>
          {copied ? '복사됨' : '복사'}
        </button>
      </div>
      {source && (
        <p className="dev-stats__card-desc">
          통계에는 <strong>{sourceLabel(slug(campaign) ? `${source}:${slug(campaign)}` : source)}</strong>(으)로
          표시됩니다.
        </p>
      )}
    </section>
  )
}

function SourceList({ rows }) {
  const top = Math.max(1, ...rows.map((r) => r.visits))
  return (
    <section className="dev-stats__card">
      <h2 className="dev-stats__card-title">유입 경로</h2>
      <p className="dev-stats__card-desc">
        막대는 방문 수, 오른쪽은 그 경로로 들어와 알림을 신청한 수와 방문 대비 비율입니다 (상위 10개).
      </p>
      {rows.length === 0 ? (
        <p className="dev-stats__empty">아직 데이터가 없습니다.</p>
      ) : (
        <ul className="dev-stats__rank">
          {rows.map((r) => (
            <li key={r.key} className="dev-stats__rank-row dev-stats__rank-row--source">
              <span className="dev-stats__rank-label" title={r.key}>
                {sourceLabel(r.key)}
              </span>
              <span className="dev-stats__rank-track">
                <span className="dev-stats__rank-bar" style={{ width: `${(r.visits / top) * 100}%` }} />
              </span>
              <span className="dev-stats__rank-value">{fmt(r.visits)}</span>
              <span className="dev-stats__rank-signups">
                신청 {fmt(r.subscribed)}
                <small>{r.visits ? pct(r.subscribed, r.visits) : ''}</small>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

// 홍보 팝업 key → 표시 이름. 없으면 key를 그대로 보여준다.
const PROMO_LABELS = {
  'notice-subscribe-2026-10': '공지 알림 신청 (2026.10)',
}

function PromoList({ rows }) {
  return (
    <section className="dev-stats__card">
      <h2 className="dev-stats__card-title">홍보 팝업</h2>
      <p className="dev-stats__card-desc">
        노출은 홈에서 팝업이 뜬 횟수, 클릭률은 본 사람 대비 클릭 수, 신청은 팝업을 누른 뒤 알림을 신청한 수입니다.
      </p>
      {rows.length === 0 ? (
        <p className="dev-stats__empty">아직 데이터가 없습니다.</p>
      ) : (
        <div className="dev-stats__table-wrap">
          <table className="dev-stats__table">
            <thead>
              <tr>
                <th>팝업</th>
                <th>노출</th>
                <th>본 사람</th>
                <th>클릭</th>
                <th>클릭률</th>
                <th>클릭 후 신청</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key}>
                  <td title={r.key}>{PROMO_LABELS[r.key] ?? r.key}</td>
                  <td>{fmt(r.views)}</td>
                  <td>{fmt(r.uniqueViewers)}</td>
                  <td>{fmt(r.clicks)}</td>
                  <td>{pct(r.clicks, r.uniqueViewers)}</td>
                  <td>{fmt(r.subscribed)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
            <SourceList rows={stats.sources} />
          </div>

          <PromoList rows={stats.promos ?? []} />

          <RankList
            title="첫 방문 페이지"
            desc="방문이 시작된 페이지 (상위 10개)"
            rows={stats.landingPaths}
            labelOf={(k) => k}
          />

          <LinkBuilder />
        </div>
      )}
    </div>
  )
}
