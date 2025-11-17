import axios from 'axios';
import type { ProblemResponse, HealthResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Health check
  async healthCheck(): Promise<HealthResponse> {
    const response = await api.get<HealthResponse>('/api/health');
    return response.data;
  },

  // Get today's problem
  async getTodayProblem(): Promise<ProblemResponse> {
    const response = await api.get<ProblemResponse>('/api/problems/today');
    return response.data;
  },

  // Get problem by date
  async getProblemByDate(date: string): Promise<ProblemResponse> {
    const response = await api.get<ProblemResponse>(`/api/problems/${date}`);
    return response.data;
  },
};

export default api;
