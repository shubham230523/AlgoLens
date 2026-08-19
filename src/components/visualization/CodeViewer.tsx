import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import SyntaxHighlighter from 'react-native-syntax-highlighter';
import { atomDark, prism } from 'react-syntax-highlighter/dist/styles/prism';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

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
      const lineHeight = 24; // Better estimated line height for execution pointer
      const scrollPosition = (activeLine - 1) * lineHeight;
      scrollViewRef.current.scrollTo({
        y: Math.max(0, scrollPosition - 100), // Center it better
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
          lineProps={(lineNumber: number) => {
            const isActive = lineNumber === activeLine;
            return {
              style: {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                backgroundColor: isActive ? colors.active + '33' : 'transparent',
                borderLeftWidth: isActive ? 4 : 0,
                borderLeftColor: colors.active,
                height: 24, // Consistent height for scroll calculations
              },
            };
          }}
          renderer={({ rows, stylesheet, useInlineStyles }: any) => {
             return rows.map((node: any, i: number) => {
               const lineNumber = i + 1;
               const isActive = lineNumber === activeLine;

               // This is a simplified conceptual approach as renderer structure depends on library version
               // For react-native-syntax-highlighter, we typically wrap it using lineProps or custom renderer
               return null; // The library handles this via lineProps mostly
             });
          }}
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
