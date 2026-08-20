import { AlgorithmDefinition, VisualizationEvent } from '@/types/algorithm';

export const quickSort: AlgorithmDefinition = {
  id: 'quick-sort',
  name: 'Quick Sort',
  category: 'Sorting Algorithm',
  difficulty: 'Medium',
  description: 'QuickSort is a divide-and-conquer algorithm that picks an element as a pivot and partitions the array around it.',
  complexities: { time: 'O(n log n)', space: 'O(log n)' },
  visualizationType: 'BAR',
  defaultInput: [10, 80, 30, 90, 40, 50, 70],
  code: {
    cpp: `void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
    java: `void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
    python: `def quickSort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quickSort(arr, low, pi - 1)
        quickSort(arr, pi + 1, high)`,
    javascript: `function quickSort(arr, low, high) {
    if (low < high) {
        let pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
    kotlin: `fun quickSort(arr: IntArray, low: Int, high: Int) {
    if (low < high) {
        val pi = partition(arr, low, high)
        quickSort(arr, low, pi - 1)
        quickSort(arr, pi + 1, high)
    }
}`
  },
  generateSteps: (input: number[]): VisualizationEvent[] => {
    const steps: VisualizationEvent[] = [];
    const arr = [...input];

    function partition(low: number, high: number) {
      const pivot = arr[high];
      let i = low - 1;

      steps.push({
        type: 'SELECT',
        indices: [high],
        description: `Picking pivot ${pivot} at index ${high}`,
        codeLine: 2,
        variables: { pivot, low, high }
      });

      for (let j = low; j < high; j++) {
        steps.push({
          type: 'COMPARE',
          indices: [j, high],
          description: `Comparing ${arr[j]} with pivot ${pivot}`,
          codeLine: 4,
          variables: { j, pivot }
        });

        if (arr[j] < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          steps.push({
            type: 'SWAP',
            indices: [i, j],
            description: `Swapping ${arr[i]} and ${arr[j]}`,
            codeLine: 6,
            variables: { i, j, array: [...arr] }
          });
        }
      }

      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      steps.push({
        type: 'SWAP',
        indices: [i + 1, high],
        description: `Placing pivot at its correct position ${i + 1}`,
        codeLine: 8,
        variables: { pivotIdx: i + 1, array: [...arr] }
      });

      steps.push({
        type: 'MARK_SORTED',
        indices: [i + 1],
        description: `Pivot at index ${i+1} is now in its final position`,
        codeLine: 2,
        variables: {}
      });

      return i + 1;
    }

    function sort(low: number, high: number) {
      if (low < high) {
        const pi = partition(low, high);
        sort(low, pi - 1);
        sort(pi + 1, high);
      } else if (low === high) {
          steps.push({
            type: 'MARK_SORTED',
            indices: [low],
            description: `Index ${low} is sorted`,
            codeLine: 1,
            variables: {}
          });
      }
    }

    sort(0, arr.length - 1);
    return steps;
  }
};
