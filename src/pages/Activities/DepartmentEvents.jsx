import { Link, useSearchParams } from 'react-router-dom'
import PageHero from '../../components/common/PageHero'
import EmptyState from '../../components/common/EmptyState'
import ActivitiesSidebar from './ActivitiesSidebar'
import { ACTIVITY_LATEST_YEAR } from '../../constants/activities'
import { DEPARTMENT_EVENTS } from '../../data/departmentEvents'
import heroActivities from '../../assets/images/brand/hero-activities.jpg'
import './Activities.css'
import './DepartmentEvents.css'

// 처음 보여줄 개수와 '더보기' 한 번에 늘어나는 개수
const PAGE_SIZE = 5

const splitDate = (date) => {
  const [year, month, day] = date.split('-')
  return { year, monthDay: `${month}.${day}` }
}

// 학과 행사 — 뉴스레터 아카이브처럼 날짜를 왼쪽에 크게 두고 최신순으로 쌓는다.
// 연도 탭 대신, 해가 바뀌는 지점에만 연도를 한 번 찍어 주고 아래는 '이전 행사 더보기'로 이어 본다.
// 몇 개까지 펼쳤는지는 ?more= 쿼리에 남겨서 상세에서 돌아와도 그 자리 그대로 보이게 한다.
export default function DepartmentEvents() {
  const [searchParams, setSearchParams] = useSearchParams()
  const events = DEPARTMENT_EVENTS
  const shown = Math.max(PAGE_SIZE, Number(searchParams.get('more')) || PAGE_SIZE)
  const visible = events.slice(0, shown)
  const remaining = events.length - visible.length

  const showMore = () => {
    setSearchParams({ more: String(shown + PAGE_SIZE) }, { replace: true, preventScrollReset: true })
  }

  return (
    <div className="activities">
      <PageHero photo photoSrc={heroActivities} title={['학과 활동']} />

      <nav className="activities__mobile-tabs" aria-label="학과 활동 분류">
        <Link to={`/activities/${ACTIVITY_LATEST_YEAR}`} className="activities__mobile-tab">
          학생활동
        </Link>
        <Link to="/activities/events" className="activities__mobile-tab is-active">
          학과 행사
        </Link>
      </nav>

      <div className="container page-layout">
        <ActivitiesSidebar activeKey="events" />

        <main className="page-layout__main">
          <section className="page-section">
            <h2>학과 행사</h2>

            {events.length === 0 ? (
              <EmptyState
                title="등록된 학과 행사가 없습니다"
                description="행사 소식이 올라오면 이곳에서 사진과 함께 볼 수 있어요."
                actions={[{ label: '학생활동 보기', to: `/activities/${ACTIVITY_LATEST_YEAR}` }]}
              />
            ) : (
              <ol className="devents__timeline">
                {visible.map((event, i) => {
                  const { year, monthDay } = splitDate(event.date)
                  const newYear = i === 0 || visible[i - 1].date.slice(0, 4) !== year
                  return (
                    <li key={event.id} className={newYear ? 'devents__item is-new-year' : 'devents__item'}>
                      <div className="devents__when">
                        {newYear && <span className="devents__year">{year}</span>}
                        <time dateTime={event.date} className="devents__md">
                          {monthDay}
                        </time>
                      </div>
                      <Link to={`/activities/events/${event.id}`} className="devents__row">
                        <span className="devents__body">
                          <strong className="devents__title">{event.title}</strong>
                          <span className="devents__summary">{event.summary}</span>
                          <span className="devents__more">
                            사진 {event.photos.length}장 보기 <span aria-hidden="true">→</span>
                          </span>
                        </span>
                        <span className="devents__thumb">
                          {event.photos[0] && <img src={event.photos[0]} alt="" />}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ol>
            )}

            {remaining > 0 && (
              <button type="button" className="devents__load-more" onClick={showMore}>
                이전 행사 더보기 <span>({remaining})</span>
              </button>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
