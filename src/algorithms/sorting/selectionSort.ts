import { AlgorithmDefinition, VisualizationEvent } from '@/types/algorithm';

export const selectionSort: AlgorithmDefinition = {
  id: 'selection-sort',
  name: 'Selection Sort',
  category: 'Sorting',
  difficulty: 'Easy',
  description: 'Selection sort sorts an array by repeatedly finding the minimum element from the unsorted part and putting it at the beginning.',
  complexities: {
    time: 'O(n²)',
    space: 'O(1)',
  },
  visualizationType: 'BAR',
  defaultInput: [29, 10, 14, 37, 13],
  code: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
}`,
  generateSteps: (input: number[]): VisualizationEvent[] => {
    const steps: VisualizationEvent[] = [];
    const arr = [...input];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      steps.push({
        type: 'HIGHLIGHT',
        indices: [i],
        description: `Set index ${i} as the current minimum`,
        codeLine: 4,
        variables: { i, minIdx }
      });

      for (let j = i + 1; j < n; j++) {
        steps.push({
          type: 'COMPARE',
          indices: [minIdx, j],
          description: `Compare current minimum with index ${j}`,
          codeLine: 6,
          variables: { i, minIdx, j }
        });

        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          steps.push({
            type: 'SELECT',
            indices: [minIdx],
            description: `New minimum found at index ${minIdx}`,
            codeLine: 7,
            variables: { i, minIdx, j }
          });
        }
      }

      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        steps.push({
          type: 'SWAP',
          indices: [i, minIdx],
          description: `Swap minimum element at index ${minIdx} with index ${i}`,
          codeLine: 11,
          variables: { i, minIdx, array: [...arr] }
        });
      }

      steps.push({
        type: 'MARK_SORTED',
        indices: [i],
        description: `Index ${i} is now sorted`,
        codeLine: 3,
        variables: { i }
      });
    }

    steps.push({
      type: 'MARK_SORTED',
      indices: [n - 1],
      description: `Last element is automatically sorted`,
      codeLine: 3,
      variables: { n }
    });

    return steps;
  },
};
