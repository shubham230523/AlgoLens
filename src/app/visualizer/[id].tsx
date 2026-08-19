import React, { useEffect, useState, useMemo, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { usePlaybackStore } from '@/store/playbackStore';
import { useProgressStore } from '@/store/progressStore';
import { getAlgorithmById, bubbleSort } from '@/algorithms';
import { ArrayVisualizer } from '@/components/visualization/ArrayVisualizer';
import { TreeVisualizer } from '@/components/visualization/TreeVisualizer';
import { GraphVisualizer } from '@/components/visualization/GraphVisualizer';
import { PlaybackControls } from '@/components/visualization/PlaybackControls';
import { ThemedText } from '@/components/ui/ThemedText';
import { CustomInputModal } from '@/components/visualization/CustomInputModal';
import { PredictionOverlay } from '@/components/visualization/PredictionOverlay';
import { CodeViewer } from '@/components/visualization/CodeViewer';
import { AITutorModal } from '@/components/visualization/AITutorModal';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Settings2, Brain, Heart, Code, Sparkles } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';

export default function VisualizerScreen() {
  const { id } = useLocalSearchParams();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  const {
    steps,
    currentStepIndex,
    setSteps,
    isPlaying,
    nextStep,
    playbackSpeed,
    reset,
    pause
  } = usePlaybackStore();

  const { markViewed, toggleFavorite, isFavorite, completeAlgorithm } = useProgressStore();

  const algorithm = useMemo(() => getAlgorithmById(id as string) || bubbleSort, [id]);

  const [inputData, setInputData] = useState(algorithm.defaultInput);
  const [isInputModalVisible, setIsInputModalVisible] = useState(false);
  const [isPredictionMode, setIsPredictionMode] = useState(false);
  const [showPrediction, setShowPrediction] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [isAITutorVisible, setIsAITutorVisible] = useState(false);

  const initialData = useMemo(() => {
    if (typeof inputData === 'object' && 'array' in inputData) {
      return inputData.array;
    }
    if (typeof inputData === 'object' && 'tree' in inputData) {
        return inputData.tree;
    }
    return inputData;
  }, [inputData]);

  const [currentData, setCurrentData] = useState<any>(initialData);
  const [sortedIndices, setSortedIndices] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const prevStepIndexRef = useRef<number>(-1);

  // Initialize steps & track view
  useEffect(() => {
    try {
      setError(null);
      const generatedSteps = algorithm.generateSteps(inputData);
      setSteps(generatedSteps);
      reset();
      markViewed(algorithm.id);
    } catch (e) {
      console.error('Failed to generate steps:', e);
      setError('Failed to initialize algorithm visualization.');
    }
  }, [algorithm, inputData]);

  // Handle step changes with optimization
  useEffect(() => {
    try {
      const prevIndex = prevStepIndexRef.current;

      // Full reset
      if (currentStepIndex === -1) {
        setCurrentData(initialData);
        setSortedIndices(new Set());
        prevStepIndexRef.current = -1;
        return;
      }

      if (algorithm.visualizationType === 'GRAPH') {
          setCurrentData(inputData);
      } else {
          let newData: any;
          let newSorted: Set<number>;

          // Optimization: If only one step forward, apply delta to current state
          if (currentStepIndex === prevIndex + 1 && prevIndex >= -1) {
              newData = Array.isArray(currentData) ? [...currentData] : currentData;
              newSorted = new Set(sortedIndices);
              const step = steps[currentStepIndex];
              applyStep(step, newData, newSorted);
          } else {
              // Re-calculate from scratch
              newData = Array.isArray(initialData) ? [...initialData] : initialData;
              newSorted = new Set<number>();
              for (let i = 0; i <= currentStepIndex; i++) {
                applyStep(steps[i], newData, newSorted);
              }
          }

          setCurrentData(newData);
          setSortedIndices(newSorted);
      }

      prevStepIndexRef.current = currentStepIndex;

      // Track completion
      if (currentStepIndex === steps.length - 1 && steps.length > 0) {
        completeAlgorithm(algorithm.id);
      }
    } catch (e) {
      console.error('Error during step processing:', e);
      setError('An error occurred during visualization.');
    }

    // Prediction trigger
    if (isPredictionMode && !showPrediction && currentStepIndex < steps.length - 1) {
      if (Math.random() > 0.8) {
        pause();
        setShowPrediction(true);
      }
    }
  }, [currentStepIndex, steps, initialData, isPredictionMode, inputData, algorithm.visualizationType]);

  const applyStep = (step: any, data: any, sorted: Set<number>) => {
    if (!step) return;
    if (step.type === 'SWAP' && Array.isArray(data)) {
        const [idx1, idx2] = step.indices;
        if (step.indices.length === 2) {
          [data[idx1], data[idx2]] = [data[idx2], data[idx1]];
        } else if (step.indices.length === 1 && step.variables?.array) {
          step.variables.array.forEach((val: number, idx: number) => {
            data[idx] = val;
          });
        }
    } else if (step.type === 'UPDATE_VALUE' && step.variables?.array && Array.isArray(data)) {
        step.variables.array.forEach((val: number, idx: number) => {
          data[idx] = val;
        });
    } else if (step.type === 'MARK_SORTED') {
        step.indices.forEach((idx: number) => sorted.add(idx));
    }
  };

  // Auto-play logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStepIndex < steps.length - 1 && !showPrediction) {
      interval = setInterval(() => {
        nextStep();
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStepIndex, steps.length, playbackSpeed, showPrediction]);

  const currentEvent = currentStepIndex >= 0 ? steps[currentStepIndex] : null;
  const nextEvent = currentStepIndex < steps.length - 1 ? steps[currentStepIndex + 1] : null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: algorithm.name,
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
               <TouchableOpacity
                onPress={() => toggleFavorite(algorithm.id)}
                style={styles.settingsBtn}
              >
                <Heart
                  color={isFavorite(algorithm.id) ? colors.error : colors.textSecondary}
                  fill={isFavorite(algorithm.id) ? colors.error : 'transparent'}
                  size={18}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsAITutorVisible(true)}
                style={styles.settingsBtn}
              >
                <Sparkles color={colors.primary} size={18} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowCode(!showCode)}
                style={styles.settingsBtn}
              >
                <Code color={showCode ? colors.primary : colors.textSecondary} size={18} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsPredictionMode(!isPredictionMode)}
                style={[styles.settingsBtn, isPredictionMode && { opacity: 1 }]}
              >
                <Brain color={isPredictionMode ? colors.primary : colors.textSecondary} size={18} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsInputModalVisible(true)} style={styles.settingsBtn}>
                <Settings2 color={colors.primary} size={18} />
              </TouchableOpacity>
            </View>
          )
        }}
      />

      <ErrorBoundary>
        <ScrollView contentContainerStyle={styles.content}>
          {error ? (
             <View style={styles.errorContainer}>
               <ThemedText variant="h3" style={{ color: colors.error }}>{error}</ThemedText>
               <Button title="Reset Visualization" onPress={reset} style={{ marginTop: Spacing.four }} />
             </View>
          ) : (
            <>
              <View style={[styles.vizContainer, { backgroundColor: colors.backgroundElement + '44' }]}>
                {showPrediction && nextEvent ? (
                  <PredictionOverlay
                    nextEvent={nextEvent}
                    onCorrect={() => { setShowPrediction(false); nextStep(); }}
                    onIncorrect={() => { setShowPrediction(false); nextStep(); }}
                  />
                ) : (
                  <>
                    {algorithm.visualizationType === 'TREE' ? (
                      <TreeVisualizer
                        data={currentData}
                        currentEvent={currentEvent}
                        sortedIndices={sortedIndices}
                      />
                    ) : algorithm.visualizationType === 'GRAPH' ? (
                      <GraphVisualizer
                        data={currentData}
                        currentEvent={currentEvent}
                        sortedIndices={sortedIndices}
                      />
                    ) : (
                      <ArrayVisualizer
                        data={currentData}
                        currentEvent={currentEvent}
                        sortedIndices={sortedIndices}
                      />
                    )}
                  </>
                )}
              </View>

              {!showPrediction && (
                <View style={[styles.infoContainer, { backgroundColor: colors.backgroundElement + '22' }]}>
                  <ThemedText variant="h3">{currentEvent?.description || 'Press Play to Start'}</ThemedText>

                  {showCode && (
                    <CodeViewer
                      code={algorithm.code}
                      activeLine={currentEvent?.codeLine}
                    />
                  )}

                  {currentEvent?.variables && (
                    <View style={styles.variables}>
                      {Object.entries(currentEvent.variables).map(([key, val]) => {
                        if (key === 'array') return null;
                        return (
                          <ThemedText key={key} variant="caption">
                            {key}: {JSON.stringify(val)}
                          </ThemedText>
                        );
                      })}
                    </View>
                  )}
                </View>
              )}
            </>
          )}
        </ScrollView>
      </ErrorBoundary>

      <View style={[styles.controls, { borderTopColor: colors.backgroundElement }]}>
        <PlaybackControls />
      </View>

      <CustomInputModal
        isVisible={isInputModalVisible}
        onClose={() => setIsInputModalVisible(false)}
        onSubmit={setInputData}
        initialValue={inputData}
        type={algorithm.category === 'Searching' ? 'SEARCH' : (algorithm.category === 'Graphs' ? 'ARRAY' : 'ARRAY')}
      />

      <AITutorModal
        isVisible={isAITutorVisible}
        onClose={() => setIsAITutorVisible(false)}
        currentEvent={currentEvent}
        algorithmName={algorithm.name}
        code={algorithm.code}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.four,
  },
  vizContainer: {
    minHeight: 320,
    justifyContent: 'center',
    marginBottom: Spacing.four,
    borderRadius: 16,
    overflow: 'hidden',
  },
  errorContainer: {
    minHeight: 320,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  infoContainer: {
    padding: Spacing.four,
    borderRadius: 16,
    minHeight: 120,
  },
  variables: {
    marginTop: Spacing.two,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  controls: {
    borderTopWidth: 1,
    paddingBottom: Spacing.four,
  },
  settingsBtn: {
    marginRight: Spacing.two,
    opacity: 0.8,
  }
});
