import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import SyntaxHighlighter from 'react-native-syntax-highlighter';
// @ts-ignore
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { Copy, Check } from 'lucide-react-native';
import { ThemedText } from '../ui/ThemedText';
import * as Clipboard from 'expo-clipboard';
import { SupportedLanguage } from '@/types/algorithm';

interface CodeViewerProps {
  code: Record<SupportedLanguage, string>;
  activeLine?: number;
  isDesktop?: boolean;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  selectedLanguage: SupportedLanguage;
}

// Premium Gemini Dark Theme Colors
const GEMINI_DARK = {
  background: '#131314',
  headerBg: '#1e1f20',
  border: '#3c4043',
  text: '#e3e3e3',
  comment: '#9aa0a6',
  highlight: 'rgba(108, 99, 255, 0.35)', // More visible theme-matched color
  highlightBorder: '#6C63FF', // Primary theme color
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
  selectedLanguage
}: CodeViewerProps) {
  const [copied, setCopied] = useState(false);
  const verticalScrollRef = useRef<ScrollView>(null);
  const horizontalScrollRef = useRef<ScrollView>(null);

  // Base constants for layout calculation
  const LINE_HEIGHT = 24;
  const PADDING_TOP = 12;

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
    <View style={[styles.container, { backgroundColor: GEMINI_DARK.background, borderColor: GEMINI_DARK.border }]}>
      <View style={[styles.header, { backgroundColor: GEMINI_DARK.headerBg, borderBottomColor: GEMINI_DARK.border }]}>
        <View style={styles.langSelector}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.value}
              onPress={() => onLanguageChange?.(lang.value)}
              style={[
                styles.langBtn,
                selectedLanguage === lang.value && { borderBottomColor: GEMINI_DARK.highlightBorder }
              ]}
            >
              <ThemedText
                variant="caption"
                style={[
                  styles.langText,
                  { fontFamily: FONT_SANS },
                  selectedLanguage === lang.value && { color: GEMINI_DARK.highlightBorder, fontWeight: 'bold' }
                ]}
              >
                {lang.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity onPress={copyToClipboard} style={styles.copyBtn}>
          {copied ? <Check size={16} color={GEMINI_DARK.highlightBorder} /> : <Copy size={16} color={GEMINI_DARK.comment} />}
        </TouchableOpacity>
      </View>

      {/* SINGLE VERTICAL SCROLLBAR */}
      <ScrollView
        ref={verticalScrollRef}
        style={styles.verticalScrollView}
        contentContainerStyle={styles.verticalScrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* SINGLE HORIZONTAL SCROLLBAR */}
        <ScrollView
          ref={horizontalScrollRef}
          horizontal
          style={styles.horizontalScrollView}
          contentContainerStyle={[styles.horizontalScrollContent, { paddingTop: PADDING_TOP }]}
          showsHorizontalScrollIndicator={true}
        >
          <View style={styles.codeWrapper}>
            {/* Remove floatingHighlight as requested (remove chip) */}

            <SyntaxHighlighter
              language={selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage}
              style={atomDark}
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
                color: '#5f6368',
                textAlign: 'right',
                fontSize: 11,
                backgroundColor: 'transparent',
                fontFamily: FONT_MONO,
              }}
              lineProps={(lineNumber: number) => ({
                style: {
                  height: LINE_HEIGHT,
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingLeft: 4,
                  backgroundColor: lineNumber === activeLine ? GEMINI_DARK.highlight : 'transparent',
                  borderLeftWidth: lineNumber === activeLine ? 4 : 0,
                  borderLeftColor: GEMINI_DARK.highlightBorder,
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
  }
});
