import PageHero from '../../components/common/PageHero'
import heroAbout from '../../assets/images/brand/hero-about.jpg'
import ChapterNav from '../../components/common/ChapterNav'
import { ABOUT_SECTIONS } from '../../constants/aboutNav'
import './About.css'

const LEARNING_CARDS = [
  { no: '01', title: 'AI·데이터', desc: '데이터를 이해하고 AI 기술을 실제 서비스에 적용합니다.' },
  { no: '02', title: '서비스 개발', desc: '사용자 문제를 정의하고 제품으로 구현합니다.' },
  { no: '03', title: '협업과 성장', desc: '팀 프로젝트와 현장 경험으로 함께 성장합니다.' },
]

const MAJOR_INTRO = [
  {
    no: '01',
    title: '소프트웨어 기술',
    body: '소프트웨어 기술은 컴퓨터나 모바일 기기에서 사용되는 소프트웨어뿐만 아니라 금융, 기계, 미디어, 건설, 의료, 국방 등 다양한 산업 분야에서 필요한 소프트웨어를 기획, 설계, 개발 및 운영하는 기술이다.',
  },
  {
    no: '02',
    title: '교육 목표',
    body: '소프트웨어학과는 이러한 소프트웨어가 활용되는 다양한 분야에 응용 가능한 이론 및 기술에 대한 기초 지식과 새로운 분야에 대한 소프트웨어의 응용 및 적용 능력을 고루 갖춘 인재 양성을 교육의 목표로 삼고 있다.',
  },
  {
    no: '03',
    title: '체계적인 전공 교육과정',
    body: '교과 과정은 <소프트웨어개론>, <컴퓨터수학>, <확률과 통계>, <자료구조>, <컴퓨터알고리즘>, <웹프로그래밍>, <운영체제>, <데이터베이스>, <컴퓨터통신및네트워크>, <영상처리>, 그리고 다양한 프로그래밍 과목 등을 포함하는 기초과정을 비롯하여, <인공지능>, <기계학습>, <대규모 언어 모델>, <클라우드오픈소스소프트웨어>, <빅데이터 분석>, <딥러닝 및 응용> 등 최신 기술에 기반한 고급 과정이 개설되어 있다.',
  },
  {
    no: '04',
    title: '프로젝트와 산업 연계 프로그램',
    body: '또한 효과적인 문제해결 및 협업 능력을 계발할 수 있는 <프로젝트종합설계 I/II>와 산업체 전문가들과 함께 하는 <소프트웨어진로탐색> 과목이 있으며, 소프트웨어 관련 기술을 심도 있게 학습할 수 있는 사제동행 프로그램이나 고급 전문가로의 성장을 위한 학부-대학원 연계 산학협력 프로젝트와 학·석사연계 과정 등이 운영되고 있다.',
  },
]

export default function About() {
  return (
    <div className="about">
      <PageHero photo photoSrc={heroAbout} title={['학과 소개']} />

      <div className="container page-layout">
        <ChapterNav sections={ABOUT_SECTIONS} />

        <main className="page-layout__main">
          <section className="page-section">
            <h2>학과 특징</h2>
            <div className="about__learning-grid">
              {LEARNING_CARDS.map((card) => (
                <div className="about__learning-card" key={card.no}>
                  <span className="about__learning-no">{card.no}</span>
                  <strong>{card.title}</strong>
                  <p>{card.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="page-section">
            <h2>전공 소개</h2>
            <div className="about__major">
              {MAJOR_INTRO.map((item, index) => (
                <div
                  className={
                    index === MAJOR_INTRO.length - 1
                      ? 'about__major-row about__major-row--last'
                      : 'about__major-row'
                  }
                  key={item.no}
                >
                  <span className="about__major-no">{item.no}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.body}</p>
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
