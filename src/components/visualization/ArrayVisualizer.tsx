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
}

const MemoizedBar = React.memo(({ value, index, color, width, maxVal, isFaded, isMerging }: BarProps) => {
  const shouldReduceMotion = useReducedMotion();

  // Static fallback values
  const staticHeight = value * (180 / maxVal) + 30; // Slightly taller base height

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
    <Animated.View
      style={[
        styles.bar,
        {
          width,
          backgroundColor: color, // Fallback background
          height: staticHeight, // Fallback height
        },
        animatedStyle
      ]}
    >
      {width > 20 && (
        <ThemedText variant="caption" style={styles.valueText}>{value}</ThemedText>
      )}
    </Animated.View>
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

  // Safeguard: Ensure data is an array
  const safeData = Array.isArray(data) ? data : [];
  const maxVal = useMemo(() => safeData.length > 0 ? Math.max(...safeData, 1) : 1, [safeData]);

  // Dynamic scaling logic
  const availableWidth = windowWidth - Spacing.eight;
  const barWidth = safeData.length > 0 ? Math.max(10, Math.min(45, (availableWidth / safeData.length) - 4)) : 40;

  const getElementColor = (index: number) => {
    if (sortedIndices.has(index)) return colors.sorted;
    if (currentEvent?.indices.includes(index)) {
      if (currentEvent.type === 'COMPARE') return colors.compare;
      if (currentEvent.type === 'SWAP' || currentEvent.type === 'MERGE_STEP') return colors.swap;
      return colors.active;
    }
    return scheme === 'dark' ? '#2A334D' : '#E0E0E6'; // More distinct default color
  };

  const accessibilityLabel = useMemo(() => {
    const values = safeData.join(', ');
    const eventDesc = currentEvent ? `. Current step: ${currentEvent.description}` : '';
    return `Algorithm visualization array with ${safeData.length} elements: ${values}${eventDesc}`;
  }, [safeData, currentEvent]);

  return (
    <View
      style={styles.container}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
    >
      {safeData.map((value, index) => {
        const isFaded = !!(currentEvent?.type === 'SUBARRAY_FOCUS' && !currentEvent.indices.includes(index));
        const isMerging = !!(currentEvent?.type === 'MERGE_STEP' && currentEvent.indices.includes(index));

        return (
          <MemoizedBar
            key={`bar-${index}-${value}`} // Added value to key to force re-render if data changes significantly
            index={index}
            value={value}
            color={getElementColor(index)}
            width={barWidth}
            maxVal={maxVal}
            isFaded={isFaded}
            isMerging={isMerging}
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
