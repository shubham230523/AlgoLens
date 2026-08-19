import React from 'react';
import { View, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { usePlaybackStore } from '@/store/playbackStore';
import { ThemedText } from '../ui/ThemedText';

export function PlaybackControls() {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const { width: windowWidth } = useWindowDimensions();

  const {
    isPlaying,
    play,
    pause,
    nextStep,
    prevStep,
    reset,
    currentStepIndex,
    steps,
    playbackSpeed,
    setSpeed,
    jumpToStep
  } = usePlaybackStore();

  const progress = steps.length > 0 ? (currentStepIndex + 1) / steps.length : 0;
  const speeds = [0.25, 0.5, 1, 1.5, 2];

  const handleProgressBarPress = (event: any) => {
    // Basic seek implementation
    const { locationX } = event.nativeEvent;
    const barWidth = windowWidth - Spacing.eight * 2;
    if (barWidth > 0) {
      const clickRatio = Math.max(0, Math.min(1, locationX / barWidth));
      const targetIndex = Math.floor(clickRatio * (steps.length - 1));
      jumpToStep(targetIndex);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Progress Bar */}
      <View style={styles.progressSection}>
         <View
           style={[styles.progressBarBg, { backgroundColor: colors.backgroundElement }]}
           onTouchEnd={handleProgressBarPress}
         >
           <View style={[styles.progressBarFill, { width: `${progress * 100}%`, backgroundColor: colors.primary }]} />
         </View>
         <View style={styles.progressLabels}>
            <ThemedText variant="caption">Step {currentStepIndex + 1} of {steps.length}</ThemedText>
            <ThemedText variant="caption">{Math.round(progress * 100)}%</ThemedText>
         </View>
      </View>

      <View style={styles.mainControls}>
        {/* Speed Selector */}
        <View style={styles.speedSection}>
          {speeds.map((s) => (
            <TouchableOpacity
              key={s}
              onPress={() => setSpeed(s)}
              style={[
                styles.speedBtn,
                playbackSpeed === s && { backgroundColor: colors.primary + '33', borderColor: colors.primary }
              ]}
            >
              <ThemedText variant="caption" style={[styles.speedText, playbackSpeed === s && { color: colors.primary, fontWeight: 'bold' }]}>
                {s}x
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.centerControls}>
          <TouchableOpacity onPress={reset} style={styles.iconBtn}>
            <RotateCcw color={colors.textSecondary} size={20} />
          </TouchableOpacity>

          <TouchableOpacity onPress={prevStep} style={styles.iconBtn}>
            <SkipBack color={colors.text} size={24} fill={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={isPlaying ? pause : play}
            style={[styles.playBtn, { backgroundColor: colors.primary }]}
          >
            {isPlaying ? (
              <Pause color="#FFF" size={28} fill="#FFF" />
            ) : (
              <Play color="#FFF" size={28} fill="#FFF" />
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={nextStep} style={styles.iconBtn}>
            <SkipForward color={colors.text} size={24} fill={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Spacer to keep centerControls centered */}
        <View style={{ flex: 1, maxWidth: 100 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.six,
    width: '100%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressSection: {
    marginBottom: Spacing.four,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  mainControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  speedSection: {
    flexDirection: 'row',
    gap: 4,
    flex: 1,
    maxWidth: 220,
  },
  speedBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  speedText: {
    fontSize: 10,
  },
  centerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.four,
  },
  iconBtn: {
    padding: Spacing.one,
  },
  playBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
});
