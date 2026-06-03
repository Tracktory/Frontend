export type BriefingItem = {
  job: string;
  headline: string;
  summary: string;
  source: string;
};

export const FIRST_YEAR_BRIEFINGS: BriefingItem[] = [
  {
    job: 'Data Scientist',
    headline: 'AI 모델 해석 가능성이 핵심 이슈로 부상',
    summary:
      'XAI(설명 가능한 AI) 기술이 금융·의료 분야에서 필수 요건이 되고 있습니다. SHAP, LIME 등 모델 해석 도구 활용 능력이 중요해지는 추세입니다.',
    source: 'Kaggle Survey · 2026',
  },
  {
    job: 'Backend Developer',
    headline: '서버리스 아키텍처 채택 급증',
    summary:
      'AWS Lambda, Vercel Edge Functions 등 서버리스 플랫폼이 빠르게 확산. 이벤트 기반 설계와 분산 시스템 이해가 필수 역량으로 자리잡고 있습니다.',
    source: 'Stack Overflow · 2026',
  },
  {
    job: 'UX Researcher',
    headline: '행동 데이터 기반 리서치 방법론 주목',
    summary:
      '정성 조사와 정량 데이터 결합이 핵심. Amplitude, Mixpanel 등 분석 도구를 활용한 데이터 드리븐 UX 설계가 트렌드입니다.',
    source: 'Nielsen Norman Group · 2026',
  },
];

export const CLIMBING_BRIEFINGS: BriefingItem[] = [
  {
    job: 'Backend',
    headline: 'Kafka 기반 이벤트 스트리밍 수요 증가',
    summary:
      '대규모 실시간 데이터 처리에서 Kafka의 역할이 확대. MSA 환경에서 이벤트 소싱 패턴 적용이 표준화되고 있습니다.',
    source: 'JetBrains Survey · 2026',
  },
  {
    job: 'Data Eng',
    headline: 'dbt + Snowflake 조합이 데이터 파이프라인 표준으로',
    summary:
      '데이터 변환 계층을 코드로 관리하는 dbt가 빠르게 확산. SQL 기반 데이터 모델링과 버전 관리가 핵심 스킬로 부상했습니다.',
    source: 'Data Council · 2026',
  },
  {
    job: 'AI',
    headline: 'LLM 파인튜닝보다 RAG 아키텍처 선호',
    summary:
      '비용 효율적인 RAG(검색 증강 생성) 패턴이 주류로. 벡터 DB(Pinecone, Weaviate)와 임베딩 최적화 능력이 실무 핵심이 되고 있습니다.',
    source: 'arXiv · 2026',
  },
];

/** Alternate pools for refresh (future API will replace). */
export const BRIEFING_CARD_POOLS: BriefingItem[][] = [
  FIRST_YEAR_BRIEFINGS,
  [
    {
      job: 'Data Scientist',
      headline: 'MLOps 파이프라인 자동화 수요 증가',
      summary:
        '모델 배포·모니터링 일체화가 채용 공고에서 빈번히 요구됩니다. MLflow, Kubeflow 경험이 차별화 요소로 부상하고 있습니다.',
      source: 'Industry Report · 2026',
    },
    {
      job: 'Backend Developer',
      headline: 'Edge 컴퓨팅과 API 게이트웨이 통합',
      summary:
        'CDN 엣지에서의 API 처리와 글로벌 레이턴시 최적화가 백엔드 설계의 핵심 과제가 되고 있습니다.',
      source: 'CNCF · 2026',
    },
    {
      job: 'UX Researcher',
      headline: 'AI 보조 사용자 인터뷰 도구 확산',
      summary:
        '정성 리서치 워크플로에 LLM 요약·코딩이 도입되며, 리서처의 해석 역량이 더욱 중요해지고 있습니다.',
      source: 'UX Collective · 2026',
    },
  ],
];

export const CLIMBING_BRIEFING_POOLS: BriefingItem[][] = [
  CLIMBING_BRIEFINGS,
  [
    {
      job: 'Backend',
      headline: 'gRPC vs REST 하이브리드 아키텍처',
      summary:
        '내부 마이크로서비스는 gRPC, 외부 API는 REST를 병행하는 패턴이 대규모 서비스에서 표준화되고 있습니다.',
      source: 'InfoQ · 2026',
    },
    {
      job: 'Data Eng',
      headline: 'Iceberg / Delta Lake 테이블 포맷 주목',
      summary:
        '오픈 테이블 포맷이 데이터 레이크하우스의 사실상 표준이 되며, Spark·Flink 연동 수요가 증가하고 있습니다.',
      source: 'Databricks Blog · 2026',
    },
    {
      job: 'AI',
      headline: 'Agentic RAG 워크플로 확산',
      summary:
        '단순 검색 증강을 넘어 도구 호출·멀티스텝 추론이 결합된 Agentic RAG가 프로덕션 파일럿에 도입되고 있습니다.',
      source: 'arXiv · 2026',
    },
  ],
];
