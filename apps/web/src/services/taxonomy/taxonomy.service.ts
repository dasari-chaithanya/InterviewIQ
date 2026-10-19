import { apiClient } from "@/lib/api/api.client";

export interface TaxonomyRole {
  slug: string;
  name: string;
  description?: string | null;
}

export const taxonomyService = {
  async getRoles(search?: string): Promise<TaxonomyRole[]> {
    const response = await apiClient.get("/question-bank/roles", {
      params: search ? { search } : {},
    });
    return response.data?.data?.roles || [];
  },
};
