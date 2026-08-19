import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import SyntaxHighlighter from 'react-native-syntax-highlighter';
import { atomDark, prism } from 'react-syntax-highlighter/dist/styles/prism';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from 'react-native';

interface CodeViewerProps {
  code: string;
  activeLine?: number;
  language?: string;
}

export function CodeViewer({ code, activeLine, language = 'javascript' }: CodeViewerProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const theme = scheme === 'dark' ? atomDark : prism;
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-scroll to active line
  useEffect(() => {
    if (activeLine !== undefined && scrollViewRef.current) {
      const lineHeight = 20; // Estimated line height
      const scrollPosition = (activeLine - 1) * lineHeight;
      scrollViewRef.current.scrollTo({
        y: Math.max(0, scrollPosition - 60), // Center it a bit
        animated: true,
      });
    }
  }, [activeLine]);

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundElement }]}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <SyntaxHighlighter
          language={language}
          style={theme}
          customStyle={{
            backgroundColor: 'transparent',
            padding: Spacing.two,
          }}
          highlighter="prism"
          fontSize={14}
          showLineNumbers={true}
          lineNumberStyle={{
            minWidth: 30,
            paddingRight: 10,
            color: colors.textSecondary,
            opacity: 0.5,
            textAlign: 'right',
          }}
          lineProps={(lineNumber: number) => ({
            style: {
              display: 'block',
              width: '100%',
              backgroundColor: lineNumber === activeLine ? colors.active + '33' : 'transparent',
              borderLeftWidth: lineNumber === activeLine ? 4 : 0,
              borderLeftColor: colors.active,
            },
          })}
        >
          {code}
        </SyntaxHighlighter>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: Spacing.two,
    maxHeight: 250, // Limit height for scrolling
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: Spacing.one,
  },
});
