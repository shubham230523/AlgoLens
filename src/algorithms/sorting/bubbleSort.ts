import { AlgorithmDefinition, VisualizationEvent } from '@/types/algorithm';

export const bubbleSort: AlgorithmDefinition = {
  id: 'bubble-sort',
  name: 'Bubble Sort',
  category: 'Sorting',
  difficulty: 'Easy',
  description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
  complexities: {
    time: 'O(n²)',
    space: 'O(1)',
  },
  visualizationType: 'BAR',
  defaultInput: [5, 3, 8, 4, 2],
  code: `function bubbleSort(arr) {
  const n = arr.length;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
}`,
  generateSteps: (input: number[]): VisualizationEvent[] => {
    const steps: VisualizationEvent[] = [];
    const arr = [...input];
    const n = arr.length;

    steps.push({
      type: 'HIGHLIGHT',
      indices: [],
      description: 'Starting Bubble Sort',
      codeLine: 1,
      variables: { n }
    });

    for (let i = 0; i < n; i++) {
      steps.push({
        type: 'HIGHLIGHT',
        indices: [],
        description: `Outer loop: i = ${i}. Building the sorted suffix.`,
        codeLine: 3,
        variables: { i, n }
      });

      for (let j = 0; j < n - i - 1; j++) {
        steps.push({
          type: 'COMPARE',
          indices: [j, j + 1],
          description: `Comparing elements at index ${j} and ${j + 1}`,
          codeLine: 5,
          variables: { i, j, n }
        });

        if (arr[j] > arr[j + 1]) {
          steps.push({
            type: 'HIGHLIGHT',
            indices: [j, j + 1],
            description: `${arr[j]} > ${arr[j + 1]}, so we swap them.`,
            codeLine: 6,
            variables: { i, j, n }
          });

          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];

          steps.push({
            type: 'SWAP',
            indices: [j, j + 1],
            description: `Swapped ${arr[j+1]} and ${arr[j]}`,
            codeLine: 6,
            variables: { i, j, n, array: [...arr] }
          });
        }
      }

      steps.push({
        type: 'MARK_SORTED',
        indices: [n - i - 1],
        description: `Element at index ${n - i - 1} is now in its final position.`,
        codeLine: 3,
        variables: { i, n }
      });
    }

    steps.push({
      type: 'HIGHLIGHT',
      indices: [],
      description: 'Sorting complete!',
      codeLine: 1,
      variables: { n }
    });

    return steps;
  },
};
