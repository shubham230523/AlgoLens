import React from 'react';
import { TextInput, StyleSheet, View, Text, TextInputProps, ViewStyle } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function Input({ label, error, containerStyle, style, ...props }: InputProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.backgroundElement,
            color: colors.text,
            borderColor: error ? colors.error : colors.backgroundSelected,
          },
          style,
        ]}
        placeholderTextColor={colors.textSecondary}
        accessibilityLabel={props.accessibilityLabel || label}
        accessibilityState={{ error: !!error }}
        {...props}
      />
      {error && (
        <Text style={[styles.errorText, { color: colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.two,
  },
  label: {
    fontSize: 14,
    marginBottom: Spacing.one,
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: Spacing.one,
  },
});
