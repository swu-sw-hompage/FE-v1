// swu.ac.kr 소프트웨어학과 교수진 페이지(https://www.swu.ac.kr/swu/902/subview.do)에서 가져온 실제 데이터
const photos = import.meta.glob('../assets/images/faculty/*', { eager: true, import: 'default' })
const photoUrl = (filename) => photos[`../assets/images/faculty/${filename}`]

// 교수진 페이지에 이 순서 그대로 표시된다. homepage(연구실 홈페이지)는 있는 교수님만 적는다.
export const FACULTY = [
  {
    name: '엄성용',
    position: '교수',
    major: '멀티미디어 · 그래픽스 · 컴퓨터응용',
    phone: '02-970-5696',
    email: 'osy@swu.ac.kr',
    education: ['서울대학교 공학사', '서울대학교 공학석사', '서울대학교 공학박사'],
    photo: photoUrl('prof-5.jpg'),
  },
  {
    name: '박지숙',
    position: '교수',
    major: '데이터베이스 · 의료정보',
    phone: '02-970-5695',
    email: 'jspark@swu.ac.kr',
    education: ['한국과학기술원 공학사', '서울대학교 공학석사', '서울대학교 공학박사'],
    photo: photoUrl('prof-2.jpg'),
  },
  {
    name: '홍헬렌',
    position: '교수',
    major: '인공지능 및 영상분석',
    phone: '02-970-5756',
    email: 'hlhong@swu.ac.kr',
    homepage: 'https://sites.google.com/view/vcmilab/home',
    education: ['이화여자대학교 이학사', '이화여자대학교 이학석사', '이화여자대학교 공학박사'],
    photo: photoUrl('prof-6.jpg'),
  },
  {
    name: '백종호',
    position: '교수',
    major: '지능형 플랫폼 · 서버/클라이언트 서비스 플랫폼 ·\n유무선 방송통신 시스템',
    phone: '02-970-5606',
    email: 'paikjh@swu.ac.kr',
    education: ['중앙대학교 공학사', '중앙대학교 공학석사', '중앙대학교 공학박사'],
    photo: photoUrl('prof-4.jpg'),
  },
  {
    name: '방정호',
    position: '부교수',
    major: '무선통신 네트워크 · IoT 설계 및 서비스',
    phone: '02-970-5761',
    email: 'bang6467@swu.ac.kr',
    education: ['중앙대학교 공학사', 'Polytechnic Institute of New York University M.S.', 'New Jersey Institute of Technology  Ph.D.'],
    photo: photoUrl('prof-3.jpg'),
  },
  {
    name: '김영진',
    position: '조교수',
    major: '자연어처리',
    phone: '02-970-5760',
    email: 'kimyj@swu.ac.kr',
    education: ['연세대학교 공학사', 'Michigan State Univ. Ph.D'],
    photo: photoUrl('prof-1.jpg'),
  },
]

export const EMERITUS_FACULTY = [
  {
    name: '황 준',
    field: '디지털 미디어융합',
    education: ['중앙대학교 (이학사, 이학석사, 공학박사)'],
    photo: photoUrl('emeritus-1.jpg'),
  },
  {
    name: '정민교',
    field: '컴퓨터 비전',
    education: ['서울대학교 공학사', '한국과학기술원 공학석사', 'The University of Iowa 공학박사'],
    photo: photoUrl('emeritus-2.jpg'),
  },
]
