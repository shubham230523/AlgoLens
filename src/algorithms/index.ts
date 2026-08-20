import { AlgorithmDefinition } from '@/types/algorithm';
import { bubbleSort } from './sorting/bubbleSort';
import { selectionSort } from './sorting/selectionSort';
import { insertionSort } from './sorting/insertionSort';
import { mergeSort } from './sorting/mergeSort';
import { linearSearch } from './searching/linearSearch';
import { binarySearch } from './searching/binarySearch';
import { bstSearch } from './trees/bstSearch';
import { bfs } from './graphs/bfs';
import { dfs } from './graphs/dfs';

import { preorderTraversal, inorderTraversal, postorderTraversal } from './trees/treeTraversals';
import { dijkstra } from './graphs/dijkstra';
import { knapsack01 } from './dynamicProgramming/knapsack';
import { fibonacciDP } from './dynamicProgramming/fibonacci';
import { maxSumSubarray } from './slidingWindow/maxSumSubarray';
import { pairSum } from './twoPointers/pairSum';
import { nQueens } from './backtracking/nQueens';
import { activitySelection } from './greedy/activitySelection';

import { quickSort } from './sorting/quickSort';
import { heapSort } from './sorting/heapSort';
import { lcs } from './dynamicProgramming/lcs';

export * from './learningPaths';

export const ALL_ALGORITHMS: AlgorithmDefinition[] = [
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
  linearSearch,
  binarySearch,
  bstSearch,
  preorderTraversal,
  inorderTraversal,
  postorderTraversal,
  bfs,
  dfs,
  dijkstra,
  knapsack01,
  fibonacciDP,
  lcs,
  maxSumSubarray,
  pairSum,
  nQueens,
  activitySelection,
];

export const CATEGORIES = [
  'Sorting Algorithm',
  'Searching Algorithm',
  'Trees',
  'Graphs',
  'Dynamic Programming',
  'Backtracking',
  'Greedy Algorithm',
  'Sliding Window',
  'Two Pointers',
  'Stack / Monotonic Deque',
  'Linked List',
];

export const getAlgorithmById = (id: string) =>
  ALL_ALGORITHMS.find(algo => algo.id === id);

export const getAlgorithmsByCategory = (category: string) =>
  ALL_ALGORITHMS.filter(algo => algo.category === category);
