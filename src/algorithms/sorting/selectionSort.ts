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
  code: {
    cpp: `void selectionSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        int min_idx = i;
        for (int j = i+1; j < n; j++)
            if (arr[j] < arr[min_idx])
                min_idx = j;
        swap(arr[min_idx], arr[i]);
    }
}`,
    java: `void sort(int arr[]) {
    int n = arr.length;
    for (int i = 0; i < n-1; i++) {
        int min_idx = i;
        for (int j = i+1; j < n; j++)
            if (arr[j] < arr[min_idx])
                min_idx = j;
        int temp = arr[min_idx];
        arr[min_idx] = arr[i];
        arr[i] = temp;
    }
}`,
    python: `def selectionSort(arr):
    for i in range(len(arr)):
        min_idx = i
        for j in range(i+1, len(arr)):
            if arr[min_idx] > arr[j]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
    javascript: `function selectionSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        let minIdx = i;
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
}`,
    kotlin: `fun selectionSort(arr: IntArray) {
    val n = arr.size
    for (i in 0 until n - 1) {
        var min_idx = i
        for (j in i + 1 until n)
            if (arr[j] < arr[min_idx])
                min_idx = j
        val temp = arr[min_idx]
        arr[min_idx] = arr[i]
        arr[i] = temp
    }
}`
  },
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
