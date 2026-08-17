import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outline';
}

export function Card({ children, style, onPress, variant = 'default' }: CardProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  const Container = onPress ? TouchableOpacity : View;

  const variantStyles = StyleSheet.create({
    default: {
      backgroundColor: colors.backgroundElement,
    },
    elevated: {
      backgroundColor: colors.backgroundElement,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.backgroundSelected,
    },
  });

  return (
    <Container
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.card,
        variantStyles[variant],
        style,
      ]}
    >
      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: Spacing.three,
    marginVertical: Spacing.one,
  },
});
