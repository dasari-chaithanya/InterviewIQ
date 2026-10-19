export interface ResumeVersion {
  id: string;
  versionNumber: number;
  uploadDate: string;
}

export interface Resume {
  id: string;
  filename: string;
  fileSize: number; // in bytes
  uploadDate: string;
  status: "Ready" | "Processing" | "Error";
  versions: ResumeVersion[];
  aiAnalyzed: boolean; // flag for EPIC 4B
}

export interface UploadResponse {
  success: boolean;
  resume?: Resume;
  error?: string;
}
