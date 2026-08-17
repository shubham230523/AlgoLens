export type PathDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  algorithmIds: string[];
  difficulty: PathDifficulty;
  icon: string;
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'sorting-master',
    title: 'Sorting Master',
    description: 'Learn the fundamentals of sorting, from simple swaps to efficient divide-and-conquer.',
    algorithmIds: ['bubble-sort', 'selection-sort', 'insertion-sort'],
    difficulty: 'Beginner',
    icon: 'list-ordered',
  },
  {
    id: 'search-pro',
    title: 'Search Pro',
    description: 'Master the art of finding data quickly using linear and logarithmic search techniques.',
    algorithmIds: ['linear-search', 'binary-search'],
    difficulty: 'Beginner',
    icon: 'search',
  },
  {
    id: 'tree-explorer',
    title: 'Tree Explorer',
    description: 'Dive into hierarchical data structures and learn how to navigate them efficiently.',
    algorithmIds: ['bst-search'],
    difficulty: 'Intermediate',
    icon: 'tree-pine',
  },
];

export const getLearningPathById = (id: string) =>
  LEARNING_PATHS.find(path => path.id === id);
