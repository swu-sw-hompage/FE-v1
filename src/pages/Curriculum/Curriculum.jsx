import PageHero from '../../components/common/PageHero'
import heroCurriculum from '../../assets/images/brand/hero-curriculum.jpg'
import ChapterNav from '../../components/common/ChapterNav'
import PdfViewer from '../../components/common/PdfViewer'
import { CURRICULUM_SECTIONS } from '../../constants/aboutNav'
import curriculumPdf from '../../assets/docs/curriculum-2026.pdf'
import './Curriculum.css'

const PILLARS = [
  {
    no: '01',
    title: '기초교양',
    desc: ['문제를 이해하고 생각을 확장하는', '기초 역량을 기릅니다.'],
  },
  {
    no: '02',
    title: '전공필수',
    desc: ['프로그래밍·자료구조 등 핵심 전공', '역량을 다집니다.'],
  },
  {
    no: '03',
    title: '전공선택',
    desc: ['AI·데이터·서비스 개발 등 관심 분야를', '넓혀갑니다.'],
  },
]

export default function Curriculum() {
  return (
    <div className="curriculum">
      <PageHero photo photoSrc={heroCurriculum} title={['교육과정']} />

      <div className="container page-layout">
        <ChapterNav sections={CURRICULUM_SECTIONS} />

        <main className="page-layout__main">
          <section className="page-section">
            <h2>교육과정 안내</h2>
            <p className="curriculum__lead">
              기초 교양에서 전공 핵심, 선택 심화와 프로젝트까지 이어지는 학습 구조입니다.
            </p>

            <div className="curriculum__pillars">
              {PILLARS.map((p) => (
                <div className="curriculum__pillar" key={p.no}>
                  <span className="curriculum__pillar-no">{p.no}</span>
                  <strong>{p.title}</strong>
                  <p>
                    {p.desc.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="page-section">
            <h2>2026 교육과정</h2>
            <p className="curriculum__lead">
              서울여자대학교 2026학년도 소프트웨어학과 공식 교육과정 PDF입니다.
            </p>

            <PdfViewer
              src={curriculumPdf}
              fileName="2026학년도 소프트웨어학과 교육과정.pdf"
              pageCount={8}
            />
          </section>
        </main>
      </div>
    </div>
  )
}
