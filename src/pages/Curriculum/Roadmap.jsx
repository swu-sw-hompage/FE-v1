import { useState } from 'react'
import PageHero from '../../components/common/PageHero'
import ChapterNav from '../../components/common/ChapterNav'
import { CURRICULUM_SECTIONS } from '../../constants/aboutNav'
import './Roadmap.css'

// 소프트웨어학과 최신 전공가이드북 「교육과정 이수 체계도」의 진로별·학년별 교과목.
// 이 체계도는 추천 이수 경로이므로 개설 학기나 필수/선택 구분을 임의로 표시하지 않는다.
const TRACKS = [
  {
    id: 'research',
    no: '01',
    name: '학문·연구',
    subtitle: '이론과 연구를 바탕으로 새로운 기술을 탐구하는 진로',
    careers: ['정보통신기술자', '교수', '연구원'],
    years: [
      ['소프트웨어개론', '컴퓨터수학', '확률과통계', 'C++프로그래밍기초', 'C++프로그래밍응용', '소프트웨어진로탐색'],
      ['자료구조', '컴퓨터알고리즘', '컴퓨터구조', '운영체제', '빅데이터수집및마이닝(캡스톤디자인)', 'JAVA프로그래밍기초', 'JAVA프로그래밍응용', '윈도우프로그래밍'],
      ['기계학습', '데이터통신및네트워크', '영상처리', '컴퓨터그래픽스', '데이터베이스기초', '데이터베이스응용', '웹프로그래밍', '소프트웨어커리어디자인', '인공지능'],
      ['빅데이터분석', 'VR/AR/MR프로그래밍', '프로젝트종합설계Ⅰ(캡스톤디자인)', '프로젝트종합설계Ⅱ(캡스톤디자인)', '딥러닝및응용'],
    ],
  },
  {
    id: 'cloud',
    no: '02',
    name: '서버·클라우드 플랫폼',
    subtitle: '웹·앱 서비스와 클라우드 인프라를 설계하고 운영하는 진로',
    careers: ['웹·앱 기획자', '웹·앱 프로그래머', '서버 관리자'],
    years: [
      ['소프트웨어개론', 'C++프로그래밍기초', 'C++프로그래밍응용', '웹디자인및기획', '소프트웨어진로탐색'],
      ['자료구조', '컴퓨터알고리즘', 'JAVA프로그래밍기초', 'JAVA프로그래밍응용', '컴퓨터비전', '운영체제', '컴퓨터구조', '웹표준언어', '빅데이터수집및마이닝(캡스톤디자인)'],
      ['웹프로그래밍', '데이터통신및네트워크', '데이터베이스기초', '데이터베이스응용', '영상처리', '소프트웨어커리어디자인', '클라우드오픈소스소프트웨어'],
      ['프로젝트종합설계Ⅰ(캡스톤디자인)', '프로젝트종합설계Ⅱ(캡스톤디자인)', '유닉스프로그래밍', '소프트웨어와스타트업'],
    ],
  },
  {
    id: 'ai',
    no: '03',
    name: 'AI·SW 개발',
    subtitle: '인공지능과 응용 소프트웨어를 기획·개발하는 진로',
    careers: ['AI·SW 응용 프로그램 개발자'],
    years: [
      ['소프트웨어개론', '컴퓨터수학', 'C++프로그래밍기초', 'C++프로그래밍응용', '소프트웨어진로탐색'],
      ['자료구조', '컴퓨터알고리즘', 'JAVA프로그래밍기초', 'JAVA프로그래밍응용', '컴퓨터비전', '빅데이터수집및마이닝(캡스톤디자인)', '윈도우프로그래밍'],
      ['데이터통신및네트워크', '데이터베이스기초', '데이터베이스응용', '기계학습', '영상처리', 'DIY종합설계프로그래밍', '소프트웨어커리어디자인', '인공지능', '모바일프로그래밍'],
      ['빅데이터분석', '딥러닝및응용', '프로젝트종합설계Ⅰ(캡스톤디자인)', '프로젝트종합설계Ⅱ(캡스톤디자인)', '소프트웨어와스타트업', 'VR/AR/MR프로그래밍', '유닉스프로그래밍'],
    ],
  },
]

const REPRESENTATIVE_COURSES = [
  {
    year: '2학년',
    name: '컴퓨터알고리즘',
    detail: '프로그래밍으로 문제를 효과적으로 해결하는 다양한 방법을 배웁니다.',
  },
  {
    year: '3학년',
    name: '인공지능',
    detail: '인공지능 기본 개념과 신경망 기술을 학습하고, 딥러닝 프레임워크 실습과 최신 응용 사례를 살펴봅니다.',
  },
  {
    year: '3학년',
    name: '데이터베이스 기초·응용',
    detail: '관계형 데이터베이스 구조와 SQL 연산을 배우고 데이터베이스의 활용 역량을 기릅니다.',
  },
  {
    year: '4학년',
    name: '빅데이터분석',
    detail: '다양한 영역의 빅데이터에서 의미 있는 인사이트를 도출하는 분석 방법을 배웁니다.',
  },
]

export default function Roadmap() {
  const [selected, setSelected] = useState(TRACKS[0].id)
  const track = TRACKS.find((item) => item.id === selected) ?? TRACKS[0]

  return (
    <div className="roadmap">
      <PageHero photo title={['전공로드맵']} />
      <div className="container page-layout">
        <ChapterNav sections={CURRICULUM_SECTIONS} />
        <main className="page-layout__main">
          <section className="page-section">
            <h2>진로별 전공로드맵</h2>
            <p className="roadmap__intro">
              최신 소프트웨어학과 전공가이드북의 교육과정 이수 체계도를 기준으로 진로별 추천 교과목을 정리했습니다.
              관심 있는 진로를 선택하여 1학년부터 4학년까지의 학습 경로를 확인해 보세요.
            </p>

            <div className="roadmap__career-tabs" role="tablist" aria-label="진로 분야">
              {TRACKS.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  role="tab"
                  id={'roadmap-tab-' + item.id}
                  aria-selected={selected === item.id}
                  aria-controls="roadmap-track-panel"
                  className={'roadmap__career-tab' + (selected === item.id ? ' roadmap__career-tab--active' : '')}
                  onClick={() => setSelected(item.id)}
                >
                  <span>{item.no}</span>{item.name}
                </button>
              ))}
            </div>

            <div id="roadmap-track-panel" className="roadmap__track" role="tabpanel" aria-labelledby={'roadmap-tab-' + track.id}>
              <div className="roadmap__track-head">
                <div>
                  <span className="roadmap__track-eyebrow">CAREER ROADMAP</span>
                  <h3>{track.name}</h3>
                  <p>{track.subtitle}</p>
                </div>
              </div>
              <div className="roadmap__track-years">
                {track.years.map((courses, index) => (
                  <section className="roadmap__year-card" key={index}>
                    <div className="roadmap__year-head">
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <h4>{index + 1}학년</h4>
                    </div>
                    <ul>
                      {courses.map((course) => <li key={course}>{course}</li>)}
                    </ul>
                  </section>
                ))}
              </div>
              <div className="roadmap__careers">
                <strong>관련 진출 직업</strong>
                <div>{track.careers.map((career) => <span key={career}>{career}</span>)}</div>
              </div>
            </div>
            <p className="roadmap__footnote">
              ※ 전공가이드북의 진로별 이수 체계도입니다. 실제 개설 학기·수강 가능 여부·전공필수 여부는 해당 학년도 공식 교육과정과 수강편람을 확인해 주세요.
            </p>
          </section>

          <section className="page-section">
            <h2>대표 전공과목</h2>
            <p className="roadmap__intro">전공가이드북에 소개된 주요 교과목 네 가지입니다.</p>
            <div className="roadmap__representative">
              {REPRESENTATIVE_COURSES.map((course) => (
                <article className="roadmap__representative-card" key={course.name}>
                  <span>{course.year}</span>
                  <h3>{course.name}</h3>
                  <p>{course.detail}</p>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
