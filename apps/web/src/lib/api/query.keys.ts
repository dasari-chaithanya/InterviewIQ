export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  resumes: {
    all: ['resumes'] as const,
    detail: (id: string) => ['resumes', id] as const,
  },
  dashboard: {
    summary: ['dashboard', 'summary'] as const,
  },
  interviews: {
    all: ['interviews'] as const,
    detail: (id: string) => ['interviews', id] as const,
    evaluation: (id: string) => ['interviews', 'evaluation', id] as const,
  },
  coding: {
    problems: ['coding', 'problems'] as const,
    problemDetail: (id: string) => ['coding', 'problems', id] as const,
    workspaces: ['coding', 'workspaces'] as const,
    workspaceDetail: (id: string) => ['coding', 'workspaces', id] as const,
    execution: (id: string) => ['coding', 'executions', id] as const,
    submission: (id: string) => ['coding', 'submissions', id] as const,
    review: (id: string) => ['coding', 'reviews', id] as const,
  },
  analytics: {
    interview: ['analytics', 'interview'] as const,
    coding: ['analytics', 'coding'] as const,
    achievements: ['analytics', 'achievements'] as const,
    learningHub: ['analytics', 'learningHub'] as const,
  },
};
