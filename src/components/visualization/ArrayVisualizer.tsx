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
  const staticHeight = value * (200 / maxVal) + 20;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: shouldReduceMotion ? color : withTiming(color, { duration: 300 }),
      height: shouldReduceMotion ? staticHeight : withSpring(staticHeight, { damping: 15 }),
      opacity: withTiming(isFaded ? 0.3 : 1, { duration: 300 }),
      transform: [
        { translateY: withSpring(isMerging ? -40 : 0) }
      ]
    };
  }, [color, value, maxVal, shouldReduceMotion, staticHeight, isFaded, isMerging]);

  return (
    <Animated.View
      style={[
        styles.bar,
        {
          width,
          backgroundColor: color,
          height: staticHeight, // Hard-wired base height
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

  const maxVal = useMemo(() => Math.max(...data, 1), [data]);

  // Dynamic scaling logic
  const availableWidth = windowWidth - Spacing.eight;
  const barWidth = Math.max(8, Math.min(40, (availableWidth / data.length) - Spacing.one));

  const getElementColor = (index: number) => {
    if (sortedIndices.has(index)) return colors.sorted;
    if (currentEvent?.indices.includes(index)) {
      if (currentEvent.type === 'COMPARE') return colors.compare;
      if (currentEvent.type === 'SWAP' || currentEvent.type === 'MERGE_STEP') return colors.swap;
      return colors.active;
    }
    return colors.backgroundElement;
  };

  const accessibilityLabel = useMemo(() => {
    const values = data.join(', ');
    const eventDesc = currentEvent ? `. Current step: ${currentEvent.description}` : '';
    return `Algorithm visualization array with ${data.length} elements: ${values}${eventDesc}`;
  }, [data, currentEvent]);

  return (
    <View
      style={styles.container}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
    >
      {data.map((value, index) => {
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
