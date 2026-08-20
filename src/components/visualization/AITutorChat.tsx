import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { ThemedText } from '../ui/ThemedText';
import { Sparkles, Send } from 'lucide-react-native';
import { VisualizationEvent } from '@/types/algorithm';
import { Input } from '../ui/Input';
import { generateTutorResponse, getSuggestedQuestions, ChatMessage } from '@/lib/aiService';

interface AITutorChatProps {
  currentEvent: VisualizationEvent | null;
  algorithmName: string;
  code: string;
  isEmbedded?: boolean;
}

export function AITutorChat({ currentEvent, algorithmName, code, isEmbedded = false }: AITutorChatProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: `Hi! I'm your AlgoLens Tutor. I see you're looking at **${algorithmName}**. How can I help you understand this step?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const suggestedQuestions = getSuggestedQuestions({ algorithmName, code, currentEvent });

  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages, isLoading]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    const userMsg = textToSend.trim();
    if (!textOverride) setInput('');

    const newUserMessage: ChatMessage = { role: 'user', content: userMsg };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const context = { algorithmName, code, currentEvent };
      const responseMessage = await generateTutorResponse([...messages, newUserMessage], context);
      setMessages(prev => [...prev, responseMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting to the AI service. Please check your API key or connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (content: string, isUser: boolean) => {
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return (
      <ThemedText style={{ color: isUser ? '#FFF' : colors.text, lineHeight: 22, fontSize: 16 }}>
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <ThemedText key={i} style={{ fontWeight: 'bold', color: isUser ? '#FFF' : colors.text }}>{part.slice(2, -2)}</ThemedText>;
          }
          return part;
        })}
      </ThemedText>
    );
  };

  return (
    <View style={[styles.container, isEmbedded && styles.embeddedContainer, { backgroundColor: colors.background }]}>
      {!isEmbedded && (
        <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.two }}>
                <View style={[styles.iconContainer, { backgroundColor: colors.primary + '22' }]}>
                <Sparkles color={colors.primary} size={20} />
                </View>
                <View>
                <ThemedText variant="h3" style={{ fontWeight: 'bold' }}>AI Tutor</ThemedText>
                <ThemedText variant="caption" style={{ color: colors.success }}>Powered by NVIDIA</ThemedText>
                </View>
            </View>
        </View>
      )}

      <ScrollView
        ref={scrollViewRef}
        style={styles.chatArea}
        contentContainerStyle={{ paddingBottom: Spacing.four, paddingHorizontal: isEmbedded ? Spacing.two : 0 }}
        showsVerticalScrollIndicator={true}
      >
        {messages.map((msg, i) => (
          <View
            key={i}
            style={[
              styles.message,
              msg.role === 'user' ? [styles.userMsg, { backgroundColor: colors.primary }] : [styles.aiMsg, { backgroundColor: colors.backgroundElement }]
            ]}
          >
            {renderMessageContent(msg.content, msg.role === 'user')}
          </View>
        ))}
        {isLoading && (
          <View style={[styles.message, styles.aiMsg, { backgroundColor: colors.backgroundElement, width: 60, alignItems: 'center' }]}>
            <ActivityIndicator color={colors.primary} size="small" />
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, isEmbedded && { paddingHorizontal: Spacing.two }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.suggestions}
          contentContainerStyle={{ gap: Spacing.two }}
        >
          {suggestedQuestions.map((q, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.suggestionChip, { borderColor: colors.primary + '44', backgroundColor: colors.backgroundSelected }]}
              onPress={() => handleSend(q)}
              disabled={isLoading}
            >
              <ThemedText variant="caption" style={{ color: colors.primary, fontSize: 13 }}>{q}</ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.inputRow}>
          <Input
            value={input}
            onChangeText={setInput}
            placeholder="Ask a question..."
            containerStyle={{ flex: 1, marginVertical: 0 }}
            style={{ backgroundColor: colors.backgroundElement, borderWidth: 0, fontSize: 16 }}
            onSubmitEditing={() => handleSend()} // Submit on Enter
            returnKeyType="send"
          />
          <TouchableOpacity
              onPress={() => handleSend()}
              style={[styles.sendBtn, { backgroundColor: colors.primary, opacity: isLoading || !input.trim() ? 0.6 : 1 }]}
              disabled={isLoading || !input.trim()}
          >
              <Send color="#FFF" size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  embeddedContainer: {
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.four,
    paddingBottom: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatArea: {
    flex: 1,
  },
  message: {
    padding: Spacing.three,
    borderRadius: 20,
    marginVertical: Spacing.one,
    maxWidth: '90%',
  },
  userMsg: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiMsg: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  footer: {
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
  },
  suggestions: {
    flexDirection: 'row',
    marginBottom: Spacing.two,
  },
  suggestionChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: 16,
    borderWidth: 1,
  },
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'center',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
