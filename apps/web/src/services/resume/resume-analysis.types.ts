export interface Skill {
  name: string;
  category: "Frontend" | "Backend" | "Database" | "Cloud" | "DevOps" | "Languages" | "Tools" | "Frameworks" | "Soft Skills";
  confidence: number; // 0-100
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  technologies: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  complexity: "Low" | "Medium" | "High";
  strengths: string[];
  weaknesses: string[];
}

export interface Education {
  degree: string;
  university: string;
  graduationYear: string;
  isComplete: boolean;
}

export interface ImprovementSuggestion {
  id: string;
  category: "Missing Skills" | "Weak Bullet Points" | "Missing Metrics" | "Formatting Issues" | "Technical Improvements" | "Writing Improvements";
  priority: "Low" | "Medium" | "High";
  estimatedImpact: "Low" | "Medium" | "High";
  whyItMatters: string;
  suggestion: string;
}

export interface RoleMatch {
  role: string;
  matchPercentage: number;
  missingSkills: string[];
  recommendedLearning: string[];
}

export interface CompanyMatch {
  company: string;
  matchScore: number;
  strengths: string[];
  weakAreas: string[];
}

export interface ReadinessTopic {
  topic: string;
  score: number; // 0-100
}

export interface ResumeAnalysis {
  resumeId: string;
  overallScore: number;
  atsCompatibility: number;
  interviewReadiness: number;
  profileCompleteness: number;
  lastAnalysisDate: string;
  
  skills: Skill[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
  
  strengths: string[];
  improvements: ImprovementSuggestion[];
  insights: string[];
  
  roleMatches: RoleMatch[];
  companyMatches: CompanyMatch[];
  readinessByTopic: ReadinessTopic[];
}
