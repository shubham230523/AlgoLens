import { AlgorithmDefinition, VisualizationEvent } from '@/types/algorithm';

export const nQueens: AlgorithmDefinition = {
  id: 'n-queens',
  name: 'N-Queens',
  category: 'Backtracking',
  difficulty: 'Hard',
  description: 'Place N queens on an NxN chessboard such that no two queens attack each other.',
  complexities: { time: 'O(N!)', space: 'O(N)' },
  visualizationType: 'BAR', // Board will be visualized as a flat array for now, simplified
  defaultInput: 4,
  getInitialData: (n: number) => new Array(n * n).fill(0),
  code: {
    cpp: `bool solve(int col) {
    if (col >= N) return true;
    for (int i = 0; i < N; i++) {
        if (isSafe(i, col)) {
            board[i][col] = 1;
            if (solve(col + 1)) return true;
            board[i][col] = 0; // Backtrack
        }
    }
    return false;
}`,
    java: `boolean solve(int col) {
    if (col >= N) return true;
    for (int i = 0; i < N; i++) {
        if (isSafe(i, col)) {
            board[i][col] = 1;
            if (solve(col + 1)) return true;
            board[i][col] = 0;
        }
    }
    return false;
}`,
    python: `def solve(col):
    if col >= N: return True
    for i in range(N):
        if is_safe(i, col):
            board[i][col] = 1
            if solve(col + 1): return True
            board[i][col] = 0
    return False`,
    javascript: `function solve(col) {
    if (col >= N) return true;
    for (let i = 0; i < N; i++) {
        if (isSafe(i, col)) {
            board[i][col] = 1;
            if (solve(col + 1)) return true;
            board[i][col] = 0;
        }
    }
    return false;
}`,
    kotlin: `fun solve(col: Int): Boolean {
    if (col >= N) return true
    for (i in 0 until N) {
        if (isSafe(i, col)) {
            board[i][col] = 1
            if (solve(col + 1)) return true
            board[i][col] = 0
        }
    }
    return false
}`
  },
  generateSteps: (n: number): VisualizationEvent[] => {
    const steps: VisualizationEvent[] = [];
    const board = Array.from({ length: n }, () => new Array(n).fill(0));

    function isSafe(row: number, col: number) {
      for (let i = 0; i < col; i++) if (board[row][i]) return false;
      for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) if (board[i][j]) return false;
      for (let i = row, j = col; j >= 0 && i < n; i++, j--) if (board[i][j]) return false;
      return true;
    }

    function solve(col: number) {
      if (col >= n) {
        steps.push({
          type: 'MARK_SORTED',
          indices: [],
          description: `All ${n} queens placed successfully!`,
          codeLine: 2,
          variables: { col, array: board.flat() }
        });
        return true;
      }

      for (let i = 0; i < n; i++) {
        const flatIdx = i * n + col;
        steps.push({
          type: 'COMPARE',
          indices: [flatIdx],
          description: `Checking if row ${i}, col ${col} is safe`,
          codeLine: 4,
          variables: { row: i, col, array: board.flat() }
        });

        if (isSafe(i, col)) {
          board[i][col] = 1;
          steps.push({
            type: 'SELECT',
            indices: [flatIdx],
            description: `Placed queen at (${i}, ${col})`,
            codeLine: 5,
            variables: { row: i, col, array: board.flat() }
          });

          if (solve(col + 1)) return true;

          board[i][col] = 0;
          steps.push({
            type: 'VISIT',
            indices: [flatIdx],
            description: `Backtracking from (${i}, ${col})`,
            codeLine: 7,
            variables: { row: i, col, array: board.flat() }
          });
        }
      }
      return false;
    }

    solve(0);
    return steps;
  }
};
