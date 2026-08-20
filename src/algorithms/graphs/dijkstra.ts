import { AlgorithmDefinition, VisualizationEvent } from '@/types/algorithm';

export const dijkstra: AlgorithmDefinition = {
  id: 'dijkstra',
  name: 'Dijkstra\'s Algorithm',
  category: 'Graphs',
  difficulty: 'Hard',
  description: 'Finds the shortest path between nodes in a weighted graph.',
  complexities: { time: 'O(E log V)', space: 'O(V)' },
  visualizationType: 'GRAPH',
  defaultInput: {
    nodes: [
      { id: '0', label: 'A' }, { id: '1', label: 'B' }, { id: '2', label: 'C' },
      { id: '3', label: 'D' }, { id: '4', label: 'E' }
    ],
    edges: [
      { from: '0', to: '1', weight: 4 }, { from: '0', to: '2', weight: 2 },
      { from: '1', to: '2', weight: 3 }, { from: '1', to: '3', weight: 2 },
      { from: '1', to: '4', weight: 3 }, { from: '2', to: '1', weight: 1 },
      { from: '2', to: '3', weight: 4 }, { from: '2', to: '4', weight: 5 },
      { from: '4', to: '3', weight: 1 }
    ],
    startNode: '0'
  },
  code: {
    cpp: `void dijkstra(int start) {
    priority_queue<pair<int, int>> pq;
    dist[start] = 0;
    pq.push({0, start});
    while (!pq.empty()) {
        int u = pq.top().second; pq.pop();
        for (auto& edge : adj[u]) {
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
}`,
    java: `void dijkstra(int start) {
    PriorityQueue<Node> pq = new PriorityQueue<>();
    dists[start] = 0;
    pq.add(new Node(start, 0));
    while (!pq.isEmpty()) {
        Node curr = pq.poll();
        for (Node neighbor : adj.get(curr.id)) {
            if (dists[curr.id] + neighbor.weight < dists[neighbor.id]) {
                dists[neighbor.id] = dists[curr.id] + neighbor.weight;
                pq.add(new Node(neighbor.id, dists[neighbor.id]));
            }
        }
    }
}`,
    python: `def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    pq = [(0, start)]
    while pq:
        curr_dist, u = heapq.heappop(pq)
        for v, weight in graph[u]:
            if curr_dist + weight < distances[v]:
                distances[v] = curr_dist + weight
                heapq.heappush(pq, (distances[v], v))`,
    javascript: `function dijkstra(graph, start) {
    let distances = {};
    for (let node in graph) distances[node] = Infinity;
    distances[start] = 0;
    let pq = [[0, start]];
    while (pq.length > 0) {
        let [d, u] = pq.shift(); // Simplified PQ
        for (let [v, w] of graph[u]) {
            if (distances[u] + w < distances[v]) {
                distances[v] = distances[u] + w;
                pq.push([distances[v], v]);
            }
        }
    }
}`,
    kotlin: `fun dijkstra(start: Int) {
    val pq = PriorityQueue<Pair<Int, Int>>()
    dists[start] = 0
    pq.add(start to 0)
    while (pq.isNotEmpty()) {
        val (u, d) = pq.poll()
        for (edge in adj[u]) {
            if (dists[u] + edge.weight < dists[edge.to]) {
                dists[edge.to] = dists[u] + edge.weight
                pq.add(edge.to to dists[edge.to])
            }
        }
    }
}`
  },
  generateSteps: (input: { nodes: any[], edges: any[], startNode: string }): VisualizationEvent[] => {
    const steps: VisualizationEvent[] = [];
    const { nodes, edges, startNode } = input;
    const n = nodes.length;
    const dist = new Array(n).fill(Infinity);
    const visited = new Set<number>();

    const startIdx = nodes.findIndex(node => node.id === startNode);
    dist[startIdx] = 0;

    steps.push({
      type: 'HIGHLIGHT',
      indices: [startIdx],
      description: `Starting Dijkstra from ${nodes[startIdx].label}. Initial distance is 0.`,
      codeLine: 3,
      variables: { distances: [...dist] }
    });

    for (let i = 0; i < n; i++) {
      let u = -1;
      for (let j = 0; j < n; j++) {
        if (!visited.has(j) && (u === -1 || dist[j] < dist[u])) {
          u = j;
        }
      }

      if (dist[u] === Infinity) break;

      visited.add(u);
      steps.push({
        type: 'SELECT',
        indices: [u],
        description: `Selecting node ${nodes[u].label} with smallest distance ${dist[u]}`,
        codeLine: 7,
        variables: { current: nodes[u].label, distances: [...dist] }
      });

      const neighborEdges = edges.filter(e => e.from === nodes[u].id);
      for (const edge of neighborEdges) {
        const v = nodes.findIndex(node => node.id === edge.to);
        const weight = edge.weight;

        steps.push({
          type: 'COMPARE',
          indices: [u, v],
          description: `Checking neighbor ${nodes[v].label} via edge weight ${weight}`,
          codeLine: 9,
          variables: { from: nodes[u].label, to: nodes[v].label, weight }
        });

        if (dist[u] + weight < dist[v]) {
          dist[v] = dist[u] + weight;
          steps.push({
            type: 'UPDATE_VALUE',
            indices: [v],
            description: `Relaxing edge: New shortest distance to ${nodes[v].label} is ${dist[v]}`,
            codeLine: 10,
            variables: { distances: [...dist] }
          });
        }
      }

      steps.push({
        type: 'MARK_SORTED',
        indices: [u],
        description: `Shortest path to ${nodes[u].label} is finalized: ${dist[u]}`,
        codeLine: 7,
        variables: {}
      });
    }

    return steps;
  }
};
