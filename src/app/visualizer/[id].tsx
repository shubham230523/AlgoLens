import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
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
import { Settings2, Brain, Heart, Sparkles, Info } from 'lucide-react-native';
import { SupportedLanguage } from '@/types/algorithm';

export default function VisualizerScreen() {
  const { id } = useLocalSearchParams();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const { width: windowWidth } = useWindowDimensions();
  const isDesktop = windowWidth > 900;

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
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('cpp');
  const [isAITutorVisible, setIsAITutorVisible] = useState(false);
  const [showLegend, setShowLegend] = useState(false);

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

  useEffect(() => {
    setCurrentData(initialData);
    setSortedIndices(new Set());
  }, [initialData]);

  useEffect(() => {
    try {
      const generatedSteps = algorithm.generateSteps(inputData);
      setSteps(generatedSteps);
      reset();
      markViewed(algorithm.id);
    } catch (e) {
      console.error('Failed to generate steps:', e);
    }
  }, [algorithm, inputData]);

  useEffect(() => {
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
          if (idx >= 0 && idx < data.length) data[idx] = val;
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

  const legendItems = [
    { color: colors.compare, label: 'Comparing' },
    { color: colors.swap, label: 'Swapping' },
    { color: colors.active, label: 'Active/Visited' },
    { color: colors.sorted, label: 'Sorted/Found' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: algorithm.name,
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
               <TouchableOpacity onPress={() => toggleFavorite(algorithm.id)} style={styles.headerBtn}>
                <Heart color={isFavorite(algorithm.id) ? colors.error : colors.textSecondary} fill={isFavorite(algorithm.id) ? colors.error : 'transparent'} size={18} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsAITutorVisible(true)} style={styles.headerBtn}>
                <Sparkles color={colors.primary} size={18} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsPredictionMode(!isPredictionMode)} style={[styles.headerBtn, isPredictionMode && { opacity: 1 }]}>
                <Brain color={isPredictionMode ? colors.primary : colors.textSecondary} size={18} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsInputModalVisible(true)} style={styles.headerBtn}>
                <Settings2 color={colors.primary} size={18} />
              </TouchableOpacity>
            </View>
          )
        }}
      />

      <ErrorBoundary>
        <View style={[styles.mainLayout, isDesktop && styles.desktopLayout]}>
          <View style={[styles.codeSection, isDesktop && styles.desktopCodeSection]}>
            <CodeViewer
              code={algorithm.code}
              activeLine={currentEvent?.codeLine}
              isDesktop={isDesktop}
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
          </View>

          <View style={[styles.rightSection, isDesktop && styles.desktopRightSection]}>
             <View style={styles.vizCanvas}>
                <View style={[styles.vizContainer, { backgroundColor: colors.backgroundElement + '08' }]}>
                  {showPrediction && nextEvent ? (
                    <PredictionOverlay
                      nextEvent={nextEvent}
                      onCorrect={() => { setShowPrediction(false); nextStep(); }}
                      onIncorrect={() => { setShowPrediction(false); nextStep(); }}
                    />
                  ) : renderVisualizer()}
                </View>

                {/* Color Legend in UI */}
                <View style={styles.legendContainer}>
                   <TouchableOpacity onPress={() => setShowLegend(!showLegend)} style={styles.legendToggle}>
                      <Info size={16} color={colors.textSecondary} />
                      <ThemedText variant="caption"> Legend</ThemedText>
                   </TouchableOpacity>
                   {showLegend && (
                     <View style={[styles.legendBox, { backgroundColor: colors.backgroundElement, borderColor: colors.backgroundSelected }]}>
                        {legendItems.map((item, idx) => (
                          <View key={idx} style={styles.legendItem}>
                            <View style={[styles.colorBox, { backgroundColor: item.color }]} />
                            <ThemedText variant="caption">{item.label}</ThemedText>
                          </View>
                        ))}
                     </View>
                   )}
                </View>
             </View>

             <View style={styles.bottomSection}>
                <View style={styles.metadataPanel}>
                  {currentEvent?.variables && (
                    <View style={styles.variablesPanel}>
                      <View style={styles.variablesGrid}>
                        {Object.entries(currentEvent.variables).map(([key, val]) => {
                          if (key === 'array') return null;
                          return (
                            <View key={key} style={[styles.variableBadge, { backgroundColor: colors.backgroundElement }]}>
                              <ThemedText variant="caption" style={{ color: colors.primary, fontWeight: 'bold' }}>{key}:</ThemedText>
                              <ThemedText variant="caption">{JSON.stringify(val)}</ThemedText>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  )}
                  <View style={styles.descriptionRow}>
                    <ThemedText variant="h3" style={styles.stepDescription} numberOfLines={2}>
                      {currentEvent?.description || 'Press Play to begin'}
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.controlsSection}>
                  <PlaybackControls />
                </View>
             </View>
          </View>
        </View>
      </ErrorBoundary>

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
        code={algorithm.code[selectedLanguage]}
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
  },
  desktopLayout: {
    flexDirection: 'row',
  },
  codeSection: {
    flex: 1,
    padding: Spacing.two,
  },
  desktopCodeSection: {
    flex: 0.4,
    height: '100%',
  },
  rightSection: {
    flex: 1,
  },
  desktopRightSection: {
    flex: 0.6,
    height: '100%',
  },
  vizCanvas: {
    flex: 2,
    padding: Spacing.four,
    position: 'relative',
  },
  vizContainer: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 24,
    overflow: 'hidden',
  },
  legendContainer: {
    position: 'absolute',
    bottom: Spacing.six,
    right: Spacing.six,
    alignItems: 'flex-end',
  },
  legendToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 20,
  },
  legendBox: {
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorBox: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  bottomSection: {
    flex: 1,
    padding: Spacing.four,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee22',
  },
  metadataPanel: {
    flex: 1,
  },
  descriptionRow: {
    marginTop: Spacing.two,
  },
  stepDescription: {
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 28,
  },
  variablesPanel: {
    marginBottom: Spacing.two,
  },
  variablesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  variableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  controlsSection: {
    marginTop: 'auto',
  },
  headerBtn: {
    marginLeft: Spacing.three,
    opacity: 0.8,
  }
});
