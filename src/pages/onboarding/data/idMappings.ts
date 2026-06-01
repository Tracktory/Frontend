/**
 * 임시 ID 매핑 — 백엔드 카탈로그 API 확보 전 순번 사용.
 * 백엔드 ID 배포 후 이 파일의 값만 교체하면 됨.
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

export const DEV_FIELD_ID_MAP: Record<string, number> = {
  '앱': 1,
  '웹': 2,
  '데이터': 3,
  '게임': 4,
  'AI': 5,
  '보안': 6,
};

export const COMPANY_TYPE_ID_MAP: Record<string, number> = {
  '대기업': 1,
  '중견기업': 2,
  '중소기업': 3,
  '공기업': 4,
  '스타트업': 5,
  '프리랜서': 6,
  '상관없음': 7,
};

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

export const DEPARTMENT_ID_MAP: Record<string, number> = {
  'IT공과대학': 1,
  '크리에이티브인문예술대학': 2,
  '창의융합대학': 3,
  '미래융합사회과학대학': 4,
  '디자인대학': 5,
  '미래플러스대학': 6,
  '글로벌인재대학': 7,
};

export const TRACK_TO_DEPARTMENT_ID_MAP: Record<string, number> = {
  '기계시스템디자인트랙': 1,
  '기계전자공학부': 1,
  '디지털콘텐츠ㆍ가상현실트랙': 1,
  '모바일소프트웨어트랙': 1,
  '빅데이터트랙': 1,
  '사이버보안트랙': 1,
  '산업공학트랙': 1,
  '산업시스템공학부': 1,
  '생산물류시스템트랙': 1,
  '시스템경영공학트랙': 1,
  '시스템반도체트랙': 1,
  '웹공학트랙': 1,
  '응용산업데이터공학트랙': 1,
  '전자트랙': 1,
  '정보시스템트랙': 1,
  '컨설팅트랙': 1,
  '컴퓨터공학부': 1,
  'AI로봇융합트랙': 1,
  'IT융합공학부': 1,
  '동양화전공': 2,
  '디지털인문정보학트랙': 2,
  '발레전공': 2,
  '서양화전공': 2,
  '역사문화큐레이션트랙': 2,
  '역사콘텐츠트랙': 2,
  '영미문화콘텐츠트랙': 2,
  '영미언어정보트랙': 2,
  '예술학부': 2,
  '지식정보문화트랙': 2,
  '크리에이티브인문학부': 2,
  '한국무용전공': 2,
  '한국어교육트랙': 2,
  '현대무용전공': 2,
  '문학문화콘텐츠학과': 3,
  '미래모빌리티학과': 3,
  '융합보안학과': 3,
  '자기설계전공': 3,
  '창업트랙': 3,
  'AI응용학과': 3,
  'SW연계전공': 3,
  '경제금융투자트랙': 4,
  '공공행정트랙': 4,
  '국제무역트랙': 4,
  '글로벌비즈니스트랙': 4,
  '금융ㆍ데이터분석트랙': 4,
  '기업경영트랙': 4,
  '기업ㆍ경제분석트랙': 4,
  '법&정책트랙': 4,
  '부동산트랙': 4,
  '비즈니스애널리틱스트랙': 4,
  '사회과학부': 4,
  '스마트도시ㆍ교통계획트랙': 4,
  '회계ㆍ재무경영트랙': 4,
  '게임그래픽디자인트랙': 5,
  '글로벌패션산업학부': 5,
  '미디어디자인트랙': 5,
  '뷰티디자인매니지먼트학과': 5,
  '시각디자인트랙': 5,
  '영상ㆍ애니메이션디자인트랙': 5,
  '인테리어디자인트랙': 5,
  '제품ㆍ서비스디자인트랙': 5,
  '패션디자인트랙': 5,
  '패션마케팅트랙': 5,
  '패션크리에이티브디렉션트랙': 5,
  'ICT디자인학부': 5,
  'UX/UI디자인트랙': 5,
  'VMDㆍ전시디자인트랙': 5,
  '뷰티디자인학과': 6,
  '뷰티매니지먼트학과': 6,
  '비즈니스컨설팅학과': 6,
  '융합행정학과': 6,
  '호텔외식경영학과': 6,
  'ICT융합디자인학과': 6,
  'SW융합학과': 7,
};

export const TRACK_ID_MAP: Record<string, number> = {
  '기계시스템디자인트랙': 1,
  '기계전자공학부': 2,
  '디지털콘텐츠ㆍ가상현실트랙': 3,
  '모바일소프트웨어트랙': 4,
  '빅데이터트랙': 5,
  '사이버보안트랙': 6,
  '산업공학트랙': 7,
  '산업시스템공학부': 8,
  '생산물류시스템트랙': 9,
  '시스템경영공학트랙': 10,
  '시스템반도체트랙': 11,
  '웹공학트랙': 12,
  '응용산업데이터공학트랙': 13,
  '전자트랙': 14,
  '정보시스템트랙': 15,
  '컨설팅트랙': 16,
  '컴퓨터공학부': 17,
  'AI로봇융합트랙': 18,
  'IT융합공학부': 19,
  '동양화전공': 20,
  '디지털인문정보학트랙': 21,
  '발레전공': 22,
  '서양화전공': 23,
  '역사문화큐레이션트랙': 24,
  '역사콘텐츠트랙': 25,
  '영미문화콘텐츠트랙': 26,
  '영미언어정보트랙': 27,
  '예술학부': 28,
  '지식정보문화트랙': 29,
  '크리에이티브인문학부': 30,
  '한국무용전공': 31,
  '한국어교육트랙': 32,
  '현대무용전공': 33,
  '문학문화콘텐츠학과': 34,
  '미래모빌리티학과': 35,
  '융합보안학과': 36,
  '자기설계전공': 37,
  '창업트랙': 38,
  'AI응용학과': 39,
  'SW연계전공': 40,
  '경제금융투자트랙': 41,
  '공공행정트랙': 42,
  '국제무역트랙': 43,
  '글로벌비즈니스트랙': 44,
  '금융ㆍ데이터분석트랙': 45,
  '기업경영트랙': 46,
  '기업ㆍ경제분석트랙': 47,
  '법&정책트랙': 48,
  '부동산트랙': 49,
  '비즈니스애널리틱스트랙': 50,
  '사회과학부': 51,
  '스마트도시ㆍ교통계획트랙': 52,
  '회계ㆍ재무경영트랙': 53,
  '게임그래픽디자인트랙': 54,
  '글로벌패션산업학부': 55,
  '미디어디자인트랙': 56,
  '뷰티디자인매니지먼트학과': 57,
  '시각디자인트랙': 58,
  '영상ㆍ애니메이션디자인트랙': 59,
  '인테리어디자인트랙': 60,
  '제품ㆍ서비스디자인트랙': 61,
  '패션디자인트랙': 62,
  '패션마케팅트랙': 63,
  '패션크리에이티브디렉션트랙': 64,
  'ICT디자인학부': 65,
  'UX/UI디자인트랙': 66,
  'VMDㆍ전시디자인트랙': 67,
  '뷰티디자인학과': 68,
  '뷰티매니지먼트학과': 69,
  '비즈니스컨설팅학과': 70,
  '융합행정학과': 71,
  '호텔외식경영학과': 72,
  'ICT융합디자인학과': 73,
  'SW융합학과': 74,
  '교양영어과정': 75,
  '기초교양학부': 76,
  '디지털콘텐츠디자인학과(계약학과)': 77,
  '뷰티매니지먼트학과(계약학과)': 78,
  '소양핵심교양학부': 79,
  '스마트제조혁신컨설팅학과(계약학과)': 80,
  '자율공학학부': 81,
  'AIㆍ소프트웨어학과': 82,
};

/** 트랙명 표기 통일 후 TRACK_ID_MAP 조회 */
export function normalizeTrackName(name: string): string {
  return name.replace(/·/g, 'ㆍ').replace(/VMD·/g, 'VMDㆍ');
}

export function resolveTrackId(trackName: string): number | undefined {
  const normalized = normalizeTrackName(trackName.trim());
  return TRACK_ID_MAP[normalized] ?? TRACK_ID_MAP[trackName.trim()];
}

export function resolveDepartmentIdForTrack(trackName: string): number | undefined {
  const normalized = normalizeTrackName(trackName.trim());
  return (
    TRACK_TO_DEPARTMENT_ID_MAP[normalized] ??
    TRACK_TO_DEPARTMENT_ID_MAP[trackName.trim()]
  );
}

function invertMap(map: Record<string, number>): Record<number, string> {
  return Object.fromEntries(
    Object.entries(map).map(([label, id]) => [id, label])
  ) as Record<number, string>;
}

export const ID_TO_INTEREST_LABEL = invertMap(INTEREST_ID_MAP);
export const ID_TO_DEV_FIELD_LABEL = invertMap(DEV_FIELD_ID_MAP);
export const ID_TO_COMPANY_TYPE_LABEL = invertMap(COMPANY_TYPE_ID_MAP);
export const ID_TO_WORK_VALUE_LABEL = invertMap(WORK_VALUE_ID_MAP);
export const ID_TO_DEPARTMENT_LABEL = invertMap(DEPARTMENT_ID_MAP);
