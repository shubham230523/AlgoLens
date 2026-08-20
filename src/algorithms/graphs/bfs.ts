import { AlgorithmDefinition, VisualizationEvent } from '@/types/algorithm';

export const bfs: AlgorithmDefinition = {
  id: 'bfs',
  name: 'Breadth First Search',
  category: 'Graphs',
  difficulty: 'Medium',
  description: 'Starts at the root and explores all neighbor nodes at the present depth before moving to the next level.',
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
    cpp: `class Solution {
public:
    void BFS(int V, vector<int> adj[], int s) {
        vector<bool> visited(V, false);
        queue<int> q;
        visited[s] = true;
        q.push(s);
        while(!q.empty()) {
            int curr = q.front(); q.pop();
            for(auto neighbor : adj[curr]) {
                if(!visited[neighbor]) {
                    visited[neighbor] = true;
                    q.push(neighbor);
                }
            }
        }
    }
};`,
    java: `class Solution {
    public void BFS(int V, LinkedList<Integer> adj[], int s) {
        boolean visited[] = new boolean[V];
        LinkedList<Integer> queue = new LinkedList<Integer>();
        visited[s] = true;
        queue.add(s);
        while (queue.size() != 0) {
            int curr = queue.poll();
            for (int neighbor : adj[curr]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    queue.add(neighbor);
                }
            }
        }
    }
}`,
    python: `class Solution:
    def BFS(self, V, adj, s):
        visited = [False] * V
        queue = []
        queue.append(s)
        visited[s] = True
        while queue:
            curr = queue.pop(0)
            for neighbor in adj[curr]:
                if not visited[neighbor]:
                    queue.append(neighbor)
                    visited[neighbor] = True`,
    javascript: `class Solution {
    BFS(V, adj, startNode) {
        let queue = [startNode];
        let visited = new Array(V).fill(false);
        visited[startNode] = true;
        while (queue.length > 0) {
            let curr = queue.shift();
            for (let neighbor of adj[curr]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    queue.push(neighbor);
                }
            }
        }
    }
}`,
    kotlin: `class Solution {
    fun BFS(V: Int, adj: Array<LinkedList<Int>>, s: Int) {
        val visited = BooleanArray(V)
        val queue = LinkedList<Int>()
        visited[s] = true
        queue.add(s)
        while (queue.isNotEmpty()) {
            val curr = queue.poll()
            adj[curr].forEach { neighbor ->
                if (!visited[neighbor]) {
                    visited[neighbor] = true
                    queue.add(neighbor)
                }
            }
        }
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

    const queue: string[] = [startNode];
    const visited = new Set<string>([startNode]);

    steps.push({
      type: 'HIGHLIGHT',
      indices: [nodes.findIndex(n => n.id === startNode)],
      description: `Start BFS from node ${startNode}`,
      codeLine: 4,
      variables: { queue: [...queue], visited: Array.from(visited) }
    });

    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      const nodeIdx = nodes.findIndex(n => n.id === nodeId);

      steps.push({
        type: 'SELECT',
        indices: [nodeIdx],
        description: `Dequeue ${nodeId} and visit neighbors`,
        codeLine: 7,
        variables: { queue: [...queue], current: nodeId }
      });

      for (const neighborId of adj[nodeId]) {
        const neighborIdx = nodes.findIndex(n => n.id === neighborId);

        steps.push({
          type: 'COMPARE',
          indices: [nodeIdx, neighborIdx],
          description: `Checking neighbor ${neighborId}`,
          codeLine: 9,
          variables: { neighbor: neighborId }
        });

        if (!visited.has(neighborId)) {
          visited.add(neighborId);
          queue.push(neighborId);
          steps.push({
            type: 'VISIT',
            indices: [neighborIdx],
            description: `Adding ${neighborId} to queue`,
            codeLine: 11,
            variables: { queue: [...queue], visited: Array.from(visited) }
          });
        }
      }

      steps.push({
        type: 'MARK_SORTED',
        indices: [nodeIdx],
        description: `Done with node ${nodeId}`,
        codeLine: 7,
        variables: { queue: [...queue] }
      });
    }

    return steps;
  },
};
