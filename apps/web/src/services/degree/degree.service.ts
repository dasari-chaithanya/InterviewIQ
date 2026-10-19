import { apiClient } from '@/lib/api/api.client';

export interface GetDegreesResponse {
  status: string;
  data: {
    degrees: string[];
  };
}

export const degreeService = {
  async getDegrees(search?: string): Promise<string[]> {
    const params = search ? { search } : {};
    const response = await apiClient.get<GetDegreesResponse>('/degrees', { params });
    return response.data.data.degrees;
  },
};
