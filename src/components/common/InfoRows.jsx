import './InfoRows.css'

// 왼쪽 라벨 칸(번호 + 제목) / 오른쪽 내용 칸으로 나뉜 행 목록.
// 졸업 요건의 신청 절차·추가 요건과 졸업 후 진로 상세가 같은 모양을 쓴다.
export default function InfoRows({ rows }) {
  return (
    <div className="info-rows">
      {rows.map((row) => (
        <div className="info-rows__row" key={row.no}>
          <div className="info-rows__label">
            <span>{row.no}</span>
            <strong>{row.title}</strong>
          </div>
          <div className={row.items.length > 1 ? 'info-rows__copy info-rows__copy--list' : 'info-rows__copy'}>
            {row.items.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
