import React, { useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, withTiming, useReducedMotion } from 'react-native-reanimated';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { VisualizationEvent } from '@/types/algorithm';
import { ThemedText } from '../ui/ThemedText';

interface BarProps {
  value: number;
  index: number;
  color: string;
  width: number;
  maxVal: number;
  isFaded: boolean;
  isMerging: boolean;
  label?: string;
}

const MemoizedBar = React.memo(({ value, index, color, width, maxVal, isFaded, isMerging, label }: BarProps) => {
  const shouldReduceMotion = useReducedMotion();

  // Static base height calculation
  const staticHeight = value * (180 / maxVal) + 30;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: shouldReduceMotion ? color : withTiming(color, { duration: 300 }),
      height: shouldReduceMotion ? staticHeight : withSpring(staticHeight, { damping: 15 }),
      opacity: withTiming(isFaded ? 0.3 : 1, { duration: 300 }),
      transform: [
        { translateY: withSpring(isMerging ? -30 : 0) }
      ]
    };
  });

  return (
    <View style={styles.barWrapper}>
      {label && (
        <View style={styles.pointerContainer}>
          <ThemedText variant="caption" style={styles.pointerText}>{label}</ThemedText>
        </View>
      )}
      <Animated.View
        style={[
          styles.bar,
          {
            width,
            backgroundColor: color,
            height: staticHeight,
          },
          animatedStyle
        ]}
      >
        {width > 22 && (
          <ThemedText variant="caption" style={styles.valueText}>{value}</ThemedText>
        )}
      </Animated.View>
    </View>
  );
});

interface ArrayVisualizerProps {
  data: number[];
  currentEvent: VisualizationEvent | null;
  sortedIndices: Set<number>;
}

export function ArrayVisualizer({ data, currentEvent, sortedIndices }: ArrayVisualizerProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const { width: windowWidth } = useWindowDimensions();

  const safeData = Array.isArray(data) ? data : [];
  const maxVal = useMemo(() => safeData.length > 0 ? Math.max(...safeData, 1) : 1, [safeData]);

  const availableWidth = windowWidth - Spacing.eight;
  const barWidth = safeData.length > 0 ? Math.max(10, Math.min(45, (availableWidth / safeData.length) - 4)) : 40;

  const getElementColor = (index: number) => {
    if (sortedIndices.has(index)) return colors.sorted;
    if (currentEvent?.indices.includes(index)) {
      if (currentEvent.type === 'COMPARE') return colors.compare;
      if (currentEvent.type === 'SWAP' || currentEvent.type === 'MERGE_STEP' || currentEvent.type === 'UPDATE_VALUE') return colors.swap;
      if (currentEvent.type === 'HIGHLIGHT' || currentEvent.type === 'SUBARRAY_FOCUS') return colors.primary + 'AA';
      return colors.active;
    }
    return scheme === 'dark' ? '#2A334D' : '#E0E0E6';
  };

  const getLabelForIndex = (index: number) => {
    if (!currentEvent?.variables) return undefined;
    const labels = [];
    for (const [key, val] of Object.entries(currentEvent.variables)) {
      if (val === index && ['i', 'j', 'low', 'high', 'mid', 'left', 'right', 'pivot'].includes(key)) {
        labels.push(key);
      }
    }
    return labels.length > 0 ? labels.join(',') : undefined;
  };

  return (
    <View style={styles.container}>
      {safeData.map((value, index) => {
        const isFaded = !!(currentEvent?.type === 'SUBARRAY_FOCUS' && !currentEvent.indices.includes(index));
        const isMerging = !!(currentEvent?.type === 'MERGE_STEP' && currentEvent.indices.includes(index));

        return (
          <MemoizedBar
            key={`bar-${index}`} // Keep key stable to allow Reanimated transitions
            index={index}
            value={value}
            color={getElementColor(index)}
            width={barWidth}
            maxVal={maxVal}
            isFaded={isFaded}
            isMerging={isMerging}
            label={getLabelForIndex(index)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 260,
    paddingVertical: Spacing.two,
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    marginHorizontal: 2,
    borderRadius: 4,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: Spacing.one,
  },
  valueText: {
    fontWeight: 'bold',
    fontSize: 10,
    marginBottom: 2,
  },
  pointerContainer: {
    position: 'absolute',
    top: -25,
    backgroundColor: '#3b82f6',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    zIndex: 10,
  },
  pointerText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  }
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 240,
    paddingVertical: Spacing.two,
  },
  bar: {
    marginHorizontal: 2,
    borderRadius: 4,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: Spacing.one,
  },
  valueText: {
    fontWeight: 'bold',
    fontSize: 10,
  }
});
