import React, { useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, withTiming, useReducedMotion } from 'react-native-reanimated';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { VisualizationEvent } from '@/types/algorithm';
import { ThemedText } from '../ui/ThemedText';
import { usePlaybackStore } from '@/store/playbackStore';

interface BarProps {
  value: number;
  index: number;
  color: string;
  width: number;
  maxVal: number;
  isFaded: boolean;
  isMerging: boolean;
  label?: string;
  speed: number;
}

const MemoizedBar = React.memo(({ value, index, color, width, maxVal, isFaded, isMerging, label, speed }: BarProps) => {
  const shouldReduceMotion = useReducedMotion();
  const animDuration = (1 / speed) * 300; // Base duration 300ms, scales with speed

  // Static base height calculation
  const staticHeight = Math.max(20, (value / maxVal) * 150);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: shouldReduceMotion ? color : withTiming(color, { duration: animDuration }),
      height: shouldReduceMotion ? staticHeight : withTiming(staticHeight, { duration: animDuration }), // Use timing for smoother height transitions
      opacity: withTiming(isFaded ? 0.2 : 1, { duration: animDuration }),
      transform: [
        { translateY: withTiming(isMerging ? -30 : 0, { duration: animDuration }) }
      ]
    };
  });

  return (
    <View style={[styles.barWrapper, { width: width + 4 }]}>
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
        <ThemedText variant="caption" style={styles.valueText}>{value}</ThemedText>
      </Animated.View>
      <ThemedText variant="caption" style={styles.indexText}>{index}</ThemedText>
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
  const { playbackSpeed } = usePlaybackStore();

  const safeData = Array.isArray(data) ? data : [];
  const maxVal = useMemo(() => safeData.length > 0 ? Math.max(...safeData, 1) : 1, [safeData]);

  // Adjust scaling for new layout
  const availableWidth = Math.min(windowWidth * 0.5, 800);
  const barWidth = safeData.length > 0 ? Math.max(20, Math.min(60, (availableWidth / safeData.length) - 8)) : 40;

  const getElementColor = (index: number) => {
    if (sortedIndices.has(index)) return colors.sorted;
    if (currentEvent?.indices.includes(index)) {
      if (currentEvent.type === 'COMPARE') return colors.compare;
      if (currentEvent.type === 'SWAP' || currentEvent.type === 'MERGE_STEP' || currentEvent.type === 'UPDATE_VALUE') return colors.swap;
      if (currentEvent.type === 'HIGHLIGHT' || currentEvent.type === 'SUBARRAY_FOCUS') return colors.primary;
      return colors.active;
    }
    return scheme === 'dark' ? '#2A334D' : '#E0E0E6';
  };

  const getLabelForIndex = (index: number) => {
    if (!currentEvent?.variables) return undefined;
    const labels = [];
    for (const [key, val] of Object.entries(currentEvent.variables)) {
      if (val === index && ['i', 'j', 'k', 'low', 'high', 'mid', 'left', 'right', 'pivot'].includes(key)) {
        labels.push(key);
      }
    }
    return labels.length > 0 ? labels.join(',') : undefined;
  };

  return (
    <View style={styles.container}>
      <View style={styles.arrayRow}>
        {safeData.map((value, index) => {
          const isFaded = !!(currentEvent?.type === 'SUBARRAY_FOCUS' && !currentEvent.indices.includes(index));
          const isMerging = !!(currentEvent?.type === 'MERGE_STEP' && currentEvent.indices.includes(index));

          return (
            <MemoizedBar
              key={`bar-${index}`}
              index={index}
              value={value}
              color={getElementColor(index)}
              width={barWidth}
              maxVal={maxVal}
              isFaded={isFaded}
              isMerging={isMerging}
              label={getLabelForIndex(index)}
              speed={playbackSpeed}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrayRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 2,
  },
  bar: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  valueText: {
    fontWeight: 'bold',
    fontSize: 11,
    color: '#000',
  },
  indexText: {
    marginTop: 8,
    fontSize: 10,
    opacity: 0.4,
  },
  pointerContainer: {
    position: 'absolute',
    top: -30,
    backgroundColor: '#8ab4f8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 20,
    minWidth: 20,
    alignItems: 'center',
  },
  pointerText: {
    color: '#1e1f20',
    fontSize: 10,
    fontWeight: 'bold',
  }
});
