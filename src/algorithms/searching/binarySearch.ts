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
  code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid;
    }
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}`,
  generateSteps: (input: { array: number[], target: number }): VisualizationEvent[] => {
    const steps: VisualizationEvent[] = [];
    const { array, target } = input;

    let left = 0;
    let right = array.length - 1;

    steps.push({
      type: 'HIGHLIGHT',
      indices: [],
      description: `Searching for ${target} in the array`,
      codeLine: 1,
      variables: { target, left, right }
    });

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      steps.push({
        type: 'SUBARRAY_FOCUS',
        indices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
        description: `Current search range: [${left}, ${right}]`,
        codeLine: 4,
        variables: { left, right, mid }
      });

      steps.push({
        type: 'COMPARE',
        indices: [mid],
        description: `Calculating mid: index ${mid} (value ${array[mid]})`,
        codeLine: 5,
        variables: { left, right, mid, target, current: array[mid] }
      });

      if (array[mid] === target) {
        steps.push({
          type: 'MARK_SORTED',
          indices: [mid],
          description: `Target ${target} found at index ${mid}!`,
          codeLine: 6,
          variables: { mid, target }
        });
        return steps;
      }

      if (array[mid] < target) {
        steps.push({
          type: 'VISIT',
          indices: Array.from({ length: mid - left + 1 }, (_, i) => left + i),
          description: `${array[mid]} < ${target}, focusing on the right half`,
          codeLine: 7,
          variables: { left, right, mid, target }
        });
        left = mid + 1;
      } else {
        steps.push({
          type: 'VISIT',
          indices: Array.from({ length: right - mid + 1 }, (_, i) => mid + i),
          description: `${array[mid]} > ${target}, focusing on the left half`,
          codeLine: 8,
          variables: { left, right, mid, target }
        });
        right = mid - 1;
      }
    }

    steps.push({
      type: 'HIGHLIGHT',
      indices: [],
      description: `Target ${target} not found in the array`,
      codeLine: 10,
      variables: { target }
    });

    return steps;
  },
};
