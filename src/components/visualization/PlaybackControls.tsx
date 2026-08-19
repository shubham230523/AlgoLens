import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { usePlaybackStore } from '@/store/playbackStore';

export function PlaybackControls() {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  const { isPlaying, play, pause, nextStep, prevStep, reset } = usePlaybackStore();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={reset}
        style={styles.button}
        accessibilityLabel="Reset visualization"
        accessibilityHint="Returns the algorithm to the starting state"
        accessibilityRole="button"
      >
        <RotateCcw color={colors.text} size={24} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={prevStep}
        style={styles.button}
        accessibilityLabel="Previous step"
        accessibilityHint="Goes back to the previous visualization step"
        accessibilityRole="button"
      >
        <SkipBack color={colors.text} size={24} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={isPlaying ? pause : play}
        style={[styles.playButton, { backgroundColor: colors.primary }]}
        accessibilityLabel={isPlaying ? "Pause algorithm" : "Play algorithm"}
        accessibilityHint={isPlaying ? "Pauses the visualization" : "Starts the auto-play visualization"}
        accessibilityRole="button"
      >
        {isPlaying ? (
          <Pause color="#FFF" size={32} />
        ) : (
          <Play color="#FFF" size={32} fill="#FFF" />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={nextStep}
        style={styles.button}
        accessibilityLabel="Next step"
        accessibilityHint="Advances to the next visualization step"
        accessibilityRole="button"
      >
        <SkipForward color={colors.text} size={24} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.six,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  button: {
    padding: Spacing.two,
  },
  playButton: {
    width: 56,
    height: 64, // Keep it slightly taller for the "pill" look if desired or make it a circle
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
