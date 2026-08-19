import { AlgorithmDefinition, VisualizationEvent } from '@/types/algorithm';

export const mergeSort: AlgorithmDefinition = {
  id: 'merge-sort',
  name: 'Merge Sort',
  category: 'Sorting',
  difficulty: 'Medium',
  description: 'Merge sort is a divide-and-conquer algorithm that works by dividing the unsorted list into n sublists, each containing one element, and then repeatedly merging sublists.',
  complexities: {
    time: 'O(n log n)',
    space: 'O(n)',
  },
  visualizationType: 'BAR',
  defaultInput: [38, 27, 43, 3, 9, 82, 10],
  code: {
    cpp: `class Solution {
public:
    void mergeSort(int arr[], int l, int r) {
        if (l >= r) return;
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }

    void merge(int arr[], int l, int m, int r) {
        int n1 = m - l + 1;
        int n2 = r - m;
        int L[n1], R[n2];
        for (int i = 0; i < n1; i++) L[i] = arr[l + i];
        for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
        int i = 0, j = 0, k = l;
        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) arr[k++] = L[i++];
            else arr[k++] = R[j++];
        }
        while (i < n1) arr[k++] = L[i++];
        while (j < n2) arr[k++] = R[j++];
    }
};`,
    java: `class Solution {
    //
    public void mergeSort(int[] arr, int l, int r) {
        if (l >= r) return;
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }

    private void merge(int[] arr, int l, int m, int r) {
        int n1 = m - l + 1;
        int n2 = r - m;
        int[] L = new int[n1];
        int[] R = new int[n2];
        System.arraycopy(arr, l, L, 0, n1);
        System.arraycopy(arr, m + 1, R, 0, n2);
        int i = 0, j = 0, k = l;
        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) arr[k++] = L[i++];
            else arr[k++] = R[j++];
        }
        while (i < n1) arr[k++] = L[i++];
        while (j < n2) arr[k++] = R[j++];
    }
}`,
    python: `class Solution:
    #
    def mergeSort(self, arr, l, r):
        if l >= r: return
        m = l + (r - l) // 2
        self.mergeSort(arr, l, m)
        self.mergeSort(arr, m + 1, r)
        self.merge(arr, l, m, r)

    def merge(self, arr, l, m, r):
        n1, n2 = m - l + 1, r - m
        L = arr[l : m + 1]
        R = arr[m + 1 : r + 1]
        #
        #
        i, j, k = 0, 0, l
        while i < n1 and j < n2:
            if L[i] <= R[j]:
                arr[k] = L[i]; i += 1
            else:
                arr[k] = R[j]; j += 1
            k += 1
        while i < n1:
            arr[k] = L[i]; i += 1; k += 1
        while j < n2:
            arr[k] = R[j]; j += 1; k += 1`,
    javascript: `class Solution {
  //
  mergeSort(arr, left, right) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    this.mergeSort(arr, left, mid);
    this.mergeSort(arr, mid + 1, right);
    this.merge(arr, left, mid, right);
  }

  merge(arr, left, mid, right) {
    const n1 = mid - left + 1;
    const n2 = right - mid;
    const L = arr.slice(left, mid + 1);
    const R = arr.slice(mid + 1, right + 1);
    #
    #
    let i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
      if (L[i] <= R[j]) arr[k++] = L[i++];
      else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
  }
}`,
    kotlin: `class Solution {
    //
    fun mergeSort(arr: IntArray, l: Int, r: Int) {
        if (l >= r) return
        val m = l + (r - l) / 2
        mergeSort(arr, l, m)
        mergeSort(arr, m + 1, r)
        merge(arr, l, m, r)
    }

    fun merge(arr: IntArray, l: Int, m: Int, r: Int) {
        val n1 = m - l + 1
        val n2 = r - m
        val L = arr.sliceArray(l..m)
        val R = arr.sliceArray(m + 1..r)
        #
        #
        var i = 0; var j = 0; var k = l
        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) arr[k++] = L[i++]
            else arr[k++] = R[j++]
        }
        while (i < n1) arr[k++] = L[i++]
        while (j < n2) arr[k++] = R[j++]
    }
}`
  },
  generateSteps: (input: number[]): VisualizationEvent[] => {
    const steps: VisualizationEvent[] = [];
    const arr = [...input];

    const sort = (l: number, r: number, depth: number) => {
      if (l >= r) {
        steps.push({
          type: 'HIGHLIGHT',
          indices: [l],
          description: `Base case reached: index ${l} is a single element.`,
          codeLine: 4,
          variables: { l, r, depth }
        });
        return;
      }

      const mid = Math.floor((l + r) / 2);

      steps.push({
        type: 'SUBARRAY_FOCUS',
        indices: Array.from({ length: r - l + 1 }, (_, i) => l + i),
        description: `Dividing subarray [${l}...${r}] at mid index ${mid}`,
        codeLine: 5,
        variables: { l, r, m: mid, depth }
      });

      sort(l, mid, depth + 1);
      sort(mid + 1, r, depth + 1);
      merge(l, mid, r, depth);
    };

    const merge = (l: number, mid: number, r: number, depth: number) => {
      const leftArr = arr.slice(l, mid + 1);
      const rightArr = arr.slice(mid + 1, r + 1);

      steps.push({
        type: 'SUBARRAY_FOCUS',
        indices: Array.from({ length: r - l + 1 }, (_, i) => l + i),
        description: `Merging subarrays [${l}...${mid}] and [${mid + 1}...${r}]`,
        codeLine: 8,
        variables: { l, r, m: mid, depth }
      });

      let i = 0, j = 0, k = l;

      while (i < leftArr.length && j < rightArr.length) {
        steps.push({
          type: 'COMPARE',
          indices: [l + i, mid + 1 + j],
          description: `Compare ${leftArr[i]} and ${rightArr[j]}`,
          codeLine: 20,
          variables: { i, j, k, leftVal: leftArr[i], rightVal: rightArr[j] }
        });

        if (leftArr[i] <= rightArr[j]) {
          arr[k] = leftArr[i];
          steps.push({
            type: 'MERGE_STEP',
            indices: [k],
            description: `Place ${leftArr[i]} from left sublist into index ${k}`,
            codeLine: 20,
            variables: { i, j, k, array: [...arr] }
          });
          i++;
        } else {
          arr[k] = rightArr[j];
          steps.push({
            type: 'MERGE_STEP',
            indices: [k],
            description: `Place ${rightArr[j]} from right sublist into index ${k}`,
            codeLine: 21,
            variables: { i, j, k, array: [...arr] }
          });
          j++;
        }
        k++;
      }

      while (i < leftArr.length) {
        arr[k] = leftArr[i];
        steps.push({
          type: 'MERGE_STEP',
          indices: [k],
          description: `Copy remaining element ${leftArr[i]} from left sublist`,
          codeLine: 23,
          variables: { i, k, array: [...arr] }
        });
        i++;
        k++;
      }

      while (j < rightArr.length) {
        arr[k] = rightArr[j];
        steps.push({
          type: 'MERGE_STEP',
          indices: [k],
          description: `Copy remaining element ${rightArr[j]} from right sublist`,
          codeLine: 24,
          variables: { j, k, array: [...arr] }
        });
        j++;
        k++;
      }

      steps.push({
        type: 'MARK_SORTED',
        indices: Array.from({ length: r - l + 1 }, (_, i) => l + i),
        description: `Subarray [${l}...${r}] successfully merged and sorted!`,
        codeLine: 8,
        variables: { l, r, array: [...arr] }
      });
    };

    sort(0, arr.length - 1, 0);

    steps.push({
      type: 'MARK_SORTED',
      indices: Array.from({ length: arr.length }, (_, i) => i),
      description: `Algorithm complete! The array is fully sorted.`,
      codeLine: 1,
      variables: { array: [...arr] }
    });

    return steps;
  },
};
