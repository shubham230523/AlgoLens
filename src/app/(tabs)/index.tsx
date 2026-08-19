import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { ThemedText } from '@/components/ui/ThemedText';
import { AlgorithmCard } from '@/components/ui/AlgorithmCard';
import { LearningPathCard } from '@/components/ui/LearningPathCard';
import { ALL_ALGORITHMS, CATEGORIES, LEARNING_PATHS } from '@/algorithms';
import { useRouter } from 'expo-router';
import { Card } from '@/components/ui/Card';

export default function HomeScreen() {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const router = useRouter();

  const featuredAlgorithms = ALL_ALGORITHMS.slice(0, 3);

  const handleNavigateToPath = (id: string) => {
    console.log('Pushing to path:', id);
    router.push(`/path/${id}`);
  };

  const handleNavigateToAlgo = (id: string) => {
    console.log('Pushing to algo:', id);
    router.push(`/visualizer/${id}`);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <ThemedText variant="h1">AlgoLens</ThemedText>
        <ThemedText variant="caption">See Algorithms Come Alive</ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText variant="h2" style={styles.sectionTitle}>Learning Paths</ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {LEARNING_PATHS.map(path => (
            <LearningPathCard
              key={path.id}
              path={path}
              onPress={() => handleNavigateToPath(path.id)}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <ThemedText variant="h2" style={styles.sectionTitle}>Featured</ThemedText>
        <View style={styles.cardContainer}>
          {featuredAlgorithms.map(algo => (
            <AlgorithmCard
              key={algo.id}
              algorithm={algo}
              onPress={() => handleNavigateToAlgo(algo.id)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText variant="h2" style={styles.sectionTitle}>Categories</ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {CATEGORIES.map(category => (
            <Card
              key={category}
              style={styles.categoryCard}
              onPress={() => router.push({ pathname: '/explore', params: { category } })}
            >
              <ThemedText variant="h3">{category}</ThemedText>
            </Card>
          ))}
        </ScrollView>
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
    paddingTop: Platform.OS === 'web' ? Spacing.five : Spacing.five,
  },
  section: {
    paddingVertical: Spacing.four,
  },
  sectionTitle: {
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.three,
  },
  horizontalList: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  cardContainer: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  categoryCard: {
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  },
});
