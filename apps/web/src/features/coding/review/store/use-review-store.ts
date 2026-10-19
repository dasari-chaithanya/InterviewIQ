"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ReviewStage = 'idle' | 'analyzing' | 'complexity' | 'naming' | 'readability' | 'edge_cases' | 'optimizations' | 'summary' | 'completed' | 'error';

export interface CodeSmell {
  id: string;
  type: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  line: number;
}

export interface ReviewSuggestion {
  id: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  estimatedImprovement: string;
  example: string;
}

export interface AIReviewResult {
  id: string;
  submissionId: string;
  problemId: string;
  
  overallScore: number;
  correctnessScore: number;
  codeQualityScore: number;
  readabilityScore: number;
  maintainabilityScore: number;
  performanceScore: number;
  bestPracticesScore: number;

  detectedTimeComplexity: string;
  expectedTimeComplexity: string;
  detectedSpaceComplexity: string;
  expectedSpaceComplexity: string;
  complexityOptimization: string;

  readabilityFeedback: string;
  readabilitySuggestions: string[];

  maintainabilityFeedback: string;
  maintainabilitySuggestions: string[];

  namingFeedback: string;
  namingSuggestions: { from: string; to: string; reason: string }[];

  edgeCasesCovered: string[];
  edgeCasesMissing: string[];
  
  currentApproach: string;
  recommendedApproach: string;
  runtimeImprovement: string;
  memoryImprovement: string;
  
  codeSmells: CodeSmell[];
  strengths: string[];
  weaknesses: string[];
  topSuggestions: ReviewSuggestion[];
}

interface ReviewState {
  reviewStage: ReviewStage;
  latestReviews: Record<string, AIReviewResult>; // submissionId -> AIReviewResult
  isPanelExpanded: boolean;

  setPanelExpanded: (expanded: boolean) => void;
  generateReview: (problemId: string, submissionId: string) => void;
}

const mockGenerateReview = async (set: (state: Partial<ReviewState> | ((state: ReviewState) => Partial<ReviewState>)) => void, get: () => ReviewState, problemId: string, submissionId: string) => {
  set({ reviewStage: 'analyzing', isPanelExpanded: true });
  const wait = (ms: number) => new Promise(r => setTimeout(r, ms));
  
  await wait(600);
  set({ reviewStage: 'complexity' });
  await wait(600);
  set({ reviewStage: 'naming' });
  await wait(500);
  set({ reviewStage: 'readability' });
  await wait(500);
  set({ reviewStage: 'edge_cases' });
  await wait(600);
  set({ reviewStage: 'optimizations' });
  await wait(700);
  set({ reviewStage: 'summary' });
  await wait(500);

  const mockReview: AIReviewResult = {
    id: `rev-${Math.random().toString(36).substr(2, 9)}`,
    submissionId,
    problemId,
    
    overallScore: 85,
    correctnessScore: 100,
    codeQualityScore: 82,
    readabilityScore: 90,
    maintainabilityScore: 78,
    performanceScore: 70,
    bestPracticesScore: 88,

    detectedTimeComplexity: 'O(n²)',
    expectedTimeComplexity: 'O(n)',
    detectedSpaceComplexity: 'O(1)',
    expectedSpaceComplexity: 'O(n)',
    complexityOptimization: 'Use a HashMap to store the indices of elements you have already seen to eliminate the nested loop.',

    readabilityFeedback: 'The code is generally clean and uses consistent indentation, but variable names could be more descriptive.',
    readabilitySuggestions: ['Use explanatory variables', 'Add comments for the core logic'],

    maintainabilityFeedback: 'Function is concise but lacks modularity if the requirements change.',
    maintainabilitySuggestions: ['Extract the map lookup into a helper function', 'Check for empty inputs early'],

    namingFeedback: 'Avoid single-letter variables except for loop indices.',
    namingSuggestions: [
      { from: 'i', to: 'currentIndex', reason: 'More descriptive of the iteration state' },
      { from: 'm', to: 'seenNumbers', reason: 'Describes the map contents' }
    ],

    edgeCasesCovered: ['Positive integers', 'Exact match at the end'],
    edgeCasesMissing: ['Empty array', 'No match found', 'Negative numbers'],
    
    currentApproach: 'Brute Force Iteration',
    recommendedApproach: 'One-pass Hash Table',
    runtimeImprovement: 'From O(n²) to O(n) (Significant)',
    memoryImprovement: 'From O(1) to O(n) (Trade-off)',
    
    codeSmells: [
      { id: '1', type: 'Deep Nesting', severity: 'Medium', description: 'Double loop increases cognitive complexity.', line: 4 },
      { id: '2', type: 'Magic Numbers', severity: 'Low', description: 'Hardcoded 0 for not-found return.', line: 12 }
    ],
    
    strengths: ['Clear structure', 'Correct edge case handling for simple inputs', 'No redundant imports'],
    weaknesses: ['Suboptimal time complexity', 'Lacks input validation', 'Poor variable naming'],
    
    topSuggestions: [
      {
        id: 's1',
        category: 'Performance',
        priority: 'High',
        difficulty: 'Easy',
        description: 'Replace nested loops with a hash map lookup.',
        estimatedImprovement: 'O(n²) -> O(n)',
        example: 'const map = new Map(); ...'
      }
    ]
  };

  set((state: ReviewState) => ({
    reviewStage: 'completed',
    latestReviews: {
      ...state.latestReviews,
      [submissionId]: mockReview
    }
  }));
};

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      reviewStage: 'idle',
      latestReviews: {},
      isPanelExpanded: false,

      setPanelExpanded: (expanded) => set({ isPanelExpanded: expanded }),
      generateReview: (problemId, submissionId) => mockGenerateReview(set, get, problemId, submissionId)
    }),
    {
      name: 'interview-iq-review-store',
      partialize: (state) => ({
        latestReviews: state.latestReviews,
        isPanelExpanded: state.isPanelExpanded
      })
    }
  )
);
