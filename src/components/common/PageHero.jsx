import heroPhoto from '../../assets/images/brand/hero-photo.jpg'
import './PageHero.css'

export default function PageHero({ tone = 'light', eyebrow, title, subtitle, photo = false, photoSrc }) {
  if (photo) {
    return (
      <section className="page-hero page-hero--photo">
        <img className="page-hero__photo" src={photoSrc ?? heroPhoto} alt="" />
        <div className="page-hero__overlay" />
        <h1 className="page-hero__photo-title">{title.join(' ')}</h1>
      </section>
    )
  }

  return (
    <section className={`page-hero page-hero--${tone}`}>
      <div className="container page-hero__inner">
        {eyebrow && <p className="page-hero__eyebrow">{eyebrow}</p>}
        <h1 className="page-hero__title">
          {title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>
        {subtitle && <p className="page-hero__subtitle">{subtitle}</p>}
      </div>
    </section>
  )
}
