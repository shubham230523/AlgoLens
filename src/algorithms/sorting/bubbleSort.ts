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

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Compare
        steps.push({
          type: 'COMPARE',
          indices: [j, j + 1],
          description: `Compare ${arr[j]} and ${arr[j + 1]}`,
          codeLine: 5,
          variables: { j, i, n }
        });

        if (arr[j] > arr[j + 1]) {
          // Swap
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          steps.push({
            type: 'SWAP',
            indices: [j, j + 1],
            description: `Swap ${arr[j + 1]} and ${arr[j]}`,
            codeLine: 6,
            variables: { j, i, n, array: [...arr] }
          });
        }
      }
      // Mark sorted
      steps.push({
        type: 'MARK_SORTED',
        indices: [n - i - 1],
        description: `Element at index ${n - i - 1} is in its final sorted position`,
        codeLine: 3,
        variables: { i, n }
      });
    }

    return steps;
  },
};
