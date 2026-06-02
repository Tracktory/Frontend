import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Button } from '../../../components/Button';
import { ProgressBar } from '../../../components/ProgressBar';
import { colors } from '../../../styles/colors';

interface OnboardingStepLayoutProps {
  progress: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  primaryTitle: string;
  primaryVariant?: 'primary' | 'disabled';
  primarySubtitle?: string;
  onPrimaryPress?: () => void;
  secondaryTitle?: string;
  onSecondaryPress?: () => void;
  scrollable?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  /** 제공 시 기본 primary/secondary 버튼 대신 렌더 */
  footer?: React.ReactNode;
}

export function OnboardingStepLayout({
  progress,
  title,
  subtitle,
  children,
  showBack = false,
  onBack,
  primaryTitle,
  primaryVariant = 'primary',
  primarySubtitle,
  onPrimaryPress,
  secondaryTitle,
  onSecondaryPress,
  scrollable = false,
  contentStyle,
  footer,
}: OnboardingStepLayoutProps) {
  const body = (
    <>
      <ProgressBar progress={progress} />
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <View style={[styles.children, contentStyle]}>{children}</View>
    </>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        {showBack && onBack ? (
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← 뒤로</Text>
          </Pressable>
        ) : (
          <View style={styles.headerSpacer} />
        )}
      </View>

      {scrollable ? (
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {body}
        </ScrollView>
      ) : (
        <View style={styles.content}>{body}</View>
      )}

      <View style={styles.bottomArea}>
        {footer ?? (
          <>
            {secondaryTitle && onSecondaryPress ? (
              <>
                <Button title={secondaryTitle} variant="secondary" onPress={onSecondaryPress} />
                <View style={styles.buttonGap} />
              </>
            ) : null}
            <Button
              title={primaryTitle}
              variant={primaryVariant}
              onPress={onPrimaryPress}
              subtitle={primarySubtitle}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 28,
  },
  headerRow: {
    minHeight: 44,
    justifyContent: 'center',
    marginBottom: 4,
  },
  headerSpacer: {
    minHeight: 44,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingRight: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  children: {
    flex: 1,
  },
  bottomArea: {
    paddingTop: 12,
  },
  buttonGap: {
    height: 10,
  },
});
