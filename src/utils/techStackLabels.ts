import { TECH_STACK_ID_MAP } from '../pages/onboarding/data/idMappings';
import { TECH_TAG_OPTIONS } from '../pages/onboarding/data/onboardingOptions';

const TECH_TAG_SET = new Set<string>(TECH_TAG_OPTIONS);

/** techStackId → UI 칩 라벨 (TECH_TAG_OPTIONS 우선) */
const UI_LABEL_BY_TECH_STACK_ID: Record<number, string> = {};
for (const opt of TECH_TAG_OPTIONS) {
  const id = TECH_STACK_ID_MAP[opt];
  if (id != null) {
    UI_LABEL_BY_TECH_STACK_ID[id] = opt;
  }
}

/** 서버/DB 카탈로그명 → TECH_TAG_OPTIONS 칩 라벨. 매핑 없으면 custom(원문). */
export function techStackToUiLabel(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return trimmed;
  if (TECH_TAG_SET.has(trimmed)) return trimmed;

  const id = TECH_STACK_ID_MAP[trimmed];
  if (id != null && UI_LABEL_BY_TECH_STACK_ID[id]) {
    return UI_LABEL_BY_TECH_STACK_ID[id];
  }

  return trimmed;
}

/** 카탈로그 tech stack(칩)인지 여부 */
export function isTechStackChipLabel(name: string): boolean {
  return TECH_TAG_SET.has(techStackToUiLabel(name));
}

export function splitExperiencedFields(names: string[]): {
  chipLabels: string[];
  customLabels: string[];
} {
  const chipLabels: string[] = [];
  const customLabels: string[] = [];
  const seenChips = new Set<string>();

  for (const raw of names) {
    const trimmed = raw.trim();
    if (!trimmed) continue;

    const ui = techStackToUiLabel(trimmed);
    if (TECH_TAG_SET.has(ui)) {
      if (!seenChips.has(ui)) {
        seenChips.add(ui);
        chipLabels.push(ui);
      }
    } else if (!customLabels.includes(trimmed)) {
      customLabels.push(trimmed);
    }
  }

  return { chipLabels, customLabels };
}
