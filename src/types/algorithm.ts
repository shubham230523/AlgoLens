export type AlgorithmDifficulty = 'Easy' | 'Medium' | 'Hard';

export type VisualizationEventType =
  | 'COMPARE'
  | 'SWAP'
  | 'VISIT'
  | 'HIGHLIGHT'
  | 'SELECT'
  | 'DESELECT'
  | 'MARK_SORTED'
  | 'MOVE_POINTER'
  | 'UPDATE_VALUE'
  | 'SUBARRAY_FOCUS'
  | 'MERGE_STEP';

export interface VisualizationEvent {
  type: VisualizationEventType;
  indices: number[];
  description: string;
  codeLine?: number;
  variables?: Record<string, any>;
}

export interface AlgorithmMetadata {
  id: string;
  name: string;
  category: string;
  difficulty: AlgorithmDifficulty;
  description: string;
  complexities: {
    time: string;
    space: string;
  };
}

export interface AlgorithmDefinition extends AlgorithmMetadata {
  generateSteps: (input: any) => VisualizationEvent[];
  defaultInput: any;
  visualizationType: 'ARRAY' | 'BAR' | 'LINKED_LIST' | 'TREE' | 'GRAPH' | 'RECURSION';
  code: string;
}
