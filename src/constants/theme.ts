/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
    primary: '#6C63FF',
    secondary: '#00D4FF',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    // Semantic Visualization Colors
    compare: '#3B82F6',
    swap: '#F59E0B',
    sorted: '#22C55E',
    active: '#6C63FF',
    visited: '#9333EA',
  },
  dark: {
    text: '#ffffff',
    background: '#0B1020',
    backgroundElement: '#151B2E',
    backgroundSelected: '#1E293B',
    textSecondary: '#B0B4BA',
    primary: '#6C63FF',
    secondary: '#00D4FF',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    // Semantic Visualization Colors
    compare: '#60A5FA',
    swap: '#FBBF24',
    sorted: '#4ADE80',
    active: '#818CF8',
    visited: '#A855F7',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'System',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'Google Sans Code',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'Google Sans Code',
  },
  web: {
    sans: 'var(--font-display), system-ui, -apple-system, sans-serif',
    serif: 'var(--font-serif), ui-serif, serif',
    rounded: 'var(--font-rounded), ui-rounded, sans-serif',
    mono: '"Google Sans Code", "JetBrains Mono", "Space Mono", monospace',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Breakpoints = {
  PHONE: 480,
  TABLET: 768,
  DESKTOP: 1024,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 1200;
