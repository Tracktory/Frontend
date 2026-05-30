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

// MVP: IT공과대학 단일. 학기 후반·다른 학부 추가 시 endpoint 승격 가능.
// college code: IT_ENG | department code: COMPUTER_ENG
export const COLLEGE_TRACK_MAP: Record<string, string[]> = {
  'IT공과대학': [
    '모바일소프트웨어트랙',
    '빅데이터트랙',
    '디지털콘텐츠·가상현실트랙',
    '웹공학트랙',
    '전자트랙',
    '시스템반도체트랙',
    '기계시스템디자인트랙',
    'AI로봇융합트랙',
    '산업공학트랙',
    '응용산업데이터공학트랙',
  ],
};

export const COLLEGE_OPTIONS = Object.keys(COLLEGE_TRACK_MAP);
