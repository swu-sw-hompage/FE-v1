import { useState } from 'react'
import PageHero from '../../components/common/PageHero'
import ChapterNav from '../../components/common/ChapterNav'
import { CURRICULUM_SECTIONS } from '../../constants/aboutNav'
import './Roadmap.css'

const COURSE_DESC_PLACEHOLDER = '과목 설명 · 강의계획서 기준 입력 예정'
// 추천 이유가 없는 과목은 모두 교양필수 과목이다.
const LIBERAL_REQUIRED_LABEL = '교양필수'

const GUIDEBOOK_TRACKS = [
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

const YEARS = [
  {
    no: '01',
    year: '1학년',
    highlight: true,
    semesters: [
      {
        label: '1학기',
        courses: [
          {
            title: '소프트웨어진로탐색(1)',
            tag: '필수',
            desc: '소프트웨어 전공을 수행하는 데 있어 필요한 학습동기를 부여받고, 다양한 전공실무영역을 미리 체험하여 장래 직업 및 진로탐색에 도움되는 정보를 체득할 수 있도록 전공과 관련된 세미나 및 특강 또는 취업 관련 행사에 참석한다.',
          },
          {
            title: 'C++프로그래밍 기초(3)',
            tag: '필수',
            desc: '컴퓨터 프로그램을 처음 시작하는 학생들을 위한 과목으로, 프로그래밍 언어의 구문보다는 문제 해결에 중점을 두는 문제 구동 방식을 사용한다. 선택문·반복문·함수·배열에 대한 기본 개념을 이해하고, 이를 기반으로 기본 프로그래밍 기법을 학습한다.',
          },
          {
            title: '컴퓨터수학(3)',
            tag: '선택',
            desc: '소프트웨어학과에서 필수적인 수학적 기초를 다루는 과목으로, 수학적 모델·증명·함수와 그래프·부울대수·행렬과 벡터·확률과 통계·미분과 적분 등을 학습해 논리적 사고와 컴퓨터 이론의 기초를 다진다.',
          },
        ],
      },
      {
        label: '2학기',
        courses: [
          {
            title: '확률과통계(3)',
            tag: '선택',
            desc: '인공지능과 빅데이터 분석 등의 기본 이론을 이해하기 위해 필요한 집합과 함수, 미분과 적분, 자료의 정리와 수치적 특성, 확률, 확률변수와 분포, 추정 및 가설 검증 등을 다룬다.',
          },
        ],
      },
    ],
  },
  {
    no: '02',
    year: '2학년',
    semesters: [
      {
        label: '1학기',
        courses: [
          {
            title: '자료구조(3)',
            tag: '필수',
            desc: '컴퓨터 프로그래밍에 사용되는 기본적인 자료 구조(배열·연결리스트·스택·큐·트리·그래프)의 원리와 활용 방법을 배우고, 프로그래밍 실습 및 과제를 통해 심화 학습한다. 컴퓨터 소프트웨어 개론 및 C/C++ 또는 파이썬 프로그래밍 기초 지식이 필요하다.',
          },
        ],
      },
      { label: '2학기', courses: [] },
    ],
  },
  {
    no: '03',
    year: '3학년',
    semesters: [
      { label: '1학기', courses: [] },
      {
        label: '2학기',
        courses: [
          {
            title: '소프트웨어커리어디자인(1)',
            tag: '필수',
            desc: '산업 현장에서 제시하는 요구와 기술 발전 흐름을 파악하고, 사회 진출에 대비한 경력 개발에 필요한 도움을 받을 수 있도록 전공 관련 세미나·특강 또는 취업 관련 행사에 참석하고 결과보고서를 제출하는 방식으로 운영된다.',
          },
          {
            title: '인공지능(3)',
            tag: '선택',
            desc: '기초 머신러닝에서 최신 생성형 AI로 도약하기 위한 과목으로, 퍼셉트론·역전파·합성곱 신경망(CNN)부터 순환신경망(RNN/LSTM), 오토인코더·생성적 적대 신경망(GAN)까지 다루며 PyTorch 실습을 통해 ChatGPT·Stable Diffusion 등 최신 AI의 작동 원리를 이해할 기반을 갖춘다.',
          },
        ],
      },
    ],
  },
  {
    no: '04',
    year: '4학년',
    semesters: [
      {
        label: '1학기',
        courses: [
          {
            title: '프로젝트종합설계I(3)',
            tag: '필수',
            desc: '졸업 후 산업 현장에서 필요한 실무 능력을 사전에 경험하는 캡스톤 디자인 과목으로, 프로젝트 기획부터 구현·테스트, 결과 발표까지 학생 스스로 팀을 구성해 문제를 해결하며 자기 주도적 문제 해결 능력을 기른다.',
          },
          {
            title: '소프트웨어역량인증(0)',
            tag: '필수',
            desc: '졸업인증 조건을 확인하는 전공필수 과목. 공인외국어 성적, 논문발표 또는 특허출원, 소프트웨어개발실무영어 I·II 및 프로그래밍 Guru 1·2 수료증을 제출해 P/F 평가를 받는다. 2026학년도부터 SW 등록 실적은 인정되지 않는다.',
          },
          {
            title: '빅데이터분석(3)',
            tag: '선택',
            desc: '스몰데이터와 빅데이터를 정의하고 구별하는 이론적 배경을 학습한다. 다양한 분야에서 수집된 빅데이터를 활용해 원하는 정보를 추출하는 파이썬 기반 데이터 분석 방법을 배우고 실습하며 실무 능력을 배양한다.',
          },
        ],
      },
      {
        label: '2학기',
        courses: [
          {
            title: '프로젝트종합설계II(3)',
            tag: '필수',
            desc: '프로젝트종합설계I에 이어지는 캡스톤 디자인 과목으로, 팀을 구성해 산업 현장·실생활 문제를 직접 기획·설계·구현하여 학기말에 공개 발표한다. 인공지능 기술 활용을 의무화해 취업 전 AI 응용 기술 습득을 유도한다.',
          },
          {
            title: '소프트웨어와스타트업(1)',
            tag: '선택',
            desc: '산업기술의 최신 동향과 소프트웨어 기술 전망에 대해 전임 교수 및 산업체 전문가가 팀티칭으로 진행한다. 최신 업계 동향을 인지해 졸업 후 취업 또는 스타트업 등 진로 선택에 도움을 얻는다.',
          },
          {
            title: 'VR/AR/MR프로그래밍(3)',
            tag: '선택',
            desc: '3D 인공세계에 몰입해 실시간 상호작용으로 현실감을 체험하는 가상현실 기술의 원리를 학습한다. Web3D 기반 가상객체 모델링, 이벤트 생성, 3D 애니메이션 등을 활용해 동적인 가상세계를 직접 제작한다.',
          },
        ],
      },
    ],
  },
]

const LIBERAL_ARTS = [
  {
    year: '1학년',
    courses: [
      { title: '기독교개론(2)' },
      { title: 'AI와창의적 문제해결(3)' },
      { title: '대학영어(듣기말하기)(2)' },
      { title: '바롬인성교육(1)' },
      {
        title: '수학의세계(3)',
        reason:
          '현대 수학의 주요 기초 분야인 집합론, 해석학, 선형대수학, 기하학 등에서 핵심적인 부분만을 선별하여 강의',
      },
      {
        title: '기초통계학(3)',
        reason: '수학의 깊은 지식을 요하지 않는 범위 내에서 통계학의 개념들과 기초적인 확률분포를 소개',
      },
      {
        title: '생활속의글쓰기(3)',
        reason: '리포트 작성법이나 자기소개서, 공문서 작성법, 문예적 글쓰기 등 생활에 필요한 기초적인 작업들을 실행',
      },
    ],
  },
  {
    year: '2학년',
    courses: [
      {
        title: '기업가정신과 비즈니스기회발굴(3)',
        reason: '새로운 비즈니스 기회를 발굴하고 평가하는 예비창업을 위한 실무를 교육',
      },
      {
        title: '지식재산권(3)',
        reason:
          '특허정보의 검색과 해석, 그리고 특허분석을 통한 특허맵 작성 등의 특허 관련 실무적 지식을 온라인 실습을 통해 병행 습득',
      },
    ],
  },
  {
    year: '3학년',
    courses: [
      { title: '바롬종합설계프로젝트(2)' },
      {
        title: '뇌과학과인간(3)',
        reason: '뇌과학의 기본개념 소개, 기억과 학습의 인간 정보처리, 뇌과학을 통한 인간 학습의 다양한 측면 이해',
      },
      {
        title: '인공지능과빅데이터입문(3)',
        reason: '인공지능과 빅데이터의 개념을 살펴보고 원하는 다양한 분야에 적용할 수 있도록 교육',
      },
      {
        title: '메타버스의세계(3)',
        reason:
          '팬데믹 상황과 함께 부각되고 있는 메타버스 세계에 대해 이해하고 직접 제작해보는 프로젝트형 실습 기반 수업으로 진행',
      },
    ],
  },
  {
    year: '4학년',
    courses: [
      {
        title: '생활속인공지능실습(3)',
        reason:
          '인공지능은 사람이 원하는 결과 데이터를 제공하면 인공지능이 알아서 처리방법을 만들어 사람에게 처리결과를 보여줌. 누구나 쉽게 인공지능에 대해 이해하고 관심분야에 적용하여 활용할 수 있도록 교육함',
      },
      {
        title: '취업실전워크숍(2)',
        reason:
          '채용동향파악, 직무 및 기업분석, 기업이 원하는 입사서류 작성법, 프레젠테이션 기법, 이미지메이킹 및 면접교육, 취업 후의 경력개발 및 직장예절 등 취업준비도에 따라 실전에 대비하는 교육과 개별실습을 진행함',
      },
    ],
  },
]

function Chevron({ open }) {
  return (
    <svg
      className={open ? 'roadmap__mobile-chevron roadmap__mobile-chevron--open' : 'roadmap__mobile-chevron'}
      width="10"
      height="6"
      viewBox="0 0 10 6"
      fill="none"
      aria-hidden="true"
    >
      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MobileYearTabs({ years, active, onChange }) {
  return (
    <div className="roadmap__year-tabs">
      {years.map((label, i) => (
        <button
          key={label}
          type="button"
          className={i === active ? 'roadmap__year-tab roadmap__year-tab--active' : 'roadmap__year-tab'}
          onClick={() => onChange(i)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

function MobileCourseItem({ course, expanded, onToggle }) {
  return (
    <div className={expanded ? 'roadmap__mobile-course roadmap__mobile-course--open' : 'roadmap__mobile-course'}>
      <button type="button" className="roadmap__mobile-course-row" onClick={onToggle}>
        <span
          className={
            course.tag === '필수'
              ? 'roadmap__mobile-course-mark roadmap__mobile-course-mark--required'
              : course.tag === '추천'
                ? 'roadmap__mobile-course-mark roadmap__mobile-course-mark--recommended'
                : 'roadmap__mobile-course-mark roadmap__mobile-course-mark--elective'
          }
        />
        <span className="roadmap__mobile-course-text">
          <span className="roadmap__mobile-course-title">{course.title}</span>
          <span
            className={
              course.tag === '필수'
              ? 'roadmap__mobile-course-tag roadmap__mobile-course-tag--required'
              : course.tag === '추천'
                ? 'roadmap__mobile-course-tag roadmap__mobile-course-tag--recommended'
                : 'roadmap__mobile-course-tag roadmap__mobile-course-tag--elective'
            }
          >
            {course.tag}
          </span>
        </span>
        <Chevron open={expanded} />
      </button>
      {expanded && (
        <div className="roadmap__mobile-course-desc">
          <strong>{course.title.replace(/\(\d+\)$/, '')}</strong>
          <p>{course.desc ?? COURSE_DESC_PLACEHOLDER}</p>
        </div>
      )}
    </div>
  )
}

function MobileLiberalItem({ course, expanded, onToggle }) {
  return (
    <div className={expanded ? 'roadmap__mobile-liberal roadmap__mobile-liberal--open' : 'roadmap__mobile-liberal'}>
      <button type="button" className="roadmap__mobile-liberal-row" onClick={onToggle}>
        <span className="roadmap__mobile-liberal-title">{course.title}</span>
        <Chevron open={expanded} />
      </button>
      {expanded && (
        <div className="roadmap__mobile-liberal-reason">
          <strong>추천 이유</strong>
          <p>{course.reason ?? LIBERAL_REQUIRED_LABEL}</p>
        </div>
      )}
    </div>
  )
}

function CourseItem({ course, flip }) {
  return (
    <div className={flip ? 'roadmap__course roadmap__course--flip' : 'roadmap__course'}>
      <span
        className={
          course.tag === '필수'
              ? 'roadmap__course-mark roadmap__course-mark--required'
              : course.tag === '추천'
                ? 'roadmap__course-mark roadmap__course-mark--recommended'
                : 'roadmap__course-mark roadmap__course-mark--elective'
        }
      />
      <div className="roadmap__course-body">
        <p className="roadmap__course-title">{course.title}</p>
        <span
          className={
            course.tag === '필수'
              ? 'roadmap__course-tag roadmap__course-tag--required'
              : course.tag === '추천'
                ? 'roadmap__course-tag roadmap__course-tag--recommended'
                : 'roadmap__course-tag roadmap__course-tag--elective'
          }
        >
          {course.tag}
        </span>
      </div>
      <div className="roadmap__tooltip">
        <strong>{course.title.replace(/\(\d+\)$/, '')}</strong>
        <p>{course.desc ?? COURSE_DESC_PLACEHOLDER}</p>
      </div>
    </div>
  )
}

export default function Roadmap() {
  const [roadmapMode, setRoadmapMode] = useState('semester')
  const [guidebookTrackId, setGuidebookTrackId] = useState('research')
  const guidebookTrack = GUIDEBOOK_TRACKS.find((item) => item.id === guidebookTrackId) ?? GUIDEBOOK_TRACKS[0]
  const displayYears = roadmapMode === 'guidebook'
    ? YEARS.map((year, index) => ({
        ...year,
        semesters: [{
          label: '학년별 추천 교과목',
          courses: guidebookTrack.years[index].map((title) => ({
            title,
            tag: '추천',
            desc: '전공가이드북 이수 체계도의 진로별 추천 교과목입니다. 실제 개설 학기 및 전공 필수·선택 구분은 공식 수강편람에서 확인해 주세요.',
          })),
        }],
      }))
    : YEARS
  const [mobileYear, setMobileYear] = useState(0)
  const [openCourses, setOpenCourses] = useState(new Set())
  const [mobileLiberalYear, setMobileLiberalYear] = useState(0)
  const [openLiberal, setOpenLiberal] = useState(new Set())

  const toggleCourse = (key) => {
    setOpenCourses((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const toggleLiberal = (key) => {
    setOpenLiberal((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div className="roadmap">
      <PageHero photo title={['전공로드맵']} />

      <div className="container page-layout">
        <ChapterNav sections={CURRICULUM_SECTIONS} />

        <main className="page-layout__main">
          <section className="page-section">
            <h2>전공로드맵</h2>

            <div className="roadmap__mode-buttons" role="group" aria-label="전공로드맵 보기">
              <button type="button" className={roadmapMode === 'semester' ? 'roadmap__mode-button is-active' : 'roadmap__mode-button'} aria-pressed={roadmapMode === 'semester'} onClick={() => setRoadmapMode('semester')}>기존 학년·학기별</button>
              <button type="button" className={roadmapMode === 'guidebook' ? 'roadmap__mode-button is-active' : 'roadmap__mode-button'} aria-pressed={roadmapMode === 'guidebook'} onClick={() => setRoadmapMode('guidebook')}>전공가이드북 진로별</button>
            </div>

            {roadmapMode === 'guidebook' && (
              <>
                <div className="roadmap__track-buttons" role="group" aria-label="추천 진로 선택">
                  {GUIDEBOOK_TRACKS.map((track) => (
                    <button type="button" key={track.id} className={guidebookTrackId === track.id ? 'roadmap__track-button is-active' : 'roadmap__track-button'} aria-pressed={guidebookTrackId === track.id} onClick={() => setGuidebookTrackId(track.id)}>{track.name}</button>
                  ))}
                </div>
                <p className="roadmap__mode-note">{guidebookTrack.subtitle} · 학년별 추천과목이며, 개설 학기를 의미하지 않습니다.</p>
              </>
            )}

            <div className="roadmap__years">
              {displayYears.map((y) => (
                <div className="roadmap__year" key={y.year}>
                  <span className="roadmap__year-no">{y.no}</span>
                  <strong className="roadmap__year-title">{y.year}</strong>
                  <span className={y.highlight ? 'roadmap__year-rule roadmap__year-rule--active' : 'roadmap__year-rule'} />
                </div>
              ))}

              {(roadmapMode === 'guidebook' ? [0] : [0, 1]).map((semIndex) =>
                displayYears.map((y) => {
                  const sem = y.semesters[semIndex]
                  return (
                    <div className="roadmap__semester" key={`${y.year}-${sem.label}`}>
                      {semIndex > 0 && <span className="roadmap__sem-divider" />}
                      <p className="roadmap__sem-label">{sem.label}</p>
                      {sem.courses.map((course) => (
                        <CourseItem course={course} flip={y.no === '04'} key={course.title} />
                      ))}
                    </div>
                  )
                }),
              )}
            </div>

            <div className="roadmap__mobile-roadmap">
              {roadmapMode === 'semester' && <div className="roadmap__legend">
                <span className="roadmap__legend-item">
                  <span className="roadmap__legend-mark roadmap__legend-mark--required" />
                  필수
                </span>
                <span className="roadmap__legend-item">
                  <span className="roadmap__legend-mark roadmap__legend-mark--elective" />
                  선택
                </span>
              </div>}

              <MobileYearTabs years={displayYears.map((y) => y.year)} active={mobileYear} onChange={setMobileYear} />

              {displayYears[mobileYear].semesters.map((sem) => (
                <div className="roadmap__mobile-semester" key={sem.label}>
                  <p className="roadmap__mobile-sem-label">{sem.label}</p>
                  {sem.courses.length === 0 ? (
                    <p className="roadmap__mobile-empty">현재 등록된 과목 정보가 없습니다.</p>
                  ) : (
                    sem.courses.map((course) => (
                      <MobileCourseItem
                        key={course.title}
                        course={course}
                        expanded={openCourses.has(course.title)}
                        onToggle={() => toggleCourse(course.title)}
                      />
                    ))
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="page-section">
            <h2>함께 들으면 좋은 교양</h2>

            <div className="roadmap__liberal">
              {LIBERAL_ARTS.map((group) => (
                <div className="roadmap__liberal-col" key={group.year}>
                  <p className="roadmap__liberal-year">{group.year}</p>
                  {group.courses.map((course) => (
                    <div
                      className={
                        group.year === '4학년'
                          ? 'roadmap__liberal-item roadmap__liberal-item--flip'
                          : 'roadmap__liberal-item'
                      }
                      key={course.title}
                    >
                      <span>{course.title}</span>
                      <div className="roadmap__tooltip roadmap__tooltip--liberal">
                        <strong>추천 이유</strong>
                        <p>{course.reason ?? LIBERAL_REQUIRED_LABEL}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="roadmap__mobile-liberal-wrap">
              <MobileYearTabs
                years={LIBERAL_ARTS.map((g) => g.year)}
                active={mobileLiberalYear}
                onChange={setMobileLiberalYear}
              />
              <div className="roadmap__mobile-liberal-list">
                {LIBERAL_ARTS[mobileLiberalYear].courses.map((course) => (
                  <MobileLiberalItem
                    key={course.title}
                    course={course}
                    expanded={openLiberal.has(course.title)}
                    onToggle={() => toggleLiberal(course.title)}
                  />
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
