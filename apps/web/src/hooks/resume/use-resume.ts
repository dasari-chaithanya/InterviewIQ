"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resumeService } from "@/services/resume/resume.service";
import { toast } from "sonner";
import { handleApiError } from "@/lib/api/api.errors";
import { queryKeys } from "@/lib/api/query.keys";

export function useResumes() {
  return useQuery({
    queryKey: queryKeys.resumes.all,
    queryFn: () => resumeService.getResumes(),
  });
}

export function useResume(id: string) {
  return useQuery({
    queryKey: queryKeys.resumes.detail(id),
    queryFn: () => resumeService.getResume(id),
    enabled: !!id,
  });
}

export function useUploadResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => resumeService.uploadResume(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resumes.all });
      toast.success("Resume uploaded successfully");
    },
    onError: (error: unknown) => {
      handleApiError(error, "Failed to upload resume");
    },
  });
}

export function useDeleteResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resumeService.deleteResume(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resumes.all });
      toast.success("Resume deleted");
    },
    onError: (error: unknown) => {
      handleApiError(error, "Failed to delete resume");
    },
  });
}
