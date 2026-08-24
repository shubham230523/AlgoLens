import { View, StyleSheet, ScrollView, useWindowDimensions, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { ThemedText } from '@/components/ui/ThemedText';
import { AlgorithmCard } from '@/components/ui/AlgorithmCard';
import { LearningPathCard } from '@/components/ui/LearningPathCard';
import { ALL_ALGORITHMS, CATEGORIES, LEARNING_PATHS } from '@/algorithms';
import { useRouter } from 'expo-router';
import React, { useState, useRef } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, FadeInDown, FadeInRight } from 'react-native-reanimated';
import {
  BarChart3,
  Search as SearchIcon,
  GitBranch,
  Share2,
  Zap,
  Target,
  Layers,
  Layout,
  Sparkles,
  BookOpen,
  RotateCcw
} from 'lucide-react-native';

const CATEGORY_ICONS: Record<string, any> = {
  'Sorting Algorithm': BarChart3,
  'Searching Algorithm': SearchIcon,
  'Trees': GitBranch,
  'Graphs': Share2,
  'Dynamic Programming': Layers,
  'Backtracking': RotateCcw,
  'Greedy Algorithm': Zap,
  'Sliding Window': Layout,
  'Two Pointers': Target,
  'Stack / Monotonic Deque': Layers,
  'Linked List': Share2,
};

import { useAdaptiveLayout } from '@/hooks/useAdaptiveLayout';

export default function HomeScreen() {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const router = useRouter();
  const { isPhone, isDesktop, getColumns, contentPadding } = useAdaptiveLayout();
  const featuredAlgorithms = ALL_ALGORITHMS.slice(0, 4);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInDown.duration(800)} style={[styles.header, { paddingHorizontal: contentPadding }]}>
        <View style={styles.headerTop}>
            <View>
                <ThemedText variant="h1" style={[styles.heroTitle, !isPhone && { fontSize: 64, lineHeight: 72 }]}>Explore</ThemedText>
                <ThemedText variant="h1" style={[styles.heroTitle, { color: colors.primary }, !isPhone && { fontSize: 64, lineHeight: 72 }]}>Algorithms</ThemedText>
            </View>
            <TouchableOpacity style={[styles.aiBadge, { backgroundColor: colors.primary + '15' }]}>
                <Sparkles size={18} color={colors.primary} />
                <ThemedText style={{ color: colors.primary, fontWeight: 'bold', fontSize: 16 }}>AI Tutor</ThemedText>
            </TouchableOpacity>
        </View>
        <ThemedText variant="body" style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
          Master complex data structures and algorithms with interactive visualizations.
        </ThemedText>
      </Animated.View>

      {/* 1. Categories - Grid Layout */}
      <View style={styles.section}>
        <View style={[styles.sectionHeader, { paddingHorizontal: contentPadding }]}>
            <ThemedText variant="h2" style={styles.sectionTitle}>Categories</ThemedText>
            <TouchableOpacity onPress={() => router.push('/explore')}>
                <ThemedText style={{ color: colors.primary, fontWeight: '600' }}>View All</ThemedText>
            </TouchableOpacity>
        </View>

        <View style={[styles.gridContainer, { paddingHorizontal: contentPadding }]}>
            {CATEGORIES.map((category, index) => {
                const Icon = CATEGORY_ICONS[category] || BookOpen;
                const cols = getColumns(2, 3, 4);
                // Explicitly set width to nearly half for 2 columns to force side-by-side
                const itemWidth = cols === 2 ? '48%' : cols === 3 ? '31%' : '23%';

                return (
                <Animated.View key={category} entering={FadeInDown.delay(index * 50)} style={{ width: itemWidth as any }}>
                    <TouchableOpacity
                    activeOpacity={0.8}
                    style={[styles.categoryCard, { backgroundColor: colors.backgroundElement }]}
                    onPress={() => router.push({ pathname: '/explore', params: { category } })}
                    >
                    <View style={[styles.categoryIcon, { backgroundColor: colors.primary + '10' }]}>
                        <Icon color={colors.primary} size={22} />
                    </View>
                    <ThemedText variant="h3" style={styles.categoryText}>{category}</ThemedText>
                    </TouchableOpacity>
                </Animated.View>
                );
            })}
        </View>
      </View>

      {/* 2. Learning Paths */}
      <View style={styles.section}>
        <View style={[styles.sectionHeader, { paddingHorizontal: contentPadding }]}>
            <ThemedText variant="h2" style={styles.sectionTitle}>Learning Paths</ThemedText>
            <View style={[styles.badge, { backgroundColor: colors.secondary + '20' }]}>
                <ThemedText style={{ color: colors.secondary, fontSize: 14, fontWeight: 'bold' }}>PRO</ThemedText>
            </View>
        </View>
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.horizontalList, { paddingHorizontal: contentPadding }]}
            decelerationRate="fast"
        >
          {LEARNING_PATHS.map((path, index) => (
            <Animated.View key={path.id} entering={FadeInRight.delay(index * 150)}>
                <LearningPathCard
                path={path}
                onPress={() => router.push(`/path/${path.id}`)}
                />
            </Animated.View>
          ))}
        </ScrollView>
      </View>

      {/* 3. Featured */}
      <View style={styles.section}>
        <View style={[styles.sectionHeader, { paddingHorizontal: contentPadding }]}>
            <ThemedText variant="h2" style={styles.sectionTitle}>Featured Algorithms</ThemedText>
            <BarChart3 color={colors.primary} size={24} />
        </View>
        <View style={[styles.listContent, { paddingHorizontal: contentPadding }]}>
          {featuredAlgorithms.map((algo, index) => (
            <Animated.View key={algo.id} entering={FadeInDown.delay(index * 100)}>
                <AlgorithmCard
                algorithm={algo}
                onPress={() => router.push(`/visualizer/${algo.id}`)}
                />
            </Animated.View>
          ))}
        </View>
      </View>

      <View style={{ height: Spacing.six }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.four,
  },
  header: {
    padding: Spacing.four,
    paddingTop: Spacing.six,
    marginBottom: Spacing.two,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroTitle: {
    fontSize: 44,
    lineHeight: 48,
  },
  heroSubtitle: {
    marginTop: Spacing.two,
    fontSize: 20,
    maxWidth: '90%',
    lineHeight: 28,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
  },
  section: {
    paddingVertical: Spacing.three,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.three,
  },
  sectionTitle: {
    fontSize: 28,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: Spacing.three,
  },
  horizontalList: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.six,
    paddingBottom: Spacing.four,
  },
  listContent: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  categoryCard: {
    width: '100%',
    height: 110,
    padding: Spacing.three,
    borderRadius: 24,
    alignItems: 'flex-start',
    gap: Spacing.two,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    justifyContent: 'center',
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '700',
  }
});
