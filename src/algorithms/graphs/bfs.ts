import { AlgorithmDefinition, VisualizationEvent } from '@/types/algorithm';

export const bfs: AlgorithmDefinition = {
  id: 'bfs',
  name: 'Breadth First Search',
  category: 'Graphs',
  difficulty: 'Medium',
  description: 'BFS is an algorithm for traversing or searching tree or graph data structures. It starts at the tree root and explores all of the neighbor nodes at the present depth prior to moving on to the nodes at the next depth level.',
  complexities: {
    time: 'O(V + E)',
    space: 'O(V)',
  },
  visualizationType: 'GRAPH',
  defaultInput: {
    nodes: [
      { id: '0', label: '0' },
      { id: '1', label: '1' },
      { id: '2', label: '2' },
      { id: '3', label: '3' },
      { id: '4', label: '4' },
      { id: '5', label: '5' },
    ],
    edges: [
      { from: '0', to: '1' },
      { from: '0', to: '2' },
      { from: '1', to: '3' },
      { from: '1', to: '4' },
      { from: '2', to: '4' },
      { from: '3', to: '4' },
      { from: '3', to: '5' },
      { from: '4', to: '5' },
    ],
    startNode: '0',
  },
  code: `function BFS(startNode) {
  let queue = [startNode];
  let visited = new Set([startNode]);
  while (queue.length > 0) {
    let node = queue.shift();
    for (let neighbor of node.neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}`,
  generateSteps: (input: { nodes: any[], edges: any[], startNode: string }): VisualizationEvent[] => {
    const steps: VisualizationEvent[] = [];
    const { nodes, edges, startNode } = input;

    const adj: Record<string, string[]> = {};
    nodes.forEach(n => adj[n.id] = []);
    edges.forEach(e => {
      adj[e.from].push(e.to);
      adj[e.to].push(e.from); // Undirected for now
    });

    const queue: string[] = [startNode];
    const visited = new Set<string>([startNode]);

    steps.push({
      type: 'HIGHLIGHT',
      indices: [nodes.findIndex(n => n.id === startNode)],
      description: `Starting BFS from node ${startNode}`,
      codeLine: 2,
      variables: { queue: [...queue], visited: Array.from(visited) }
    });

    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      const nodeIdx = nodes.findIndex(n => n.id === nodeId);

      steps.push({
        type: 'SELECT',
        indices: [nodeIdx],
        description: `De-queueing node ${nodeId} and visiting its neighbors`,
        codeLine: 6,
        variables: { queue: [...queue], currentNode: nodeId }
      });

      for (const neighborId of adj[nodeId]) {
        const neighborIdx = nodes.findIndex(n => n.id === neighborId);

        steps.push({
          type: 'COMPARE',
          indices: [nodeIdx, neighborIdx],
          description: `Checking neighbor ${neighborId}`,
          codeLine: 8,
          variables: { neighbor: neighborId }
        });

        if (!visited.has(neighborId)) {
          visited.add(neighborId);
          queue.push(neighborId);

          steps.push({
            type: 'VISIT',
            indices: [neighborIdx],
            description: `Neighbor ${neighborId} is not visited. Adding to queue.`,
            codeLine: 10,
            variables: { queue: [...queue], visited: Array.from(visited) }
          });
        } else {
          steps.push({
            type: 'HIGHLIGHT',
            indices: [neighborIdx],
            description: `Neighbor ${neighborId} is already visited.`,
            codeLine: 8,
            variables: { visited: Array.from(visited) }
          });
        }
      }

      steps.push({
        type: 'MARK_SORTED',
        indices: [nodeIdx],
        description: `Done with node ${nodeId}`,
        codeLine: 6,
        variables: { queue: [...queue] }
      });
    }

    return steps;
  },
};
