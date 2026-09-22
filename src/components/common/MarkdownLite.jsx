const INLINE_PATTERN =
  /\{color:(#[0-9a-fA-F]{3,8})\}(.*?)\{\/color\}|\*\*(.+?)\*\*|~~(.+?)~~|\*(.+?)\*/g

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
      nodes.push(<s key={key}>{match[4]}</s>)
    } else if (match[5] !== undefined) {
      nodes.push(<em key={key}>{match[5]}</em>)
    }
    lastIndex = INLINE_PATTERN.lastIndex
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes
}

// 굵게(**) · 기울임(*) · 취소선(~~) · 색상({color:#hex}...{/color}) 문법을 지원하는 경량 마크다운 렌더러
export default function MarkdownLite({ text, className }) {
  const paragraphs = (text ?? '').split(/\n{2,}/)
  return (
    <div className={className}>
      {paragraphs.map((para, pIdx) => (
        <p key={pIdx}>
          {para.split('\n').map((line, lIdx, arr) => (
            <span key={lIdx}>
              {renderInline(line, `${pIdx}-${lIdx}`)}
              {lIdx < arr.length - 1 && <br />}
            </span>
          ))}
        </p>
      ))}
    </div>
  )
}
