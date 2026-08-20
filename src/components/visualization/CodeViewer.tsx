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

// PREMIUM IDE THEMES
const THEMES = {
  light: {
    background: '#ffffff',
    headerBg: '#f8fafc',
    border: '#e2e8f0',
    text: '#1e293b',
    gutterText: '#94a3b8',
    highlight: 'rgba(108, 99, 255, 0.08)',
    accent: '#6366f1',
    comment: '#64748b',
    syntax: prism,
  },
  dark: {
    background: '#0B1020',
    headerBg: '#151B2E',
    border: '#1E293B',
    text: '#f1f5f9',
    gutterText: '#475569',
    // HIGH VISIBILITY NEON HIGHLIGHT for dark background
    highlight: 'rgba(129, 140, 248, 0.25)',
    accent: '#818CF8',
    comment: '#64748b',
    syntax: atomDark,
  },
};

const FONT_MONO = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  web: '"JetBrains Mono", "Fira Code", "Roboto Mono", monospace',
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
  const PADDING_TOP = 20;

  const animatedHighlightStyle = useAnimatedStyle(() => {
    if (activeLine === undefined || activeLine < 1) return { opacity: 0 };
    return {
      opacity: 1,
      transform: [
        { translateY: withSpring((activeLine - 1) * LINE_HEIGHT, { damping: 20, stiffness: 150 }) }
      ]
    };
  });

  useEffect(() => {
    if (activeLine !== undefined && activeLine > 0 && verticalScrollRef.current) {
      const scrollPosition = (activeLine - 1) * LINE_HEIGHT;
      verticalScrollRef.current.scrollTo({
        y: Math.max(0, scrollPosition - (isDesktop ? 180 : 100)),
        animated: true,
      });
    }
  }, [activeLine, isDesktop]);

  const copyToClipboard = async () => {
    const codeStr = code?.[selectedLanguage] || '';
    await Clipboard.setStringAsync(codeStr);
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

  const currentLangLabel = languages.find(l => l.value === selectedLanguage)?.label || 'JS';
  const safeCode = code?.[selectedLanguage] || '// No code implementation available';

  return (
    <View style={[styles.container, { backgroundColor: theme.background, borderColor: theme.border }]}>
      <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
        <TouchableOpacity style={[styles.langSelector, { backgroundColor: scheme === 'dark' ? '#1E293B' : '#F1F5F9' }]}>
          <ThemedText variant="caption" style={[styles.langText, { color: theme.text }]}>
            {currentLangLabel}
          </ThemedText>
          <ChevronDown size={12} color={theme.gutterText} />
        </TouchableOpacity>

        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Bookmark size={16} color={theme.gutterText} />
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
            {/* NEON FULL WIDTH HIGHLIGHT */}
            <Animated.View style={[
              styles.floatingHighlight,
              { backgroundColor: theme.highlight, borderLeftColor: theme.accent },
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
                minWidth: 40,
                paddingRight: 15,
                color: theme.gutterText,
                textAlign: 'right',
                fontSize: 11,
                backgroundColor: 'transparent',
                fontFamily: FONT_MONO,
                borderRightWidth: 1,
                borderRightColor: theme.border,
                marginRight: 15,
              }}
              lineProps={() => ({
                style: {
                  height: LINE_HEIGHT,
                  flexDirection: 'row',
                  alignItems: 'center',
                },
              })}
            >
              {safeCode}
            </SyntaxHighlighter>
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    flex: 1,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    borderBottomWidth: 1,
    height: 42,
  },
  langSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  langText: {
    fontSize: 12,
    fontWeight: '600',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
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
    paddingBottom: 40,
  },
  codeWrapper: {
    position: 'relative',
    flex: 1,
  },
  floatingHighlight: {
    position: 'absolute',
    left: -100, // Covers gutter
    width: 3000, // Safe huge width
    height: 24,
    borderLeftWidth: 4,
    zIndex: -1,
  }
});
