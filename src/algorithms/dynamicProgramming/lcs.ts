import { AlgorithmDefinition, VisualizationEvent } from '@/types/algorithm';

export const lcs: AlgorithmDefinition = {
  id: 'lcs',
  name: 'Longest Common Subsequence',
  category: 'Dynamic Programming',
  difficulty: 'Medium',
  description: 'Find the longest sequence that appears in both strings in the same order.',
  complexities: { time: 'O(m*n)', space: 'O(m*n)' },
  visualizationType: 'BAR', // Will visualize as two arrays or a progress of matching
  defaultInput: { text1: 'abcde', text2: 'ace' },
  code: {
    cpp: `int lcs(string s1, string s2) {
    int m = s1.size(), n = s2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            if (s1[i-1] == s2[j-1]) dp[i][j] = 1 + dp[i-1][j-1];
            else dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
    return dp[m][n];
}`,
    java: `int lcs(String s1, String s2) {
    int m = s1.length(), n = s2.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            if (s1.charAt(i-1) == s2.charAt(j-1)) dp[i][j] = 1 + dp[i-1][j-1];
            else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
    return dp[m][n];
}`,
    python: `def lcs(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0]*(n+1) for _ in range(m+1)]
    for i in range(1, m+1):
        for j in range(1, n+1):
            if s1[i-1] == s2[j-1]: dp[i][j] = 1 + dp[i-1][j-1]
            else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]`,
    javascript: `function lcs(s1, s2) {
    let m = s1.length, n = s2.length;
    let dp = Array.from({length: m+1}, () => Array(n+1).fill(0));
    for (let i = 1; i <= m; i++)
        for (let j = 1; j <= n; j++)
            if (s1[i-1] === s2[j-1]) dp[i][j] = 1 + dp[i-1][j-1];
            else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
    return dp[m][n];
}`,
    kotlin: `fun lcs(s1: String, s2: String): Int {
    val m = s1.length; val n = s2.length
    val dp = Array(m + 1) { IntArray(n + 1) }
    for (i in 1..m)
        for (j in 1..n)
            if (s1[i-1] == s2[j-1]) dp[i][j] = 1 + dp[i-1][j-1]
            else dp[i][j] = maxOf(dp[i-1][j], dp[i][j-1])
    return dp[m][n]
}`
  },
  generateSteps: (input: { text1: string, text2: string }): VisualizationEvent[] => {
    const steps: VisualizationEvent[] = [];
    const { text1, text2 } = input;
    const m = text1.length;
    const n = text2.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        steps.push({
          type: 'COMPARE',
          indices: [i - 1, j - 1], // Mapping to chars in strings
          description: `Comparing '${text1[i - 1]}' and '${text2[j - 1]}'`,
          codeLine: 5,
          variables: { i, j, char1: text1[i-1], char2: text2[j-1] }
        });

        if (text1[i - 1] === text2[j - 1]) {
          dp[i][j] = 1 + dp[i - 1][j - 1];
          steps.push({
            type: 'SELECT',
            indices: [i - 1, j - 1],
            description: `Match! LCS length becomes ${dp[i][j]}`,
            codeLine: 5,
            variables: { lcs: dp[i][j] }
          });
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
          steps.push({
            type: 'VISIT',
            indices: [i - 1, j - 1],
            description: `No match. Taking max(dp[i-1][j], dp[i][j-1]) = ${dp[i][j]}`,
            codeLine: 6,
            variables: { lcs: dp[i][j] }
          });
        }
      }
    }

    steps.push({
      type: 'MARK_SORTED',
      indices: [],
      description: `LCS length is ${dp[m][n]}`,
      codeLine: 8,
      variables: { result: dp[m][n] }
    });

    return steps;
  }
};
