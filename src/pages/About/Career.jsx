import { Link } from 'react-router-dom'
import PageHero from '../../components/common/PageHero'
import ChapterNav from '../../components/common/ChapterNav'
import { ABOUT_SECTIONS, CAREER_FIELDS } from '../../constants/aboutNav'
import './Career.css'

export default function Career() {
  return (
    <div className="career">
      <PageHero photo title={['졸업 후 진로']} />

      <div className="container page-layout">
        <ChapterNav sections={ABOUT_SECTIONS} />

        <main className="page-layout__main">
          <section className="page-section">
            <h2>졸업 후 진로</h2>
            <div className="career__grid">
              {CAREER_FIELDS.map((field) => (
                <Link to={`/about/career/${field.slug}`} className="career__card" key={field.slug}>
                  <span>{field.no}</span>
                  <strong>{field.title}</strong>
                  <p>{field.summary}</p>
                  <em>자세히 보기 →</em>
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
