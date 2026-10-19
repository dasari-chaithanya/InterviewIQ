import { apiClient } from "@/lib/api/api.client";
import { Resume } from "./resume.types";

export const resumeService = {
  async getResumes(): Promise<Resume[]> {
    const response = await apiClient.get("/resumes");
    return response.data.data.resumes;
  },

  async getResume(id: string): Promise<Resume> {
    const response = await apiClient.get(`/resumes/${id}`);
    return response.data.data.resume;
  },

  async uploadResume(file: File): Promise<Resume> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post("/resumes", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data.resume;
  },

  async deleteResume(id: string): Promise<void> {
    await apiClient.delete(`/resumes/${id}`);
  },

  async setPrimary(id: string): Promise<Resume> {
    const response = await apiClient.patch(`/resumes/${id}/primary`);
    return response.data.data.resume;
  },

  async getDownloadUrl(id: string): Promise<string> {
    const response = await apiClient.get(`/resumes/${id}/download`);
    return response.data.data.downloadUrl;
  }
};
