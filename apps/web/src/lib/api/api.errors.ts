import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

export interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export const handleApiError = (error: unknown, defaultMessage = 'An error occurred') => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const status = axiosError.response?.status;
    const data = axiosError.response?.data;
    const message = data?.message || defaultMessage;

    switch (status) {
      case 400:
        toast.error('Error', { description: message });
        break;
      case 401:
        toast.error('Unauthorized', { description: message || 'Please log in again.' });
        break;
      case 403:
        toast.error('Forbidden', { description: message || 'You do not have permission to perform this action.' });
        break;
      case 404:
        toast.error('Not Found', { description: message });
        break;
      case 409:
        toast.error('Conflict', { description: message });
        break;
      case 422:
        toast.error('Validation Error', { description: message });
        break;
      case 429:
        toast.error('Too Many Requests', { description: 'Please wait a moment before trying again.' });
        break;
      case 500:
        toast.error('Server Error', { description: 'Something went wrong on our end. Please try again later.' });
        break;
      default:
        if (!status) {
          toast.error('Network Error', { description: 'Could not connect to the server.' });
        } else {
          toast.error('Error', { description: message });
        }
    }
    return;
  }

  // Fallback for non-Axios errors
  if (error instanceof Error) {
    toast.error('Error', { description: error.message });
  } else {
    toast.error('Error', { description: defaultMessage });
  }
};
