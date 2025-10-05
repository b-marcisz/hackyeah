import axios from 'axios';
import { GameResponse, StartGameRequest, SubmitAnswerRequest, SubmitFeedbackRequest } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4000`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const gameApi = {
  // Start a new game
  startGame: async (data: StartGameRequest): Promise<GameResponse> => {
    const response = await api.post('/api/games/start', data);
    return response.data;
  },

  // Get game state
  getGame: async (gameId: string): Promise<GameResponse> => {
    const response = await api.get(`/api/games/${gameId}`);
    return response.data;
  },

  // Submit answer
  submitAnswer: async (gameId: string, data: SubmitAnswerRequest): Promise<GameResponse> => {
    const response = await api.post(`/api/games/${gameId}/answer`, data);
    return response.data;
  },

  // Get game result
  getGameResult: async (gameId: string): Promise<GameResponse> => {
    const response = await api.get(`/api/games/${gameId}/result`);
    return response.data;
  },

  // Submit feedback
  submitFeedback: async (gameId: string, data: SubmitFeedbackRequest): Promise<GameResponse> => {
    const response = await api.post(`/api/games/${gameId}/feedback`, data);
    return response.data;
  },
};

export default api;
