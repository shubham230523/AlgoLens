import { AlgorithmDefinition, VisualizationEvent } from '@/types/algorithm';

export const slidingWindowMaximum: AlgorithmDefinition = {
  id: 'sliding-window-maximum',
  name: 'Sliding Window Max',
  category: 'Stack / Monotonic Deque',
  difficulty: 'Hard',
  description: 'Find the maximum in each sliding window of size K using a monotonic deque.',
  complexities: { time: 'O(n)', space: 'O(k)' },
  visualizationType: 'BAR',
  defaultInput: { array: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 },
  code: {
    cpp: `vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    deque<int> dq;
    vector<int> res;
    for (int i = 0; i < nums.size(); i++) {
        if (!dq.empty() && dq.front() == i - k) dq.pop_front();
        while (!dq.empty() && nums[dq.back()] < nums[i]) dq.pop_back();
        dq.push_back(i);
        if (i >= k - 1) res.push_back(nums[dq.front()]);
    }
    return res;
}`,
    java: `public int[] maxSlidingWindow(int[] nums, int k) {
    Deque<Integer> dq = new ArrayDeque<>();
    int[] res = new int[nums.length - k + 1];
    for (int i = 0; i < nums.length; i++) {
        if (!dq.isEmpty() && dq.peekFirst() == i - k) dq.pollFirst();
        while (!dq.isEmpty() && nums[dq.peekLast()] < nums[i]) dq.pollLast();
        dq.offerLast(i);
        if (i >= k - 1) res[i - k + 1] = nums[dq.peekFirst()];
    }
    return res;
}`,
    python: `def maxSlidingWindow(nums, k):
    dq = deque()
    res = []
    for i, n in enumerate(nums):
        if dq and dq[0] == i - k: dq.popleft()
        while dq and nums[dq[-1]] < n: dq.pop()
        dq.append(i)
        if i >= k - 1: res.append(nums[dq[0]])
    return res`,
    javascript: `function maxSlidingWindow(nums, k) {
    let dq = [];
    let res = [];
    for (let i = 0; i < nums.length; i++) {
        if (dq[0] === i - k) dq.shift();
        while (dq.length && nums[dq[dq.length - 1]] < nums[i]) dq.pop();
        dq.push(i);
        if (i >= k - 1) res.push(nums[dq[0]]);
    }
    return res;
}`,
    kotlin: `fun maxSlidingWindow(nums: IntArray, k: Int): IntArray {
    val dq = ArrayDeque<Int>()
    val res = IntArray(nums.size - k + 1)
    for (i in nums.indices) {
        if (dq.isNotEmpty() && dq.first() == i - k) dq.removeFirst()
        while (dq.isNotEmpty() && nums[dq.last()] < nums[i]) dq.removeLast()
        dq.addLast(i)
        if (i >= k - 1) res[i - k + 1] = nums[dq.first()]
    }
    return res
}`
  },
  generateSteps: (input: { array: number[], k: number }): VisualizationEvent[] => {
    const steps: VisualizationEvent[] = [];
    const { array, k } = input;
    const dq: number[] = [];

    for (let i = 0; i < array.length; i++) {
      steps.push({
        type: 'HIGHLIGHT',
        indices: [i],
        description: `Processing element ${array[i]} at index ${i}`,
        codeLine: 4,
        variables: { i, val: array[i], deque: [...dq] }
      });

      if (dq.length > 0 && dq[0] === i - k) {
        dq.shift();
        steps.push({
          type: 'VISIT',
          indices: [i - k],
          description: `Index ${i - k} is out of current window. Removing from front.`,
          codeLine: 5,
          variables: { deque: [...dq] }
        });
      }

      while (dq.length > 0 && array[dq[dq.length - 1]] < array[i]) {
        const popped = dq.pop();
        steps.push({
          type: 'COMPARE',
          indices: [popped!, i],
          description: `${array[popped!]} < ${array[i]}. Removing ${array[popped!]} from back to maintain monotonic property.`,
          codeLine: 6,
          variables: { deque: [...dq] }
        });
      }

      dq.push(i);
      steps.push({
        type: 'SELECT',
        indices: [i],
        description: `Adding index ${i} to deque`,
        codeLine: 7,
        variables: { deque: [...dq] }
      });

      if (i >= k - 1) {
        steps.push({
          type: 'MARK_SORTED',
          indices: [dq[0]],
          description: `Current window maximum is ${array[dq[0]]} (front of deque)`,
          codeLine: 8,
          variables: { result: array[dq[0]], window: [i - k + 1, i] }
        });
      }
    }

    return steps;
  }
};
