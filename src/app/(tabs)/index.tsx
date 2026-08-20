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
  ChevronLeft,
  ChevronRight,
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

export default function HomeScreen() {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();
  const categoryScrollRef = useRef<ScrollView>(null);

  // Use a ref to track the current scroll position synchronously
  const scrollOffset = useRef(0);
  const [contentWidth, setContentWidth] = useState(1);
  const containerWidth = windowWidth - Spacing.four * 2;

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
        const offset = direction === 'left' ? -400 : 400;
        const newX = Math.max(0, Math.min(contentWidth - containerWidth, scrollOffset.current + offset));
        categoryScrollRef.current.scrollTo({
            x: newX,
            animated: true
        });
    }
  };

  // Reanimated indicator logic
  const scrollX = useSharedValue(0);
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

  const featuredAlgorithms = ALL_ALGORITHMS.slice(0, 4);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInDown.duration(800)} style={styles.header}>
        <View style={styles.headerTop}>
            <View>
                <ThemedText variant="h1" style={styles.heroTitle}>Explore</ThemedText>
                <ThemedText variant="h1" style={[styles.heroTitle, { color: colors.primary }]}>Algorithms</ThemedText>
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

      {/* 1. Categories - Fixed Scroll with Arrows */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
            <ThemedText variant="h2" style={styles.sectionTitle}>Categories</ThemedText>
            <TouchableOpacity onPress={() => router.push('/explore')}>
                <ThemedText style={{ color: colors.primary, fontWeight: '600' }}>View All</ThemedText>
            </TouchableOpacity>
        </View>

        <View style={styles.horizontalWrapper}>
            <TouchableOpacity
                style={[styles.scrollArrow, styles.leftArrow, { backgroundColor: colors.backgroundElement }]}
                onPress={() => scrollCategories('left')}
                activeOpacity={0.8}
            >
                <ChevronLeft color={colors.text} size={20} />
            </TouchableOpacity>

            <ScrollView
                ref={categoryScrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
                onScroll={(e) => {
                    const x = e.nativeEvent.contentOffset.x;
                    scrollX.value = x;
                    scrollOffset.current = x; // Update synchronous ref
                }}
                onContentSizeChange={(w) => setContentWidth(w)}
                scrollEventThrottle={16}
                decelerationRate="fast"
                scrollEnabled={true}
            >
            {CATEGORIES.map((category, index) => {
                const Icon = CATEGORY_ICONS[category] || BookOpen;
                return (
                <Animated.View key={category} entering={FadeInRight.delay(index * 100)}>
                    <TouchableOpacity
                    activeOpacity={0.8}
                    style={[styles.categoryCard, { backgroundColor: colors.backgroundElement }]}
                    onPress={() => router.push({ pathname: '/explore', params: { category } })}
                    >
                    <View style={[styles.categoryIcon, { backgroundColor: colors.primary + '10' }]}>
                        <Icon color={colors.primary} size={28} />
                    </View>
                    <ThemedText variant="h3" style={styles.categoryText}>{category}</ThemedText>
                    </TouchableOpacity>
                </Animated.View>
                );
            })}
            </ScrollView>

            <TouchableOpacity
                style={[styles.scrollArrow, styles.rightArrow, { backgroundColor: colors.backgroundElement }]}
                onPress={() => scrollCategories('right')}
                activeOpacity={0.8}
            >
                <ChevronRight color={colors.text} size={20} />
            </TouchableOpacity>
        </View>

        <View style={[styles.indicatorContainer, { backgroundColor: colors.backgroundSelected + '44' }]}>
          <Animated.View style={[styles.indicator, { backgroundColor: colors.primary }, indicatorStyle]} />
        </View>
      </View>

      {/* 2. Learning Paths */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
            <ThemedText variant="h2" style={styles.sectionTitle}>Learning Paths</ThemedText>
            <View style={[styles.badge, { backgroundColor: colors.secondary + '20' }]}>
                <ThemedText style={{ color: colors.secondary, fontSize: 14, fontWeight: 'bold' }}>PRO</ThemedText>
            </View>
        </View>
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
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
        <View style={styles.sectionHeader}>
            <ThemedText variant="h2" style={styles.sectionTitle}>Featured Algorithms</ThemedText>
            <BarChart3 color={colors.primary} size={24} />
        </View>
        <View style={styles.listContent}>
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
  horizontalWrapper: {
    position: 'relative',
    alignItems: 'center',
  },
  scrollArrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -30, // Centered vertically relative to cards
    width: 40,
    height: 40,
    borderRadius: 20,
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  leftArrow: {
    left: 12,
  },
  rightArrow: {
    right: 12,
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
    width: 200,
    height: 140,
    padding: Spacing.four,
    borderRadius: 28,
    alignItems: 'flex-start',
    gap: Spacing.three,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    justifyContent: 'center',
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 20,
    fontWeight: '700',
  },
  indicatorContainer: {
    height: 6,
    width: 100,
    alignSelf: 'center',
    marginTop: Spacing.two,
    borderRadius: 3,
    overflow: 'hidden',
  },
  indicator: {
    height: '100%',
    width: 40,
    borderRadius: 3,
  }
});
