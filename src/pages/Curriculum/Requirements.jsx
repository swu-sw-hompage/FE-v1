import { useState } from 'react'
import PageHero from '../../components/common/PageHero'
import ChapterNav from '../../components/common/ChapterNav'
import { CURRICULUM_SECTIONS } from '../../constants/aboutNav'
import './Requirements.css'

const COHORTS = [
  {
    id: 'until2016',
    label: '~2016학번까지',
    items: ['공인외국어 성적', '취업준비 프로그램 이수 인증'],
  },
  {
    id: 'from2017',
    label: '2017학번부터',
    items: [
      '공인외국어 성적',
      '취업준비 프로그램 이수 인증',
      "'Guru 1', 'Guru 2' 이수",
      "'소프트웨어개발실무영어 I', '소프트웨어개발실무영어 II' 이수",
      '1인 1 SW지적재산권 취득 (SW등록, 논문, 특허출원 등)',
    ],
  },
]

const ADDITIONAL = [
  {
    no: '01',
    title: '2017학번 이후 편입생',
    items: [
      "'Guru 1', 'Guru 2' 중 한 가지 이수",
      "'소프트웨어개발실무영어 I', '소프트웨어개발실무영어 II' 중 한 가지 이수",
      '1인 1 SW지적재산권 한 가지 취득 (SW등록, 논문, 특허출원 등)',
    ],
  },
  {
    no: '02',
    title: '복수전공생',
    items: ['소프트웨어융합학과 복수전공필수 과목 모두 이수 및 복수전공 학점(42학점) 이상 이수'],
  },
]

export default function Requirements() {
  const [cohortId, setCohortId] = useState(COHORTS[1].id)
  const cohort = COHORTS.find((c) => c.id === cohortId)

  return (
    <div className="requirements">
      <PageHero photo title={['졸업 요건']} />

      <div className="container page-layout">
        <ChapterNav sections={CURRICULUM_SECTIONS} />

        <main className="page-layout__main">
          <section className="page-section">
            <h2>졸업 요건</h2>

            <div className="requirements__tabs">
              {COHORTS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={
                    c.id === cohortId
                      ? 'requirements__tab requirements__tab--active'
                      : 'requirements__tab'
                  }
                  onClick={() => setCohortId(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <ol
              className={
                cohortId === 'from2017'
                  ? 'requirements__list'
                  : 'requirements__list requirements__list--no-guru'
              }
            >
              {cohort.items.map((item, i) => (
                <li key={item}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <p>{item}</p>
                </li>
              ))}
            </ol>

            {cohortId === 'from2017' && (
              <div className="requirements__guru">
                <p className="requirements__guru-title">GURU 1·2 이수 여부 확인 방법</p>
                <div className="requirements__guru-divider" />
                <p className="requirements__guru-steps">
                  학생성장지원시스템 &gt; 마이페이지 &gt; 학습활동 &gt; GURU 비교과목 &gt; 활동 &gt; 수료증 다운로드
                </p>
                <p className="requirements__guru-note">
                  ※ 일정 기간 이전의 이수 여부는 확인이 불가하므로, 학과사무실(970-5921)로 문의 바랍니다.
                </p>
              </div>
            )}

            <h2 className="requirements__additional-title">전형별 추가 졸업요건</h2>

            <div className="requirements__additional">
              {ADDITIONAL.map((row) => (
                <div className="requirements__row" key={row.no}>
                  <div className="requirements__row-label">
                    <span>{row.no}</span>
                    <strong>{row.title}</strong>
                  </div>
                  <div className="requirements__row-copy">
                    {row.items.map((item) => (
                      <p key={item}>{item}</p>
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
