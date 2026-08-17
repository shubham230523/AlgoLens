import React, { useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, useReducedMotion } from 'react-native-reanimated';
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
}

const MemoizedBar = React.memo(({ value, index, color, width, maxVal }: BarProps) => {
  const shouldReduceMotion = useReducedMotion();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: shouldReduceMotion ? color : withSpring(color),
      height: shouldReduceMotion ? value * (200 / maxVal) + 20 : withSpring(value * (200 / maxVal) + 20),
    };
  }, [color, value, maxVal, shouldReduceMotion]);

  return (
    <Animated.View
      style={[
        styles.bar,
        { width },
        animatedStyle
      ]}
    >
      {width > 25 && (
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
      if (currentEvent.type === 'SWAP') return colors.swap;
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
      {data.map((value, index) => (
        <MemoizedBar
          key={`bar-${index}`}
          index={index}
          value={value}
          color={getElementColor(index)}
          width={barWidth}
          maxVal={maxVal}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 250,
    paddingVertical: Spacing.four,
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
