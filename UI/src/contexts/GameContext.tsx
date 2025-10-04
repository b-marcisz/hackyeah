import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameResponse, StartGameRequest } from '../types';
import { gameApi } from '../services/api';

interface GameState {
  currentGame: GameResponse | null;
  isLoading: boolean;
  error: string | null;
  gameHistory: GameResponse[];
}

type GameAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_GAME'; payload: GameResponse | null }
  | { type: 'UPDATE_GAME'; payload: GameResponse }
  | { type: 'ADD_TO_HISTORY'; payload: GameResponse }
  | { type: 'CLEAR_CURRENT_GAME' };

const initialState: GameState = {
  currentGame: null,
  isLoading: false,
  error: null,
  gameHistory: [],
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_CURRENT_GAME':
      return { ...state, currentGame: action.payload, error: null };
    case 'UPDATE_GAME':
      return { ...state, currentGame: action.payload, error: null };
    case 'ADD_TO_HISTORY':
      return {
        ...state,
        gameHistory: [action.payload, ...state.gameHistory.slice(0, 9)], // Keep last 10 games
      };
    case 'CLEAR_CURRENT_GAME':
      return { ...state, currentGame: null, error: null };
    default:
      return state;
  }
}

interface GameContextType {
  state: GameState;
  startGame: (request: StartGameRequest) => Promise<void>;
  getGame: (gameId: string) => Promise<void>;
  submitAnswer: (gameId: string, answer: Record<string, unknown>, timeSpentMs?: number) => Promise<void>;
  submitFeedback: (gameId: string, message: string, rating?: number) => Promise<void>;
  clearError: () => void;
  clearCurrentGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const startGame = async (request: StartGameRequest) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const game = await gameApi.startGame(request);
      dispatch({ type: 'SET_CURRENT_GAME', payload: game });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to start game';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getGame = async (gameId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const game = await gameApi.getGame(gameId);
      dispatch({ type: 'SET_CURRENT_GAME', payload: game });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load game';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const submitAnswer = async (gameId: string, answer: Record<string, unknown>, timeSpentMs?: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const game = await gameApi.submitAnswer(gameId, { answer, timeSpentMs });
      dispatch({ type: 'UPDATE_GAME', payload: game });
      dispatch({ type: 'ADD_TO_HISTORY', payload: game });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit answer';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const submitFeedback = async (gameId: string, message: string, rating?: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const game = await gameApi.submitFeedback(gameId, { message, rating });
      dispatch({ type: 'UPDATE_GAME', payload: game });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit feedback';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const clearCurrentGame = () => {
    dispatch({ type: 'CLEAR_CURRENT_GAME' });
  };

  const value: GameContextType = {
    state,
    startGame,
    getGame,
    submitAnswer,
    submitFeedback,
    clearError,
    clearCurrentGame,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
