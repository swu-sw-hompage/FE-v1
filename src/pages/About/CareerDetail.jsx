import { Link, useParams } from 'react-router-dom'
import PageHero from '../../components/common/PageHero'
import ChapterNav from '../../components/common/ChapterNav'
import { ABOUT_SECTIONS, CAREER_FIELDS } from '../../constants/aboutNav'
import './CareerDetail.css'

const INFO_ROWS = [
  { key: 'duties', label: '수행 직무' },
  { key: 'skills', label: '필요 역량' },
  { key: 'prep', label: '준비 방향' },
  { key: 'advice', label: '유관 전공 · 기타 조언' },
]

export default function CareerDetail() {
  const { slug } = useParams()
  const field = CAREER_FIELDS.find((f) => f.slug === slug)

  if (!field) {
    return (
      <div className="container">
        <p>존재하지 않는 진로 분야입니다.</p>
        <Link to="/about/career">← 졸업 후 진로로 돌아가기</Link>
      </div>
    )
  }

  return (
    <div className="career-detail">
      <PageHero photo title={['졸업 후 진로']} />

      <div className="container page-layout">
        <ChapterNav sections={ABOUT_SECTIONS} />

        <main className="page-layout__main">
          <section className="page-section">
            <h2>졸업 후 진로</h2>
            <div className="career-detail__grid">
              {CAREER_FIELDS.map((f) => (
                <Link
                  to={`/about/career/${f.slug}`}
                  className={
                    f.slug === field.slug
                      ? 'career-detail__card career-detail__card--active'
                      : 'career-detail__card'
                  }
                  key={f.slug}
                >
                  <span>{f.no}</span>
                  <strong>{f.title}</strong>
                  <p>{f.summary}</p>
                  <em>자세히 보기 →</em>
                </Link>
              ))}
            </div>

            <div className="career-detail__panel">
              <p className="career-detail__field-title">{field.heading}</p>
              <p className="career-detail__field-summary">{field.summary}</p>
              <div className="career-detail__accent" />

              <div className="career-detail__summary-row">
                <div>
                  <p className="career-detail__label">대표 직무</p>
                  <p className="career-detail__value">{field.jobs}</p>
                </div>
                <div>
                  <p className="career-detail__label">주요 진출처</p>
                  <p className="career-detail__value">{field.destinations}</p>
                </div>
              </div>

              {INFO_ROWS.map((row) => (
                <div className="career-detail__info-row" key={row.key}>
                  <p className="career-detail__label">{row.label}</p>
                  <ul>
                    {field[row.key].map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
