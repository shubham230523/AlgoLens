import { AlgorithmDefinition, VisualizationEvent } from '@/types/algorithm';

export const knapsack01: AlgorithmDefinition = {
  id: 'knapsack-01',
  name: '0/1 Knapsack',
  category: 'Dynamic Programming',
  difficulty: 'Hard',
  description: 'Maximize the total value of items in a knapsack with a weight limit.',
  complexities: { time: 'O(N*W)', space: 'O(N*W)' },
  visualizationType: 'BAR', // Using BAR to show weights/values, though DP usually uses a table
  defaultInput: { weights: [1, 2, 3], values: [10, 15, 40], capacity: 6 },
  getInitialData: (input: { weights: number[], values: number[], capacity: number }) => new Array(input.capacity + 1).fill(0),
  code: {
    cpp: `int knapsack(int W, int wt[], int val[], int n) {
    int dp[n + 1][W + 1];
    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= W; w++) {
            if (wt[i - 1] <= w)
                dp[i][w] = max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w]);
            else dp[i][w] = dp[i - 1][w];
        }
    }
    return dp[n][W];
}`,
    java: `int knapsack(int W, int[] wt, int[] val, int n) {
    int[][] dp = new int[n + 1][W + 1];
    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= W; w++) {
            if (wt[i - 1] <= w)
                dp[i][w] = Math.max(val[i-1] + dp[i-1][w-wt[i-1]], dp[i-1][w]);
            else dp[i][w] = dp[i-1][w];
        }
    }
    return dp[n][W];
}`,
    python: `def knapsack(W, wt, val, n):
    dp = [[0 for _ in range(W + 1)] for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(1, W + 1):
            if wt[i-1] <= w:
                dp[i][w] = max(val[i-1] + dp[i-1][w-wt[i-1]], dp[i-1][w])
            else:
                dp[i][w] = dp[i-1][w]
    return dp[n][W]`,
    javascript: `function knapsack(W, wt, val, n) {
    let dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));
    for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= W; w++) {
            if (wt[i - 1] <= w) {
                dp[i][w] = Math.max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w]);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    return dp[n][W];
}`,
    kotlin: `fun knapsack(W: Int, wt: IntArray, valArr: IntArray, n: Int): Int {
    val dp = Array(n + 1) { IntArray(W + 1) }
    for (i in 1..n) {
        for (w in 1..W) {
            if (wt[i - 1] <= w)
                dp[i][w] = maxOf(valArr[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w])
            else dp[i][w] = dp[i - 1][w]
        }
    }
    return dp[n][W]
}`
  },
  generateSteps: (input: { weights: number[], values: number[], capacity: number }): VisualizationEvent[] => {
    const steps: VisualizationEvent[] = [];
    const { weights, values, capacity } = input;
    const n = weights.length;
    const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));

    for (let i = 1; i <= n; i++) {
      steps.push({
        type: 'HIGHLIGHT',
        indices: [],
        description: `Processing item ${i} (Weight: ${weights[i - 1]}, Value: ${values[i - 1]})`,
        codeLine: 4,
        variables: { item: i, weight: weights[i - 1], value: values[i - 1], array: [...dp[i-1]] }
      });

      for (let w = 1; w <= capacity; w++) {
        if (weights[i - 1] <= w) {
          const include = values[i - 1] + dp[i - 1][w - weights[i - 1]];
          const exclude = dp[i - 1][w];
          dp[i][w] = Math.max(include, exclude);

          steps.push({
            type: 'UPDATE_VALUE',
            indices: [w],
            description: `At capacity ${w}: Max(Include: ${include}, Exclude: ${exclude}) = ${dp[i][w]}`,
            codeLine: 6,
            variables: { currentCapacity: w, include, exclude, result: dp[i][w], array: [...dp[i]] }
          });
        } else {
          dp[i][w] = dp[i - 1][w];
          steps.push({
            type: 'VISIT',
            indices: [w],
            description: `At capacity ${w}: Weight ${weights[i-1]} too large. Carrying forward ${dp[i][w]}`,
            codeLine: 7,
            variables: { currentCapacity: w, result: dp[i][w], array: [...dp[i]] }
          });
        }
      }
    }

    steps.push({
      type: 'MARK_SORTED',
      indices: Array.from({ length: n }, (_, i) => i),
      description: `Optimal value found: ${dp[n][capacity]}`,
      codeLine: 10,
      variables: { totalValue: dp[n][capacity] }
    });

    return steps;
  }
};
