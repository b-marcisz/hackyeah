import apiClient from '../client';
import { StartGameDto, GameResponse, SubmitAnswerDto, SubmitFeedbackDto } from '../types';

export const gamesService = {
  /**
   * Start a new game
   */
  startGame: async (dto: StartGameDto): Promise<GameResponse> => {
    const response = await apiClient.post<GameResponse>('/api/games/start', dto);
    return response.data;
  },

  /**
   * Get game by ID
   */
  getGame: async (gameId: string): Promise<GameResponse> => {
    const response = await apiClient.get<GameResponse>(`/api/games/${gameId}`);
    return response.data;
  },

  /**
   * Submit answer to a game
   */
  submitAnswer: async (gameId: string, dto: SubmitAnswerDto): Promise<GameResponse> => {
    const response = await apiClient.post<GameResponse>(`/api/games/${gameId}/answer`, dto);
    return response.data;
  },

  /**
   * Get game result
   */
  getResult: async (gameId: string): Promise<GameResponse> => {
    const response = await apiClient.get<GameResponse>(`/api/games/${gameId}/result`);
    return response.data;
  },

  /**
   * Submit feedback for a game
   */
  submitFeedback: async (gameId: string, dto: SubmitFeedbackDto): Promise<GameResponse> => {
    const response = await apiClient.post<GameResponse>(`/api/games/${gameId}/feedback`, dto);
    return response.data;
  },
};
