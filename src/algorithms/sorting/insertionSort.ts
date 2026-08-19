import { AlgorithmDefinition, VisualizationEvent } from '@/types/algorithm';

export const insertionSort: AlgorithmDefinition = {
  id: 'insertion-sort',
  name: 'Insertion Sort',
  category: 'Sorting',
  difficulty: 'Easy',
  description: 'Insertion sort works by building a sorted array one item at a time, picking elements from the unsorted part and inserting them into their correct position.',
  complexities: {
    time: 'O(n²)',
    space: 'O(1)',
  },
  visualizationType: 'BAR',
  defaultInput: [12, 11, 13, 5, 6],
  code: {
    cpp: `void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`,
    java: `void insertionSort(int arr[]) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`,
    python: `def insertionSort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and key < arr[j]:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key`,
    javascript: `function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`,
    kotlin: `fun insertionSort(arr: IntArray) {
    for (i in 1 until arr.size) {
        val key = arr[i]
        var j = i - 1
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j]
            j--
        }
        arr[j + 1] = key
    }
}`
  },
  generateSteps: (input: number[]): VisualizationEvent[] => {
    const steps: VisualizationEvent[] = [];
    const arr = [...input];
    const n = arr.length;

    steps.push({
      type: 'MARK_SORTED',
      indices: [0],
      description: 'First element is considered sorted',
      codeLine: 2,
      variables: { i: 0 }
    });

    for (let i = 1; i < n; i++) {
      let key = arr[i];
      let j = i - 1;

      steps.push({
        type: 'SELECT',
        indices: [i],
        description: `Pick ${key} to be inserted into the sorted part`,
        codeLine: 3,
        variables: { i, key }
      });

      while (j >= 0 && arr[j] > key) {
        steps.push({
          type: 'COMPARE',
          indices: [j, j + 1],
          description: `Compare ${key} with ${arr[j]}`,
          codeLine: 6,
          variables: { i, key, j }
        });

        arr[j + 1] = arr[j];
        steps.push({
          type: 'UPDATE_VALUE',
          indices: [j + 1],
          description: `Move ${arr[j]} to the right`,
          codeLine: 7,
          variables: { i, key, j, array: [...arr] }
        });
        j = j - 1;
      }

      arr[j + 1] = key;
      steps.push({
        type: 'SWAP',
        indices: [j + 1],
        description: `Insert ${key} at index ${j + 1}`,
        codeLine: 10,
        variables: { i, key, j, array: [...arr] }
      });

      // Mark all elements from 0 to i as sorted
      const sortedUntil = [];
      for(let k=0; k<=i; k++) sortedUntil.push(k);
      steps.push({
        type: 'MARK_SORTED',
        indices: sortedUntil,
        description: `Elements up to index ${i} are now sorted`,
        codeLine: 2,
        variables: { i }
      });
    }

    return steps;
  },
};
