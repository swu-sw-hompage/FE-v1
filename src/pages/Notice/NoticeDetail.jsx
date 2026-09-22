import { Link, useParams } from 'react-router-dom'
import { NOTICES } from '../../data/notices'
import { NOTICE_DETAILS } from '../../data/noticeDetails'
import MarkdownLite from '../../components/common/MarkdownLite'
import './NoticeDetail.css'

export default function NoticeDetail() {
  const { id } = useParams()
  const notice = NOTICES.find((n) => String(n.id) === id)
  const detail = NOTICE_DETAILS[id]

  if (!notice || !detail) {
    return (
      <section className="notice-detail container">
        <p>존재하지 않는 공지사항입니다.</p>
        <Link to="/notice" className="notice-detail__back">
          ← 목록으로
        </Link>
      </section>
    )
  }

  return (
    <section className="notice-detail container">
      <div className="notice-detail__header">
        {notice.pinned && <span className="notice-detail__pin">공지</span>}
        <h1>{notice.title}</h1>
        <div className="notice-detail__meta">
          <span>{detail.writer}</span>
          <span>{detail.datetime}</span>
        </div>
      </div>

      <MarkdownLite text={detail.body} className="notice-detail__body" />

      {detail.images.length > 0 && (
        <div className="notice-detail__images">
          {detail.images.map((src) => (
            <img key={src} src={src} alt="" />
          ))}
        </div>
      )}

      {detail.attachments.length > 0 && (
        <div className="notice-detail__attachments">
          <h2>첨부파일</h2>
          <ul>
            {detail.attachments.map((att) => (
              <li key={att.url}>
                <a href={att.url} target="_blank" rel="noreferrer">
                  {att.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link to="/notice" className="notice-detail__back">
        ← 목록으로
      </Link>
    </section>
  )
}
