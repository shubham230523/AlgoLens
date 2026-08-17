import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { getLearningPathById, ALL_ALGORITHMS } from '@/algorithms';
import { ThemedText } from '@/components/ui/ThemedText';
import { Card } from '@/components/ui/Card';
import { CheckCircle2, Circle, ChevronRight } from 'lucide-react-native';
import { useProgressStore } from '@/store/progressStore';

export default function PathDetailScreen() {
  const { id } = useLocalSearchParams();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const router = useRouter();
  const { isCompleted } = useProgressStore();

  const path = useMemo(() => getLearningPathById(id as string), [id]);

  const pathAlgorithms = useMemo(() => {
    if (!path) return [];
    return path.algorithmIds.map(algoId =>
      ALL_ALGORITHMS.find(a => a.id === algoId)
    ).filter(Boolean);
  }, [path]);

  if (!path) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ThemedText>Path not found</ThemedText>
      </View>
    );
  }

  const completedCount = path.algorithmIds.filter(id => isCompleted(id)).length;
  const isPathFinished = completedCount === path.algorithmIds.length;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: path.title }} />

      <View style={[styles.header, { backgroundColor: colors.backgroundElement }]}>
        <ThemedText variant="h2">{path.title}</ThemedText>
        <ThemedText variant="body" style={styles.description}>{path.description}</ThemedText>

        <View style={styles.statsRow}>
          <View style={[styles.statBadge, { backgroundColor: colors.backgroundSelected }]}>
            <ThemedText variant="caption">{path.difficulty}</ThemedText>
          </View>
          <ThemedText variant="caption">
            {completedCount} / {path.algorithmIds.length} Completed
          </ThemedText>
        </View>

        {isPathFinished && (
          <View style={[styles.congrats, { backgroundColor: colors.success + '22' }]}>
            <CheckCircle2 color={colors.success} size={20} />
            <ThemedText variant="caption" style={{ color: colors.success, fontWeight: 'bold' }}>
              Path Completed!
            </ThemedText>
          </View>
        )}
      </View>

      <View style={styles.listSection}>
        <ThemedText variant="h3" style={styles.listTitle}>Journey Roadmap</ThemedText>

        {pathAlgorithms.map((algo, index) => {
          if (!algo) return null;
          const done = isCompleted(algo.id);

          return (
            <Card
              key={algo.id}
              style={styles.algoItem}
              onPress={() => router.push(`/visualizer/${algo.id}`)}
            >
              <View style={styles.algoItemContent}>
                <View style={styles.algoInfo}>
                  <View style={styles.stepIndicator}>
                    <View style={[styles.stepLine, index === 0 && { opacity: 0 }, { backgroundColor: colors.backgroundSelected }]} />
                    <View style={styles.stepIcon}>
                      {done ? (
                        <CheckCircle2 color={colors.success} size={24} />
                      ) : (
                        <Circle color={colors.textSecondary} size={24} />
                      )}
                    </View>
                    <View style={[styles.stepLine, index === pathAlgorithms.length - 1 && { opacity: 0 }, { backgroundColor: colors.backgroundSelected }]} />
                  </View>

                  <View style={styles.textContainer}>
                    <ThemedText variant="h3">{algo.name}</ThemedText>
                    <ThemedText variant="caption" numberOfLines={1}>{algo.description}</ThemedText>
                  </View>
                </View>

                <ChevronRight color={colors.textSecondary} size={20} />
              </View>
            </Card>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: Spacing.four,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  description: {
    marginTop: Spacing.two,
    opacity: 0.8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginTop: Spacing.three,
  },
  statBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one / 2,
    borderRadius: 8,
  },
  congrats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.four,
    padding: Spacing.two,
    borderRadius: 12,
  },
  listSection: {
    padding: Spacing.four,
  },
  listTitle: {
    marginBottom: Spacing.three,
  },
  algoItem: {
    marginBottom: Spacing.two,
    padding: Spacing.three,
  },
  algoItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  algoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stepIndicator: {
    alignItems: 'center',
    width: 40,
    marginRight: Spacing.two,
  },
  stepLine: {
    width: 2,
    height: 15,
  },
  stepIcon: {
    marginVertical: 2,
  },
  textContainer: {
    flex: 1,
  }
});
