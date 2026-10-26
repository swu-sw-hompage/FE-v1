import PageHero from '../../components/common/PageHero'
import heroAbout from '../../assets/images/brand/hero-about.jpg'
import ChapterNav from '../../components/common/ChapterNav'
import { ABOUT_SECTIONS } from '../../constants/aboutNav'
import './Location.css'

const TRANSPORT = [
  {
    label: '지하철',
    lines: [
      '6호선 화랑대역 3번 출구에서 도보 10~15분',
      '1·6호선 석계역 4번 출구 → 시내버스 이용',
      '6·7호선 태릉입구역 7번 출구 → 학교버스 또는 시내버스 이용',
    ],
  },
  {
    label: '버스',
    lines: [
      '정문 방향: 202, 1155, 1156번 → 서울여대 정문(육사후문) 하차',
      '남문 방향: 1122, 1132번 → 서울여대 남문(우방아파트 앞) 하차',
    ],
  },
  {
    label: '학교버스',
    lines: ['태릉입구역 7번 출구 ↔ 서울여자대학교 간 운행'],
  },
  {
    label: '자가용',
    lines: [
      '내비게이션: 서울특별시 노원구 화랑로 621 서울여자대학교',
      '남문은 차량 출입이 불가하므로 정문을 이용해 주세요.',
    ],
  },
]

export default function Location() {
  return (
    <div className="location">
      <PageHero photo photoSrc={heroAbout} title={['찾아오시는 길']} />

      <div className="container page-layout">
        <ChapterNav sections={ABOUT_SECTIONS} />

        <main className="page-layout__main">
          <section className="page-section">
            <h2>찾아오시는 길</h2>

            <div className="location__map">
              <iframe
                title="서울여자대학교 위치"
                src="https://maps.google.com/maps?q=%EC%84%9C%EC%9A%B8%EC%97%AC%EC%9E%90%EB%8C%80%ED%95%99%EA%B5%90&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <a
              className="location__map-open-btn"
              href="https://maps.google.com/?q=서울여자대학교"
              target="_blank"
              rel="noreferrer"
            >
              지도 앱에서 열기 ↗
            </a>

            <div className="location__info">
              <div className="location__info-row">
                <p className="location__info-label">주소</p>
                <p className="location__info-value">(01797) 서울특별시 노원구 화랑로 621 서울여자대학교</p>
              </div>
              <div className="location__info-row">
                <p className="location__info-label">연락처</p>
                <p className="location__info-value">
                  소프트웨어학과 02-970-5921
                </p>
              </div>
              <div className="location__info-row">
                <p className="location__info-label">이메일</p>
                <p className="location__info-value">
                  <a className="location__email-link" href="mailto:sw@swu.ac.kr">sw@swu.ac.kr</a>
                </p>
              </div>
            </div>
          </section>

          <section className="page-section">
            <h2>교통편 안내</h2>
            <div className="location__transport-list">
              {TRANSPORT.map((item) => (
                <div className="location__transport-card" key={item.label}>
                  <p className="location__transport-label">{item.label}</p>
                  <div className="location__transport-lines">
                    {item.lines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
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
