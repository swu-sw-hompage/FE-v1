import './MarkdownLite.css'

const INLINE_PATTERN =
  /\{color:(#[0-9a-fA-F]{3,8})\}(.*?)\{\/color\}|\*\*(.+?)\*\*|__(.+?)__|~~(.+?)~~|\*(.+?)\*/g

// "## 제목" → 큰 제목(h3), "### 소제목" → 작은 제목(h4). 페이지 h1은 공지 제목이 쓰고 있다.
const HEADING_PATTERN = /^(#{2,3})\s+(.+)$/
const HEADING_TAGS = { 2: 'h3', 3: 'h4' }

function renderInline(text, keyPrefix) {
  const nodes = []
  let lastIndex = 0
  let match
  let i = 0

  INLINE_PATTERN.lastIndex = 0
  while ((match = INLINE_PATTERN.exec(text))) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }
    const key = `${keyPrefix}-${i++}`
    if (match[1] !== undefined) {
      nodes.push(
        <span key={key} style={{ color: match[1] }}>
          {match[2]}
        </span>,
      )
    } else if (match[3] !== undefined) {
      nodes.push(<strong key={key}>{match[3]}</strong>)
    } else if (match[4] !== undefined) {
      nodes.push(<u key={key}>{match[4]}</u>)
    } else if (match[5] !== undefined) {
      nodes.push(<s key={key}>{match[5]}</s>)
    } else if (match[6] !== undefined) {
      nodes.push(<em key={key}>{match[6]}</em>)
    }
    lastIndex = INLINE_PATTERN.lastIndex
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes
}

// 빈 줄로 나뉜 문단 안에서 제목 줄은 따로 떼어 내고, 나머지 연속된 줄은 <p> 하나로 묶는다.
function renderParagraph(para, pIdx) {
  const blocks = []
  let lines = []

  const flushLines = () => {
    if (lines.length === 0) return
    const key = `${pIdx}-p${blocks.length}`
    const paragraphLines = lines
    blocks.push(
      <p key={key}>
        {paragraphLines.map((line, lIdx) => (
          <span key={lIdx}>
            {renderInline(line, `${key}-${lIdx}`)}
            {lIdx < paragraphLines.length - 1 && <br />}
          </span>
        ))}
      </p>,
    )
    lines = []
  }

  para.split('\n').forEach((line) => {
    const heading = line.match(HEADING_PATTERN)
    if (!heading) {
      lines.push(line)
      return
    }
    flushLines()
    const level = heading[1].length
    const Tag = HEADING_TAGS[level]
    const key = `${pIdx}-h${blocks.length}`
    blocks.push(
      <Tag key={key} className={`md-heading md-heading--${level}`}>
        {renderInline(heading[2], key)}
      </Tag>,
    )
  })
  flushLines()
  return blocks
}

// 제목(## / ###) · 굵게(**) · 밑줄(__) · 기울임(*) · 취소선(~~) · 색상({color:#hex}...{/color}) 문법을 지원하는 경량 마크다운 렌더러
export default function MarkdownLite({ text, className }) {
  const paragraphs = (text ?? '').split(/\n{2,}/)
  return <div className={className}>{paragraphs.map(renderParagraph)}</div>
}
