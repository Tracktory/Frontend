import type { OnboardingRequestBody } from '../api/onboardingApi';
import {
  COMPANY_TYPE_ID_MAP,
  DEV_FIELD_ID_MAP,
  INTEREST_ID_MAP,
  TECH_STACK_ID_MAP,
  WORK_VALUE_ID_MAP,
  isValidDepartmentId,
  resolveDepartmentIdForTrack,
  resolveFirstYearDefaultTrackId,
  resolveFirstYearDepartmentId,
  resolveTrackId,
} from '../pages/onboarding/data/idMappings';

export interface OnboardingBuildInput {
  name: string;
  grade: number | null;
  college: string | null;
  track1: string;
  track2: string;
  interests: string[];
  developmentFields: string[];
  preferredCompanyTypes: string[];
  employmentValues: string[];
  catalogExperiencedFields: string[];
  techStackCustoms: string[];
}

export type OnboardingBuildResult =
  | { ok: true; body: OnboardingRequestBody }
  | { ok: false; error: string };

function toIds(labels: string[], map: Record<string, number>): number[] {
  return labels.map((l) => map[l]).filter((id): id is number => id !== undefined);
}

function validateLabels(
  labels: string[],
  map: Record<string, number>,
  fieldLabel: string
): string | null {
  const missing = labels.filter((l) => map[l] === undefined);
  if (missing.length > 0) {
    return `${fieldLabel} 선택값을 확인해주세요.`;
  }
  return null;
}

export function buildOnboardingRequestBody(
  input: OnboardingBuildInput
): OnboardingBuildResult {
  const trimmedName = input.name.trim();
  if (!trimmedName) {
    return { ok: false, error: '이름을 입력해주세요.' };
  }

  const grade = input.grade;
  if (grade == null || grade < 1 || grade > 4) {
    return { ok: false, error: '학년을 선택해주세요.' };
  }

  const interestErr = validateLabels(input.interests, INTEREST_ID_MAP, '관심 분야');
  if (interestErr) return { ok: false, error: interestErr };

  const devErr = validateLabels(
    input.developmentFields,
    DEV_FIELD_ID_MAP,
    '흥미 개발분야'
  );
  if (devErr) return { ok: false, error: devErr };

  const companyErr = validateLabels(
    input.preferredCompanyTypes,
    COMPANY_TYPE_ID_MAP,
    '희망 회사 유형'
  );
  if (companyErr) return { ok: false, error: companyErr };

  const workErr = validateLabels(input.employmentValues, WORK_VALUE_ID_MAP, '취업 가치');
  if (workErr) return { ok: false, error: workErr };

  const techErr = validateLabels(
    input.catalogExperiencedFields,
    TECH_STACK_ID_MAP,
    '기술 스택'
  );
  if (techErr) return { ok: false, error: techErr };

  let departmentId: number | undefined;
  const tracks: { trackId: number; trackOrder: 1 | 2 }[] = [];

  if (grade === 1) {
    if (!input.college) {
      return { ok: false, error: '소속 학부를 선택해주세요.' };
    }
    departmentId = resolveFirstYearDepartmentId(input.college);
    if (departmentId == null || !isValidDepartmentId(departmentId)) {
      return { ok: false, error: '선택한 단과대의 학과 정보를 찾을 수 없어요.' };
    }
    const trackId = resolveFirstYearDefaultTrackId(input.college);
    if (trackId == null) {
      return { ok: false, error: '선택한 단과대의 기본 트랙을 찾을 수 없어요.' };
    }
    tracks.push({ trackId, trackOrder: 1 });
  } else {
    const t1 = input.track1.trim();
    if (!t1) {
      return { ok: false, error: '1트랙을 선택해주세요.' };
    }
    const id1 = resolveTrackId(t1);
    if (id1 == null) {
      return { ok: false, error: '1트랙 선택값을 확인해주세요.' };
    }
    tracks.push({ trackId: id1, trackOrder: 1 });

    const t2 = input.track2.trim();
    if (t2) {
      const id2 = resolveTrackId(t2);
      if (id2 == null) {
        return { ok: false, error: '2트랙 선택값을 확인해주세요.' };
      }
      tracks.push({ trackId: id2, trackOrder: 2 });
    }

    departmentId = resolveDepartmentIdForTrack(t1);
    if (departmentId == null || !isValidDepartmentId(departmentId)) {
      return { ok: false, error: '1트랙에 연결된 학과 정보를 찾을 수 없어요.' };
    }
  }

  if (tracks.length === 0) {
    return { ok: false, error: '트랙 정보가 필요해요.' };
  }

  return {
    ok: true,
    body: {
      profile: {
        currentYear: grade,
        name: trimmedName,
        departmentId,
      },
      tracks,
      interestIds: toIds(input.interests, INTEREST_ID_MAP),
      devFieldIds: toIds(input.developmentFields, DEV_FIELD_ID_MAP),
      companyTypeIds: toIds(input.preferredCompanyTypes, COMPANY_TYPE_ID_MAP),
      workValueIds: toIds(input.employmentValues, WORK_VALUE_ID_MAP),
      techStackIds: toIds(input.catalogExperiencedFields, TECH_STACK_ID_MAP),
      techStackCustoms: input.techStackCustoms,
    },
  };
}
