"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SupportedLanguage = 'javascript' | 'typescript' | 'python' | 'java' | 'cpp' | 'go' | 'rust' | 'kotlin';

export type ExecutionStatus = 'idle' | 'preparing' | 'compiling' | 'running' | 'completed' | 'error';
export type ExecutionResultStatus = 'Accepted' | 'Wrong Answer' | 'Compilation Error' | 'Runtime Error' | 'Time Limit Exceeded' | 'Memory Limit Exceeded' | null;

export interface TestCaseResult {
  id: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  executionTime: number;
}

export interface ExecutionResult {
  id: string;
  status: ExecutionResultStatus;
  runtime: number; // ms
  memory: number; // MB
  testCases: TestCaseResult[];
  stdout: string;
  stderr: string;
  compilerMessage: string;
  language: SupportedLanguage;
  timestamp: number;
}

interface WorkspaceState {
  // Settings
  language: SupportedLanguage;
  theme: 'vs-dark' | 'light';
  fontSize: number;
  wordWrap: 'on' | 'off';
  minimap: boolean;
  
  // Layout State
  isFullscreen: boolean;
  panelSizes: [number, number]; // [Problem, RightColumn]
  rightPanelSizes: [number, number]; // [Editor, Console]
  isConsoleOpen: boolean;
  isProblemPanelOpen: boolean;
  activeConsoleTab: string;
  
  // Editor State
  code: Record<string, string>; // Maps problemId_language to code string
  isDirty: boolean;
  lastSavedAt: number | null;
  
  // Execution State
  executionStatus: ExecutionStatus;
  currentResult: ExecutionResult | null;
  executionHistory: Record<string, ExecutionResult[]>; // problemId -> History
  
  // Actions
  setLanguage: (lang: SupportedLanguage) => void;
  setTheme: (theme: 'vs-dark' | 'light') => void;
  setFontSize: (size: number) => void;
  setWordWrap: (wrap: 'on' | 'off') => void;
  setMinimap: (show: boolean) => void;
  
  setFullscreen: (val: boolean) => void;
  setPanelSizes: (sizes: [number, number]) => void;
  setRightPanelSizes: (sizes: [number, number]) => void;
  setConsoleOpen: (val: boolean) => void;
  setProblemPanelOpen: (val: boolean) => void;
  setActiveConsoleTab: (tab: string) => void;
  
  updateCode: (problemId: string, lang: SupportedLanguage, newCode: string) => void;
  saveCode: () => void;
  resetCode: (problemId: string, lang: SupportedLanguage, defaultCode: string) => void;

  // Execution Actions
  runCode: (problemId: string) => void;
  clearConsole: () => void;
  clearHistory: (problemId: string) => void;
}

const mockRunExecution = async (set: (state: Partial<WorkspaceState> | ((state: WorkspaceState) => Partial<WorkspaceState>)) => void, get: () => WorkspaceState, problemId: string) => {
  const { language } = get();
  
  set({ executionStatus: 'preparing', activeConsoleTab: 'output', isConsoleOpen: true });
  await new Promise(r => setTimeout(r, 600));
  
  set({ executionStatus: 'compiling' });
  await new Promise(r => setTimeout(r, 800));
  
  set({ executionStatus: 'running' });
  await new Promise(r => setTimeout(r, 1200));

  // Generate mock result
  const passed = Math.random() > 0.3; // 70% chance to pass
  
  const mockResult: ExecutionResult = {
    id: Math.random().toString(36).substr(2, 9),
    status: passed ? 'Accepted' : 'Wrong Answer',
    runtime: Math.floor(Math.random() * 50) + 10,
    memory: parseFloat((Math.random() * 10 + 30).toFixed(1)),
    testCases: [
      {
        id: "case-1",
        input: "nums = [2,7,11,15], target = 9",
        expectedOutput: "[0,1]",
        actualOutput: passed ? "[0,1]" : "[1,2]",
        passed: passed,
        executionTime: 2
      },
      {
        id: "case-2",
        input: "nums = [3,2,4], target = 6",
        expectedOutput: "[1,2]",
        actualOutput: passed ? "[1,2]" : "[]",
        passed: passed,
        executionTime: 3
      }
    ],
    stdout: passed ? "Executing test cases...\nTest 1 passed.\nTest 2 passed.\nAll tests passed successfully!" : "Executing test cases...\nTest 1 failed.\nTest 2 failed.",
    stderr: "",
    compilerMessage: "Compiled successfully in 0.8s",
    language,
    timestamp: Date.now()
  };

  set((state: WorkspaceState) => {
    const prevHistory = state.executionHistory[problemId] || [];
    return {
      executionStatus: 'completed',
      currentResult: mockResult,
      executionHistory: {
        ...state.executionHistory,
        [problemId]: [mockResult, ...prevHistory]
      }
    };
  });
  
  // Reset status after a delay so UI can show completion before going back to idle
  setTimeout(() => {
    set({ executionStatus: 'idle' });
  }, 2000);
};

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      // Defaults
      language: 'javascript',
      theme: 'vs-dark',
      fontSize: 14,
      wordWrap: 'on',
      minimap: false,
      
      isFullscreen: false,
      panelSizes: [40, 60],
      rightPanelSizes: [70, 30],
      isConsoleOpen: true,
      isProblemPanelOpen: true,
      activeConsoleTab: 'testcases',
      
      code: {},
      isDirty: false,
      lastSavedAt: null,
      
      executionStatus: 'idle',
      currentResult: null,
      executionHistory: {},
      
      setLanguage: (lang) => set({ language: lang }),
      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      setWordWrap: (wordWrap) => set({ wordWrap }),
      setMinimap: (minimap) => set({ minimap }),
      
      setFullscreen: (isFullscreen) => set({ isFullscreen }),
      setPanelSizes: (panelSizes) => set({ panelSizes }),
      setRightPanelSizes: (rightPanelSizes) => set({ rightPanelSizes }),
      setConsoleOpen: (isConsoleOpen) => set({ isConsoleOpen }),
      setProblemPanelOpen: (isProblemPanelOpen) => set({ isProblemPanelOpen }),
      setActiveConsoleTab: (activeConsoleTab) => set({ activeConsoleTab }),
      
      updateCode: (problemId, lang, newCode) => set((state) => ({
        code: { ...state.code, [`${problemId}_${lang}`]: newCode },
        isDirty: true
      })),
      
      saveCode: () => set({ isDirty: false, lastSavedAt: Date.now() }),
      
      resetCode: (problemId, lang, defaultCode) => set((state) => ({
        code: { ...state.code, [`${problemId}_${lang}`]: defaultCode },
        isDirty: true
      })),

      runCode: (problemId) => {
        const { executionStatus } = get();
        if (executionStatus !== 'idle' && executionStatus !== 'completed' && executionStatus !== 'error') return;
        mockRunExecution(set, get, problemId);
      },
      
      clearConsole: () => set({ currentResult: null }),
      
      clearHistory: (problemId) => set((state) => ({
        executionHistory: {
          ...state.executionHistory,
          [problemId]: []
        }
      })),
    }),
    {
      name: 'interview-iq-workspace-store',
      partialize: (state) => ({
        language: state.language,
        theme: state.theme,
        fontSize: state.fontSize,
        wordWrap: state.wordWrap,
        minimap: state.minimap,
        panelSizes: state.panelSizes,
        rightPanelSizes: state.rightPanelSizes,
        code: state.code,
        executionHistory: state.executionHistory, // Persist history locally
      }),
    }
  )
);
