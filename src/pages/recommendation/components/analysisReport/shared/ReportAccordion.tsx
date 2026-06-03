import React, { type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ReportAccordionProps {
  expanded: boolean;
  onToggle: () => void;
  header: ReactNode;
  children?: ReactNode;
  borderActive?: boolean;
}

export function ReportAccordion({
  expanded,
  onToggle,
  header,
  children,
  borderActive = false,
}: ReportAccordionProps) {
  return (
    <View
      style={[
        styles.wrap,
        borderActive && expanded ? styles.wrapActive : null,
      ]}
    >
      <Pressable
        onPress={onToggle}
        style={[styles.header, expanded ? styles.headerExpanded : null]}
      >
        {header}
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={16}
          color="#9CA3AF"
        />
      </Pressable>
      {expanded && children ? (
        <View style={styles.body}>{children}</View>
      ) : null}
    </View>
  );
}

export function AccordionChevronRow({ children }: { children: ReactNode }) {
  return <View style={styles.headerInner}>{children}</View>;
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    marginBottom: 12,
  },
  wrapActive: {
    borderColor: '#14B8A6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  headerExpanded: {
    backgroundColor: '#F0FDFA',
  },
  headerInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  body: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 4,
    backgroundColor: '#F0FDFA',
  },
});
