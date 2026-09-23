import PageHero from '../../components/common/PageHero'
import ChapterNav from '../../components/common/ChapterNav'
import { FACULTY, EMERITUS_FACULTY } from '../../data/faculty'
import heroFaculty from '../../assets/images/brand/hero-faculty.jpg'
import './Faculty.css'

const SECTIONS = [{ id: 'faculty-list', label: '교수진' }]

function EducationValue({ education }) {
  return (
    <div className="faculty__value faculty__value--stacked">
      {education.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  )
}

export default function Faculty() {
  return (
    <div className="faculty">
      <PageHero photo photoSrc={heroFaculty} title={['교수진']} />

      <div className="container page-layout">
        <ChapterNav sections={SECTIONS} />

        <main className="page-layout__main">
          <section id="faculty-list" className="page-section">
            <h2>교수진</h2>

            <p className="faculty__group-label">전임교수</p>
            <div className="faculty__grid">
              {FACULTY.map((professor) => (
                <div className="faculty__card" key={professor.email}>
                  <div className="faculty__top">
                    <img className="faculty__photo" src={professor.photo} alt={professor.name} />
                    <div className="faculty__identity">
                      <strong>{professor.name}</strong>
                      <p className="faculty__position">{professor.position}</p>
                      <p className="faculty__contact">{professor.phone}</p>
                      <p className="faculty__contact">{professor.email}</p>
                    </div>
                  </div>
                  <div className="faculty__meta-row">
                    <span className="faculty__label">연구분야</span>
                    <p className="faculty__value">{professor.major}</p>
                  </div>
                  <div className="faculty__divider" />
                  <div className="faculty__meta-row">
                    <span className="faculty__label">학력</span>
                    <EducationValue education={professor.education} />
                  </div>
                </div>
              ))}
            </div>

            <div className="faculty__group-label faculty__group-label--emeritus">
              <p>명예교수</p>
              <span />
            </div>
            <div className="faculty__grid">
              {EMERITUS_FACULTY.map((professor) => (
                <div className="faculty__card" key={professor.name}>
                  <div className="faculty__top">
                    <img className="faculty__photo" src={professor.photo} alt={professor.name} />
                    <div className="faculty__identity faculty__identity--emeritus">
                      <strong>{professor.name}</strong>
                    </div>
                  </div>
                  <div className="faculty__meta-row">
                    <span className="faculty__label">연구분야</span>
                    <p className="faculty__value">{professor.field}</p>
                  </div>
                  <div className="faculty__divider" />
                  <div className="faculty__meta-row">
                    <span className="faculty__label">학력</span>
                    <EducationValue education={professor.education} />
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
