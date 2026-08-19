import { AlgorithmDefinition, VisualizationEvent } from '@/types/algorithm';

export const binarySearch: AlgorithmDefinition = {
  id: 'binary-search',
  name: 'Binary Search',
  category: 'Searching',
  difficulty: 'Easy',
  description: 'Binary search finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.',
  complexities: {
    time: 'O(log n)',
    space: 'O(1)',
  },
  visualizationType: 'BAR',
  defaultInput: { array: [10, 20, 30, 40, 50, 60, 70, 80, 90], target: 70 },
  code: {
    cpp: `int binarySearch(int arr[], int n, int target) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
    java: `public int binarySearch(int[] arr, int target) {
    int low = 0, high = arr.length - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
    python: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        if arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
    javascript: `function binarySearch(arr, target) {
  let low = 0, high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
    kotlin: `fun binarySearch(arr: IntArray, target: Int): Int {
    var low = 0; var high = arr.size - 1
    while (low <= high) {
        val mid = low + (high - low) / 2
        if (arr[mid] == target) return mid
        if (arr[mid] < target) low = mid + 1
        else high = mid - 1
    }
    return -1
}`
  },
  generateSteps: (input: { array: number[], target: number }): VisualizationEvent[] => {
    const steps: VisualizationEvent[] = [];
    const { array, target } = input;

    let low = 0;
    let high = array.length - 1;

    steps.push({
      type: 'HIGHLIGHT',
      indices: [],
      description: `Searching for \${target} in the array`,
      codeLine: 1,
      variables: { target, low, high }
    });

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);

      steps.push({
        type: 'SUBARRAY_FOCUS',
        indices: Array.from({ length: high - low + 1 }, (_, i) => low + i),
        description: \`Current search range: [\${low}, \${high}]\`,
        codeLine: 3,
        variables: { low, high, mid }
      });

      steps.push({
        type: 'COMPARE',
        indices: [mid],
        description: \`Calculating mid: index \${mid} (value \${array[mid]})\`,
        codeLine: 4,
        variables: { low, high, mid, target, current: array[mid] }
      });

      if (array[mid] === target) {
        steps.push({
          type: 'MARK_SORTED',
          indices: [mid],
          description: \`Target \${target} found at index \${mid}!\`,
          codeLine: 5,
          variables: { mid, target }
        });
        return steps;
      }

      if (array[mid] < target) {
        steps.push({
          type: 'VISIT',
          indices: Array.from({ length: mid - low + 1 }, (_, i) => low + i),
          description: \`\${array[mid]} < \${target}, focusing on the right half\`,
          codeLine: 6,
          variables: { low, high, mid, target }
        });
        low = mid + 1;
      } else {
        steps.push({
          type: 'VISIT',
          indices: Array.from({ length: high - mid + 1 }, (_, i) => mid + i),
          description: \`\${array[mid]} > \${target}, focusing on the left half\`,
          codeLine: 7,
          variables: { low, high, mid, target }
        });
        high = mid - 1;
      }
    }

    steps.push({
      type: 'HIGHLIGHT',
      indices: [],
      description: \`Target \${target} not found in the array\`,
      codeLine: 9,
      variables: { target }
    });

    return steps;
  },
};
