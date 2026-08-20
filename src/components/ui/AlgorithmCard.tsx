import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { AlgorithmMetadata } from '@/types/algorithm';
import { ThemedText } from './ThemedText';
import { ChevronRight } from 'lucide-react-native';

interface AlgorithmCardProps {
  algorithm: AlgorithmMetadata;
  onPress: () => void;
}

export function AlgorithmCard({ algorithm, onPress }: AlgorithmCardProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  const difficultyColor = {
    Easy: colors.success,
    Medium: colors.warning,
    Hard: colors.error,
  }[algorithm.difficulty];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.card,
        { backgroundColor: colors.backgroundElement, borderLeftColor: difficultyColor }
      ]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText variant="h3" style={styles.title}>{algorithm.name}</ThemedText>
          <View style={[styles.badge, { backgroundColor: difficultyColor + '15' }]}>
            <ThemedText variant="caption" style={{ color: difficultyColor, fontWeight: '700', fontSize: 13 }}>
              {algorithm.difficulty}
            </ThemedText>
          </View>
        </View>

        <ThemedText variant="caption" numberOfLines={2} style={[styles.description, { color: colors.textSecondary }]}>
          {algorithm.description}
        </ThemedText>

        <View style={styles.footer}>
          <View style={styles.categoryBadge}>
             <ThemedText variant="caption" style={[styles.category, { color: colors.primary }]}>
                {algorithm.category}
             </ThemedText>
          </View>
          <View style={[styles.iconCircle, { backgroundColor: colors.backgroundSelected + '44' }]}>
            <ChevronRight color={colors.primary} size={18} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: Spacing.one,
    borderRadius: 20,
    padding: Spacing.four,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  content: {
    gap: Spacing.two,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  description: {
    marginTop: Spacing.one,
    fontSize: 16,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  categoryBadge: {
    backgroundColor: 'rgba(108, 99, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  category: {
    fontWeight: '600',
    fontSize: 14,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
