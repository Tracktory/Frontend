export const ONBOARDING_SERVICE_NAME = 'tracktory';

export type OnboardingScreenKey =
  | 'name'
  | 'admissionYear'
  | 'affiliation'
  | 'collegeSelect'
  | 'track1Select'
  | 'track2Select'
  | 'interestSelect'
  | 'developmentFieldSelect'
  | 'companyTypeSelect'
  | 'employmentValueSelect'
  | 'experiencedField'
  | 'confirm';

export const ONBOARDING_COPY: Record<
  OnboardingScreenKey,
  {
    title: string;
    subtitle?: string;
    ctaPrimary: string;
    ctaDisabledHint?: string;
    ctaSecondary?: string;
  }
> = {
  name: {
    title: `반가워요,\n${ONBOARDING_SERVICE_NAME}이에요`,
    subtitle: '이름만 알려주시면, 맞춤 로드맵을 준비할게요',
    ctaPrimary: '다음',
    ctaDisabledHint: '이름을 적어주세요',
  },
  admissionYear: {
    title: '몇 학번이세요?',
    subtitle: '입학년도만 고르면, 지금 몇 학년인지 알아서 맞출게요',
    ctaPrimary: '좋아요, 다음',
  },
  affiliation: {
    title: '지금은 어느 쪽에 가까우세요?',
    ctaPrimary: '다음',
    ctaDisabledHint: '하나만 골라주세요',
  },
  collegeSelect: {
    title: '어느 단과대에 속해 있나요?',
    subtitle: '아직 트랙을 안 골랐어도 괜찮아요. 단과대만 알려주세요',
    ctaPrimary: '다음',
  },
  track1Select: {
    title: '주전공 1트랙이 뭐예요?',
    subtitle: '한성 트랙제에서 1트랙은 주전공 소속이에요',
    ctaPrimary: '1트랙 정했어요',
    ctaDisabledHint: '1트랙을 골라주세요',
  },
  track2Select: {
    title: '2트랙도 골랐나요?',
    subtitle: '없으면 건너뛰어도 돼요. 나중에 마이페이지에서 바꿀 수 있어요',
    ctaPrimary: '다음',
    ctaSecondary: '2트랙은 나중에',
  },
  interestSelect: {
    title: '요즘 어떤 분야에 눈길이 가나요?',
    subtitle: '마음 가는 걸 골라주세요. 최대 5개까지요',
    ctaPrimary: '이 정도면 충분해요',
    ctaDisabledHint: '관심 분야를 골라주세요',
  },
  developmentFieldSelect: {
    title: 'IT 쪽이라면, 어디에 더 끌려요?',
    subtitle: '관심 없는 분야는 빼고 골라도 돼요. 최대 3개',
    ctaPrimary: '이 방향으로 갈게요',
    ctaDisabledHint: '개발 분야를 골라주세요',
  },
  companyTypeSelect: {
    title: '졸업 후 어떤 곳에서 일하고 싶어요?',
    subtitle: '복수 선택해도 돼요',
    ctaPrimary: '다음',
    ctaDisabledHint: '희망 회사 유형을 골라주세요',
  },
  employmentValueSelect: {
    title: '일할 때 뭐가 제일 중요해요?',
    subtitle: '끌리는 것만 골라주세요. 최대 3개',
    ctaPrimary: '취업 성향 정했어요',
    ctaDisabledHint: '중요한 가치를 골라주세요',
  },
  experiencedField: {
    title: '미리 해본 기술이 있나요?',
    subtitle: '없어도 괜찮아요. 있으면 조합 추천이 더 정확해져요',
    ctaPrimary: '다음',
    ctaSecondary: '건너뛸게요',
  },
  confirm: {
    title: '한번만 확인해 주세요',
    subtitle: '틀린 건 뒤로 가서 고치면 돼요. 맞으면 AI가 로드맵을 만들어요',
    ctaPrimary: 'AI에게 맡기기',
  },
};

export const RECOMMEND_LOADING_MESSAGES = [
  '관심사랑 트랙을 연결하고 있어요',
  '1,081가지 조합 중에서 시너지를 찾는 중이에요',
  'GraphRAG로 교과 로드맵을 짜고 있어요',
  '거의 다 됐어요',
] as const;
