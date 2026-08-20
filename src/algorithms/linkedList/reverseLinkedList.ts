import { AlgorithmDefinition, VisualizationEvent } from '@/types/algorithm';

export const reverseLinkedList: AlgorithmDefinition = {
  id: 'reverse-linked-list',
  name: 'Reverse Linked List',
  category: 'Linked List',
  difficulty: 'Easy',
  description: 'Reverse a singly linked list in-place.',
  complexities: { time: 'O(n)', space: 'O(1)' },
  visualizationType: 'BAR', // Visualized as an array of pointers
  defaultInput: [1, 2, 3, 4, 5],
  code: {
    cpp: `Node* reverse(Node* head) {
    Node *prev = NULL, *curr = head, *next = NULL;
    while (curr != NULL) {
        next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
    java: `public Node reverse(Node head) {
    Node prev = null, curr = head;
    while (curr != null) {
        Node next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
    python: `def reverseList(head):
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`,
    javascript: `function reverseList(head) {
    let prev = null, curr = head;
    while (curr) {
        let next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
    kotlin: `fun reverseList(head: ListNode?): ListNode? {
    var prev: ListNode? = null; var curr = head
    while (curr != null) {
        val next = curr.next
        curr.next = prev
        prev = curr
        curr = next
    }
    return prev
}`
  },
  generateSteps: (input: number[]): VisualizationEvent[] => {
    const steps: VisualizationEvent[] = [];
    const n = input.length;

    steps.push({
      type: 'HIGHLIGHT',
      indices: [],
      description: 'Starting list reversal',
      codeLine: 2,
      variables: { head: input[0], prev: 'null' }
    });

    for (let i = 0; i < n; i++) {
      steps.push({
        type: 'SELECT',
        indices: [i],
        description: `Pointer curr is at node ${input[i]}`,
        codeLine: 3,
        variables: { curr: input[i], prev: i > 0 ? input[i-1] : 'null' }
      });

      steps.push({
        type: 'COMPARE',
        indices: [i],
        description: `Changing next pointer of ${input[i]} to point to ${i > 0 ? input[i-1] : 'null'}`,
        codeLine: 5,
        variables: { curr: input[i], next: i < n-1 ? input[i+1] : 'null' }
      });

      steps.push({
        type: 'MARK_SORTED',
        indices: [i],
        description: `Node ${input[i]} is now reversed`,
        codeLine: 6,
        variables: { prev: input[i] }
      });
    }

    return steps;
  }
};
