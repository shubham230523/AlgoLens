import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform, Modal, TouchableWithoutFeedback } from 'react-native';
import SyntaxHighlighter from 'react-native-syntax-highlighter';
// @ts-ignore
import atomDark from 'react-syntax-highlighter/dist/esm/styles/prism/atom-dark';
// @ts-ignore
import prism from 'react-syntax-highlighter/dist/esm/styles/prism/prism';
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
    syntax: prism || {},
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
    syntax: atomDark || {},
  },
};

const FONT_MONO = '"Google Sans Code", "JetBrains Mono", "Space Mono", monospace';

const dedent = (str: string) => {
  const lines = str.split('\n');
  if (lines.length === 0) return str;
  const firstContentLineIndex = lines.findIndex(line => line.trim() !== '');
  if (firstContentLineIndex === -1) return str;
  const match = lines[firstContentLineIndex].match(/^\s*/);
  const minIndent = match ? match[0].length : 0;
  return lines
    .map(line => line.startsWith(' '.repeat(minIndent)) ? line.slice(minIndent) : line.trimStart())
    .join('\n')
    .trimStart();
};

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const verticalScrollRef = useRef<ScrollView>(null);
  const horizontalScrollRef = useRef<ScrollView>(null);

  const LINE_HEIGHT = 30;
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
    const text = code?.[selectedLanguage] || '';
    if (text) {
      await Clipboard.setStringAsync(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const languages: { label: string; value: SupportedLanguage }[] = [
    { label: 'C++', value: 'cpp' },
    { label: 'Java', value: 'java' },
    { label: 'Python', value: 'python' },
    { label: 'JavaScript', value: 'javascript' },
    { label: 'Kotlin', value: 'kotlin' },
  ];

  const currentLangLabel = languages.find(l => l.value === selectedLanguage)?.label || 'Language';

  const selectLanguage = (lang: SupportedLanguage) => {
    onLanguageChange?.(lang);
    setIsDropdownOpen(false);
  };

  if (!SyntaxHighlighter) {
      return (
          <View style={[styles.container, { padding: 20 }]}>
              <ThemedText>Syntax Highlighter is not available.</ThemedText>
          </View>
      );
  }

  const displayCode = dedent(code?.[selectedLanguage] || '').trimEnd();

  return (
    <View style={[styles.container, { backgroundColor: theme.background, borderColor: theme.border }]}>
      <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
        <TouchableOpacity style={styles.langSelector} onPress={() => setIsDropdownOpen(true)}>
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

      <Modal
        visible={isDropdownOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDropdownOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsDropdownOpen(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.dropdownMenu, { backgroundColor: theme.headerBg, borderColor: theme.border }]}>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.value}
                  style={[
                    styles.dropdownItem,
                    selectedLanguage === lang.value && { backgroundColor: theme.highlight }
                  ]}
                  onPress={() => selectLanguage(lang.value)}
                >
                  <ThemedText style={{ color: theme.text, fontSize: 16 }}>{lang.label}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <ScrollView
        ref={verticalScrollRef}
        style={styles.verticalScrollView}
        contentContainerStyle={styles.verticalScrollContent}
        showsVerticalScrollIndicator={true}
      >
        <ScrollView
          ref={horizontalScrollRef}
          horizontal={true}
          style={styles.horizontalScrollView}
          contentContainerStyle={[styles.horizontalScrollContent, { paddingTop: PADDING_TOP }]}
          showsHorizontalScrollIndicator={true}
        >
          <View style={styles.codeWrapper}>
            <Animated.View style={[
              styles.floatingHighlight,
              { backgroundColor: theme.highlight, height: LINE_HEIGHT },
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
              fontSize={19}
              showLineNumbers={true}
              wrapLines={false}
              lineNumberStyle={{
                minWidth: 60,
                paddingRight: 15,
                paddingLeft: 10,
                color: theme.gutterText,
                textAlign: 'right',
                fontSize: 15,
                backgroundColor: 'transparent',
                fontFamily: FONT_MONO,
                borderRightWidth: 1,
                borderRightColor: theme.border,
                marginRight: 20,
                height: LINE_HEIGHT,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              lineProps={() => ({
                style: {
                  height: LINE_HEIGHT,
                  flexDirection: 'row',
                  alignItems: 'center',
                  whiteSpace: 'pre',
                },
              })}
            >
              {displayCode}
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
    height: 44,
  },
  langSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.03)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  langText: {
    fontSize: 16,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-start',
    paddingTop: 100,
    paddingLeft: 20,
  },
  dropdownMenu: {
    width: 150,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
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
    paddingBottom: 24,
    alignItems: 'flex-start',
  },
  codeWrapper: {
    position: 'relative',
  },
  floatingHighlight: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: -1,
  }
});
