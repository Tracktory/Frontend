import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../styles/colors';
import type { ChatMessage, CourseSuggestion } from '../../stores/chatStore';

function CourseCard({ course }: { course: CourseSuggestion }) {
  return (
    <View style={cardStyles.card}>
      <View style={cardStyles.titleRow}>
        <Text style={cardStyles.title}>{course.title}</Text>
      </View>
      <Text style={cardStyles.desc}>{course.description}</Text>
      {course.prereqMet && (
        <Text style={cardStyles.prereq}>선수과목 충족 ✓</Text>
      )}
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  titleRow: {
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  desc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  prereq: {
    marginTop: 6,
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
});

interface BubbleProps {
  message: ChatMessage;
  onChipPress?: (id: string, label: string) => void;
}

export function ChatMessageBubble({ message, onChipPress }: BubbleProps) {
  const isUser = message.role === 'user';

  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowBot]}>
      {/* 말풍선 본문 */}
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleBot]}>
        <Text style={[styles.text, isUser ? styles.textUser : styles.textBot]}>
          {message.text}
        </Text>

        {/* 추천 과목 카드 */}
        {message.type === 'courses' && message.courses?.map((c) => (
          <CourseCard key={c.title} course={c} />
        ))}
      </View>

      {/* 선택지 칩 (말풍선 아래 별도 행) */}
      {message.type === 'quickReply' && message.chips && (
        <View style={styles.chipsRow}>
          {message.chips.map((chip) => (
            <React.Fragment key={chip.id}>
              {onChipPress ? (
                <View
                  style={styles.chip}
                  // Pressable 대신 Touchable 없이 부모에서 처리 — ChatContent에서 chip onPress 포함
                >
                  <Text
                    style={styles.chipText}
                    onPress={() => onChipPress(chip.id, chip.label)}
                  >
                    {chip.label}
                  </Text>
                </View>
              ) : (
                <View style={[styles.chip, styles.chipDisabled]}>
                  <Text style={[styles.chipText, styles.chipTextDisabled]}>{chip.label}</Text>
                </View>
              )}
            </React.Fragment>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginBottom: 12,
    maxWidth: '85%',
  },
  rowUser: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  rowBot: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleBot: {
    backgroundColor: colors.primaryLight,
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  textUser: {
    color: colors.white,
  },
  textBot: {
    color: colors.textPrimary,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  chip: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  chipDisabled: {
    borderColor: colors.border,
  },
  chipTextDisabled: {
    color: colors.textHint,
  },
});
