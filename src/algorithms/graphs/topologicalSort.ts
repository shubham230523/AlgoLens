import { AlgorithmDefinition, VisualizationEvent } from '@/types/algorithm';

export const topologicalSort: AlgorithmDefinition = {
  id: 'topological-sort',
  name: 'Topological Sort',
  category: 'Graphs',
  difficulty: 'Medium',
  description: 'Linear ordering of vertices such that for every directed edge uv, vertex u comes before v in the ordering.',
  complexities: { time: 'O(V + E)', space: 'O(V)' },
  visualizationType: 'GRAPH',
  defaultInput: {
    nodes: [
      { id: '0', label: 'A' }, { id: '1', label: 'B' }, { id: '2', label: 'C' },
      { id: '3', label: 'D' }, { id: '4', label: 'E' }, { id: '5', label: 'F' },
    ],
    edges: [
      { from: '5', to: '2' }, { from: '5', to: '0' }, { from: '4', to: '0' },
      { from: '4', to: '1' }, { from: '2', to: '3' }, { from: '3', to: '1' },
    ],
  },
  code: {
    cpp: `void topoSort(int v, bool visited[], stack<int>& Stack) {
    visited[v] = true;
    for (int i : adj[v])
        if (!visited[i]) topoSort(i, visited, Stack);
    Stack.push(v);
}`,
    java: `void topoSort(int v, boolean visited[], Stack<Integer> stack) {
    visited[v] = true;
    for (int neighbor : adj.get(v))
        if (!visited[neighbor]) topoSort(neighbor, visited, stack);
    stack.push(v);
}`,
    python: `def topoSort(v, visited, stack):
    visited[v] = True
    for i in adj[v]:
        if not visited[i]:
            topoSort(i, visited, stack)
    stack.append(v)`,
    javascript: `function topoSort(v, visited, stack) {
    visited[v] = true;
    for (let neighbor of adj[v]) {
        if (!visited[neighbor]) topoSort(neighbor, visited, stack);
    }
    stack.push(v);
}`,
    kotlin: `fun topoSort(v: Int, visited: BooleanArray, stack: Stack<Int>) {
    visited[v] = true
    adj[v].forEach {
        if (!visited[it]) topoSort(it, visited, stack)
    }
    stack.push(v)
}`
  },
  generateSteps: (input: { nodes: any[], edges: any[] }): VisualizationEvent[] => {
    const steps: VisualizationEvent[] = [];
    const { nodes, edges } = input;
    const n = nodes.length;
    const adj: Record<string, string[]> = {};
    nodes.forEach(n => adj[n.id] = []);
    edges.forEach(e => adj[e.from].push(e.to));

    const visited = new Set<string>();
    const stack: string[] = [];

    const dfs = (nodeId: string) => {
      visited.add(nodeId);
      const nodeIdx = nodes.findIndex(n => n.id === nodeId);

      steps.push({
        type: 'SELECT',
        indices: [nodeIdx],
        description: `Visiting node ${nodes[nodeIdx].label}`,
        codeLine: 2,
        variables: { visited: Array.from(visited) }
      });

      for (const neighborId of adj[nodeId]) {
        const neighborIdx = nodes.findIndex(n => n.id === neighborId);
        steps.push({
          type: 'COMPARE',
          indices: [nodeIdx, neighborIdx],
          description: `Checking neighbor ${nodes[neighborIdx].label}`,
          codeLine: 4,
          variables: { neighbor: nodes[neighborIdx].label }
        });

        if (!visited.has(neighborId)) {
          dfs(neighborId);
        }
      }

      stack.push(nodeId);
      steps.push({
        type: 'MARK_SORTED',
        indices: [nodeIdx],
        description: `Pushing ${nodes[nodeIdx].label} to result stack`,
        codeLine: 5,
        variables: { currentStack: [...stack].reverse() }
      });
    };

    for (let i = 0; i < n; i++) {
      if (!visited.has(nodes[i].id)) {
        dfs(nodes[i].id);
      }
    }

    return steps;
  }
};
