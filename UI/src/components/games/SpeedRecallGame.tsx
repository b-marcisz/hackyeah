import React, { useState, useRef, useEffect } from 'react';
import { GameResponse, GameState } from '../../types';
import { useGame } from '../../contexts/GameContext';
import { Clock, Send, RotateCcw } from 'lucide-react';

interface SpeedRecallGameProps {
  game: GameResponse;
  gameState: GameState;
  onComplete: () => void;
  startTime: number | null;
}

const SpeedRecallGame: React.FC<SpeedRecallGameProps> = ({ 
  game, 
  gameState, 
  onComplete, 
  startTime 
}) => {
  const { submitAnswer } = useGame();
  const [recallText, setRecallText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const association = gameState.association;
  const attempts = gameState.attempts || 0;

  // Timer
  useEffect(() => {
    if (startTime && !isSubmitting) {
      const interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [startTime, isSubmitting]);

  // Focus textarea on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSubmit = async () => {
    if (!recallText.trim()) {
      alert('Пожалуйста, введите ваш ответ');
      return;
    }

    setIsSubmitting(true);
    const timeSpent = startTime ? Date.now() - startTime : undefined;

    try {
      await submitAnswer(game.id, {
        recall: recallText.trim(),
      }, timeSpent);
      
      onComplete();
    } catch (error) {
      console.error('Failed to submit answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="card">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {gameState.prompt || `Вспомни ассоциацию для числа ${game.number}`}
        </h2>
        <div className="text-6xl font-bold text-blue-600 mb-4">
          {game.number}
        </div>
        <div className="flex items-center justify-center space-x-4 text-lg text-gray-600">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Время: {formatTime(timeElapsed)}</span>
          </div>
          <div>
            Попытки: {attempts}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-700 mb-4">
          Опишите ассоциацию для этого числа:
        </label>
        <textarea
          ref={textareaRef}
          value={recallText}
          onChange={(e) => setRecallText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Введите вашу ассоциацию здесь... (Ctrl+Enter для отправки)"
          className="w-full h-32 p-4 border-2 border-gray-300 rounded-lg resize-none focus:border-blue-500 focus:outline-none"
          disabled={isSubmitting}
        />
        <div className="text-right text-sm text-gray-500 mt-2">
          {recallText.length} символов
        </div>
      </div>

      {/* Hint Section */}
      <div className="mb-6">
        <button
          onClick={() => setShowHint(!showHint)}
          className="btn btn-secondary text-sm"
        >
          {showHint ? 'Скрыть подсказку' : 'Показать подсказку'}
        </button>
        
        {showHint && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Подсказка:</h4>
            <p className="text-yellow-700">
              Вспомните героя, действие и объект, связанные с числом {game.number}. 
              Вы можете описать их в любом порядке и форме.
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleSubmit}
          disabled={!recallText.trim() || isSubmitting}
          className="btn btn-primary text-lg px-8 py-3"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              <span>Отправка...</span>
            </div>
          ) : (
            <>
              <Send className="h-5 w-5" />
              Отправить ответ
            </>
          )}
        </button>
        
        <button
          onClick={() => setRecallText('')}
          disabled={isSubmitting || !recallText.trim()}
          className="btn btn-secondary text-lg px-8 py-3"
        >
          <RotateCcw className="h-5 w-5" />
          Очистить
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>💡 Совет: Опишите ассоциацию в свободной форме. Используйте Ctrl+Enter для быстрой отправки.</p>
      </div>

      {/* Speed Bonus Info */}
      {timeElapsed < 30 && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">
              Бонус за скорость! Время: {formatTime(timeElapsed)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeedRecallGame;
