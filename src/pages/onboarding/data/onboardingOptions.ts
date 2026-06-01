// code: MANAGEMENT_OFFICE | TRADE_DISTRIBUTION | SALES_CUSTOMER | SERVICE | MARKETING_AD_PR
//       IT_INTERNET | DESIGN | RND_ENGINEERING | PRODUCTION_MANUFACTURING | EDUCATION
//       MEDICAL | MEDIA | SPECIALIZED | CONSTRUCTION
export const INTEREST_OPTIONS = [
  '경영/사무',
  '무역/유통',
  '영업/고객상담',
  '서비스',
  '마케팅/광고/홍보',
  'IT/인터넷',
  '디자인',
  '연구개발/설계',
  '생산/제조',
  '교육',
  '의료',
  '미디어',
  '전문/특수직',
  '건설',
];

// code: APP | WEB | DATA | GAME | AI | SECURITY
export const DEVELOPMENT_FIELD_OPTIONS = ['앱', '웹', '데이터', '게임', 'AI', '보안'];

// code: LARGE_CORP | MID_CORP | SMALL_CORP | PUBLIC | STARTUP | FREELANCE | ANY
export const COMPANY_TYPE_OPTIONS = [
  '대기업',
  '중견기업',
  '중소기업',
  '공기업',
  '스타트업',
  '프리랜서',
  '상관없음',
];

// code: MONEY | WORK_LIFE_BALANCE | WELFARE | HONOR | STABILITY | GROWTH
export const EMPLOYMENT_VALUE_OPTIONS = ['돈', '워라벨', '복지', '명예', '안정성', '성장성'];

// post-MVP: 공부해본 분야 기술 태그 (ON-011-1)
export const TECH_TAG_OPTIONS = ['Python', 'Java', 'JavaScript', 'C/C++', 'SQL', 'React', 'Spring', 'Flutter'];

/** 한성대 단과대 → 소속 트랙/학과 목록 (강의계획서 기준) */
export const COLLEGE_TRACK_MAP: Record<string, string[]> = {
  'IT공과대학': [
    '기계시스템디자인트랙',
    '기계전자공학부',
    '디지털콘텐츠ㆍ가상현실트랙',
    '모바일소프트웨어트랙',
    '빅데이터트랙',
    '사이버보안트랙',
    '산업공학트랙',
    '산업시스템공학부',
    '생산물류시스템트랙',
    '시스템경영공학트랙',
    '시스템반도체트랙',
    '웹공학트랙',
    '응용산업데이터공학트랙',
    '전자트랙',
    '정보시스템트랙',
    '컨설팅트랙',
    '컴퓨터공학부',
    'AI로봇융합트랙',
    'IT융합공학부',
  ],
  '크리에이티브인문예술대학': [
    '동양화전공',
    '디지털인문정보학트랙',
    '발레전공',
    '서양화전공',
    '역사문화큐레이션트랙',
    '역사콘텐츠트랙',
    '영미문화콘텐츠트랙',
    '영미언어정보트랙',
    '예술학부',
    '지식정보문화트랙',
    '크리에이티브인문학부',
    '한국무용전공',
    '한국어교육트랙',
    '현대무용전공',
  ],
  '창의융합대학': [
    '문학문화콘텐츠학과',
    '미래모빌리티학과',
    '융합보안학과',
    '자기설계전공',
    '창업트랙',
    'AI응용학과',
    'SW연계전공',
  ],
  '미래융합사회과학대학': [
    '경제금융투자트랙',
    '공공행정트랙',
    '국제무역트랙',
    '글로벌비즈니스트랙',
    '금융ㆍ데이터분석트랙',
    '기업경영트랙',
    '기업ㆍ경제분석트랙',
    '법&정책트랙',
    '부동산트랙',
    '비즈니스애널리틱스트랙',
    '사회과학부',
    '스마트도시ㆍ교통계획트랙',
    '회계ㆍ재무경영트랙',
  ],
  '디자인대학': [
    '게임그래픽디자인트랙',
    '글로벌패션산업학부',
    '미디어디자인트랙',
    '뷰티디자인매니지먼트학과',
    '시각디자인트랙',
    '영상ㆍ애니메이션디자인트랙',
    '인테리어디자인트랙',
    '제품ㆍ서비스디자인트랙',
    '패션디자인트랙',
    '패션마케팅트랙',
    '패션크리에이티브디렉션트랙',
    'ICT디자인학부',
    'UX/UI디자인트랙',
    'VMDㆍ전시디자인트랙',
  ],
  '미래플러스대학': [
    '뷰티디자인학과',
    '뷰티매니지먼트학과',
    '비즈니스컨설팅학과',
    '융합행정학과',
    '호텔외식경영학과',
    'ICT융합디자인학과',
  ],
  '글로벌인재대학': [
    'SW융합학과',
  ],
};

export const COLLEGE_OPTIONS = Object.keys(COLLEGE_TRACK_MAP);

/** · / ㆍ 등 표기 차이 통일 — hansungCourseData 와 ID 조회 시 사용 */
export function normalizeTrackName(name: string): string {
  return name.replace(/·/g, 'ㆍ').replace(/VMD·/g, 'VMDㆍ');
}
