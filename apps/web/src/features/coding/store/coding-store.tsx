"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { Language } from "../services/coding.types";

interface CodingState {
  language: Language;
  code: string;
  theme: "vs-dark" | "light";
  fontSize: number;
  wordWrap: "on" | "off";
  minimap: boolean;
  isFullscreen: boolean;
  isConsoleOpen: boolean;
  isProblemPanelOpen: boolean;
  consoleTab: "testcases" | "result";
}

type CodingAction =
  | { type: "SET_LANGUAGE"; payload: Language }
  | { type: "SET_CODE"; payload: string }
  | { type: "SET_THEME"; payload: "vs-dark" | "light" }
  | { type: "SET_FONT_SIZE"; payload: number }
  | { type: "TOGGLE_WORD_WRAP" }
  | { type: "TOGGLE_MINIMAP" }
  | { type: "TOGGLE_FULLSCREEN" }
  | { type: "TOGGLE_CONSOLE" }
  | { type: "TOGGLE_PROBLEM_PANEL" }
  | { type: "SET_CONSOLE_TAB"; payload: "testcases" | "result" }
  | { type: "OPEN_CONSOLE_WITH_RESULT" }
  | { type: "RESET_STATE" };

const initialState: CodingState = {
  language: "typescript",
  code: "",
  theme: "vs-dark",
  fontSize: 14,
  wordWrap: "on",
  minimap: false,
  isFullscreen: false,
  isConsoleOpen: true,
  isProblemPanelOpen: true,
  consoleTab: "testcases",
};

function codingReducer(state: CodingState, action: CodingAction): CodingState {
  switch (action.type) {
    case "SET_LANGUAGE":
      return { ...state, language: action.payload };
    case "SET_CODE":
      return { ...state, code: action.payload };
    case "SET_THEME":
      return { ...state, theme: action.payload };
    case "SET_FONT_SIZE":
      return { ...state, fontSize: action.payload };
    case "TOGGLE_WORD_WRAP":
      return { ...state, wordWrap: state.wordWrap === "on" ? "off" : "on" };
    case "TOGGLE_MINIMAP":
      return { ...state, minimap: !state.minimap };
    case "TOGGLE_FULLSCREEN":
      return { ...state, isFullscreen: !state.isFullscreen };
    case "TOGGLE_CONSOLE":
      return { ...state, isConsoleOpen: !state.isConsoleOpen };
    case "TOGGLE_PROBLEM_PANEL":
      return { ...state, isProblemPanelOpen: !state.isProblemPanelOpen };
    case "SET_CONSOLE_TAB":
      return { ...state, consoleTab: action.payload, isConsoleOpen: true };
    case "OPEN_CONSOLE_WITH_RESULT":
      return { ...state, consoleTab: "result", isConsoleOpen: true };
    case "RESET_STATE":
      return { ...initialState };
    default:
      return state;
  }
}

const CodingContext = createContext<{
  state: CodingState;
  dispatch: React.Dispatch<CodingAction>;
} | null>(null);

export function CodingProvider({ children, initialLanguage, initialCode }: { children: ReactNode, initialLanguage?: Language, initialCode?: string }) {
  const [state, dispatch] = useReducer(codingReducer, {
    ...initialState,
    language: initialLanguage || initialState.language,
    code: initialCode || initialState.code,
  });

  return (
    <CodingContext.Provider value={{ state, dispatch }}>
      {children}
    </CodingContext.Provider>
  );
}

export function useCodingStore() {
  const context = useContext(CodingContext);
  if (!context) {
    throw new Error("useCodingStore must be used within a CodingProvider");
  }
  return context;
}
