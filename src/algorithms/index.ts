import { AlgorithmDefinition } from '@/types/algorithm';
import { bubbleSort } from './sorting/bubbleSort';
import { selectionSort } from './sorting/selectionSort';
import { insertionSort } from './sorting/insertionSort';
import { linearSearch } from './searching/linearSearch';
import { binarySearch } from './searching/binarySearch';
import { bstSearch } from './trees/bstSearch';

export * from './learningPaths';

export const ALL_ALGORITHMS: AlgorithmDefinition[] = [
  bubbleSort,
  selectionSort,
  insertionSort,
  linearSearch,
  binarySearch,
  bstSearch,
];

export const CATEGORIES = [
  'Sorting',
  'Searching',
  'Arrays',
  'Linked Lists',
  'Stacks',
  'Queues',
  'Trees',
  'Graphs',
  'Recursion',
  'Dynamic Programming',
];

export const getAlgorithmById = (id: string) =>
  ALL_ALGORITHMS.find(algo => algo.id === id);

export const getAlgorithmsByCategory = (category: string) =>
  ALL_ALGORITHMS.filter(algo => algo.category === category);
