import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../../components/common/PageHero'
import ChapterNav from '../../components/common/ChapterNav'
import { NOTICES } from '../../data/notices'
import './Notice.css'

const SECTIONS = [
  { id: 'notice-list', label: '공지사항' },
  { id: 'chatbot', label: 'AI 챗봇 안내' },
]

const PAGE_SIZE = 20

export default function Notice() {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(NOTICES.length / PAGE_SIZE))

  const pageNotices = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return NOTICES.slice(start, start + PAGE_SIZE)
  }, [page])

  const goToPage = (n) => {
    setPage(n)
    document.getElementById('notice-list')?.scrollIntoView({ block: 'start' })
  }

  return (
    <div className="notice">
      <PageHero
        tone="light"
        eyebrow="NOTICE"
        title={['학과의 새로운 소식을', '가장 먼저 확인하세요']}
        subtitle="학과 공지, 학생회 공지, 행사와 프로그램 소식을 모아봅니다."
      />

      <div className="container page-layout">
        <ChapterNav sections={SECTIONS} />

        <main className="page-layout__main">
          <section id="notice-list" className="page-section">
            <h2>공지사항</h2>
            <ul className="notice__list">
              {pageNotices.map((notice) => (
                <li key={notice.id}>
                  <Link to={`/notice/${notice.id}`}>
                    {notice.pinned && <span className="notice__pin">공지</span>}
                    {notice.title}
                  </Link>
                  <span>{notice.date}</span>
                </li>
              ))}
            </ul>

            {totalPages > 1 && (
              <nav className="notice__pagination" aria-label="공지사항 페이지">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => goToPage(page - 1)}
                  aria-label="이전 페이지"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={n === page ? 'is-active' : ''}
                    onClick={() => goToPage(n)}
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={page === totalPages}
                  onClick={() => goToPage(page + 1)}
                  aria-label="다음 페이지"
                >
                  ›
                </button>
              </nav>
            )}
          </section>

          <section id="chatbot" className="page-section notice__chatbot-section">
            <div className="notice__chatbot">
              <div>
                <strong>공지사항이 궁금한가요?</strong>
                <p>AI 챗봇에게 학사 일정과 학과 생활을 물어보세요.</p>
              </div>
              <button type="button" className="notice__chatbot-btn">
                AI 챗봇에게 물어보기
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
