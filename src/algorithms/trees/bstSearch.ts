import { AlgorithmDefinition, VisualizationEvent } from '@/types/algorithm';

export const bstSearch: AlgorithmDefinition = {
  id: 'bst-search',
  name: 'BST Search',
  category: 'Trees',
  difficulty: 'Easy',
  description: 'Binary Search Tree search finds a value by comparing it to the root and recursively moving to the left or right subtree.',
  complexities: {
    time: 'O(log n)',
    space: 'O(log n)',
  },
  visualizationType: 'TREE',
  defaultInput: {
    tree: [50, 30, 70, 20, 40, 60, 80],
    target: 60
  },
  code: {
    cpp: `Node* search(Node* root, int key) {
    if (root == NULL || root->key == key) return root;
    if (root->key < key) return search(root->right, key);
    return search(root->left, key);
}`,
    java: `public Node search(Node root, int key) {
    if (root==null || root.key==key) return root;
    if (root.key < key) return search(root.right, key);
    return search(root.left, key);
}`,
    python: `def search(root, key):
    if root is None or root.val == key:
        return root
    if root.val < key:
        return search(root.right, key)
    return search(root.left, key)`,
    javascript: `function search(root, target) {
    if (!root || root.val === target) return root;
    if (target < root.val) return search(root.left, target);
    return search(root.right, target);
}`,
    kotlin: `fun search(root: Node?, key: Int): Node? {
    if (root == null || root.key == key) return root
    if (root.key < key) return search(root.right, key)
    return search(root.left, key)
}`
  },
  generateSteps: (input: { tree: number[], target: number }): VisualizationEvent[] => {
    const steps: VisualizationEvent[] = [];
    const { tree, target } = input;

    // In a real implementation, we'd build the tree first.
    // For visualization events, we map array indices to tree nodes.
    let currentIdx = 0;

    while (currentIdx < tree.length) {
      steps.push({
        type: 'COMPARE',
        indices: [currentIdx],
        description: `Compare target ${target} with node ${tree[currentIdx]}`,
        codeLine: 3,
        variables: { current: tree[currentIdx], target }
      });

      if (tree[currentIdx] === target) {
        steps.push({
          type: 'MARK_SORTED',
          indices: [currentIdx],
          description: `Found ${target}!`,
          codeLine: 3,
          variables: { target }
        });
        return steps;
      }

      if (target < tree[currentIdx]) {
        steps.push({
          type: 'VISIT',
          indices: [currentIdx],
          description: `${target} < ${tree[currentIdx]}, moving to left child`,
          codeLine: 4,
          variables: { target, next: 'left' }
        });
        currentIdx = 2 * currentIdx + 1;
      } else {
        steps.push({
          type: 'VISIT',
          indices: [currentIdx],
          description: `${target} > ${tree[currentIdx]}, moving to right child`,
          codeLine: 5,
          variables: { target, next: 'right' }
        });
        currentIdx = 2 * currentIdx + 2;
      }
    }

    steps.push({
      type: 'HIGHLIGHT',
      indices: [],
      description: `${target} not found in the BST`,
      codeLine: 2,
      variables: { target }
    });

    return steps;
  },
};
