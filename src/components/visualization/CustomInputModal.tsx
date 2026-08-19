import React, { useState } from 'react';
import { View, StyleSheet, Modal, ScrollView, TouchableWithoutFeedback } from 'react-native';
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
  type: 'ARRAY' | 'SEARCH';
}

export function CustomInputModal({ isVisible, onClose, onSubmit, initialValue, type }: CustomInputModalProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  const [rawInput, setRawInput] = useState(
    Array.isArray(initialValue)
      ? initialValue.join(', ')
      : initialValue.array.join(', ')
  );

  const [target, setTarget] = useState(
    type === 'SEARCH' ? String(initialValue.target) : ''
  );

  const [error, setError] = useState<string | null>(null);

  const handleRandomize = () => {
    const random = generateRandomArray({ size: 8, min: 1, max: 50 });
    setRawInput(random.join(', '));
    setError(null);
  };

  const validate = (): boolean => {
    const array = parseInputArray(rawInput);

    if (array.length === 0) {
      setError('Please enter at least one number');
      return false;
    }

    if (array.length > 50) {
      setError('Array size is limited to 50 for performance');
      return false;
    }

    if (array.some(isNaN)) {
      setError('Please enter valid numbers separated by commas');
      return false;
    }

    if (type === 'SEARCH') {
      const targetVal = parseInt(target, 10);
      if (isNaN(targetVal)) {
        setError('Please enter a valid target number');
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const array = parseInputArray(rawInput);
    if (type === 'SEARCH') {
      onSubmit({ array, target: parseInt(target, 10) });
    } else {
      onSubmit(array);
    }
    onClose();
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
                <ThemedText variant="h2">Customize Input</ThemedText>
                <Button title="" variant="ghost" onPress={onClose} style={styles.closeBtn}>
                   <X color={colors.text} size={24} />
                </Button>
              </View>

              <ScrollView style={styles.form}>
                {error && (
                  <View style={[styles.errorContainer, { backgroundColor: colors.error + '22' }]}>
                    <ThemedText variant="caption" style={{ color: colors.error }}>{error}</ThemedText>
                  </View>
                )}

                <Input
                  label="Array (comma separated)"
                  value={rawInput}
                  onChangeText={(text) => {
                    setRawInput(text);
                    if (error) setError(null);
                  }}
                  placeholder="e.g. 5, 2, 8, 1"
                  multiline
                  error={error && rawInput.length === 0 ? error : undefined}
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
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.four,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  closeBtn: {
    width: 40,
    height: 40,
    padding: 0,
  },
  form: {
    marginBottom: Spacing.six,
  },
  errorContainer: {
    padding: Spacing.two,
    borderRadius: 8,
    marginBottom: Spacing.two,
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
