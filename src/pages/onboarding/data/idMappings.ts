/**
 * 백엔드 카탈로그 시드 ID 매핑 (tech_stack, track).
 * DB 변경 시 이 파일의 값만 동기화하면 됨.
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
  React: 1,
  TypeScript: 2,
  'JavaScript (ES2024+)': 3,
  'Next.js': 4,
  'Node.js': 5,
  'Tailwind CSS': 6,
  'Vue.js': 7,
  Vite: 8,
  'Zustand / React Query': 9,
  'Storybook / Vitest': 10,
  Python: 11,
  Java: 12,
  'Node.js / Express': 13,
  'Spring Boot': 14,
  FastAPI: 15,
  'Go (Golang)': 16,
  PostgreSQL: 17,
  Redis: 18,
  Docker: 19,
  'GraphQL / REST API': 20,
  'SQL (+ BigQuery / Snowflake)': 21,
  'Apache Spark': 22,
  'Apache Kafka': 23,
  'Apache Airflow': 24,
  'dbt (data build tool)': 25,
  'Snowflake / BigQuery': 26,
  'AWS / GCP': 27,
  'Docker / Kubernetes': 28,
  'Databricks / Delta Lake': 29,
  SQL: 30,
  'Python (Pandas, NumPy)': 31,
  Tableau: 32,
  'Power BI': 33,
  'Excel / Google Sheets': 34,
  R: 35,
  'Looker / Metabase': 36,
  'Jupyter Notebook': 37,
  'A/B 테스팅 프레임워크': 38,
  PyTorch: 39,
  'TensorFlow / Keras': 40,
  'Hugging Face Transformers': 41,
  'scikit-learn': 42,
  'MLflow / Kubeflow': 43,
  'LangChain / LlamaIndex': 44,
  'CUDA / GPU 프로그래밍': 45,
  'AWS SageMaker / GCP Vertex AI': 46,
  'Docker + Kubernetes': 47,
  'SIEM 도구 (Splunk, QRadar, Sentinel)': 48,
  '침투 테스팅 도구 (Metasploit, Burp Suite, Nmap)': 49,
  'Python / Bash': 50,
  '클라우드 보안 (AWS Security Hub, Azure Defender)': 51,
  'Wireshark / tcpdump': 52,
  '취약점 스캐너 (Nessus, OpenVAS)': 53,
  'DevSecOps (SonarQube, Snyk, OWASP ZAP)': 54,
  'IAM / Zero Trust (Okta, CrowdStrike)': 55,
  '포렌식 도구 (Volatility, Autopsy)': 56,
  '보안 인증 (CISSP, CEH, OSCP)': 57,
  Kotlin: 58,
  Swift: 59,
  'Flutter (Dart)': 60,
  'React Native': 61,
  'Jetpack Compose': 62,
  SwiftUI: 63,
  'Kotlin Multiplatform (KMP)': 64,
  Firebase: 65,
  'Android Jetpack': 66,
  'Gradle / CocoaPods': 67,
  'Kubernetes (k8s)': 68,
  Terraform: 69,
  AWS: 70,
  'GitHub Actions / GitLab CI': 71,
  Ansible: 72,
  'Prometheus + Grafana': 73,
  'Linux (Bash)': 74,
  Helm: 75,
  'Unity (C#)': 76,
  'Unreal Engine 5 (C++)': 77,
  'C++': 78,
  'C#': 79,
  'HLSL / GLSL': 80,
  '게임 서버 (Go, Java, Node.js)': 81,
  'Git + Perforce': 82,
  'Blender / Maya': 83,
  'VR/AR SDK (ARCore, ARKit, OpenXR)': 84,
  // UI 칩 별칭 (TECH_TAG_OPTIONS)
  JavaScript: 3,
  'C/C++': 78,
  Spring: 14,
  Flutter: 60,
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

export const TRACK_ID_MAP: Record<string, number> = {
  'AIㆍ소프트웨어학과': 1,
  'AI로봇융합트랙': 2,
  'AI응용학과': 3,
  'ICT융합디자인학과': 4,
  'SW융합학과': 5,
  'UX/UI디자인트랙': 6,
  'VMDㆍ전시디자인트랙': 7,
  '게임그래픽디자인트랙': 8,
  '경제금융투자트랙': 9,
  '공공행정트랙': 10,
  '교양영어과정': 11,
  '국제무역트랙': 12,
  '글로벌K비즈니스학과': 13,
  '글로벌비즈니스트랙': 14,
  '기계시스템디자인트랙': 15,
  '기업ㆍ경제분석트랙': 16,
  '기업경영트랙': 17,
  '기초교양학부': 18,
  '동양화전공': 19,
  '디지털인문정보학트랙': 20,
  '디지털콘텐츠ㆍ가상현실트랙': 21,
  '모바일소프트웨어트랙': 22,
  '문학문화콘텐츠학과': 23,
  '미디어디자인트랙': 24,
  '미래모빌리티학과': 25,
  '발레전공': 26,
  '법&정책트랙': 27,
  '부동산트랙': 28,
  '뷰티디자인매니지먼트학과': 29,
  '뷰티디자인학과': 30,
  '비즈니스애널리틱스트랙': 31,
  '비즈니스컨설팅학과': 32,
  '빅데이터트랙': 33,
  '사고와표현과정': 34,
  '산업공학트랙': 35,
  '상상력인재학부': 36,
  '서양화전공': 37,
  '소양핵심교양학부': 38,
  '스마트도시ㆍ교통계획트랙': 39,
  '시각디자인트랙': 40,
  '시스템반도체트랙': 41,
  '역사문화큐레이션트랙': 42,
  '역사콘텐츠트랙': 43,
  '영미문화콘텐츠트랙': 44,
  '영미언어정보트랙': 45,
  '영상ㆍ애니메이션디자인트랙': 46,
  '영상엔터테인먼트학과': 47,
  '웹공학트랙': 48,
  '융합보안학과': 49,
  '융합행정학과': 50,
  '응용산업데이터공학트랙': 51,
  '인테리어디자인트랙': 52,
  '자율공학학부': 53,
  '전자트랙': 54,
  '지식정보문화트랙': 55,
  '패션디자인트랙': 56,
  '패션마케팅트랙': 57,
  '패션뷰티크리에이션학과': 58,
  '패션크리에이티브디렉션트랙': 59,
  '한국무용전공': 60,
  '한국어교육트랙': 61,
  '한국언어문화교육학과': 62,
  '현대무용전공': 63,
  '호텔외식경영학과': 64,
  '회계ㆍ재무경영트랙': 65,
};

/** 트랙별 department_id (백엔드 track.department_id) */
export const TRACK_TO_DEPARTMENT_ID_MAP: Record<string, number> = {
  'AIㆍ소프트웨어학과': 1,
  'AI로봇융합트랙': 2,
  'AI응용학과': 3,
  'ICT융합디자인학과': 1,
  'SW융합학과': 4,
  'UX/UI디자인트랙': 5,
  'VMDㆍ전시디자인트랙': 5,
  '게임그래픽디자인트랙': 5,
  '경제금융투자트랙': 6,
  '공공행정트랙': 6,
  '교양영어과정': 7,
  '국제무역트랙': 6,
  '글로벌K비즈니스학과': 4,
  '글로벌비즈니스트랙': 6,
  '기계시스템디자인트랙': 2,
  '기업ㆍ경제분석트랙': 6,
  '기업경영트랙': 6,
  '기초교양학부': 7,
  '동양화전공': 8,
  '디지털인문정보학트랙': 9,
  '디지털콘텐츠ㆍ가상현실트랙': 10,
  '모바일소프트웨어트랙': 10,
  '문학문화콘텐츠학과': 3,
  '미디어디자인트랙': 5,
  '미래모빌리티학과': 3,
  '발레전공': 8,
  '법&정책트랙': 6,
  '부동산트랙': 6,
  '뷰티디자인매니지먼트학과': 11,
  '뷰티디자인학과': 1,
  '비즈니스애널리틱스트랙': 6,
  '비즈니스컨설팅학과': 1,
  '빅데이터트랙': 10,
  '사고와표현과정': 7,
  '산업공학트랙': 12,
  '상상력인재학부': 3,
  '서양화전공': 8,
  '소양핵심교양학부': 13,
  '스마트도시ㆍ교통계획트랙': 6,
  '시각디자인트랙': 5,
  '시스템반도체트랙': 2,
  '역사문화큐레이션트랙': 9,
  '역사콘텐츠트랙': 9,
  '영미문화콘텐츠트랙': 9,
  '영미언어정보트랙': 9,
  '영상ㆍ애니메이션디자인트랙': 5,
  '영상엔터테인먼트학과': 4,
  '웹공학트랙': 10,
  '융합보안학과': 3,
  '융합행정학과': 1,
  '응용산업데이터공학트랙': 12,
  '인테리어디자인트랙': 5,
  '자율공학학부': 14,
  '전자트랙': 2,
  '지식정보문화트랙': 9,
  '패션디자인트랙': 15,
  '패션마케팅트랙': 15,
  '패션뷰티크리에이션학과': 4,
  '패션크리에이티브디렉션트랙': 15,
  '한국무용전공': 8,
  '한국어교육트랙': 9,
  '한국언어문화교육학과': 4,
  '현대무용전공': 8,
  '호텔외식경영학과': 1,
  '회계ㆍ재무경영트랙': 6,
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
export const ID_TO_TECH_STACK_LABEL = invertMap(TECH_STACK_ID_MAP);
export const ID_TO_TRACK_LABEL = invertMap(TRACK_ID_MAP);
