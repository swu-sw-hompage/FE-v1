import PageHero from '../../components/common/PageHero'
import heroAbout from '../../assets/images/brand/hero-about.jpg'
import ChapterNav from '../../components/common/ChapterNav'
import { ABOUT_SECTIONS } from '../../constants/aboutNav'
import './History.css'

const HISTORY = [
  {
    year: '2015',
    events: [
      { title: '멀티미디어학과', desc: '소프트웨어융합학과 개편 이전 학과명' },
    ],
  },
  {
    year: '2016',
    events: [
      { title: '소프트웨어융합학과로 학과명 변경', desc: '멀티미디어학과 → 소프트웨어융합학과' },
      { title: '미래산업융합대학 소속으로 개편', desc: '정보미디어대학 → 미래산업융합대학' },
      { title: '서울여자대학교 SW중심대학 선정', desc: '정부 SW교육 혁신 지원사업 선정' },
    ],
  },
  {
    year: '2020',
    events: [{ title: 'SW중심대학 사업 2년 연장', desc: '2016년 선정 사업의 후속 연장 · 총 6년간 운영' }],
  },
  {
    year: '2026',
    events: [{ title: '소프트웨어학과로 학과명 변경', desc: '소프트웨어융합학과 → 소프트웨어학과' }],
  },
]

export default function History() {
  return (
    <div className="history">
      <PageHero photo photoSrc={heroAbout} title={['연혁']} />

      <div className="container page-layout">
        <ChapterNav sections={ABOUT_SECTIONS} />

        <main className="page-layout__main">
          <section className="page-section">
            <h2>연혁</h2>
            <div className="history__timeline">
              {HISTORY.map((group) => (
                <div className="history__group" key={group.year}>
                  <p className="history__year">{group.year}</p>
                  <div className="history__events">
                    {group.events.map((event) => (
                      <div className="history__event" key={event.title}>
                        <span className="history__dot" />
                        <div>
                          <strong>{event.title}</strong>
                          <p>{event.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
