import PageHero from '../../components/common/PageHero'
import ChapterNav from '../../components/common/ChapterNav'
import { ABOUT_SECTIONS } from '../../constants/aboutNav'
import './EducationGoals.css'

const GOALS = [
  {
    no: '01',
    title: '기초이론과 전문지식 습득 및 학습 능력 배양',
    body: '소프트웨어가 사용되는 다양한 IT 융합 분야에 대한 기초이론과 전문지식을 습득하고, 지속적으로 학습할 수 있는 능력을 배양합니다.',
  },
  {
    no: '02',
    title: '소프트웨어 가치 확산을 위한 의사소통 역량',
    body: '소프트웨어의 가치를 다양한 분야와 사회에 확산할 수 있도록 소통하고 협력하는 역량을 갖춥니다.',
  },
  {
    no: '03',
    title: '문제 해결·도메인 적응·협업 실무 능력 함양',
    body: '현장에서 문제를 스스로 찾아내고 창의적으로 해결할 줄 아는 기술 전문성과 도메인 적응 능력을 갖추며, 협업 전문가로서의 실무 능력을 함양합니다.',
  },
]

const TALENTS = [
  { no: '01', title: '기술 전문성', lines: ['소프트웨어', '기술 역량'] },
  { no: '02', title: '의사소통 역량', lines: ['협력과 소통의', '연결 역량'], active: true },
  { no: '03', title: '사회 기여', lines: ['지속적인 성장과', '발전에 기여'] },
]

export default function EducationGoals() {
  return (
    <div className="education-goals">
      <PageHero photo title={['교육 목표 및 인재상']} />

      <div className="container page-layout">
        <ChapterNav sections={ABOUT_SECTIONS} />

        <main className="page-layout__main">
          <section className="page-section">
            <h2>교육 목표</h2>
            <div className="education-goals__list">
              {GOALS.map((goal) => (
                <div className="education-goals__row" key={goal.no}>
                  <span className="education-goals__no">{goal.no}</span>
                  <div>
                    <strong>{goal.title}</strong>
                    <p>{goal.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="page-section">
            <h2>인재상</h2>
            <p className="education-goals__lead">
              기술 전문성과 의사소통 역량을 갖추고 사회의 지속적인 성장과 발전에 기여하는
              소프트웨어융합 인재
            </p>

            <div className="talent-diagram">
              {TALENTS.map((talent, index) => (
                <div className="talent-diagram__item-wrap" key={talent.no}>
                  <div
                    className={
                      talent.active ? 'talent-diagram__circle talent-diagram__circle--active' : 'talent-diagram__circle'
                    }
                  >
                    <span className="talent-diagram__no">{talent.no}</span>
                    <strong>{talent.title}</strong>
                    <p>
                      {talent.lines.map((line) => (
                        <span key={line}>{line}</span>
                      ))}
                    </p>
                  </div>
                  {index < TALENTS.length - 1 && <span className="talent-diagram__connector" />}
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
