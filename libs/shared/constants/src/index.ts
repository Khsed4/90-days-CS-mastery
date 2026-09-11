import { ProgrammingLanguage } from '@shared/types';

export const USER_ROLES = {
  USER: 'USER',
  ORGANIZATION: 'ORGANIZATION',
  ADMIN: 'ADMIN',
} as const;

export const DIFFICULTY_LEVELS = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
} as const;

export const CHALLENGE_TYPES = {
  CORE: 'CORE',
  BONUS: 'BONUS',
} as const;

export const CHALLENGE_STATUSES = {
  /** Globally visible to all users — approved by platform admin */
  APPROVED: 'APPROVED',
  /** Visible to all members of the submitting organization — approved by org manager */
  ORG_APPROVED: 'ORG_APPROVED',
  /** Awaiting review by the organization manager — submitted by an org member */
  PENDING_ORG: 'PENDING_ORG',
  /** Awaiting review by a platform admin — submitted by a standalone user */
  PENDING: 'PENDING',
  /** Rejected at org or admin level */
  REJECTED: 'REJECTED',
} as const;

export const INTERFACE_LANGUAGES = {
  EN: 'en',
} as const;

// ==========================================
// Programming Languages
// ==========================================

export interface ProgrammingLanguageMeta {
  id: ProgrammingLanguage;
  name: string;
  icon: string;
  fileExtension: string;
  monacoLanguage: string;
  color: string;
}

export const PROGRAMMING_LANGUAGES: ProgrammingLanguageMeta[] = [
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: '🔷',
    fileExtension: '.ts',
    monacoLanguage: 'typescript',
    color: '#3178C6',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: '🟡',
    fileExtension: '.js',
    monacoLanguage: 'javascript',
    color: '#F7DF1E',
  },
  {
    id: 'java',
    name: 'Java',
    icon: '☕',
    fileExtension: '.java',
    monacoLanguage: 'java',
    color: '#ED8B00',
  },
  {
    id: 'python',
    name: 'Python',
    icon: '🐍',
    fileExtension: '.py',
    monacoLanguage: 'python',
    color: '#3776AB',
  },
  {
    id: 'cpp',
    name: 'C++',
    icon: '⚙️',
    fileExtension: '.cpp',
    monacoLanguage: 'cpp',
    color: '#00599C',
  },
  {
    id: 'c',
    name: 'C',
    icon: '🔵',
    fileExtension: '.c',
    monacoLanguage: 'c',
    color: '#A8B9CC',
  },
  {
    id: 'csharp',
    name: 'C#',
    icon: '💜',
    fileExtension: '.cs',
    monacoLanguage: 'csharp',
    color: '#9B4F96',
  },
  {
    id: 'php',
    name: 'PHP',
    icon: '🐘',
    fileExtension: '.php',
    monacoLanguage: 'php',
    color: '#777BB4',
  },
  {
    id: 'go',
    name: 'Go',
    icon: '🐹',
    fileExtension: '.go',
    monacoLanguage: 'go',
    color: '#00ADD8',
  },
  {
    id: 'rust',
    name: 'Rust',
    icon: '🦀',
    fileExtension: '.rs',
    monacoLanguage: 'rust',
    color: '#CE412B',
  },
];

// ==========================================
// CS Challenge Categories
// ==========================================

export interface CategoryMeta {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const CS_CATEGORIES: CategoryMeta[] = [
  {
    id: 'arrays-hashing',
    name: 'Arrays & Hashing',
    icon: '📦',
    description: 'Hash maps, sets, frequency counters',
  },
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    icon: '👆',
    description: 'Dual traversal & sliding window patterns',
  },
  {
    id: 'stack',
    name: 'Stack',
    icon: '📚',
    description: 'Monotonic stacks, parenthesis problems',
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    icon: '🔍',
    description: 'Divide and conquer search strategies',
  },
  {
    id: 'linked-list',
    name: 'Linked List',
    icon: '🔗',
    description: 'Pointer manipulation, reversal, merge',
  },
  {
    id: 'trees',
    name: 'Trees',
    icon: '🌲',
    description: 'BST, DFS, BFS, traversal patterns',
  },
  {
    id: 'tries',
    name: 'Tries',
    icon: '🌳',
    description: 'Prefix trees for string problems',
  },
  {
    id: 'heap-priority-queue',
    name: 'Heap / Priority Queue',
    icon: '⛰️',
    description: 'Min/max heaps and scheduling',
  },
  {
    id: 'backtracking',
    name: 'Backtracking',
    icon: '↩️',
    description: 'State-space exploration and pruning',
  },
  {
    id: 'graphs',
    name: 'Graphs',
    icon: '🕸️',
    description: 'DFS, BFS, topological sort, union-find',
  },
  {
    id: 'dynamic-programming',
    name: 'Dynamic Programming',
    icon: '📊',
    description: 'Memoization, tabulation, optimal substructure',
  },
  {
    id: 'bit-manipulation',
    name: 'Bit Manipulation',
    icon: '🔢',
    description: 'Bitwise operators and tricks',
  },
  {
    id: 'math-geometry',
    name: 'Math & Geometry',
    icon: '📐',
    description: 'Number theory, matrix ops, coordinate math',
  },
  {
    id: 'intervals',
    name: 'Intervals',
    icon: '📏',
    description: 'Merging, inserting, and overlapping ranges',
  },
  {
    id: 'greedy',
    name: 'Greedy',
    icon: '🏆',
    description: 'Locally optimal choices for global solutions',
  },
  {
    id: 'sorting',
    name: 'Sorting',
    icon: '🗂️',
    description: 'Comparison-based and linear sorting algorithms',
  },
  {
    id: 'concurrency',
    name: 'Concurrency',
    icon: '⚡',
    description: 'Threads, locks, semaphores, async patterns',
  },
  {
    id: 'system-design',
    name: 'System Design',
    icon: '🏗️',
    description: 'Scalable distributed systems and architecture',
  },
];

export const DEFAULT_TRIAL_DAYS = [1, 2, 3];
export const TOTAL_ROADMAP_DAYS = 90;
