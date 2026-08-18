export interface TreeNode {
  value: number;
  id: string;
  x: number;
  y: number;
  left?: TreeNode;
  right?: TreeNode;
}

/**
 * Converts a flat array representation of a binary tree into a hierarchical structure with coordinates.
 * Assumes a complete binary tree for simple layout.
 */
export function buildTreeLayout(arr: number[], index = 0, x = 200, y = 50, level = 1): TreeNode | null {
  if (index >= arr.length || arr[index] === null) return null;

  const horizontalSpacing = 200 / Math.pow(2, level);
  const verticalSpacing = 70;

  const node: TreeNode = {
    value: arr[index],
    id: index.toString(),
    x: x,
    y: y,
  };

  const leftIdx = 2 * index + 1;
  const rightIdx = 2 * index + 2;

  if (leftIdx < arr.length) {
    node.left = buildTreeLayout(
      arr,
      leftIdx,
      x - horizontalSpacing,
      y + verticalSpacing,
      level + 1
    ) || undefined;
  }

  if (rightIdx < arr.length) {
    node.right = buildTreeLayout(
      arr,
      rightIdx,
      x + horizontalSpacing,
      y + verticalSpacing,
      level + 1
    ) || undefined;
  }

  return node;
}
