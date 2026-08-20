import { View, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { ThemedText } from '@/components/ui/ThemedText';
import { AlgorithmCard } from '@/components/ui/AlgorithmCard';
import { LearningPathCard } from '@/components/ui/LearningPathCard';
import { ALL_ALGORITHMS, CATEGORIES, LEARNING_PATHS } from '@/algorithms';
import { useRouter } from 'expo-router';
import { Card } from '@/components/ui/Card';
import React, { useState } from 'react';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

export default function HomeScreen() {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();

  // Scroll indicator logic
  const scrollX = useSharedValue(0);
  const [contentWidth, setContentWidth] = useState(1);
  const containerWidth = windowWidth - Spacing.four * 2;

  const indicatorStyle = useAnimatedStyle(() => {
    const maxScroll = contentWidth - containerWidth;
    if (maxScroll <= 0) return { opacity: 0, transform: [{ translateX: 0 }] };

    const progress = scrollX.value / maxScroll;
    const trackWidth = 100;
    const indicatorWidth = 40;
    const maxTranslate = trackWidth - indicatorWidth;

    return {
      opacity: 1,
      transform: [{ translateX: Math.min(Math.max(progress * maxTranslate, 0), maxTranslate) }],
    };
  });

  const featuredAlgorithms = ALL_ALGORITHMS.slice(0, 3);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <ThemedText variant="h1">AlgoLens</ThemedText>
        <ThemedText variant="caption" style={{ color: colors.textSecondary }}>See Algorithms Come Alive</ThemedText>
      </View>

      {/* 1. Categories above everything */}
      <View style={styles.section}>
        <ThemedText variant="h2" style={styles.sectionTitle}>Categories</ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          onScroll={(e) => {
            scrollX.value = e.nativeEvent.contentOffset.x;
          }}
          onContentSizeChange={(w) => setContentWidth(w)}
          scrollEventThrottle={16}
        >
          {CATEGORIES.map(category => (
            <Card
              key={category}
              style={styles.categoryCard}
              onPress={() => router.push({ pathname: '/explore', params: { category } })}
            >
              <ThemedText variant="h3" style={{ fontSize: 14 }}>{category}</ThemedText>
            </Card>
          ))}
        </ScrollView>
        {/* Minimal Scroll Indicator */}
        <View style={[styles.indicatorContainer, { backgroundColor: colors.backgroundElement }]}>
          <Animated.View style={[styles.indicator, { backgroundColor: colors.primary }, indicatorStyle]} />
        </View>
      </View>

      {/* 2. Learning Paths */}
      <View style={styles.section}>
        <ThemedText variant="h2" style={styles.sectionTitle}>Learning Paths</ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {LEARNING_PATHS.map(path => (
            <LearningPathCard
              key={path.id}
              path={path}
              onPress={() => router.push(`/path/${path.id}`)}
            />
          ))}
        </ScrollView>
      </View>

      {/* 3. Featured */}
      <View style={styles.section}>
        <ThemedText variant="h2" style={styles.sectionTitle}>Featured Algorithms</ThemedText>
        <View style={styles.listContent}>
          {featuredAlgorithms.map(algo => (
            <AlgorithmCard
              key={algo.id}
              algorithm={algo}
              onPress={() => router.push(`/visualizer/${algo.id}`)}
            />
          ))}
        </View>
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
    paddingTop: Spacing.five,
  },
  section: {
    paddingVertical: Spacing.three,
  },
  sectionTitle: {
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.two,
  },
  horizontalList: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
  },
  listContent: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  categoryCard: {
    minWidth: 150,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 12,
  },
  indicatorContainer: {
    height: 3,
    width: 100,
    alignSelf: 'center',
    marginTop: Spacing.two,
    borderRadius: 2,
    overflow: 'hidden',
  },
  indicator: {
    height: '100%',
    width: 40,
    borderRadius: 2,
  }
});
