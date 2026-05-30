/**
 * 임시 ID 매핑 테이블 — 백엔드 카탈로그 API 확보 전 순번 사용.
 * 백엔드 ID 배포 후 이 파일의 값만 교체하면 됨.
 * code 값은 ERD catalog 테이블의 code varchar(40) 와 1:1 미러 (주석으로 명시).
 */

// code: MANAGEMENT_OFFICE | TRADE_DISTRIBUTION | SALES_CUSTOMER | SERVICE | MARKETING_AD_PR
//       IT_INTERNET | DESIGN | RND_ENGINEERING | PRODUCTION_MANUFACTURING | EDUCATION
//       MEDICAL | MEDIA | SPECIALIZED | CONSTRUCTION
export const INTEREST_ID_MAP: Record<string, number> = {
  '경영/사무': 1,
  '무역/유통': 2,
  '영업/고객상담': 3,
  '서비스': 4,
  '마케팅/광고/홍보': 5,
  'IT/인터넷': 6,
  '디자인': 7,
  '연구개발/설계': 8,
  '생산/제조': 9,
  '교육': 10,
  '의료': 11,
  '미디어': 12,
  '전문/특수직': 13,
  '건설': 14,
};

// code: APP | WEB | DATA | GAME | AI | SECURITY
export const DEV_FIELD_ID_MAP: Record<string, number> = {
  '앱': 1,
  '웹': 2,
  '데이터': 3,
  '게임': 4,
  'AI': 5,
  '보안': 6,
};

// code: LARGE_CORP | MID_CORP | SMALL_CORP | PUBLIC | STARTUP | FREELANCE | ANY
export const COMPANY_TYPE_ID_MAP: Record<string, number> = {
  '대기업': 1,
  '중견기업': 2,
  '중소기업': 3,
  '공기업': 4,
  '스타트업': 5,
  '프리랜서': 6,
  '상관없음': 7,
};

// code: MONEY | WORK_LIFE_BALANCE | WELFARE | HONOR | STABILITY | GROWTH
export const WORK_VALUE_ID_MAP: Record<string, number> = {
  '돈': 1,
  '워라벨': 2,
  '복지': 3,
  '명예': 4,
  '안정성': 5,
  '성장성': 6,
};

export const TECH_STACK_ID_MAP: Record<string, number> = {
  'Python': 1,
  'Java': 2,
  'JavaScript': 3,
  'C/C++': 4,
  'SQL': 5,
  'React': 6,
  'Spring': 7,
  'Flutter': 8,
};

// MVP: college code IT_ENG(IT공과대학) → department code COMPUTER_ENG(컴퓨터공학부, departmentId=1)
export const DEPARTMENT_ID_MAP: Record<string, number> = {
  'IT공과대학': 1,
};

/** 트랙 이름 → 소속 단과대학 departmentId (profile.departmentId 유도용) */
// MVP: IT공과대학(컴퓨터공학부) 트랙만 유지
export const TRACK_TO_DEPARTMENT_ID_MAP: Record<string, number> = {
  '모바일소프트웨어트랙': 1,
  '빅데이터트랙': 1,
  '디지털콘텐츠·가상현실트랙': 1,
  '웹공학트랙': 1,
  '전자트랙': 1,
  '시스템반도체트랙': 1,
  '기계시스템디자인트랙': 1,
  'AI로봇융합트랙': 1,
  '산업공학트랙': 1,
  '응용산업데이터공학트랙': 1,
};

export const TRACK_ID_MAP: Record<string, number> = {
  '모바일소프트웨어트랙': 1,
  '빅데이터트랙': 2,
  '디지털콘텐츠·가상현실트랙': 3,
  '웹공학트랙': 4,
  '전자트랙': 5,
  '시스템반도체트랙': 6,
  '기계시스템디자인트랙': 7,
  'AI로봇융합트랙': 8,
  '산업공학트랙': 9,
  '응용산업데이터공학트랙': 10,
};
