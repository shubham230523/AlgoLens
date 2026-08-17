import React, { useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Circle, Line, Text as SvgText, G, Marker, Path } from 'react-native-svg';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { VisualizationEvent } from '@/types/algorithm';

interface GraphVisualizerProps {
  data: {
    nodes: Array<{ id: string; label: string }>;
    edges: Array<{ from: string; to: string; weight?: number }>;
  };
  currentEvent: VisualizationEvent | null;
  activeNodes?: string[];
  activeEdges?: string[];
}

export function GraphVisualizer({ data, currentEvent, activeNodes = [], activeEdges = [] }: GraphVisualizerProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const { width: windowWidth } = useWindowDimensions();

  const width = Math.min(windowWidth - Spacing.eight, 500);
  const height = 350;

  // Simple Force-Directed or Circular Layout for MVP
  const nodePositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;

    data.nodes.forEach((node, i) => {
      const angle = (i / data.nodes.length) * 2 * Math.PI;
      positions[node.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
    return positions;
  }, [data.nodes, width, height]);

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        <Marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="25"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <Path d="M 0 0 L 10 5 L 0 10 z" fill={colors.textSecondary} />
        </Marker>

        {/* Render Edges */}
        {data.edges.map((edge, i) => {
          const start = nodePositions[edge.from];
          const end = nodePositions[edge.to];
          if (!start || !end) return null;

          const isActive = activeEdges.includes(`${edge.from}-${edge.to}`);

          return (
            <Line
              key={`edge-${i}`}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke={isActive ? colors.primary : colors.textSecondary}
              strokeWidth={isActive ? "3" : "1.5"}
              markerEnd="url(#arrow)"
              opacity={isActive ? 1 : 0.4}
            />
          );
        })}

        {/* Render Nodes */}
        {data.nodes.map((node) => {
          const pos = nodePositions[node.id];
          const isActive = activeNodes.includes(node.id) || currentEvent?.indices.includes(parseInt(node.id));

          return (
            <G key={`node-${node.id}`}>
              <Circle
                cx={pos.x}
                cy={pos.y}
                r="18"
                fill={isActive ? colors.primary : colors.backgroundElement}
                stroke={isActive ? colors.active : colors.textSecondary}
                strokeWidth="2"
              />
              <SvgText
                x={pos.x}
                y={pos.y + 5}
                fontSize="12"
                fill={isActive ? "#FFF" : colors.text}
                textAnchor="middle"
                fontWeight="bold"
              >
                {node.label}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 350,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
