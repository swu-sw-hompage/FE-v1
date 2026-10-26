import { Link, useParams } from 'react-router-dom'
import PageHero from '../../components/common/PageHero'
import ChapterNav from '../../components/common/ChapterNav'
import SegmentTabs from '../../components/common/SegmentTabs'
import InfoRows from '../../components/common/InfoRows'
import { ABOUT_SECTIONS, CAREER_FIELDS } from '../../constants/aboutNav'
import './CareerDetail.css'

// 전공로드맵(/curriculum/roadmap)의 같은 진로 탭으로 바로 연결
const ROADMAP_TRACK = { 'server-cloud': 'cloud', 'ai-sw': 'ai', research: 'research' }

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

  const rows = INFO_ROWS.map((row, i) => ({
    no: String(i + 1).padStart(2, '0'),
    title: row.label,
    items: field[row.key],
  }))

  return (
    <div className="career-detail">
      <PageHero photo title={['졸업 후 진로']} />

      <div className="container page-layout">
        <ChapterNav sections={ABOUT_SECTIONS} />

        <main className="page-layout__main">
          <section className="page-section">
            <h2>졸업 후 진로</h2>

            <SegmentTabs
              label="진로 분야 선택"
              items={CAREER_FIELDS.map((f) => ({
                id: f.slug,
                no: f.no,
                label: f.title,
                to: `/about/career/${f.slug}`,
              }))}
              active={field.slug}
            />

            <div className="career-detail__intro">
              <p className="career-detail__intro-title">{field.heading}</p>
              <p className="career-detail__intro-summary">{field.summary}</p>
              <div className="career-detail__intro-divider" />
              <dl className="career-detail__facts">
                <div>
                  <dt>대표 직무</dt>
                  <dd>{field.jobs}</dd>
                </div>
                <div>
                  <dt>주요 진출처</dt>
                  <dd>{field.destinations}</dd>
                </div>
              </dl>
            </div>

            <InfoRows rows={rows} />

            <Link className="career-detail__roadmap-link" to={`/curriculum/roadmap?track=${ROADMAP_TRACK[field.slug]}`}>
              전공로드맵에서 추천 과목 보기 →
            </Link>
          </section>
        </main>
      </div>
    </div>
  )
}
