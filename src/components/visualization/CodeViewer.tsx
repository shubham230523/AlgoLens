import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import SyntaxHighlighter from 'react-native-syntax-highlighter';
// @ts-ignore
import { atomDark, prism } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { Copy, Check, Bookmark, RotateCcw, Maximize2, Terminal, ChevronDown } from 'lucide-react-native';
import { ThemedText } from '../ui/ThemedText';
import * as Clipboard from 'expo-clipboard';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { SupportedLanguage } from '@/types/algorithm';

interface CodeViewerProps {
  code: Record<SupportedLanguage, string>;
  activeLine?: number;
  isDesktop?: boolean;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  selectedLanguage: SupportedLanguage;
  onReset?: () => void;
}

// IDE Themes
const THEMES = {
  light: {
    background: '#ffffff',
    headerBg: '#f7f8fa',
    border: '#e5e7eb',
    text: '#262626',
    gutterText: '#bfbfbf',
    highlight: '#f3f4f6',
    accent: '#007aff',
    comment: '#8c8c8c',
    syntax: prism,
  },
  dark: {
    background: '#0B1020',
    headerBg: '#151B2E',
    border: '#1E293B',
    text: '#e3e3e3',
    gutterText: '#5f6368',
    highlight: 'rgba(108, 99, 255, 0.15)',
    accent: '#818CF8',
    comment: '#9aa0a6',
    syntax: atomDark,
  },
};

const FONT_MONO = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  web: '"Google Sans Code", "Roboto Mono", monospace',
});

const FONT_SANS = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  web: '"Google Sans", "Product Sans", sans-serif',
});

export function CodeViewer({
  code,
  activeLine,
  isDesktop = false,
  onLanguageChange,
  selectedLanguage,
  onReset,
}: CodeViewerProps) {
  const scheme = useColorScheme() ?? 'light';
  const theme = THEMES[scheme as keyof typeof THEMES];
  const [copied, setCopied] = useState(false);
  const verticalScrollRef = useRef<ScrollView>(null);
  const horizontalScrollRef = useRef<ScrollView>(null);

  const LINE_HEIGHT = 24;
  const PADDING_TOP = 16;

  const animatedHighlightStyle = useAnimatedStyle(() => {
    if (activeLine === undefined || activeLine < 1) return { opacity: 0 };
    return {
      opacity: 1,
      transform: [
        { translateY: withSpring((activeLine - 1) * LINE_HEIGHT, { damping: 20, stiffness: 120 }) }
      ]
    };
  });

  useEffect(() => {
    if (activeLine !== undefined && activeLine > 0 && verticalScrollRef.current) {
      const scrollPosition = (activeLine - 1) * LINE_HEIGHT;
      verticalScrollRef.current.scrollTo({
        y: Math.max(0, scrollPosition - (isDesktop ? 150 : 80)),
        animated: true,
      });
    }
  }, [activeLine, isDesktop]);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(code[selectedLanguage]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const languages: { label: string; value: SupportedLanguage }[] = [
    { label: 'C++', value: 'cpp' },
    { label: 'Java', value: 'java' },
    { label: 'Python', value: 'python' },
    { label: 'JavaScript', value: 'javascript' },
    { label: 'Kotlin', value: 'kotlin' },
  ];

  const currentLangLabel = languages.find(l => l.value === selectedLanguage)?.label || 'Language';

  return (
    <View style={[styles.container, { backgroundColor: theme.background, borderColor: theme.border }]}>
      <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
        <TouchableOpacity style={styles.langSelector}>
          <ThemedText variant="caption" style={[styles.langText, { color: theme.text }]}>
            {currentLangLabel}
          </ThemedText>
          <ChevronDown size={14} color={theme.gutterText} />
        </TouchableOpacity>

        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Bookmark size={16} color={theme.gutterText} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Terminal size={16} color={theme.gutterText} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={onReset}>
            <RotateCcw size={16} color={theme.gutterText} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={copyToClipboard}>
            {copied ? <Check size={16} color={theme.accent} /> : <Copy size={16} color={theme.gutterText} />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Maximize2 size={16} color={theme.gutterText} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        ref={verticalScrollRef}
        style={styles.verticalScrollView}
        contentContainerStyle={styles.verticalScrollContent}
        showsVerticalScrollIndicator={true}
      >
        <ScrollView
          ref={horizontalScrollRef}
          horizontal
          style={styles.horizontalScrollView}
          contentContainerStyle={[styles.horizontalScrollContent, { paddingTop: PADDING_TOP }]}
          showsHorizontalScrollIndicator={true}
        >
          <View style={styles.codeWrapper}>
            <Animated.View style={[
              styles.floatingHighlight,
              { backgroundColor: theme.highlight },
              animatedHighlightStyle
            ]} />

            <SyntaxHighlighter
              language={selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage}
              style={theme.syntax}
              customStyle={{
                backgroundColor: 'transparent',
                padding: 0,
                margin: 0,
                overflow: 'visible',
              }}
              highlighter="prism"
              fontSize={13}
              showLineNumbers={true}
              lineNumberStyle={{
                minWidth: 35,
                paddingRight: 10,
                color: theme.gutterText,
                textAlign: 'right',
                fontSize: 11,
                backgroundColor: 'transparent',
                fontFamily: FONT_MONO,
                borderRightWidth: 1,
                borderRightColor: theme.border + '44',
                marginRight: 10,
              }}
              lineProps={() => ({
                style: {
                  height: LINE_HEIGHT,
                  flexDirection: 'row',
                  alignItems: 'center',
                },
              })}
            >
              {code[selectedLanguage]}
            </SyntaxHighlighter>
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    flex: 1,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    borderBottomWidth: 1,
    height: 36,
  },
  langSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.03)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  langText: {
    fontSize: 12,
    fontWeight: '500',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    padding: 4,
  },
  verticalScrollView: {
    flex: 1,
  },
  verticalScrollContent: {
    flexGrow: 1,
  },
  horizontalScrollView: {
    flex: 1,
  },
  horizontalScrollContent: {
    minWidth: '100%',
    paddingBottom: 24,
  },
  codeWrapper: {
    position: 'relative',
    flex: 1,
  },
  floatingHighlight: {
    position: 'absolute',
    left: -100, // Extend left to cover gutter area
    width: 2000,
    height: 24,
    zIndex: -1,
  }
});
