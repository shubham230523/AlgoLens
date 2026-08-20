import { AlgorithmDefinition, VisualizationEvent } from '@/types/algorithm';

export const maxSumSubarray: AlgorithmDefinition = {
  id: 'max-sum-subarray',
  name: 'Max Sum Subarray (K)',
  category: 'Sliding Window',
  difficulty: 'Easy',
  description: 'Find the maximum sum of any contiguous subarray of size K.',
  complexities: { time: 'O(n)', space: 'O(1)' },
  visualizationType: 'BAR',
  defaultInput: { array: [2, 1, 5, 1, 3, 2], k: 3 },
  code: {
    cpp: `int maxSubarraySum(vector<int>& arr, int k) {
    int max_sum = 0, window_sum = 0;
    for (int i = 0; i < k; i++) window_sum += arr[i];
    max_sum = window_sum;
    for (int i = k; i < arr.size(); i++) {
        window_sum += arr[i] - arr[i - k];
        max_sum = max(max_sum, window_sum);
    }
    return max_sum;
}`,
    java: `public int maxSubarraySum(int[] arr, int k) {
    int maxSum = 0, windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += arr[i];
    maxSum = windowSum;
    for (int i = k; i < arr.length; i++) {
        windowSum += arr[i] - arr[i - k];
        maxSum = Math.max(maxSum, windowSum);
    }
    return maxSum;
}`,
    python: `def max_subarray_sum(arr, k):
    window_sum = sum(arr[:k])
    max_sum = window_sum
    for i in range(len(arr) - k):
        window_sum = window_sum - arr[i] + arr[i+k]
        max_sum = max(max_sum, window_sum)
    return max_sum`,
    javascript: `function maxSubarraySum(arr, k) {
    let windowSum = 0, maxSum = 0;
    for (let i = 0; i < k; i++) windowSum += arr[i];
    maxSum = windowSum;
    for (let i = k; i < arr.length; i++) {
        windowSum += arr[i] - arr[i - k];
        maxSum = Math.max(maxSum, windowSum);
    }
    return maxSum;
}`,
    kotlin: `fun maxSubarraySum(arr: IntArray, k: Int): Int {
    var windowSum = arr.take(k).sum()
    var maxSum = windowSum
    for (i in k until arr.size) {
        windowSum += arr[i] - arr[i - k]
        maxSum = maxOf(maxSum, windowSum)
    }
    return maxSum
}`
  },
  generateSteps: (input: { array: number[], k: number }): VisualizationEvent[] => {
    const steps: VisualizationEvent[] = [];
    const { array, k } = input;
    let windowSum = 0;
    let maxSum = 0;

    steps.push({
      type: 'HIGHLIGHT',
      indices: Array.from({ length: k }, (_, i) => i),
      description: `Initializing first window of size ${k}`,
      codeLine: 3,
      variables: { k }
    });

    for (let i = 0; i < k; i++) {
      windowSum += array[i];
      steps.push({
        type: 'VISIT',
        indices: [i],
        description: `Adding ${array[i]} to initial window sum`,
        codeLine: 3,
        variables: { i, windowSum }
      });
    }
    maxSum = windowSum;

    for (let i = k; i < array.length; i++) {
      steps.push({
        type: 'SUBARRAY_FOCUS',
        indices: Array.from({ length: k }, (_, j) => i - k + j),
        description: `Sliding window: Current max is ${maxSum}`,
        codeLine: 5,
        variables: { i, maxSum, windowSum }
      });

      windowSum += array[i] - array[i - k];

      steps.push({
        type: 'COMPARE',
        indices: [i, i - k],
        description: `Subtracting ${array[i-k]} and adding ${array[i]}`,
        codeLine: 6,
        variables: { i, windowSum, removed: array[i-k], added: array[i] }
      });

      if (windowSum > maxSum) {
        maxSum = windowSum;
        steps.push({
          type: 'SELECT',
          indices: Array.from({ length: k }, (_, j) => i - k + 1 + j),
          description: `New maximum sum found: ${maxSum}`,
          codeLine: 7,
          variables: { maxSum }
        });
      }
    }

    steps.push({
      type: 'MARK_SORTED',
      indices: [], // Highlight result
      description: `Final maximum sum: ${maxSum}`,
      codeLine: 9,
      variables: { maxSum }
    });

    return steps;
  }
};
