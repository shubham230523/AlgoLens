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
  label: string;
  color: string;
  isHighlighted: boolean;
  textColor: string;
}

const MemoizedNode = React.memo(({ x, y, label, color, isHighlighted, textColor }: NodeProps) => {
  const shouldReduceMotion = useReducedMotion();

  const animatedCircleProps = useAnimatedProps(() => {
    return {
      fill: shouldReduceMotion ? color : withSpring(color),
      r: shouldReduceMotion ? (isHighlighted ? 22 : 20) : withSpring(isHighlighted ? 22 : 20),
    };
  }, [color, isHighlighted, shouldReduceMotion]);

  return (
    <G>
      <AnimatedCircle
        cx={x}
        cy={y}
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
        {label}
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
  isActive: boolean;
}

const MemoizedEdge = React.memo(({ x1, y1, x2, y2, color, isActive }: EdgeProps) => (
  <Line
    x1={x1}
    y1={y1}
    x2={x2}
    y2={y2}
    stroke={isActive ? '#6C63FF' : color}
    strokeWidth={isActive ? "3" : "2"}
    opacity={isActive ? 1 : 0.4}
  />
));

interface GraphVisualizerProps {
  data: { nodes: any[], edges: any[] };
  currentEvent: VisualizationEvent | null;
  sortedIndices: Set<number>;
}

export function GraphVisualizer({ data, currentEvent, sortedIndices }: GraphVisualizerProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const { width: windowWidth } = useWindowDimensions();

  const width = Math.min(windowWidth - Spacing.eight, 500);
  const height = 400;

  // Simple circle layout if positions aren't provided
  const nodesWithPos = useMemo(() => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40;

    return data.nodes.map((node, i) => {
      const angle = (i / data.nodes.length) * 2 * Math.PI;
      return {
        ...node,
        x: node.x ?? centerX + radius * Math.cos(angle),
        y: node.y ?? centerY + radius * Math.sin(angle),
      };
    });
  }, [data.nodes, width]);

  const getElementColor = (index: number) => {
    if (sortedIndices.has(index)) return colors.sorted;
    if (currentEvent?.indices.includes(index)) {
      if (currentEvent.type === 'COMPARE') return colors.compare;
      if (currentEvent.type === 'SELECT') return colors.primary;
      return colors.active;
    }
    return colors.backgroundElement;
  };

  return (
    <View style={styles.container}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {data.edges.map((edge, i) => {
          const fromNode = nodesWithPos.find(n => n.id === edge.from);
          const toNode = nodesWithPos.find(n => n.id === edge.to);
          if (!fromNode || !toNode) return null;

          const fromIdx = data.nodes.findIndex(n => n.id === edge.from);
          const toIdx = data.nodes.findIndex(n => n.id === edge.to);

          const isActive = currentEvent?.type === 'COMPARE' &&
                          currentEvent.indices.includes(fromIdx) &&
                          currentEvent.indices.includes(toIdx);

          return (
            <MemoizedEdge
              key={`edge-${i}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              color={colors.textSecondary}
              isActive={!!isActive}
            />
          );
        })}

        {nodesWithPos.map((node, i) => {
          const isHighlighted = currentEvent?.indices.includes(i);
          const color = getElementColor(i);

          return (
            <MemoizedNode
              key={`node-${node.id}`}
              x={node.x}
              y={node.y}
              label={node.label}
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
    height: 420,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
