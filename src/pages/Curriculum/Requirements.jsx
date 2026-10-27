import PageHero from '../../components/common/PageHero'
import heroCurriculum from '../../assets/images/brand/hero-curriculum.jpg'
import ChapterNav from '../../components/common/ChapterNav'
import InfoRows from '../../components/common/InfoRows'
import { CURRICULUM_SECTIONS } from '../../constants/aboutNav'
import './Requirements.css'

const REQUIREMENTS = [
  '공인 외국어 성적 인증 (TOEIC, TOEFL 등)',
  '1인 1지식재산권 획득 (논문발표 또는 특허출원)',
  '소프트웨어개발실무영어 I·II 과목 이수',
  '방학 중 프로그래밍 Guru 1·2 교육 이수 및 수료증 제출',
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
  return (
    <div className="requirements">
      <PageHero photo photoSrc={heroCurriculum} title={['졸업 요건']} />

      <div className="container page-layout">
        <ChapterNav sections={CURRICULUM_SECTIONS} />

        <main className="page-layout__main">
          <section className="page-section">
            <h2>졸업 요건</h2>

            <ol className="requirements__list">
              {REQUIREMENTS.map((item, i) => (
                <li key={item}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <p>{item}</p>
                </li>
              ))}
            </ol>

            <div className="requirements__guru requirements__guru--stacked">
              <p className="requirements__guru-title">GURU 1·2 이수 여부 확인 방법</p>
              <div className="requirements__guru-divider" />
              <p className="requirements__guru-steps">
                학생성장지원시스템 &gt; 마이페이지 &gt; 학습활동 &gt; GURU 비교과목 &gt; 활동 &gt; 수료증 다운로드
              </p>
              <p className="requirements__guru-note">
                {'※ 2026학년도부터 지식재산권 조건에서 SW 등록 실적은 인정되지 않습니다.'}
              </p>
            </div>

            <div className="requirements__guru">
              <p className="requirements__guru-title">2016학번 이전 입학생</p>
              <div className="requirements__guru-divider" />
              <p className="requirements__guru-steps">
                공인외국어 성적과 취업준비 프로그램 이수 인증으로 졸업 요건을 충족합니다.
              </p>
              <p className="requirements__guru-note">
                {'※ 자세한 적용 기준은 학과사무실에 문의해 주세요.'}
              </p>
            </div>
          </section>

          <section className="page-section">
            <h2>전형별 추가 졸업요건</h2>
            <InfoRows rows={ADDITIONAL} />
          </section>

          <section className="page-section">
            <h2>졸업인증 신청 절차</h2>

            <InfoRows rows={CERTIFICATION_STEPS} />
            <div className="requirements__guru requirements__guru--after-steps">
              <p className="requirements__guru-title">졸업인증 참고 사항</p>
              <div className="requirements__guru-divider" />
              <p className="requirements__guru-steps">
                담당교수는 통상 본인이 수강한 「프로젝트종합설계 I·II」 담당교수입니다.
              </p>
              <p className="requirements__guru-note">
                {'※ 2016학년도 이전 입학생, 외국인 학생, 학과 교수회의에서 특별한 사유로 인정한 경우 예외 적용 대상이 될 수 있습니다. 적용 여부는 학과사무실에 확인해 주세요.'}
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
