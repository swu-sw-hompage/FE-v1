import PageHero from '../../components/common/PageHero'
import ChapterNav from '../../components/common/ChapterNav'
import { CURRICULUM_SECTIONS } from '../../constants/aboutNav'
import './Roadmap.css'

const COURSE_DESC_PLACEHOLDER = '과목 설명 · 강의계획서 기준 입력 예정'
const LIBERAL_REASON_PLACEHOLDER = '학과 검토 후 입력'

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
            title: '소프트웨어융합 진로탐색(1)',
            tag: '필수',
            desc: '소프트웨어융합 전공을 수행하는데 있어 필요한 학습동기를 부여받고, 다양한 전공실무영역을 미리 체험하여 장래 직업 및 진로탐색에 도움되는 정보를 체득할 수 있도록 전공과 관련된 세미나 및 특강 또는 취업 관련 행사에 참석한다.',
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
            title: '소프트웨어융합 커리어디자인(1)',
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
            desc: '졸업예정 학생이 갖춰야 할 소프트웨어개발 역량과 취업준비도를 점검·인증하는 과목. 공인외국어 성적표, 취업준비 프로그램 이수증, SW 지적재산권 관련 증빙, 소프트웨어개발실무영어 I·II 및 Guru Programming 1·2 이수증을 지도교수와 함께 확인한다.',
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

export default function Roadmap() {
  return (
    <div className="roadmap">
      <PageHero photo title={['전공로드맵']} />

      <div className="container page-layout">
        <ChapterNav sections={CURRICULUM_SECTIONS} />

        <main className="page-layout__main">
          <section className="page-section">
            <h2>전공로드맵</h2>

            <div className="roadmap__years">
              {YEARS.map((y) => (
                <div className="roadmap__year" key={y.year}>
                  <span className="roadmap__year-no">{y.no}</span>
                  <strong className="roadmap__year-title">{y.year}</strong>
                  <span className={y.highlight ? 'roadmap__year-rule roadmap__year-rule--active' : 'roadmap__year-rule'} />
                </div>
              ))}

              {[0, 1].map((semIndex) =>
                YEARS.map((y) => {
                  const sem = y.semesters[semIndex]
                  return (
                    <div className="roadmap__semester" key={`${y.year}-${sem.label}`}>
                      {semIndex > 0 && <span className="roadmap__sem-divider" />}
                      <p className="roadmap__sem-label">{sem.label}</p>
                      {sem.courses.map((course) => (
                        <div
                          className={
                            y.no === '04' ? 'roadmap__course roadmap__course--flip' : 'roadmap__course'
                          }
                          key={course.title}
                        >
                          <span
                            className={
                              course.tag === '필수'
                                ? 'roadmap__course-mark roadmap__course-mark--required'
                                : 'roadmap__course-mark roadmap__course-mark--elective'
                            }
                          />
                          <div className="roadmap__course-body">
                            <p className="roadmap__course-title">{course.title}</p>
                            <span
                              className={
                                course.tag === '필수'
                                  ? 'roadmap__course-tag roadmap__course-tag--required'
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
                      ))}
                    </div>
                  )
                }),
              )}
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
                        <p>{course.reason ?? LIBERAL_REASON_PLACEHOLDER}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
