import { AlgorithmDefinition, VisualizationEvent } from '@/types/algorithm';

export const fibonacciDP: AlgorithmDefinition = {
  id: 'fibonacci-dp',
  name: 'Fibonacci (Linear DP)',
  category: 'Dynamic Programming',
  difficulty: 'Easy',
  description: 'Calculates the n-th Fibonacci number using a bottom-up dynamic programming approach.',
  complexities: { time: 'O(n)', space: 'O(n)' },
  visualizationType: 'BAR',
  defaultInput: 10,
  code: {
    cpp: `int fib(int n) {
    if (n <= 1) return n;
    int dp[n + 1];
    dp[0] = 0; dp[1] = 1;
    for (int i = 2; i <= n; i++)
        dp[i] = dp[i-1] + dp[i-2];
    return dp[n];
}`,
    java: `int fib(int n) {
    if (n <= 1) return n;
    int[] dp = new int[n + 1];
    dp[0] = 0; dp[1] = 1;
    for (int i = 2; i <= n; i++)
        dp[i] = dp[i-1] + dp[i-2];
    return dp[n];
}`,
    python: `def fib(n):
    if n <= 1: return n
    dp = [0] * (n + 1)
    dp[0], dp[1] = 0, 1
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]`,
    javascript: `function fib(n) {
    if (n <= 1) return n;
    let dp = [0, 1];
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    return dp[n];
}`,
    kotlin: `fun fib(n: Int): Int {
    if (n <= 1) return n
    val dp = IntArray(n + 1)
    dp[0] = 0; dp[1] = 1
    for (i in 2..n)
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]
}`
  },
  generateSteps: (n: number): VisualizationEvent[] => {
    const steps: VisualizationEvent[] = [];
    const dp = new Array(n + 1).fill(0);
    dp[1] = 1;

    steps.push({
      type: 'MARK_SORTED',
      indices: [0, 1],
      description: 'Base cases: fib(0)=0, fib(1)=1',
      codeLine: 4,
      variables: { dp: [0, 1] }
    });

    for (let i = 2; i <= n; i++) {
      steps.push({
        type: 'COMPARE',
        indices: [i - 1, i - 2],
        description: `Summing fib(${i-1}) and fib(${i-2})`,
        codeLine: 6,
        variables: { i, prev1: dp[i-1], prev2: dp[i-2] }
      });

      dp[i] = dp[i - 1] + dp[i - 2];

      steps.push({
        type: 'UPDATE_VALUE',
        indices: [i],
        description: `fib(${i}) = ${dp[i]}`,
        codeLine: 6,
        variables: { array: [...dp], result: dp[i] }
      });
    }

    return steps;
  }
};
