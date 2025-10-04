import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { GameType, GameState } from '../types';
import MatchHaoGame from '../components/games/MatchHaoGame';
import MemoryFlashGame from '../components/games/MemoryFlashGame';
import SpeedRecallGame from '../components/games/SpeedRecallGame';
import NumberStoryGame from '../components/games/NumberStoryGame';
import AssociationDuelGame from '../components/games/AssociationDuelGame';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const GamePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { state, getGame, clearError } = useGame();
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (gameId && !state.currentGame) {
      getGame(gameId);
    }
  }, [gameId, state.currentGame, getGame]);

  useEffect(() => {
    if (state.currentGame && state.currentGame.status === 'in_progress' && !startTime) {
      setStartTime(Date.now());
    }
  }, [state.currentGame, startTime]);

  const handleGameComplete = () => {
    if (state.currentGame) {
      navigate(`/game/${state.currentGame.id}/result`);
    }
  };

  if (state.isLoading && !state.currentGame) {
    return <LoadingSpinner message="Ładowanie gry..." />;
  }

  if (state.error) {
    return (
      <ErrorMessage 
        message={state.error} 
        onRetry={() => gameId && getGame(gameId)}
        onClose={clearError}
      />
    );
  }

  if (!state.currentGame) {
    return (
      <ErrorMessage 
        message="Gra nie została znaleziona" 
        onRetry={() => navigate('/')}
        onClose={() => navigate('/')}
      />
    );
  }

  const gameState = state.currentGame?.state as unknown as GameState;
  const gameProps = {
    game: state.currentGame!,
    gameState,
    onComplete: handleGameComplete,
    startTime,
  };

  const renderGame = () => {
    if (!state.currentGame) return null;
    
    switch (state.currentGame.type) {
      case GameType.MATCH_HAO:
        return <MatchHaoGame {...gameProps} />;
      case GameType.MEMORY_FLASH:
        return <MemoryFlashGame {...gameProps} />;
      case GameType.SPEED_RECALL:
        return <SpeedRecallGame {...gameProps} />;
      case GameType.NUMBER_STORY:
        return <NumberStoryGame {...gameProps} />;
      case GameType.ASSOCIATION_DUEL:
        return <AssociationDuelGame {...gameProps} />;
      default:
        return (
          <div className="card text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Nieznany typ gry
            </h2>
            <p className="text-gray-600 mb-6">
              Typ gry "{state.currentGame.type}" nie jest obsługiwany
            </p>
            <button 
              onClick={() => navigate('/')}
              className="btn btn-primary"
            >
              Wróć do głównej
            </button>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button 
          onClick={() => navigate('/')}
          className="btn btn-secondary mb-4"
        >
          ← Wróć do gier
        </button>
        
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-white">
            {getGameTypeName(state.currentGame?.type || GameType.MATCH_HAO)}
          </h1>
          <div className="text-white/80">
            Liczba: <span className="font-bold text-2xl">{state.currentGame?.number}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-6 text-white/80">
          <div className="flex items-center space-x-2">
            <span>Trudność:</span>
            <div className="flex space-x-1">
              {Array.from({ length: 5 }, (_, i) => (
                <div 
                  key={i} 
                  className={`w-3 h-3 rounded-full ${
                    i < (state.currentGame?.difficulty || 0) ? 'bg-yellow-400' : 'bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
          <div>
            Punkty: <span className="font-bold">{state.currentGame?.points}</span>
          </div>
          <div>
            XP: <span className="font-bold">{state.currentGame?.xp}</span>
          </div>
        </div>
      </div>

      {renderGame()}
    </div>
  );
};

const getGameTypeName = (type: GameType): string => {
  const names = {
    [GameType.MATCH_HAO]: 'Dopasuj HAO',
    [GameType.MEMORY_FLASH]: 'Błysk Pamięci',
    [GameType.SPEED_RECALL]: 'Szybkie Przypomnienie',
    [GameType.NUMBER_STORY]: 'Historia Liczby',
    [GameType.ASSOCIATION_DUEL]: 'Pojedynek Skojarzeń',
  };
  return names[type] || type;
};

export default GamePage;
