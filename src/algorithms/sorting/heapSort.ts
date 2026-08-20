import { AlgorithmDefinition, VisualizationEvent } from '@/types/algorithm';

export const heapSort: AlgorithmDefinition = {
  id: 'heap-sort',
  name: 'Heap Sort',
  category: 'Sorting Algorithm',
  difficulty: 'Hard',
  description: 'Heap sort is a comparison-based sorting technique based on Binary Heap data structure.',
  complexities: { time: 'O(n log n)', space: 'O(1)' },
  visualizationType: 'BAR',
  defaultInput: [12, 11, 13, 5, 6, 7],
  code: {
    cpp: `class Solution {
public:
    void heapSort(int arr[], int n) {
        for (int i = n / 2 - 1; i >= 0; i--)
            heapify(arr, n, i);
        for (int i = n - 1; i > 0; i--) {
            swap(arr[0], arr[i]);
            heapify(arr, i, 0);
        }
    }
};`,
    java: `class Solution {
    public void sort(int arr[]) {
        int n = arr.length;
        for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
        for (int i = n - 1; i > 0; i--) {
            int temp = arr[0]; arr[0] = arr[i]; arr[i] = temp;
            heapify(arr, i, 0);
        }
    }
}`,
    python: `class Solution:
    def heapSort(self, arr):
        n = len(arr)
        for i in range(n // 2 - 1, -1, -1):
            heapify(arr, n, i)
        for i in range(n - 1, 0, -1):
            arr[i], arr[0] = arr[0], arr[i]
            heapify(arr, i, 0)`,
    javascript: `class Solution {
    heapSort(arr) {
        let n = arr.length;
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(arr, n, i);
        for (let i = n - 1; i > 0; i--) {
            [arr[0], arr[i]] = [arr[i], arr[0]];
            heapify(arr, i, 0);
        }
    }
}`,
    kotlin: `class Solution {
    fun heapSort(arr: IntArray) {
        val n = arr.size
        for (i in n / 2 - 1 downTo 0) heapify(arr, n, i)
        for (i in n - 1 downTo 1) {
            val temp = arr[0]; arr[0] = arr[i]; arr[i] = temp
            heapify(arr, i, 0)
        }
    }
}`
  },
  generateSteps: (input: number[]): VisualizationEvent[] => {
    const steps: VisualizationEvent[] = [];
    const arr = [...input];
    const n = arr.length;

    function heapify(n: number, i: number) {
      let largest = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;

      steps.push({
        type: 'HIGHLIGHT',
        indices: [i],
        description: `Heapifying node at index ${i}`,
        codeLine: 2,
        variables: { i, n }
      });

      if (l < n) {
          steps.push({
            type: 'COMPARE',
            indices: [i, l],
            description: `Comparing parent ${arr[i]} with left child ${arr[l]}`,
            codeLine: 2,
            variables: { i, l }
          });
          if (arr[l] > arr[largest]) largest = l;
      }

      if (r < n) {
          steps.push({
            type: 'COMPARE',
            indices: [largest, r],
            description: `Comparing current largest ${arr[largest]} with right child ${arr[r]}`,
            codeLine: 2,
            variables: { largest, r }
          });
          if (arr[r] > arr[largest]) largest = r;
      }

      if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        steps.push({
          type: 'SWAP',
          indices: [i, largest],
          description: `Swapping ${arr[largest]} and ${arr[i]}`,
          codeLine: 6,
          variables: { array: [...arr] }
        });
        heapify(n, largest);
      }
    }

    // Build heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(n, i);
    }

    // Extract elements
    for (let i = n - 1; i > 0; i--) {
      [arr[0], arr[i]] = [arr[i], arr[0]];
      steps.push({
        type: 'SWAP',
        indices: [0, i],
        description: `Extracting root ${arr[i]} to sorted position ${i}`,
        codeLine: 5,
        variables: { array: [...arr] }
      });

      steps.push({
        type: 'MARK_SORTED',
        indices: [i],
        description: `Index ${i} is now sorted`,
        codeLine: 5,
        variables: {}
      });

      heapify(i, 0);
    }

    steps.push({
      type: 'MARK_SORTED',
      indices: [0],
      description: `Final element is sorted`,
      codeLine: 5,
      variables: {}
    });

    return steps;
  }
};
