import { AlgorithmDefinition, VisualizationEvent } from '@/types/algorithm';

export const linearSearch: AlgorithmDefinition = {
  id: 'linear-search',
  name: 'Linear Search',
  category: 'Searching',
  difficulty: 'Easy',
  description: 'Linear search sequentially checks each element of the list until a match is found or the whole list has been searched.',
  complexities: {
    time: 'O(n)',
    space: 'O(1)',
  },
  visualizationType: 'BAR',
  defaultInput: { array: [10, 50, 30, 70, 80, 60, 20, 90, 40], target: 20 },
  code: {
    cpp: `class Solution {
public:
    int search(int arr[], int n, int x) {
        for (int i = 0; i < n; i++)
            if (arr[i] == x) return i;
        return -1;
    }
};`,
    java: `class Solution {
    public int search(int arr[], int x) {
        for (int i = 0; i < arr.length; i++)
            if (arr[i] == x) return i;
        return -1;
    }
}`,
    python: `class Solution:
    def search(self, arr, x):
        for i in range(len(arr)):
            if arr[i] == x: return i
        return -1`,
    javascript: `class Solution {
    linearSearch(arr, target) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === target) return i;
        }
        return -1;
    }
}`,
    kotlin: `class Solution {
    fun search(arr: IntArray, x: Int): Int {
        for (i in arr.indices)
            if (arr[i] == x) return i
        return -1
    }
}`
  },
  generateSteps: (input: { array: number[], target: number }): VisualizationEvent[] => {
    const steps: VisualizationEvent[] = [];
    const { array, target } = input;

    for (let i = 0; i < array.length; i++) {
      steps.push({
        type: 'COMPARE',
        indices: [i],
        description: `Check if index ${i} matches the target ${target}`,
        codeLine: 3,
        variables: { i, target, current: array[i] }
      });

      if (array[i] === target) {
        steps.push({
          type: 'MARK_SORTED',
          indices: [i],
          description: `Target ${target} found at index ${i}!`,
          codeLine: 4,
          variables: { i, target }
        });
        return steps;
      }

      steps.push({
        type: 'VISIT',
        indices: [i],
        description: `Index ${i} does not match`,
        codeLine: 2,
        variables: { i }
      });
    }

    steps.push({
      type: 'HIGHLIGHT',
      indices: [],
      description: `Target ${target} not found in the array`,
      codeLine: 7,
      variables: { target }
    });

    return steps;
  },
};
