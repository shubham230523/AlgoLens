import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { AlgorithmMetadata } from '@/types/algorithm';
import { ThemedText } from './ThemedText';
import { Card } from './Card';
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
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.content} pointerEvents="none">
        <View style={styles.header}>
          <ThemedText variant="h3">{algorithm.name}</ThemedText>
          <View style={[styles.badge, { backgroundColor: difficultyColor + '20' }]}>
            <ThemedText variant="caption" style={{ color: difficultyColor, fontWeight: 'bold' }}>
              {algorithm.difficulty}
            </ThemedText>
          </View>
        </View>

        <ThemedText variant="caption" numberOfLines={2} style={styles.description}>
          {algorithm.description}
        </ThemedText>

        <View style={styles.footer}>
          <ThemedText variant="caption" style={styles.category}>
            {algorithm.category}
          </ThemedText>
          <ChevronRight color={colors.textSecondary} size={16} />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: Spacing.one,
  },
  content: {
    gap: Spacing.one,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: 4,
  },
  description: {
    marginTop: Spacing.one,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  category: {
    opacity: 0.7,
  },
});
