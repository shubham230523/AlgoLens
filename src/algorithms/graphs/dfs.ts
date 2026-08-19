import { AlgorithmDefinition, VisualizationEvent } from '@/types/algorithm';

export const dfs: AlgorithmDefinition = {
  id: 'dfs',
  name: 'Depth First Search',
  category: 'Graphs',
  difficulty: 'Medium',
  description: 'Explores as far as possible along each branch before backtracking.',
  complexities: {
    time: 'O(V + E)',
    space: 'O(V)',
  },
  visualizationType: 'GRAPH',
  defaultInput: {
    nodes: [
      { id: '0', label: '0' }, { id: '1', label: '1' }, { id: '2', label: '2' },
      { id: '3', label: '3' }, { id: '4', label: '4' }, { id: '5', label: '5' },
    ],
    edges: [
      { from: '0', to: '1' }, { from: '0', to: '2' }, { from: '1', to: '3' },
      { from: '1', to: '4' }, { from: '2', to: '4' }, { from: '3', to: '4' },
      { from: '3', to: '5' }, { from: '4', to: '5' },
    ],
    startNode: '0',
  },
  code: {
    cpp: `void DFS(int v, vector<bool>& visited) {
    visited[v] = true;
    for (int i : adj[v])
        if (!visited[i])
            DFS(i, visited);
}`,
    java: `void DFS(int v, boolean visited[]) {
    visited[v] = true;
    for (int n : adj[v]) {
        if (!visited[n]) DFS(n, visited);
    }
}`,
    python: `def DFS(v, visited):
    visited.add(v)
    for neighbor in adj[v]:
        if neighbor not in visited:
            DFS(neighbor, visited)`,
    javascript: `function DFS(node, visited) {
    visited.add(node);
    for (let neighbor of node.neighbors) {
        if (!visited.has(neighbor)) {
            DFS(neighbor, visited);
        }
    }
}`,
    kotlin: `fun DFS(v: Int, visited: BooleanArray) {
    visited[v] = true
    adj[v].forEach {
        if (!visited[it]) DFS(it, visited)
    }
}`
  },
  generateSteps: (input: { nodes: any[], edges: any[], startNode: string }): VisualizationEvent[] => {
    const steps: VisualizationEvent[] = [];
    const { nodes, edges, startNode } = input;
    const adj: Record<string, string[]> = {};
    nodes.forEach(n => adj[n.id] = []);
    edges.forEach(e => {
      adj[e.from].push(e.to);
      adj[e.to].push(e.from);
    });

    const visited = new Set<string>();
    const stack: string[] = [];

    const traverse = (nodeId: string) => {
      const nodeIdx = nodes.findIndex(n => n.id === nodeId);
      visited.add(nodeId);
      stack.push(nodeId);

      steps.push({
        type: 'SELECT',
        indices: [nodeIdx],
        description: `Visiting node ${nodeId}`,
        codeLine: 2,
        variables: { visited: Array.from(visited), stack: [...stack] }
      });

      for (const neighborId of adj[nodeId]) {
        const neighborIdx = nodes.findIndex(n => n.id === neighborId);

        steps.push({
          type: 'COMPARE',
          indices: [nodeIdx, neighborIdx],
          description: `Checking neighbor ${neighborId}`,
          codeLine: 3,
          variables: { neighbor: neighborId }
        });

        if (!visited.has(neighborId)) {
          traverse(neighborId);
          steps.push({
            type: 'SELECT',
            indices: [nodeIdx],
            description: `Backtracked to ${nodeId}`,
            codeLine: 1,
            variables: { stack: [...stack] }
          });
        }
      }

      steps.push({
        type: 'MARK_SORTED',
        indices: [nodeIdx],
        description: `Fully explored ${nodeId}`,
        codeLine: 1,
        variables: {}
      });
      stack.pop();
    };

    traverse(startNode);
    return steps;
  },
};
