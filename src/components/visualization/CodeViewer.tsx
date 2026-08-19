import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import SyntaxHighlighter from 'react-native-syntax-highlighter';
import { atomDark, prism } from 'react-syntax-highlighter/dist/styles/prism';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { Copy, Check, ChevronDown } from 'lucide-react-native';
import { ThemedText } from '../ui/ThemedText';
import * as Clipboard from 'expo-clipboard';
import Animated, { useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { SupportedLanguage } from '@/types/algorithm';

interface CodeViewerProps {
  code: Record<SupportedLanguage, string>;
  activeLine?: number;
  isDesktop?: boolean;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  selectedLanguage: SupportedLanguage;
}

// Gemini-style colors
const GEMINI_THEME = {
  background: '#1e1f20',
  text: '#e3e3e3',
  keyword: '#c58af9',
  function: '#7baaf7',
  string: '#fa903e',
  comment: '#9aa0a6',
  variable: '#e3e3e3',
  number: '#f28b82',
  operator: '#8ab4f8',
  highlight: 'rgba(138, 180, 248, 0.15)',
  highlightBorder: '#8ab4f8',
};

export function CodeViewer({
  code,
  activeLine,
  isDesktop = false,
  onLanguageChange,
  selectedLanguage
}: CodeViewerProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const [copied, setCopied] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const LINE_HEIGHT = 24;

  const animatedHighlightStyle = useAnimatedStyle(() => {
    if (activeLine === undefined) return { opacity: 0 };
    return {
      opacity: 1,
      transform: [
        { translateY: withSpring((activeLine - 1) * LINE_HEIGHT, { damping: 20, stiffness: 100 }) }
      ]
    };
  });

  useEffect(() => {
    if (activeLine !== undefined && scrollViewRef.current) {
      const scrollPosition = (activeLine - 1) * LINE_HEIGHT;
      scrollViewRef.current.scrollTo({
        y: Math.max(0, scrollPosition - (isDesktop ? 200 : 100)),
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

  return (
    <View style={[styles.container, { backgroundColor: GEMINI_THEME.background }]}>
      {/* Header with Language Selector and Copy */}
      <View style={styles.header}>
        <View style={styles.langSelector}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.value}
              onPress={() => onLanguageChange?.(lang.value)}
              style={[
                styles.langBtn,
                selectedLanguage === lang.value && { borderBottomColor: GEMINI_THEME.highlightBorder }
              ]}
            >
              <ThemedText
                variant="caption"
                style={[
                  styles.langText,
                  selectedLanguage === lang.value && { color: GEMINI_THEME.highlightBorder, fontWeight: 'bold' }
                ]}
              >
                {lang.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity onPress={copyToClipboard} style={styles.copyBtn}>
          {copied ? <Check size={16} color={GEMINI_THEME.highlightBorder} /> : <Copy size={16} color={GEMINI_THEME.comment} />}
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.codeWrapper}>
          {/* Smooth Execution Highlighter */}
          <Animated.View style={[styles.floatingHighlight, animatedHighlightStyle]} />

          <SyntaxHighlighter
            language={selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage}
            style={atomDark}
            customStyle={{
              backgroundColor: 'transparent',
              padding: 0,
              margin: 0,
            }}
            highlighter="prism"
            fontSize={13}
            showLineNumbers={true}
            lineNumberStyle={{
              minWidth: 35,
              paddingRight: 15,
              color: GEMINI_THEME.comment,
              textAlign: 'right',
              fontSize: 11,
              backgroundColor: 'transparent',
            }}
            lineProps={() => ({
              style: {
                height: LINE_HEIGHT,
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: 4,
              },
            })}
          >
            {code[selectedLanguage]}
          </SyntaxHighlighter>
        </View>
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
    borderColor: '#3c4043',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    borderBottomWidth: 1,
    borderBottomColor: '#3c4043',
    height: 48,
  },
  langSelector: {
    flexDirection: 'row',
    gap: Spacing.four,
  },
  langBtn: {
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  langText: {
    color: '#9aa0a6',
    fontSize: 12,
  },
  copyBtn: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: Spacing.two,
  },
  codeWrapper: {
    position: 'relative',
  },
  floatingHighlight: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 24,
    backgroundColor: GEMINI_THEME.highlight,
    borderLeftWidth: 3,
    borderLeftColor: GEMINI_THEME.highlightBorder,
    zIndex: 0,
  }
});
