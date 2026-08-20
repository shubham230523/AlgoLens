import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, ScrollView, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { ThemedText } from '../ui/ThemedText';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X } from 'lucide-react-native';
import { generateRandomArray, parseInputArray } from '@/utils/arrayUtils';

interface CustomInputModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (input: any) => void;
  initialValue: any;
  type: 'ARRAY' | 'SEARCH' | 'NUMBER' | 'GRAPH';
}

export function CustomInputModal({ isVisible, onClose, onSubmit, initialValue, type }: CustomInputModalProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  const [rawInput, setRawInput] = useState('');
  const [target, setTarget] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Sync state with initialValue when modal opens
  useEffect(() => {
    if (isVisible) {
      if (Array.isArray(initialValue)) {
        setRawInput(initialValue.join(', '));
      } else if (typeof initialValue === 'object' && initialValue?.array) {
        setRawInput(initialValue.array.join(', '));
        if (type === 'SEARCH') setTarget(String(initialValue.target || ''));
      } else if (typeof initialValue === 'number') {
        setRawInput(String(initialValue));
      } else if (type === 'GRAPH') {
        setRawInput('0-1, 0-2, 1-3, 2-3'); // Basic graph edge list notation
      }
    }
  }, [isVisible, initialValue, type]);

  const handleRandomize = () => {
    if (type === 'NUMBER') {
      setRawInput(String(Math.floor(Math.random() * 10) + 5));
    } else {
      const random = generateRandomArray({ size: 8, min: 1, max: 50 });
      setRawInput(random.join(', '));
    }
    setError(null);
  };

  const validate = (): boolean => {
    if (type === 'NUMBER') {
      const n = parseInt(rawInput, 10);
      if (isNaN(n) || n < 1 || n > 20) {
        setError('Please enter a number between 1 and 20');
        return false;
      }
      return true;
    }

    if (type === 'ARRAY' || type === 'SEARCH') {
      const array = parseInputArray(rawInput);
      if (array.length === 0) {
        setError('Please enter at least one number');
        return false;
      }
      if (array.length > 30) {
        setError('Array size limited to 30 for performance');
        return false;
      }
      if (type === 'SEARCH') {
        const targetVal = parseInt(target, 10);
        if (isNaN(targetVal)) {
          setError('Please enter a valid target number');
          return false;
        }
      }
    }

    setError(null);
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (type === 'NUMBER') {
      onSubmit(parseInt(rawInput, 10));
    } else if (type === 'SEARCH') {
      onSubmit({ array: parseInputArray(rawInput), target: parseInt(target, 10) });
    } else if (type === 'ARRAY') {
      onSubmit(parseInputArray(rawInput));
    } else if (type === 'GRAPH') {
        // Placeholder for graph input submission logic
        onClose();
        return;
    }
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.content, { backgroundColor: colors.background }]}>
                <View style={styles.header}>
                  <ThemedText variant="h2">Customize Input</ThemedText>
                  <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.backgroundElement }]}>
                    <X color={colors.textSecondary} size={20} />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
                  {error && (
                    <View style={[styles.errorContainer, { backgroundColor: colors.error + '15' }]}>
                      <ThemedText variant="caption" style={{ color: colors.error }}>{error}</ThemedText>
                    </View>
                  )}

                  <Input
                    label={type === 'NUMBER' ? 'Value' : (type === 'GRAPH' ? 'Edges (e.g. 0-1, 1-2)' : 'Array (comma separated)')}
                    value={rawInput}
                    onChangeText={(text) => {
                      setRawInput(text);
                      if (error) setError(null);
                    }}
                    placeholder={type === 'NUMBER' ? 'e.g. 10' : 'e.g. 5, 2, 8, 1'}
                    multiline={type !== 'NUMBER'}
                    keyboardType="numeric"
                  />

                  {type === 'SEARCH' && (
                    <Input
                      label="Target Value"
                      value={target}
                      onChangeText={setTarget}
                      placeholder="e.g. 10"
                      keyboardType="numeric"
                    />
                  )}

                  <View style={styles.actions}>
                    <Button
                      title="Randomize"
                      variant="outline"
                      onPress={handleRandomize}
                      style={styles.actionBtn}
                    />
                    <Button
                      title="Apply"
                      onPress={handleSubmit}
                      style={styles.actionBtn}
                    />
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  content: {
    borderRadius: 24,
    padding: Spacing.four,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    marginBottom: Spacing.two,
  },
  errorContainer: {
    padding: Spacing.three,
    borderRadius: 12,
    marginBottom: Spacing.three,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.four,
  },
  actionBtn: {
    flex: 1,
  },
});
