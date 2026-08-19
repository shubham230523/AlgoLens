import { AlgorithmDefinition, VisualizationEvent } from '@/types/algorithm';

export const mergeSort: AlgorithmDefinition = {
  id: 'merge-sort',
  name: 'Merge Sort',
  category: 'Sorting',
  difficulty: 'Medium',
  description: 'Merge sort is a divide-and-conquer algorithm that divides the array into halves, recursively sorts them, and then merges the sorted halves.',
  complexities: {
    time: 'O(n log n)',
    space: 'O(n)',
  },
  visualizationType: 'BAR',
  defaultInput: [38, 27, 43, 3, 9, 82, 10],
  code: {
    cpp: `void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`,
    java: `void sort(int arr[], int l, int r) {
    if (l < r) {
        int m = (l + r) / 2;
        sort(arr, l, m);
        sort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`,
    python: `def mergeSort(arr, l, r):
    if l < r:
        m = (l + r) // 2
        mergeSort(arr, l, m)
        mergeSort(arr, m + 1, r)
        merge(arr, l, m, r)`,
    javascript: `function mergeSort(arr, l, r) {
    if (l < r) {
        let m = Math.floor((l + r) / 2);
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`,
    kotlin: `fun mergeSort(arr: IntArray, l: Int, r: Int) {
    if (l < r) {
        val m = (l + r) / 2
        mergeSort(arr, l, m)
        mergeSort(arr, m + 1, r)
        merge(arr, l, m, r)
    }
}`
  },
  generateSteps: (input: number[]): VisualizationEvent[] => {
    const steps: VisualizationEvent[] = [];
    const arr = [...input];

    function merge(l: number, m: number, r: number) {
      const n1 = m - l + 1;
      const n2 = r - m;
      const L = arr.slice(l, m + 1);
      const R = arr.slice(m + 1, r + 1);

      let i = 0, j = 0, k = l;

      steps.push({
        type: 'HIGHLIGHT',
        indices: Array.from({ length: r - l + 1 }, (_, i) => l + i),
        description: `Merging subarrays [${l}...${m}] and [${m + 1}...${r}]`,
        codeLine: 6,
        variables: { l, m, r }
      });

      while (i < n1 && j < n2) {
        steps.push({
          type: 'COMPARE',
          indices: [l + i, m + 1 + j],
          description: `Compare ${L[i]} and ${R[j]}`,
          codeLine: 6,
          variables: { i, j, k }
        });

        if (L[i] <= R[j]) {
          arr[k] = L[i];
          i++;
        } else {
          arr[k] = R[j];
          j++;
        }

        steps.push({
          type: 'UPDATE_VALUE',
          indices: [k],
          description: `Update index ${k} with ${arr[k]}`,
          codeLine: 6,
          variables: { array: [...arr], k }
        });
        k++;
      }

      while (i < n1) {
        arr[k] = L[i];
        steps.push({
          type: 'UPDATE_VALUE',
          indices: [k],
          description: `Copy remaining element ${L[i]} from left`,
          codeLine: 6,
          variables: { array: [...arr], k }
        });
        i++;
        k++;
      }

      while (j < n2) {
        arr[k] = R[j];
        steps.push({
          type: 'UPDATE_VALUE',
          indices: [k],
          description: `Copy remaining element ${R[j]} from right`,
          codeLine: 6,
          variables: { array: [...arr], k }
        });
        j++;
        k++;
      }

      if (l === 0 && r === input.length - 1) {
          steps.push({
            type: 'MARK_SORTED',
            indices: Array.from({ length: input.length }, (_, i) => i),
            description: `Final merge complete! Array is sorted.`,
            codeLine: 1,
            variables: { array: [...arr] }
          });
      }
    }

    function sort(l: number, r: number) {
      if (l >= r) return;
      const m = l + Math.floor((r - l) / 2);

      steps.push({
        type: 'HIGHLIGHT',
        indices: [l, r],
        description: `Dividing array from index ${l} to ${r}`,
        codeLine: 3,
        variables: { l, r, m }
      });

      sort(l, m);
      sort(m + 1, r);
      merge(l, m, r);
    }

    sort(0, arr.length - 1);
    return steps;
  },
};
