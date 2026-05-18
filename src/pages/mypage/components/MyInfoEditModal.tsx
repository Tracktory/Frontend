import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  COMPANY_TYPE_OPTIONS,
  DEVELOPMENT_FIELD_OPTIONS,
  EMPLOYMENT_VALUE_OPTIONS,
  INTEREST_OPTIONS,
} from '../../onboarding/data/onboardingOptions';
import { colors } from '../../../styles/colors';

type EditableSection = 'interests' | 'development' | 'employment';

interface MyInfoEditModalProps {
  visible: boolean;
  section: EditableSection | null;
  currentInterests: string[];
  currentDevelopmentFields: string[];
  currentPreferredCompanyTypes: string[];
  currentEmploymentValues: string[];
  onClose: () => void;
  onSaveInterests: (next: string[]) => void;
  onSaveDevelopmentFields: (next: string[]) => void;
  onSaveEmployment: (next: {
    preferredCompanyTypes: string[];
    employmentValues: string[];
  }) => void;
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

export function MyInfoEditModal({
  visible,
  section,
  currentInterests,
  currentDevelopmentFields,
  currentPreferredCompanyTypes,
  currentEmploymentValues,
  onClose,
  onSaveInterests,
  onSaveDevelopmentFields,
  onSaveEmployment,
}: MyInfoEditModalProps) {
  const [draftInterests, setDraftInterests] = useState<string[]>([]);
  const [draftDevelopmentFields, setDraftDevelopmentFields] = useState<string[]>([]);
  const [draftCompanyTypes, setDraftCompanyTypes] = useState<string[]>([]);
  const [draftEmploymentValues, setDraftEmploymentValues] = useState<string[]>([]);

  useEffect(() => {
    if (!visible) return;
    setDraftInterests(currentInterests);
    setDraftDevelopmentFields(currentDevelopmentFields);
    setDraftCompanyTypes(currentPreferredCompanyTypes);
    setDraftEmploymentValues(currentEmploymentValues);
  }, [
    visible,
    currentInterests,
    currentDevelopmentFields,
    currentPreferredCompanyTypes,
    currentEmploymentValues,
  ]);

  const sectionTitle = useMemo(() => {
    if (section === 'interests') return '관심사 수정';
    if (section === 'development') return '흥미 개발 분야 수정';
    if (section === 'employment') return '취업 선호도 수정';
    return '';
  }, [section]);

  const handleSave = () => {
    if (section === 'interests') {
      onSaveInterests(draftInterests);
    } else if (section === 'development') {
      onSaveDevelopmentFields(draftDevelopmentFields);
    } else if (section === 'employment') {
      onSaveEmployment({
        preferredCompanyTypes: draftCompanyTypes,
        employmentValues: draftEmploymentValues,
      });
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <Text style={styles.title}>{sectionTitle}</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {section === 'interests' ? (
              <>
                <Text style={styles.helper}>최대 5개까지 선택할 수 있어요.</Text>
                <View style={styles.chipWrap}>
                  {INTEREST_OPTIONS.map((option) => (
                    <Pressable
                      key={option}
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

            {section === 'employment' ? (
              <>
                <Text style={styles.groupTitle}>선호 기업 유형</Text>
                <View style={styles.chipWrap}>
                  {COMPANY_TYPE_OPTIONS.map((option) => (
                    <Pressable
                      key={option}
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
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>취소</Text>
            </Pressable>
            <Pressable style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>저장</Text>
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
});
