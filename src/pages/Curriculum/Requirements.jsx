import { Link } from 'react-router-dom'
import PageHero from '../../components/common/PageHero'
import ChapterNav from '../../components/common/ChapterNav'
import { CURRICULUM_SECTIONS } from '../../constants/aboutNav'
import './Requirements.css'

// 2026.07.28 학과 공지: 2026학년도 학과 졸업 인증 제도 관련 안내 사항
const REQUIREMENTS = [
  { title: '공인 외국어 성적 인증', detail: 'TOEIC, TOEFL 등 공인 외국어 성적을 제출합니다.' },
  { title: '1인 1지식재산권 획득', detail: '논문발표 또는 특허출원이 인정됩니다. 2026학년도부터 소프트웨어(SW) 등록 실적은 인정되지 않습니다.' },
  { title: '소프트웨어개발실무영어 I·II 이수', detail: '소프트웨어개발실무영어 I, II 과목을 이수합니다.' },
  { title: '프로그래밍 Guru 1·2 이수', detail: '방학 중 프로그래밍 Guru 1, 2 교육을 이수하고 수료증을 제출합니다.' },
]

const STEPS = [
  '전공필수 과목인 「소프트웨어역량인증」을 수강합니다.',
  '모든 졸업인증 증빙서류를 「소프트웨어역량인증」 과목의 지정 과제함에 제출합니다.',
  '담당교수가 제출 서류를 검증하고 P/F 성적을 부여합니다.',
  '전공필수인 이 과목에서 F를 받으면 졸업이 자동 유보됩니다.',
]

export default function Requirements() {
  return (
    <div className="requirements">
      <PageHero photo title={['졸업 인증']} />
      <div className="container page-layout">
        <ChapterNav sections={CURRICULUM_SECTIONS} />
        <main className="page-layout__main">
          <section className="page-section">
            <h2>졸업 인증 조건</h2>
            <p className="requirements__intro">학과 졸업인증을 위해 아래 네 가지 조건을 모두 충족해야 합니다. 2026학년도 학과 공지 기준입니다.</p>
            <ol className="requirements__list">
              {REQUIREMENTS.map((item, i) => (
                <li key={item.title}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <p>{item.title}</p>
                    <p className="requirements__detail">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="requirements__guru">
              <p className="requirements__guru-title">Guru 수료증 확인 방법</p>
              <div className="requirements__guru-divider" />
              <p className="requirements__guru-steps">학생성장지원시스템 → 마이페이지 → 학습활동 → GURU 비교과과목 → 활동 → 수료증 다운로드</p>
              <p className="requirements__guru-note">※ 2026학년도부터 SW 등록 실적은 지식재산권 요건으로 인정되지 않습니다.</p>
            </div>
          </section>
          <section className="page-section">
            <h2>졸업 인증 신청 절차</h2>
            <ol className="requirements__additional">
              {STEPS.map((step, i) => (
                <li className="requirements__row" key={step}>
                  <div className="requirements__row-label">
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    <strong>{['과목 수강', '서류 제출', '담당교수 확인', '성적·졸업 판정'][i]}</strong>
                  </div>
                  <div className="requirements__row-copy"><p>{step}</p></div>
                </li>
              ))}
            </ol>
            <div className="requirements__notice">
              <strong>예외 적용 안내</strong>
              <p>2016학년도 이전 입학생, 외국인 학생 또는 학과 교수회의에서 특별한 사유가 있다고 인정한 경우는 예외 적용 대상으로 안내되어 있습니다. 해당 여부는 학과사무실에 확인해 주세요.</p>
              <p>담당교수는 통상 본인이 수강한 「프로젝트종합설계 I·II」 과목의 담당교수입니다.</p>
              <Link to="/notice/3" className="requirements__source">2026학년도 학과 졸업인증 공식 공지 확인 →</Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
