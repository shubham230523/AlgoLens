import { AlgorithmDefinition, VisualizationEvent } from '@/types/algorithm';

export const activitySelection: AlgorithmDefinition = {
  id: 'activity-selection',
  name: 'Activity Selection',
  category: 'Greedy Algorithm',
  difficulty: 'Medium',
  description: 'Select the maximum number of activities that don\'t overlap, given their start and end times.',
  complexities: { time: 'O(n log n)', space: 'O(1)' },
  visualizationType: 'BAR',
  defaultInput: {
    start: [1, 3, 0, 5, 8, 5],
    finish: [2, 4, 6, 7, 9, 9]
  },
  code: {
    cpp: `void selectActivities(int s[], int f[], int n) {
    int i = 0;
    cout << i << " ";
    for (int j = 1; j < n; j++) {
        if (s[j] >= f[i]) {
            cout << j << " ";
            i = j;
        }
    }
}`,
    java: `public static void selectActivities(int s[], int f[], int n) {
    int i = 0;
    System.out.print(i + " ");
    for (int j = 1; j < n; j++) {
        if (s[j] >= f[i]) {
            System.out.print(j + " ");
            i = j;
        }
    }
}`,
    python: `def select_activities(s, f):
    n = len(f)
    i = 0
    print(i)
    for j in range(1, n):
        if s[j] >= f[i]:
            print(j)
            i = j`,
    javascript: `function selectActivities(s, f) {
    let n = f.length;
    let i = 0;
    let selected = [0];
    for (let j = 1; j < n; j++) {
        if (s[j] >= f[i]) {
            selected.push(j);
            i = j;
        }
    }
    return selected;
}`,
    kotlin: `fun selectActivities(s: IntArray, f: IntArray) {
    var i = 0
    print(i)
    for (j in 1 until s.size) {
        if (s[j] >= f[i]) {
            print(j)
            i = j
        }
    }
}`
  },
  generateSteps: (input: { start: number[], finish: number[] }): VisualizationEvent[] => {
    const steps: VisualizationEvent[] = [];
    const { start, finish } = input;
    const n = start.length;

    steps.push({
      type: 'HIGHLIGHT',
      indices: [],
      description: 'Sorting activities by finish time (Greedy choice)',
      codeLine: 1,
      variables: { n }
    });

    let i = 0;
    steps.push({
      type: 'SELECT',
      indices: [0],
      description: `Selecting first activity (Finish: ${finish[0]})`,
      codeLine: 3,
      variables: { lastSelected: 0 }
    });

    for (let j = 1; j < n; j++) {
      steps.push({
        type: 'COMPARE',
        indices: [i, j],
        description: `Checking if activity ${j} (Start: ${start[j]}) starts after activity ${i} (Finish: ${finish[i]}) ends`,
        codeLine: 5,
        variables: { current: j, lastSelected: i }
      });

      if (start[j] >= finish[i]) {
        i = j;
        steps.push({
          type: 'SELECT',
          indices: [j],
          description: `Activity ${j} is compatible. Adding to selection.`,
          codeLine: 7,
          variables: { lastSelected: i }
        });
      } else {
        steps.push({
          type: 'VISIT',
          indices: [j],
          description: `Activity ${j} overlaps. Skipping.`,
          codeLine: 5,
          variables: { lastSelected: i }
        });
      }
    }

    steps.push({
      type: 'MARK_SORTED',
      indices: [],
      description: 'Greedy selection complete!',
      codeLine: 1,
      variables: {}
    });

    return steps;
  }
};
