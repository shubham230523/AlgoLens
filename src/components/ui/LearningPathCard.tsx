import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { LearningPath } from '@/algorithms/learningPaths';
import * as Icons from 'lucide-react-native';
import { useProgressStore } from '@/store/progressStore';

interface LearningPathCardProps {
  path: LearningPath;
  onPress: () => void;
}

export function LearningPathCard({ path, onPress }: LearningPathCardProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const { isCompleted } = useProgressStore();

  // Robust icon resolution
  const iconName = path.icon.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
  const IconComponent = (Icons as any)[iconName] || Icons.BookOpen || Icons.HelpCircle;

  const completedCount = path.algorithmIds.filter(id => isCompleted(id)).length;
  const progress = path.algorithmIds.length > 0 ? completedCount / path.algorithmIds.length : 0;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.backgroundElement }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '22' }]}>
          {/* Ensure IconComponent is a valid function/class before rendering */}
          {typeof IconComponent === 'function' || typeof IconComponent === 'object' ? (
            <IconComponent color={colors.primary} size={24} />
          ) : (
            <View style={{ width: 24, height: 24, backgroundColor: colors.primary + '44', borderRadius: 12 }} />
          )}
        </View>
        <View style={[styles.difficultyBadge, { backgroundColor: colors.backgroundSelected }]}>
          <ThemedText variant="caption" style={{ color: colors.textSecondary }}>{path.difficulty}</ThemedText>
        </View>
      </View>

      <ThemedText variant="h3" style={styles.title}>{path.title}</ThemedText>
      <ThemedText variant="caption" numberOfLines={2} style={styles.description}>
        {path.description}
      </ThemedText>

      <View style={styles.footer}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: colors.backgroundSelected }]}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: colors.success, width: `${progress * 100}%` }
              ]}
            />
          </View>
          <ThemedText variant="caption" style={styles.progressText}>
            {completedCount}/{path.algorithmIds.length}
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    padding: Spacing.three,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.two,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one / 2,
    borderRadius: 8,
  },
  title: {
    marginBottom: Spacing.one,
  },
  description: {
    marginBottom: Spacing.three,
    minHeight: 40,
  },
  footer: {
    marginTop: 'auto',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    minWidth: 30,
    textAlign: 'right',
  }
});
