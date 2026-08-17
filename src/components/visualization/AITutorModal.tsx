import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Modal, ScrollView, TouchableWithoutFeedback, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { ThemedText } from '../ui/ThemedText';
import { Button } from '../ui/Button';
import { X, Sparkles, Send } from 'lucide-react-native';
import { VisualizationEvent } from '@/types/algorithm';
import { Input } from '../ui/Input';
import { generateTutorResponse, getSuggestedQuestions, ChatMessage } from '@/lib/aiService';

interface AITutorModalProps {
  isVisible: boolean;
  onClose: () => void;
  currentEvent: VisualizationEvent | null;
  algorithmName: string;
  code: string;
}

export function AITutorModal({ isVisible, onClose, currentEvent, algorithmName, code }: AITutorModalProps) {
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

    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const context = { algorithmName, code, currentEvent };
      const response = await generateTutorResponse([...messages, { role: 'user', content: userMsg }], context);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (content: string, isUser: boolean) => {
    // Simple markdown-ish bolding parser for the mock
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return (
      <ThemedText style={{ color: isUser ? '#FFF' : colors.text, lineHeight: 20 }}>
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
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.content, { backgroundColor: colors.background }]}>
              <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.two }}>
                  <View style={[styles.iconContainer, { backgroundColor: colors.primary + '22' }]}>
                    <Sparkles color={colors.primary} size={20} />
                  </View>
                  <View>
                    <ThemedText variant="h3" style={{ fontWeight: 'bold' }}>AI Tutor</ThemedText>
                    <ThemedText variant="caption" style={{ color: colors.success }}>Local Mode</ThemedText>
                  </View>
                </View>
                <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.backgroundElement }]}>
                   <X color={colors.textSecondary} size={20} />
                </TouchableOpacity>
              </View>

              <ScrollView
                ref={scrollViewRef}
                style={styles.chatArea}
                contentContainerStyle={{ paddingBottom: Spacing.four }}
                showsVerticalScrollIndicator={false}
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

              <View style={styles.footer}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.suggestions}
                  contentContainerStyle={{ gap: Spacing.two }}
                >
                  {suggestedQuestions.map((q, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[styles.suggestionChip, { borderColor: colors.primary + '44', backgroundColor: colors.background }]}
                      onPress={() => handleSend(q)}
                      disabled={isLoading}
                    >
                      <ThemedText variant="caption" style={{ color: colors.primary }}>{q}</ThemedText>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <View style={styles.inputRow}>
                  <Input
                    value={input}
                    onChangeText={setInput}
                    placeholder="Ask a question..."
                    containerStyle={{ flex: 1, marginVertical: 0 }}
                    style={{ backgroundColor: colors.backgroundElement, borderWidth: 0 }}
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
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  content: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: Spacing.four,
    height: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.four,
    paddingBottom: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: '#33333311',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
    maxWidth: '85%',
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
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
