import { AlgorithmDefinition, VisualizationEvent } from '@/types/algorithm';

const commonCode = {
  cpp: `void traverse(Node* root) {
    if (!root) return;
    // Process root
    traverse(root->left);
    traverse(root->right);
}`,
  java: `void traverse(Node root) {
    if (root == null) return;
    // Process root
    traverse(root.left);
    traverse(root.right);
}`,
  python: `def traverse(root):
    if not root: return
    # Process root
    traverse(root.left)
    traverse(root.right)`,
  javascript: `function traverse(root) {
    if (!root) return;
    // Process root
    traverse(root.left);
    traverse(root.right);
}`,
  kotlin: `fun traverse(root: Node?) {
    if (root == null) return
    // Process root
    traverse(root.left)
    traverse(root.right)
}`
};

export const preorderTraversal: AlgorithmDefinition = {
  id: 'preorder-traversal',
  name: 'Preorder Traversal',
  category: 'Trees',
  difficulty: 'Easy',
  description: 'Visits the current node, then the left subtree, and finally the right subtree.',
  complexities: { time: 'O(n)', space: 'O(n)' },
  visualizationType: 'TREE',
  defaultInput: [1, 2, 3, 4, 5, 6, 7],
  code: commonCode,
  generateSteps: (input: number[]): VisualizationEvent[] => {
    const steps: VisualizationEvent[] = [];
    const traverse = (idx: number) => {
      if (idx >= input.length || input[idx] === null) return;
      steps.push({
        type: 'SELECT',
        indices: [idx],
        description: `Visit node ${input[idx]}`,
        codeLine: 3,
        variables: { current: input[idx] }
      });
      traverse(2 * idx + 1);
      traverse(2 * idx + 2);
      steps.push({
        type: 'MARK_SORTED',
        indices: [idx],
        description: `Backtrack from ${input[idx]}`,
        codeLine: 1,
        variables: {}
      });
    };
    traverse(0);
    return steps;
  }
};

export const inorderTraversal: AlgorithmDefinition = {
  id: 'inorder-traversal',
  name: 'Inorder Traversal',
  category: 'Trees',
  difficulty: 'Easy',
  description: 'Visits the left subtree, then the current node, and finally the right subtree.',
  complexities: { time: 'O(n)', space: 'O(n)' },
  visualizationType: 'TREE',
  defaultInput: [1, 2, 3, 4, 5, 6, 7],
  code: commonCode,
  generateSteps: (input: number[]): VisualizationEvent[] => {
    const steps: VisualizationEvent[] = [];
    const traverse = (idx: number) => {
      if (idx >= input.length || input[idx] === null) return;
      traverse(2 * idx + 1);
      steps.push({
        type: 'SELECT',
        indices: [idx],
        description: `Visit node ${input[idx]}`,
        codeLine: 3,
        variables: { current: input[idx] }
      });
      traverse(2 * idx + 2);
      steps.push({
        type: 'MARK_SORTED',
        indices: [idx],
        description: `Backtrack from ${input[idx]}`,
        codeLine: 1,
        variables: {}
      });
    };
    traverse(0);
    return steps;
  }
};

export const postorderTraversal: AlgorithmDefinition = {
  id: 'postorder-traversal',
  name: 'Postorder Traversal',
  category: 'Trees',
  difficulty: 'Easy',
  description: 'Visits the left subtree, then the right subtree, and finally the current node.',
  complexities: { time: 'O(n)', space: 'O(n)' },
  visualizationType: 'TREE',
  defaultInput: [1, 2, 3, 4, 5, 6, 7],
  code: commonCode,
  generateSteps: (input: number[]): VisualizationEvent[] => {
    const steps: VisualizationEvent[] = [];
    const traverse = (idx: number) => {
      if (idx >= input.length || input[idx] === null) return;
      traverse(2 * idx + 1);
      traverse(2 * idx + 2);
      steps.push({
        type: 'SELECT',
        indices: [idx],
        description: `Visit node ${input[idx]}`,
        codeLine: 3,
        variables: { current: input[idx] }
      });
      steps.push({
        type: 'MARK_SORTED',
        indices: [idx],
        description: `Backtrack from ${input[idx]}`,
        codeLine: 1,
        variables: {}
      });
    };
    traverse(0);
    return steps;
  }
};
