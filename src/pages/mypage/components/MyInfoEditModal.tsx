import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  COLLEGE_OPTIONS,
  COLLEGE_TRACK_MAP,
  COMPANY_TYPE_OPTIONS,
  DEVELOPMENT_FIELD_OPTIONS,
  EMPLOYMENT_VALUE_OPTIONS,
  INTEREST_OPTIONS,
  TECH_TAG_OPTIONS,
  findCollegeForTrack,
} from '../../onboarding/data/onboardingOptions';
import { colors } from '../../../styles/colors';
import { splitExperiencedFields } from '../../../utils/techStackLabels';

const GRADE_OPTIONS = [1, 2, 3, 4] as const;

export type EditableSection =
  | 'grade'
  | 'tracks'
  | 'interests'
  | 'development'
  | 'experience'
  | 'employment';

interface MyInfoEditModalProps {
  visible: boolean;
  section: EditableSection | null;
  isSaving?: boolean;
  currentGrade: number;
  currentCollege: string | null;
  currentTrack1: string;
  currentTrack2: string;
  currentInterests: string[];
  currentDevelopmentFields: string[];
  currentExperiencedFields: string[];
  currentPreferredCompanyTypes: string[];
  currentEmploymentValues: string[];
  onClose: () => void;
  onSaveGrade: (grade: number) => Promise<boolean>;
  onSaveTracks: (next: { track1: string; track2: string }) => Promise<boolean>;
  onSaveInterests: (next: string[]) => Promise<boolean>;
  onSaveDevelopmentFields: (next: string[]) => Promise<boolean>;
  onSaveExperience: (next: string[]) => Promise<boolean>;
  onSaveEmployment: (next: {
    preferredCompanyTypes: string[];
    employmentValues: string[];
  }) => Promise<boolean>;
}

function toggleWithLimit(
  prev: string[],
  value: string,
  maxSelectable?: number
): string[] {
  if (prev.includes(value)) {
    return prev.filter((item) => item !== value);
  }
  if (maxSelectable != null && prev.length >= maxSelectable) {
    return prev;
  }
  return [...prev, value];
}

function TrackPicker({
  label,
  value,
  options,
  disabled,
  onSelect,
}: {
  label: string;
  value: string;
  options: string[];
  disabled: boolean;
  onSelect: (track: string) => void;
}) {
  return (
    <>
      <Text style={styles.groupTitle}>{label}</Text>
      <View style={styles.chipWrap}>
        {options.map((option) => (
          <Pressable
            key={`${label}-${option}`}
            disabled={disabled}
            onPress={() => onSelect(value === option ? '' : option)}
            style={[styles.chip, value === option && styles.chipActive]}
          >
            <Text style={[styles.chipText, value === option && styles.chipTextActive]}>
              {option}
            </Text>
          </Pressable>
        ))}
      </View>
    </>
  );
}

function resolveInitialCollege(
  college: string | null,
  track1: string,
  track2: string
): string | null {
  if (college) return college;
  return findCollegeForTrack(track1) ?? findCollegeForTrack(track2);
}

export function MyInfoEditModal({
  visible,
  section,
  isSaving = false,
  currentGrade,
  currentCollege,
  currentTrack1,
  currentTrack2,
  currentInterests,
  currentDevelopmentFields,
  currentExperiencedFields,
  currentPreferredCompanyTypes,
  currentEmploymentValues,
  onClose,
  onSaveGrade,
  onSaveTracks,
  onSaveInterests,
  onSaveDevelopmentFields,
  onSaveExperience,
  onSaveEmployment,
}: MyInfoEditModalProps) {
  const [draftGrade, setDraftGrade] = useState(1);
  const [draftCollege, setDraftCollege] = useState<string | null>(null);
  const [draftTrack1, setDraftTrack1] = useState('');
  const [draftTrack2, setDraftTrack2] = useState('');
  const [draftInterests, setDraftInterests] = useState<string[]>([]);
  const [draftDevelopmentFields, setDraftDevelopmentFields] = useState<string[]>([]);
  const [draftExperienceInput, setDraftExperienceInput] = useState('');
  const [draftExperienceTags, setDraftExperienceTags] = useState<string[]>([]);
  const [draftCompanyTypes, setDraftCompanyTypes] = useState<string[]>([]);
  const [draftEmploymentValues, setDraftEmploymentValues] = useState<string[]>([]);

  useEffect(() => {
    if (!visible) return;
    setDraftGrade(currentGrade >= 1 && currentGrade <= 4 ? currentGrade : 1);
    setDraftCollege(resolveInitialCollege(currentCollege, currentTrack1, currentTrack2));
    setDraftTrack1(currentTrack1);
    setDraftTrack2(currentTrack2);
    setDraftInterests(currentInterests);
    setDraftDevelopmentFields(currentDevelopmentFields);
    const { chipLabels, customLabels } = splitExperiencedFields(currentExperiencedFields);
    setDraftExperienceTags(chipLabels);
    setDraftExperienceInput(customLabels.join(', '));
    setDraftCompanyTypes(currentPreferredCompanyTypes);
    setDraftEmploymentValues(currentEmploymentValues);
  }, [
    visible,
    currentGrade,
    currentCollege,
    currentTrack1,
    currentTrack2,
    currentInterests,
    currentDevelopmentFields,
    currentExperiencedFields,
    currentPreferredCompanyTypes,
    currentEmploymentValues,
  ]);

  const sectionTitle = useMemo(() => {
    if (section === 'grade') return '학년 수정';
    if (section === 'tracks') return '트랙 정보 수정';
    if (section === 'interests') return '관심 분야 수정';
    if (section === 'development') return '흥미 개발 분야 수정';
    if (section === 'experience') return '공부해본 분야 수정';
    if (section === 'employment') return '취업 선호 수정';
    return '';
  }, [section]);

  const draftCollegeTracks = useMemo(
    () => (draftCollege ? (COLLEGE_TRACK_MAP[draftCollege] ?? []) : []),
    [draftCollege]
  );

  const handleCollegeSelect = (option: string) => {
    const nextCollege = draftCollege === option ? null : option;
    setDraftCollege(nextCollege);

    if (!nextCollege) {
      setDraftTrack1('');
      setDraftTrack2('');
      return;
    }

    const tracks = COLLEGE_TRACK_MAP[nextCollege] ?? [];
    setDraftTrack1((prev) => (tracks.includes(prev) ? prev : ''));
    setDraftTrack2((prev) => (tracks.includes(prev) ? prev : ''));
  };

  const draftExperienceAll = useMemo(() => {
    const inputTags = draftExperienceInput
      ? draftExperienceInput
          .split(/[,，]/)
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    return [...new Set([...draftExperienceTags, ...inputTags])];
  }, [draftExperienceTags, draftExperienceInput]);

  const handleSave = async () => {
    if (isSaving || section == null) return;

    let ok = true;
    if (section === 'grade') {
      ok = await onSaveGrade(draftGrade);
    } else if (section === 'tracks') {
      if (!draftCollege) {
        Alert.alert('입력 오류', '단과대를 선택해주세요.');
        return;
      }
      if (!draftTrack1.trim()) {
        Alert.alert('입력 오류', '1트랙을 선택해주세요.');
        return;
      }
      ok = await onSaveTracks({ track1: draftTrack1, track2: draftTrack2 });
    } else if (section === 'interests') {
      ok = await onSaveInterests(draftInterests);
    } else if (section === 'development') {
      ok = await onSaveDevelopmentFields(draftDevelopmentFields);
    } else if (section === 'experience') {
      ok = await onSaveExperience(draftExperienceAll);
    } else if (section === 'employment') {
      ok = await onSaveEmployment({
        preferredCompanyTypes: draftCompanyTypes,
        employmentValues: draftEmploymentValues,
      });
    }

    if (ok) onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={isSaving ? undefined : onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={isSaving ? undefined : onClose} />
        <View style={styles.sheet}>
          <Text style={styles.title}>{sectionTitle}</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {section === 'grade' ? (
              <View style={styles.gradeRow}>
                {GRADE_OPTIONS.map((year) => (
                  <Pressable
                    key={year}
                    disabled={isSaving}
                    onPress={() => setDraftGrade(year)}
                    style={[styles.gradeChip, draftGrade === year && styles.chipActive]}
                  >
                    <Text
                      style={[styles.chipText, draftGrade === year && styles.chipTextActive]}
                    >
                      {year}학년
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : null}

            {section === 'tracks' ? (
              <>
                <Text style={styles.groupTitle}>단과대</Text>
                <Text style={styles.helper}>단과대를 먼저 선택해주세요.</Text>
                <View style={styles.chipWrap}>
                  {COLLEGE_OPTIONS.map((option) => (
                    <Pressable
                      key={option}
                      disabled={isSaving}
                      onPress={() => handleCollegeSelect(option)}
                      style={[styles.chip, draftCollege === option && styles.chipActive]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          draftCollege === option && styles.chipTextActive,
                        ]}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                {draftCollege ? (
                  <>
                    <View style={styles.groupGap} />
                    <Text style={styles.helper}>1트랙은 필수, 2트랙은 선택입니다.</Text>
                    <TrackPicker
                      label="1트랙 (주전공)"
                      value={draftTrack1}
                      options={draftCollegeTracks}
                      disabled={isSaving}
                      onSelect={setDraftTrack1}
                    />
                    <View style={styles.groupGap} />
                    <TrackPicker
                      label="2트랙 (선택)"
                      value={draftTrack2}
                      options={draftCollegeTracks}
                      disabled={isSaving}
                      onSelect={setDraftTrack2}
                    />
                  </>
                ) : null}
              </>
            ) : null}

            {section === 'interests' ? (
              <>
                <Text style={styles.helper}>최대 5개까지 선택할 수 있어요.</Text>
                <View style={styles.chipWrap}>
                  {INTEREST_OPTIONS.map((option) => (
                    <Pressable
                      key={option}
                      disabled={isSaving}
                      onPress={() =>
                        setDraftInterests((prev) => toggleWithLimit(prev, option, 5))
                      }
                      style={[
                        styles.chip,
                        draftInterests.includes(option) && styles.chipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          draftInterests.includes(option) && styles.chipTextActive,
                        ]}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </>
            ) : null}

            {section === 'development' ? (
              <>
                <Text style={styles.helper}>최대 3개까지 선택할 수 있어요.</Text>
                <View style={styles.chipWrap}>
                  {DEVELOPMENT_FIELD_OPTIONS.map((option) => (
                    <Pressable
                      key={option}
                      disabled={isSaving}
                      onPress={() =>
                        setDraftDevelopmentFields((prev) =>
                          toggleWithLimit(prev, option, 3)
                        )
                      }
                      style={[
                        styles.chip,
                        draftDevelopmentFields.includes(option) && styles.chipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          draftDevelopmentFields.includes(option) && styles.chipTextActive,
                        ]}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </>
            ) : null}

            {section === 'experience' ? (
              <>
                <Text style={styles.helper}>선택사항 · 자유 입력 또는 태그 선택</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="EX) Python, React, TypeScript"
                  placeholderTextColor={colors.textHint}
                  value={draftExperienceInput}
                  onChangeText={setDraftExperienceInput}
                  editable={!isSaving}
                />
                <View style={styles.chipWrap}>
                  {TECH_TAG_OPTIONS.map((option) => (
                    <Pressable
                      key={option}
                      disabled={isSaving}
                      onPress={() =>
                        setDraftExperienceTags((prev) => toggleWithLimit(prev, option))
                      }
                      style={[
                        styles.chip,
                        draftExperienceTags.includes(option) && styles.chipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          draftExperienceTags.includes(option) && styles.chipTextActive,
                        ]}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </>
            ) : null}

            {section === 'employment' ? (
              <>
                <Text style={styles.groupTitle}>선호 기업 유형</Text>
                <View style={styles.chipWrap}>
                  {COMPANY_TYPE_OPTIONS.map((option) => (
                    <Pressable
                      key={option}
                      disabled={isSaving}
                      onPress={() =>
                        setDraftCompanyTypes((prev) => toggleWithLimit(prev, option))
                      }
                      style={[
                        styles.chip,
                        draftCompanyTypes.includes(option) && styles.chipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          draftCompanyTypes.includes(option) && styles.chipTextActive,
                        ]}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <Text style={[styles.groupTitle, styles.groupGap]}>중요 가치</Text>
                <Text style={styles.helper}>최대 3개까지 선택할 수 있어요.</Text>
                <View style={styles.chipWrap}>
                  {EMPLOYMENT_VALUE_OPTIONS.map((option) => (
                    <Pressable
                      key={option}
                      disabled={isSaving}
                      onPress={() =>
                        setDraftEmploymentValues((prev) =>
                          toggleWithLimit(prev, option, 3)
                        )
                      }
                      style={[
                        styles.chip,
                        draftEmploymentValues.includes(option) && styles.chipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          draftEmploymentValues.includes(option) && styles.chipTextActive,
                        ]}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </>
            ) : null}
          </ScrollView>

          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.cancelButton, isSaving && styles.buttonDisabled]}
              onPress={onClose}
              disabled={isSaving}
            >
              <Text style={styles.cancelText}>취소</Text>
            </Pressable>
            <Pressable
              style={[styles.saveButton, isSaving && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <Text style={styles.saveText}>저장</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  sheet: {
    width: '100%',
    maxHeight: '78%',
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  helper: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  groupTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  groupGap: {
    marginTop: 14,
  },
  gradeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gradeChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.white,
  },
  textInput: {
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.white,
  },
  chipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  chipText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  chipTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  cancelText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  saveText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
