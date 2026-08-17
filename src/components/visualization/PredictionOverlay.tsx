import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { ThemedText } from '../ui/ThemedText';
import { Button } from '../ui/Button';
import { VisualizationEvent } from '@/types/algorithm';
import { Card } from '../ui/Card';
import { CheckCircle2, XCircle } from 'lucide-react-native';

interface PredictionOverlayProps {
  nextEvent: VisualizationEvent;
  onCorrect: () => void;
  onIncorrect: () => void;
}

export function PredictionOverlay({ nextEvent, onCorrect, onIncorrect }: PredictionOverlayProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const options = useMemo(() => {
    const correct = nextEvent.type;
    const all = ['COMPARE', 'SWAP', 'VISIT', 'MARK_SORTED'];
    const filtered = all.filter(t => t !== correct);
    const shuffeled = [...filtered].sort(() => 0.5 - Math.random()).slice(0, 2);
    return [...shuffeled, correct].sort(() => 0.5 - Math.random());
  }, [nextEvent]);

  const handleChoice = (choice: string) => {
    if (choice === nextEvent.type) {
      setFeedback('correct');
      setTimeout(onCorrect, 1500);
    } else {
      setFeedback('incorrect');
      setTimeout(onIncorrect, 1500);
    }
  };

  if (feedback) {
    return (
      <View style={styles.feedbackContainer}>
        {feedback === 'correct' ? (
          <>
            <CheckCircle2 color={colors.success} size={64} />
            <ThemedText variant="h2" style={{ color: colors.success }}>Correct!</ThemedText>
          </>
        ) : (
          <>
            <XCircle color={colors.error} size={64} />
            <ThemedText variant="h2" style={{ color: colors.error }}>Not quite...</ThemedText>
            <ThemedText variant="body">The next step is {nextEvent.type}</ThemedText>
          </>
        )}
      </View>
    );
  }

  return (
    <Card style={styles.container}>
      <ThemedText variant="h2">What happens next?</ThemedText>
      <ThemedText variant="body" style={styles.question}>
        Based on the current state, what will the algorithm do in the next step?
      </ThemedText>

      <View style={styles.options}>
        {options.map(option => (
          <Button
            key={option}
            title={option}
            variant="outline"
            onPress={() => handleChoice(option)}
            style={styles.optionBtn}
          />
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.four,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6C63FF',
  },
  question: {
    textAlign: 'center',
    marginVertical: Spacing.three,
  },
  options: {
    width: '100%',
    gap: Spacing.two,
  },
  optionBtn: {
    width: '100%',
  },
  feedbackContainer: {
    padding: Spacing.six,
    alignItems: 'center',
    gap: Spacing.two,
  }
});

import { useMemo } from 'react';
