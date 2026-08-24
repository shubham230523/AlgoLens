import React from 'react';
import { View, StyleSheet, Modal, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Spacing } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';
import { X } from 'lucide-react-native';
import { VisualizationEvent } from '@/types/algorithm';
import { AITutorChat } from './AITutorChat';

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
              <View style={styles.handleContainer}>
                <View style={[styles.handle, { backgroundColor: colors.backgroundSelected }]} />
              </View>

              <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.backgroundElement }]}>
                   <X color={colors.textSecondary} size={20} />
                </TouchableOpacity>
              </View>

              <AITutorChat
                currentEvent={currentEvent}
                algorithmName={algorithmName}
                code={code}
              />
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
    paddingTop: Spacing.two,
    height: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: Spacing.one,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});
