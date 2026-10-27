import PageHero from '../../components/common/PageHero'
import ChapterNav from '../../components/common/ChapterNav'
import { FACULTY, EMERITUS_FACULTY } from '../../data/faculty'
import heroFaculty from '../../assets/images/brand/hero-faculty-lounge.jpg'
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
            <h2 className="faculty__page-title">교수진</h2>

            <p className="faculty__group-label">전임교수</p>
            <div className="faculty__grid">
              {FACULTY.map((professor) => (
                <div className="faculty__card" key={professor.email}>
                  <div className="faculty__top">
                    <img className="faculty__photo" src={professor.photo} alt={professor.name} />
                    <div className="faculty__identity">
                      <div className="faculty__name-row">
                        <strong>{professor.name}</strong>
                        <p className="faculty__position">{professor.position}</p>
                      </div>
                      <p className="faculty__contact faculty__contact--phone">{professor.phone}</p>
                      <p className="faculty__contact faculty__contact--email">{professor.email}</p>
                      {professor.homepage && (
                        <a
                          className="faculty__contact faculty__contact--homepage"
                          href={professor.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          연구실 홈페이지
                          <svg className="faculty__link-icon" viewBox="0 0 12 12" aria-hidden="true">
                            <path d="M4 2h6v6M10 2 2.5 9.5" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="faculty__meta-row faculty__meta-row--major">
                    <span className="faculty__label">연구분야</span>
                    <p className="faculty__value">{professor.major}</p>
                  </div>
                  <div className="faculty__divider" />
                  <div className="faculty__meta-row faculty__meta-row--education">
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
                      <div className="faculty__name-row">
                        <strong>{professor.name}</strong>
                        <p className="faculty__position">명예교수</p>
                      </div>
                    </div>
                  </div>
                  <div className="faculty__meta-row faculty__meta-row--major">
                    <span className="faculty__label">연구분야</span>
                    <p className="faculty__value">{professor.field}</p>
                  </div>
                  <div className="faculty__divider" />
                  <div className="faculty__meta-row faculty__meta-row--education">
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
