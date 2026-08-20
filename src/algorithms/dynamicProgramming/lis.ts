import { AlgorithmDefinition, VisualizationEvent } from '@/types/algorithm';

export const lis: AlgorithmDefinition = {
  id: 'lis',
  name: 'Longest Increasing Subsequence',
  category: 'Dynamic Programming',
  difficulty: 'Medium',
  description: 'Find the length of the longest subsequence of a given sequence such that all elements of the subsequence are sorted in increasing order.',
  complexities: { time: 'O(n²)', space: 'O(n)' },
  visualizationType: 'BAR',
  defaultInput: [10, 22, 9, 33, 21, 50, 41, 60, 80],
  code: {
    cpp: `int lis(int arr[], int n) {
    int lis[n];
    fill(lis, lis + n, 1);
    for (int i = 1; i < n; i++)
        for (int j = 0; j < i; j++)
            if (arr[i] > arr[j] && lis[i] < lis[j] + 1)
                lis[i] = lis[j] + 1;
    return *max_element(lis, lis + n);
}`,
    java: `int lis(int[] arr) {
    int n = arr.length;
    int[] lis = new int[n];
    Arrays.fill(lis, 1);
    for (int i = 1; i < n; i++)
        for (int j = 0; j < i; j++)
            if (arr[i] > arr[j] && lis[i] < lis[j] + 1)
                lis[i] = lis[j] + 1;
    return Arrays.stream(lis).max().getAsInt();
}`,
    python: `def lis(arr):
    n = len(arr)
    dp = [1] * n
    for i in range(1, n):
        for j in range(i):
            if arr[i] > arr[j] and dp[i] < dp[j] + 1:
                dp[i] = dp[j] + 1
    return max(dp)`,
    javascript: `function lis(arr) {
    let n = arr.length;
    let dp = new Array(n).fill(1);
    for (let i = 1; i < n; i++) {
        for (let j = 0; j < i; j++) {
            if (arr[i] > arr[j] && dp[i] < dp[j] + 1) {
                dp[i] = dp[j] + 1;
            }
        }
    }
    return Math.max(...dp);
}`,
    kotlin: `fun lis(arr: IntArray): Int {
    val n = arr.size
    val dp = IntArray(n) { 1 }
    for (i in 1 until n)
        for (j in 0 until i)
            if (arr[i] > arr[j] && dp[i] < dp[j] + 1)
                dp[i] = dp[j] + 1
    return dp.maxOrNull() ?: 0
}`
  },
  generateSteps: (input: number[]): VisualizationEvent[] => {
    const steps: VisualizationEvent[] = [];
    const n = input.length;
    const dp = new Array(n).fill(1);

    steps.push({
      type: 'HIGHLIGHT',
      indices: [],
      description: 'Initializing LIS array with 1s',
      codeLine: 3,
      variables: { dp: [...dp] }
    });

    for (let i = 1; i < n; i++) {
      steps.push({
        type: 'SELECT',
        indices: [i],
        description: `Processing element ${input[i]} at index ${i}`,
        codeLine: 4,
        variables: { i, val: input[i] }
      });

      for (let j = 0; j < i; j++) {
        steps.push({
          type: 'COMPARE',
          indices: [i, j],
          description: `Comparing ${input[i]} with ${input[j]}`,
          codeLine: 6,
          variables: { i, j, valI: input[i], valJ: input[j], dpI: dp[i], dpJ: dp[j] }
        });

        if (input[i] > input[j] && dp[i] < dp[j] + 1) {
          dp[i] = dp[j] + 1;
          steps.push({
            type: 'UPDATE_VALUE',
            indices: [i],
            description: `Found increasing subsequence! Updating dp[${i}] to ${dp[i]}`,
            codeLine: 7,
            variables: { dp: [...dp] }
          });
        }
      }

      steps.push({
        type: 'MARK_SORTED',
        indices: [i],
        description: `Final LIS value for index ${i} is ${dp[i]}`,
        codeLine: 4,
        variables: { i, result: dp[i] }
      });
    }

    return steps;
  }
};
