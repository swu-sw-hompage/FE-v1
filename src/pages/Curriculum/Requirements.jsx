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
      '공인 외국어 성적 인증 (TOEIC, TOEFL 등)',
      '1인 1지식재산권 획득 (논문발표 또는 특허출원)',
      '소프트웨어개발실무영어 I·II 과목 이수',
      '방학 중 프로그래밍 Guru 1·2 교육 이수 및 수료증 제출',
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
    items: ['소프트웨어학과 복수전공필수 과목 모두 이수 및 복수전공 학점(42학점) 이상 이수'],
  },
]

const CERTIFICATION_STEPS = [
  { no: '01', title: '전공필수 수강', items: ['「소프트웨어역량인증」 과목을 수강합니다.'] },
  { no: '02', title: '증빙자료 제출', items: ['인증 조건의 증빙서류 일체를 해당 과목의 지정 과제함에 제출합니다.'] },
  { no: '03', title: '교수 검증', items: ['담당교수는 서류를 검증하고 P 또는 F를 부여합니다.'] },
  { no: '04', title: '졸업 판정', items: ['전공필수인 이 과목에서 F를 받으면 졸업이 자동 유보됩니다.'] },
]

export default function Requirements() {
  const [cohortId, setCohortId] = useState('from2017')
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
                cohortId === 'until2016'
                  ? 'requirements__list requirements__list--no-guru'
                  : 'requirements__list'
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
                  {'※ 2026학년도부터 지식재산권 조건에서 SW 등록 실적은 인정되지 않습니다.'}
                </p>
              </div>
            )}
          </section>

          <section className="page-section">
            <h2>{cohortId === 'from2017' ? '졸업인증 신청 절차' : '전형별 추가 졸업요건'}</h2>

            <div className="requirements__additional">
              {(cohortId === 'from2017' ? CERTIFICATION_STEPS : ADDITIONAL).map((row) => (
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
            {cohortId === 'from2017' && (
              <div className="requirements__official-note">
                <strong>2026학년도 공식 안내</strong>
                <p>2016학년도 이전 입학생, 외국인 학생 또는 학과 교수회의에서 특별한 사유로 인정한 경우 예외 적용 대상이 될 수 있습니다. 적용 여부는 학과사무실에 확인해 주세요.</p>
                <p>담당교수는 통상 본인이 수강한 「프로젝트종합설계 I·II」 담당교수입니다.</p>
                <a href="/notice/3">2026학년도 학과 졸업인증 공지 자세히 보기 →</a>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
