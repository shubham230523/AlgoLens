import React, { useEffect, useState, useMemo, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
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
import { Settings2, Brain, Heart, Code, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';

export default function VisualizerScreen() {
  const { id } = useLocalSearchParams();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const { width: windowWidth } = useWindowDimensions();
  const isDesktop = windowWidth > 800;

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
  const [showCode, setShowCode] = useState(true); // Default to true for side-by-side
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

  // Sync state when initialData changes
  useEffect(() => {
    setCurrentData(initialData);
    setSortedIndices(new Set());
  }, [initialData]);

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

  // Handle step changes
  useEffect(() => {
    try {
      if (currentStepIndex === -1) {
        setCurrentData(initialData);
        setSortedIndices(new Set());
        return;
      }

      const newData = Array.isArray(initialData) ? [...initialData] : (typeof initialData === 'object' ? {...initialData} : initialData);
      const newSorted = new Set<number>();

      for (let i = 0; i <= currentStepIndex; i++) {
        applyStep(steps[i], newData, newSorted);
      }

      setCurrentData(newData);
      setSortedIndices(newSorted);

      if (currentStepIndex === steps.length - 1 && steps.length > 0) {
        completeAlgorithm(algorithm.id);
      }
    } catch (e) {
      console.error('Error during step processing:', e);
      setError('An error occurred during visualization.');
    }

    if (isPredictionMode && !showPrediction && currentStepIndex < steps.length - 1) {
      if (Math.random() > 0.8) {
        pause();
        setShowPrediction(true);
      }
    }
  }, [currentStepIndex, steps, initialData, isPredictionMode]);

  const applyStep = (step: any, data: any, sorted: Set<number>) => {
    if (!step) return;

    if (step.variables?.array && Array.isArray(data)) {
        step.variables.array.forEach((val: number, idx: number) => {
          if (idx >= 0 && idx < data.length) {
            data[idx] = val;
          }
        });
    }

    if (step.type === 'SWAP' && Array.isArray(data)) {
        const [idx1, idx2] = step.indices;
        if (step.indices.length === 2) {
          if (idx1 < data.length && idx2 < data.length) {
            [data[idx1], data[idx2]] = [data[idx2], data[idx1]];
          }
        }
    } else if (step.type === 'MARK_SORTED') {
        step.indices.forEach((idx: number) => {
          if (idx >= 0) sorted.add(idx);
        });
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

  const renderVisualizer = () => {
    if (algorithm.visualizationType === 'TREE') {
      return <TreeVisualizer data={currentData} currentEvent={currentEvent} sortedIndices={sortedIndices} />;
    }
    if (algorithm.visualizationType === 'GRAPH') {
      return <GraphVisualizer data={currentData} currentEvent={currentEvent} sortedIndices={sortedIndices} />;
    }
    return <ArrayVisualizer data={currentData} currentEvent={currentEvent} sortedIndices={sortedIndices} />;
  };

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
              {!isDesktop && (
                <TouchableOpacity
                  onPress={() => setShowCode(!showCode)}
                  style={styles.settingsBtn}
                >
                  <Code color={showCode ? colors.primary : colors.textSecondary} size={18} />
                </TouchableOpacity>
              )}
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
        <View style={[styles.mainLayout, isDesktop && styles.desktopLayout]}>
          {/* Code Section */}
          {(showCode || isDesktop) && (
            <View style={[styles.codeSection, isDesktop && styles.desktopCodeSection]}>
              <View style={styles.sectionHeader}>
                 <ThemedText variant="subtitle">Algorithm Implementation</ThemedText>
              </View>
              <CodeViewer
                code={algorithm.code}
                activeLine={currentEvent?.codeLine}
                isDesktop={isDesktop}
              />
              {currentEvent?.variables && (
                <View style={styles.variablesPanel}>
                  <ThemedText variant="caption" style={{ fontWeight: 'bold', marginBottom: 4 }}>Call Stack & Variables</ThemedText>
                  <View style={styles.variablesGrid}>
                    {Object.entries(currentEvent.variables).map(([key, val]) => {
                      if (key === 'array') return null;
                      return (
                        <View key={key} style={[styles.variableBadge, { backgroundColor: colors.backgroundElement }]}>
                          <ThemedText variant="caption" style={{ color: colors.primary }}>{key}</ThemedText>
                          <ThemedText variant="caption" style={{ fontWeight: 'bold' }}>{JSON.stringify(val)}</ThemedText>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Visualization Section */}
          <View style={[styles.vizSection, isDesktop && styles.desktopVizSection]}>
             <View style={[styles.vizContainer, { backgroundColor: colors.backgroundElement + '22' }]}>
                {showPrediction && nextEvent ? (
                  <PredictionOverlay
                    nextEvent={nextEvent}
                    onCorrect={() => { setShowPrediction(false); nextStep(); }}
                    onIncorrect={() => { setShowPrediction(false); nextStep(); }}
                  />
                ) : renderVisualizer()}
              </View>

              <View style={styles.descriptionPanel}>
                <View style={[styles.stepIndicator, { backgroundColor: colors.primary }]}>
                  <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>STEP {currentStepIndex + 1}</ThemedText>
                </View>
                <ThemedText variant="h3" style={styles.stepDescription}>
                  {currentEvent?.description || 'Press Play to begin visualization'}
                </ThemedText>
              </View>
          </View>
        </View>
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
  mainLayout: {
    flex: 1,
    flexDirection: 'column',
  },
  desktopLayout: {
    flexDirection: 'row',
  },
  codeSection: {
    flex: 1,
    padding: Spacing.four,
    borderRightWidth: 1,
    borderRightColor: '#eeeeee22',
  },
  desktopCodeSection: {
    flex: 0.4,
    height: '100%',
  },
  vizSection: {
    flex: 1,
    padding: Spacing.four,
  },
  desktopVizSection: {
    flex: 0.6,
  },
  sectionHeader: {
    marginBottom: Spacing.two,
    paddingBottom: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee22',
  },
  vizContainer: {
    height: 320,
    justifyContent: 'center',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: Spacing.four,
  },
  descriptionPanel: {
    padding: Spacing.four,
    backgroundColor: '#3b82f611',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  stepIndicator: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 18,
    lineHeight: 26,
  },
  variablesPanel: {
    marginTop: Spacing.four,
    padding: Spacing.two,
    borderRadius: 8,
    backgroundColor: '#00000011',
  },
  variablesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  variableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 6,
  },
  controls: {
    borderTopWidth: 1,
    paddingBottom: Spacing.four,
    backgroundColor: 'transparent',
  },
  settingsBtn: {
    marginLeft: Spacing.two,
    opacity: 0.8,
  }
});


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.four,
  },
  vizContainer: {
    height: 280,
    justifyContent: 'center',
    marginBottom: Spacing.four,
    borderRadius: 16,
    overflow: 'hidden',
  },
  errorContainer: {
    height: 280,
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
