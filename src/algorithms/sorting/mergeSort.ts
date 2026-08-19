import { AlgorithmDefinition, VisualizationEvent } from '@/types/algorithm';

export const mergeSort: AlgorithmDefinition = {
  id: 'merge-sort',
  name: 'Merge Sort',
  category: 'Sorting',
  difficulty: 'Medium',
  description: 'Merge sort is a divide-and-conquer algorithm that was invented by John von Neumann in 1945. It works by dividing the unsorted list into n sublists, each containing one element, and then repeatedly merging sublists to produce new sorted sublists until there is only one sublist remaining.',
  complexities: {
    time: 'O(n log n)',
    space: 'O(n)',
  },
  visualizationType: 'BAR',
  defaultInput: [38, 27, 43, 3, 9, 82, 10],
  code: `function mergeSort(arr, left, right) {
  if (left >= right) return;

  const mid = Math.floor((left + right) / 2);
  mergeSort(arr, left, mid);
  mergeSort(arr, mid + 1, right);
  merge(arr, left, mid, right);
}

function merge(arr, left, mid, right) {
  const n1 = mid - left + 1;
  const n2 = right - mid;
  const L = arr.slice(left, mid + 1);
  const R = arr.slice(mid + 1, right + 1);

  let i = 0, j = 0, k = left;
  while (i < n1 && j < n2) {
    if (L[i] <= R[j]) arr[k++] = L[i++];
    else arr[k++] = R[j++];
  }
  while (i < n1) arr[k++] = L[i++];
  while (j < n2) arr[k++] = R[j++];
}`,
  generateSteps: (input: number[]): VisualizationEvent[] => {
    const steps: VisualizationEvent[] = [];
    const arr = [...input];

    const sort = (l: number, r: number, depth: number) => {
      if (l >= r) {
        steps.push({
          type: 'HIGHLIGHT',
          indices: [l],
          description: `Base case reached: index ${l} is a single element.`,
          codeLine: 2,
          variables: { left: l, right: r, depth }
        });
        return;
      }

      const mid = Math.floor((l + r) / 2);

      steps.push({
        type: 'SUBARRAY_FOCUS',
        indices: Array.from({ length: r - l + 1 }, (_, i) => l + i),
        description: `Dividing subarray [${l}...${r}] at mid index ${mid}`,
        codeLine: 4,
        variables: { left: l, right: r, mid, depth }
      });

      sort(l, mid, depth + 1);
      sort(mid + 1, r, depth + 1);
      merge(l, mid, r, depth);
    };

    const merge = (l: number, mid: number, r: number, depth: number) => {
      const leftArr = arr.slice(l, mid + 1);
      const rightArr = arr.slice(mid + 1, r + 1);

      steps.push({
        type: 'SUBARRAY_FOCUS',
        indices: Array.from({ length: r - l + 1 }, (_, i) => l + i),
        description: `Merging subarrays [${l}...${mid}] and [${mid + 1}...${r}]`,
        codeLine: 7,
        variables: { left: l, right: r, mid, depth }
      });

      let i = 0, j = 0, k = l;

      while (i < leftArr.length && j < rightArr.length) {
        steps.push({
          type: 'COMPARE',
          indices: [l + i, mid + 1 + j],
          description: `Compare ${leftArr[i]} and ${rightArr[j]}`,
          codeLine: 18,
          variables: { i, j, k, leftVal: leftArr[i], rightVal: rightArr[j] }
        });

        if (leftArr[i] <= rightArr[j]) {
          arr[k] = leftArr[i];
          steps.push({
            type: 'MERGE_STEP',
            indices: [k],
            description: `Place ${leftArr[i]} from left sublist into index ${k}`,
            codeLine: 18,
            variables: { i, j, k, array: [...arr] }
          });
          i++;
        } else {
          arr[k] = rightArr[j];
          steps.push({
            type: 'MERGE_STEP',
            indices: [k],
            description: `Place ${rightArr[j]} from right sublist into index ${k}`,
            codeLine: 19,
            variables: { i, j, k, array: [...arr] }
          });
          j++;
        }
        k++;
      }

      while (i < leftArr.length) {
        arr[k] = leftArr[i];
        steps.push({
          type: 'MERGE_STEP',
          indices: [k],
          description: `Copy remaining element ${leftArr[i]} from left sublist`,
          codeLine: 21,
          variables: { i, k, array: [...arr] }
        });
        i++;
        k++;
      }

      while (j < rightArr.length) {
        arr[k] = rightArr[j];
        steps.push({
          type: 'MERGE_STEP',
          indices: [k],
          description: `Copy remaining element ${rightArr[j]} from right sublist`,
          codeLine: 22,
          variables: { j, k, array: [...arr] }
        });
        j++;
        k++;
      }

      steps.push({
        type: 'MARK_SORTED',
        indices: Array.from({ length: r - l + 1 }, (_, i) => l + i),
        description: `Subarray [${l}...${r}] successfully merged and sorted!`,
        codeLine: 23,
        variables: { left: l, right: r, array: [...arr] }
      });
    };

    sort(0, arr.length - 1, 0);

    steps.push({
      type: 'MARK_SORTED',
      indices: Array.from({ length: arr.length }, (_, i) => i),
      description: `Algorithm complete! The array is fully sorted.`,
      codeLine: 1,
      variables: { array: [...arr] }
    });

    return steps;
  },
};
