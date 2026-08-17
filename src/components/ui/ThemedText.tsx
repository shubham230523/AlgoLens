import { Text, TextProps, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

interface ThemedTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'mono';
  color?: keyof typeof Colors.light;
}

export function ThemedText({ variant = 'body', color, style, ...props }: ThemedTextProps) {
  const scheme = useColorScheme() ?? 'light';
  const themeColors = Colors[scheme];

  const variantStyles = StyleSheet.create({
    h1: { fontSize: 32, fontWeight: 'bold' },
    h2: { fontSize: 24, fontWeight: 'bold' },
    h3: { fontSize: 20, fontWeight: '600' },
    body: { fontSize: 16 },
    caption: { fontSize: 14, color: themeColors.textSecondary },
    mono: { fontSize: 14, fontFamily: 'SpaceMono' }, // Assuming SpaceMono is loaded
  });

  return (
    <Text
      style={[
        { color: color ? themeColors[color] : themeColors.text },
        variantStyles[variant],
        style,
      ]}
      {...props}
    />
  );
}
