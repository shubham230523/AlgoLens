import React, { useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Circle, Line, Text as SvgText, G } from 'react-native-svg';
import Animated, { useAnimatedProps, withSpring, useReducedMotion } from 'react-native-reanimated';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { VisualizationEvent } from '@/types/algorithm';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface NodeProps {
  x: number;
  y: number;
  value: number;
  color: string;
  isHighlighted: boolean;
  textColor: string;
}

const MemoizedNode = React.memo(({ x, y, value, color, isHighlighted, textColor }: NodeProps) => {
  const shouldReduceMotion = useReducedMotion();

  const animatedCircleProps = useAnimatedProps(() => {
    return {
      fill: shouldReduceMotion ? color : withTiming(color, { duration: 300 }),
      r: shouldReduceMotion ? (isHighlighted ? 22 : 20) : withSpring(isHighlighted ? 22 : 20),
    };
  }, [color, isHighlighted, shouldReduceMotion]);

  return (
    <G>
      <AnimatedCircle
        cx={x}
        cy={y}
        r={isHighlighted ? 22 : 20} // Fallback r
        fill={color} // Fallback fill
        animatedProps={animatedCircleProps}
        stroke={isHighlighted ? color : 'transparent'}
        strokeWidth="2"
      />
      <SvgText
        x={x}
        y={y + 5}
        fontSize="12"
        fill={isHighlighted ? '#FFF' : textColor}
        textAnchor="middle"
        fontWeight="bold"
      >
        {value}
      </SvgText>
    </G>
  );
});

interface EdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
}

const MemoizedEdge = React.memo(({ x1, y1, x2, y2, color }: EdgeProps) => (
  <Line
    x1={x1}
    y1={y1}
    x2={x2}
    y2={y2}
    stroke={color}
    strokeWidth="2"
    opacity={0.4}
  />
));

interface TreeVisualizerProps {
  data: number[];
  currentEvent: VisualizationEvent | null;
  sortedIndices: Set<number>;
}

interface NodePos {
  id: number;
  value: number;
  x: number;
  y: number;
  parentId: number | null;
}

export function TreeVisualizer({ data, currentEvent, sortedIndices }: TreeVisualizerProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const { width: windowWidth } = useWindowDimensions();

  const width = Math.min(windowWidth - Spacing.eight, 500);
  const height = 300;
  const levelHeight = 60;

  const nodes = useMemo(() => {
    const result: NodePos[] = [];
    if (!data || data.length === 0) return result;

    const calculatePos = (index: number, level: number, leftBound: number, rightBound: number, parentId: number | null) => {
      if (index >= data.length || data[index] === null) return;

      const x = (leftBound + rightBound) / 2;
      const y = level * levelHeight + 40;

      result.push({ id: index, value: data[index], x, y, parentId });

      calculatePos(2 * index + 1, level + 1, leftBound, x, index);
      calculatePos(2 * index + 2, level + 1, x, rightBound, index);
    };

    calculatePos(0, 0, 0, width, null);
    return result;
  }, [data, width]);

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
    const values = Array.isArray(data) ? data.join(', ') : '';
    const eventDesc = currentEvent ? `. Current step: ${currentEvent.description}` : '';
    return `Tree visualization with nodes: ${values}${eventDesc}`;
  }, [data, currentEvent]);

  return (
    <View
      style={styles.container}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
    >
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {nodes.map((node) => {
          if (node.parentId === null) return null;
          const parent = nodes.find(n => n.id === node.parentId);
          if (!parent) return null;

          return (
            <MemoizedEdge
              key={`edge-${node.id}`}
              x1={parent.x}
              y1={parent.y}
              x2={node.x}
              y2={node.y}
              color={colors.textSecondary}
            />
          );
        })}

        {nodes.map((node) => {
          const isHighlighted = currentEvent?.indices.includes(node.id);
          const color = getElementColor(node.id);

          return (
            <MemoizedNode
              key={`node-${node.id}`}
              x={node.x}
              y={node.y}
              value={node.value}
              color={color}
              isHighlighted={isHighlighted}
              textColor={colors.text}
            />
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
