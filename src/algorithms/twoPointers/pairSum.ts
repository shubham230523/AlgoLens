import { AlgorithmDefinition, VisualizationEvent } from '@/types/algorithm';

export const pairSum: AlgorithmDefinition = {
  id: 'pair-sum',
  name: 'Pair Sum (Sorted)',
  category: 'Two Pointers',
  difficulty: 'Easy',
  description: 'Find a pair of elements in a sorted array that sum to a target value.',
  complexities: { time: 'O(n)', space: 'O(1)' },
  visualizationType: 'BAR',
  defaultInput: { array: [1, 2, 4, 6, 8, 9, 14, 15], target: 14 },
  code: {
    cpp: `bool hasPairSum(int arr[], int n, int sum) {
    int l = 0, r = n - 1;
    while (l < r) {
        if (arr[l] + arr[r] == sum) return true;
        else if (arr[l] + arr[r] < sum) l++;
        else r--;
    }
    return false;
}`,
    java: `public boolean hasPairSum(int[] arr, int sum) {
    int l = 0, r = arr.length - 1;
    while (l < r) {
        if (arr[l] + arr[r] == sum) return true;
        else if (arr[l] + arr[r] < sum) l++;
        else r--;
    }
    return false;
}`,
    python: `def has_pair_sum(arr, target):
    l, r = 0, len(arr) - 1
    while l < r:
        s = arr[l] + arr[r]
        if s == target: return True
        if s < target: l += 1
        else: r -= 1
    return False`,
    javascript: `function hasPairSum(arr, target) {
    let l = 0, r = arr.length - 1;
    while (l < r) {
        let sum = arr[l] + arr[r];
        if (sum === target) return true;
        if (sum < target) l++;
        else r--;
    }
    return false;
}`,
    kotlin: `fun hasPairSum(arr: IntArray, target: Int): Boolean {
    var l = 0; var r = arr.size - 1
    while (l < r) {
        val s = arr[l] + arr[r]
        if (s == target) return true
        if (s < target) l++ else r--
    }
    return false
}`
  },
  generateSteps: (input: { array: number[], target: number }): VisualizationEvent[] => {
    const steps: VisualizationEvent[] = [];
    const { array, target } = input;
    let l = 0;
    let r = array.length - 1;

    while (l < r) {
      const sum = array[l] + array[r];

      steps.push({
        type: 'COMPARE',
        indices: [l, r],
        description: `Checking pointers: ${array[l]} + ${array[r]} = ${sum}`,
        codeLine: 4,
        variables: { l, r, sum, target }
      });

      if (sum === target) {
        steps.push({
          type: 'MARK_SORTED',
          indices: [l, r],
          description: `Found pair! ${array[l]} + ${array[r]} = ${target}`,
          codeLine: 4,
          variables: { l, r, target }
        });
        return steps;
      }

      if (sum < target) {
        steps.push({
          type: 'VISIT',
          indices: [l],
          description: `${sum} < ${target}, moving left pointer forward`,
          codeLine: 5,
          variables: { l, r, sum, target }
        });
        l++;
      } else {
        steps.push({
          type: 'VISIT',
          indices: [r],
          description: `${sum} > ${target}, moving right pointer backward`,
          codeLine: 6,
          variables: { l, r, sum, target }
        });
        r--;
      }
    }

    steps.push({
      type: 'HIGHLIGHT',
      indices: [],
      description: `No pair found that sums to ${target}`,
      codeLine: 8,
      variables: { target }
    });

    return steps;
  }
};
