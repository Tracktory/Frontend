import type { ProfileData } from '../api/profileApi';
import type { AffiliationType } from '../stores/slices/admissionSlice';
import {
  DEPARTMENT_TO_COLLEGE_ID_MAP,
  ID_TO_COLLEGE_LABEL,
  ID_TO_COMPANY_TYPE_LABEL,
  ID_TO_DEV_FIELD_LABEL,
  ID_TO_INTEREST_LABEL,
  ID_TO_WORK_VALUE_LABEL,
} from '../pages/onboarding/data/idMappings';
import { splitExperiencedFields } from './techStackLabels';

export interface OnboardingHydrationPayload {
  name: string;
  interests: string[];
  developmentFields: string[];
  preferredCompanyTypes: string[];
  employmentValues: string[];
  track1: string;
  track2: string;
  college: string | null;
  grade: number | null;
  affiliation: AffiliationType | null;
  admissionYear: number | null;
  experiencedFields: string[];
  experiencedFieldInput: string;
  completedCourses: string[];
}

function mapIdsToLabels(
  items: { id: number; code: string }[],
  labelMap: Record<number, string>
): string[] {
  return items
    .map((item) => labelMap[item.id])
    .filter((label): label is string => label != null && label.length > 0);
}

/** studentId 앞 2자리 → 입학연도 (예: "19" → 2019) */
export function admissionYearFromStudentId(studentId: string | undefined): number | null {
  if (!studentId || studentId.length < 2) return null;
  const yy = parseInt(studentId.slice(0, 2), 10);
  if (Number.isNaN(yy)) return null;
  return 2000 + yy;
}

export function mapProfileToOnboarding(data: ProfileData): OnboardingHydrationPayload {
  const sortedTracks = [...data.tracks].sort((a, b) => a.trackOrder - b.trackOrder);

  const { chipLabels, customLabels } = splitExperiencedFields([
    ...data.techStacks.map((t) => t.name),
    ...data.techStackCustoms,
  ]);
  const experiencedFields = [...chipLabels, ...customLabels];

  const currentYear = data.profile.currentYear;
  const affiliation: AffiliationType | null =
    currentYear === 1 ? '1학년' : currentYear > 1 ? '2학년이상' : null;

  const collegeId = DEPARTMENT_TO_COLLEGE_ID_MAP[data.profile.departmentId];
  const college =
    collegeId != null ? (ID_TO_COLLEGE_LABEL[collegeId] ?? null) : null;

  return {
    name: data.profile.name,
    interests: mapIdsToLabels(data.interests, ID_TO_INTEREST_LABEL),
    developmentFields: mapIdsToLabels(data.devFields, ID_TO_DEV_FIELD_LABEL),
    preferredCompanyTypes: mapIdsToLabels(data.companyTypes, ID_TO_COMPANY_TYPE_LABEL),
    employmentValues: mapIdsToLabels(data.workValues, ID_TO_WORK_VALUE_LABEL),
    track1: sortedTracks[0]?.name ?? '',
    track2: sortedTracks[1]?.name ?? '',
    college,
    grade: currentYear,
    affiliation,
    admissionYear: admissionYearFromStudentId(data.profile.studentId),
    experiencedFields,
    experiencedFieldInput: '',
    completedCourses: data.completedSubjects.map((s) => s.name),
  };
}
