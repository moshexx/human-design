import axios from 'axios';
import type { ChartRequest, ChartResponse } from '../types/chart';

export async function generateChart(data: ChartRequest): Promise<ChartResponse> {
  try {
    const response = await axios.post<ChartResponse>('/api/v1/generate-chart', data);
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const msg = err.response?.data?.detail ?? err.message;
      throw new Error(typeof msg === 'string' ? msg : 'Could not generate chart. Please check your details.');
    }
    throw new Error('An unexpected error occurred.');
  }
}
