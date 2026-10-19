"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SupportedLanguage } from '../../workspace/store/use-workspace-store';
import { ExecutionResultStatus } from '../../workspace/store/use-workspace-store';

export type PipelineStage = 'idle' | 'uploading' | 'preparing' | 'compiling' | 'testing' | 'evaluating' | 'completed' | 'error';

export interface HiddenTestResult {
  id: string;
  passed: boolean;
  skipped: boolean;
  runtime: number;
  memory: number;
}

export interface SubmissionResult {
  id: string;
  problemId: string;
  status: ExecutionResultStatus;
  runtime: number;
  memory: number;
  hiddenTestsTotal: number;
  hiddenTestsPassed: number;
  hiddenTestDetails: HiddenTestResult[];
  language: SupportedLanguage;
  timestamp: number;
}

interface SubmissionState {
  // State
  isSubmitDialogOpen: boolean;
  submissionStage: PipelineStage;
  currentSubmissionId: string | null;
  latestSubmissions: Record<string, SubmissionResult>; // problemId -> SubmissionResult
  
  // Actions
  setSubmitDialogOpen: (isOpen: boolean) => void;
  startSubmission: (problemId: string, language: SupportedLanguage) => void;
  clearSubmission: (problemId: string) => void;
}

const mockSubmissionFlow = async (set: (state: Partial<SubmissionState> | ((state: SubmissionState) => Partial<SubmissionState>)) => void, get: () => SubmissionState, problemId: string, language: SupportedLanguage) => {
  set({ isSubmitDialogOpen: false, submissionStage: 'uploading', currentSubmissionId: null });
  
  const wait = (ms: number) => new Promise(r => setTimeout(r, ms));
  
  await wait(500);
  set({ submissionStage: 'preparing' });
  await wait(600);
  
  set({ submissionStage: 'compiling' });
  await wait(800);
  
  set({ submissionStage: 'testing' });
  await wait(1200);
  
  set({ submissionStage: 'evaluating' });
  await wait(600);
  
  // Generate mock submission result
  const passed = Math.random() > 0.4; // 60% pass rate for mock
  const totalHiddenTests = Math.floor(Math.random() * 20) + 30; // 30 to 50 hidden tests
  const testsPassed = passed ? totalHiddenTests : Math.floor(Math.random() * totalHiddenTests);
  
  const hiddenTestDetails: HiddenTestResult[] = Array.from({ length: totalHiddenTests }).map((_, i) => ({
    id: `hidden-${i}`,
    passed: i < testsPassed,
    skipped: !passed && i >= testsPassed + 1, // Skip tests after failure
    runtime: Math.floor(Math.random() * 10) + 1,
    memory: parseFloat((Math.random() * 2 + 30).toFixed(1))
  }));

  const mockResult: SubmissionResult = {
    id: `sub-${Math.random().toString(36).substr(2, 9)}`,
    problemId,
    status: passed ? 'Accepted' : 'Wrong Answer',
    runtime: passed ? Math.floor(Math.random() * 50) + 20 : 0,
    memory: passed ? parseFloat((Math.random() * 10 + 35).toFixed(1)) : 0,
    hiddenTestsTotal: totalHiddenTests,
    hiddenTestsPassed: testsPassed,
    hiddenTestDetails,
    language,
    timestamp: Date.now()
  };

  set((state: SubmissionState) => ({
    submissionStage: 'completed',
    currentSubmissionId: mockResult.id,
    latestSubmissions: {
      ...state.latestSubmissions,
      [problemId]: mockResult
    }
  }));
};

export const useSubmissionStore = create<SubmissionState>()(
  persist(
    (set, get) => ({
      isSubmitDialogOpen: false,
      submissionStage: 'idle',
      currentSubmissionId: null,
      latestSubmissions: {},
      
      setSubmitDialogOpen: (isOpen) => set({ isSubmitDialogOpen: isOpen }),
      
      startSubmission: (problemId, language) => {
        const { submissionStage } = get();
        if (submissionStage !== 'idle' && submissionStage !== 'completed' && submissionStage !== 'error') return;
        mockSubmissionFlow(set, get, problemId, language);
      },
      
      clearSubmission: (problemId) => set({ submissionStage: 'idle', currentSubmissionId: null }),
    }),
    {
      name: 'interview-iq-submission-store',
      partialize: (state) => ({
        latestSubmissions: state.latestSubmissions
      }),
    }
  )
);
