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
    paddingTop: Spacing.one,
    paddingBottom: Spacing.two, // Reduced bottom padding
    width: '100%',
    backgroundColor: 'transparent',
  },
  progressSection: {
    marginBottom: Spacing.two,
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
    width: 120, // Reduced width
  },
  speedBtn: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  speedText: {
    fontSize: 8,
  },
  centerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  iconBtn: {
    padding: Spacing.half,
  },
  playBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
