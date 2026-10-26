import EmptyState from '../../components/common/EmptyState'

export default function NotFound() {
  return (
    <section className="container" style={{ paddingBlock: '80px' }}>
      <EmptyState
        code="404"
        title="페이지를 찾을 수 없습니다"
        description="주소가 잘못 입력되었거나 페이지가 이동되었을 수 있어요."
        actions={[
          { label: '홈으로 돌아가기', to: '/' },
          { label: '공지사항 보기', to: '/notice' },
        ]}
      />
    </section>
  )
}
