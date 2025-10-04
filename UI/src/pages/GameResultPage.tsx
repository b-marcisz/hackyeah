import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { GameType } from '../types';
import { 
  Trophy, 
  Star, 
  Clock, 
  Target, 
  MessageSquare, 
  ThumbsUp,
  RotateCcw,
  Home
} from 'lucide-react';

const GameResultPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { state, getGame, submitFeedback, clearError } = useGame();
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackRating, setFeedbackRating] = useState<number | undefined>(undefined);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    if (gameId && !state.currentGame) {
      getGame(gameId);
    }
  }, [gameId, state.currentGame, getGame]);

  const handleFeedbackSubmit = async () => {
    if (!feedbackMessage.trim()) {
      alert('Пожалуйста, введите сообщение');
      return;
    }

    if (!gameId) return;

    setIsSubmittingFeedback(true);
    try {
      await submitFeedback(gameId, feedbackMessage.trim(), feedbackRating);
      setFeedbackSubmitted(true);
      setFeedbackMessage('');
      setFeedbackRating(undefined);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const getGameTypeName = (type: GameType): string => {
    const names = {
      [GameType.MATCH_HAO]: 'Match HAO',
      [GameType.MEMORY_FLASH]: 'Memory Flash',
      [GameType.SPEED_RECALL]: 'Speed Recall',
      [GameType.NUMBER_STORY]: 'Number Story',
      [GameType.ASSOCIATION_DUEL]: 'Association Duel',
    };
    return names[type] || type;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Trophy className="h-6 w-6 text-green-500" />;
      case 'failed':
        return <Target className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Поздравляем! Игра завершена успешно';
      case 'failed':
        return 'Игра не завершена. Попробуйте еще раз!';
      default:
        return 'Игра в процессе';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  if (state.isLoading && !state.currentGame) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600">Загрузка результатов...</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Ошибка</h2>
          <p className="text-gray-600 mb-6">{state.error}</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  if (!state.currentGame) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Игра не найдена</h2>
          <p className="text-gray-600 mb-6">Игра с указанным ID не существует</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  const game = state.currentGame;
  const result = game.result as any;
  const summary = result?.summary || {};

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button 
          onClick={() => navigate('/')}
          className="btn btn-secondary mb-4"
        >
          <Home className="h-4 w-4" />
          На главную
        </button>
      </div>

      {/* Game Status */}
      <div className="card mb-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            {getStatusIcon(game.status)}
            <h1 className="text-3xl font-bold text-gray-800">
              {getGameTypeName(game.type)}
            </h1>
          </div>
          
          <div className={`inline-flex items-center px-4 py-2 rounded-lg border ${getStatusColor(game.status)} mb-4`}>
            <span className="font-medium">{getStatusText(game.status)}</span>
          </div>

          <div className="text-6xl font-bold text-blue-600 mb-4">
            {game.number}
          </div>
        </div>
      </div>

      {/* Score and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">{game.points}</div>
          <div className="text-gray-600">Очки</div>
        </div>
        
        <div className="card text-center">
          <div className="text-4xl font-bold text-green-600 mb-2">{game.xp}</div>
          <div className="text-gray-600">Опыт</div>
        </div>
        
        <div className="card text-center">
          <div className="text-4xl font-bold text-purple-600 mb-2">{game.difficulty}</div>
          <div className="text-gray-600">Сложность</div>
        </div>
      </div>

      {/* Game Details */}
      {summary.isCorrect !== undefined && (
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Результат
          </h2>
          <div className="text-center">
            <div className={`inline-flex items-center space-x-2 px-6 py-3 rounded-lg text-lg font-medium ${
              summary.isCorrect ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
            }`}>
              {summary.isCorrect ? (
                <>
                  <ThumbsUp className="h-5 w-5" />
                  <span>Правильно!</span>
                </>
              ) : (
                <>
                  <Target className="h-5 w-5" />
                  <span>Неправильно</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Attempts History */}
      {result?.attempts && result.attempts.length > 0 && (
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            История попыток
          </h2>
          <div className="space-y-4">
            {result.attempts.map((attempt: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    attempt.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {attempt.isCorrect ? '✓' : '✗'}
                  </div>
                  <div>
                    <div className="font-medium">
                      Попытка {index + 1}
                    </div>
                    <div className="text-sm text-gray-600">
                      {attempt.timeSpentMs ? `${Math.round(attempt.timeSpentMs / 1000)}с` : 'Нет данных'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-blue-600">+{attempt.pointsAwarded}</div>
                  <div className="text-sm text-gray-600">очков</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feedback Section */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Обратная связь
        </h2>
        
        {!feedbackSubmitted ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Сообщение
              </label>
              <textarea
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                placeholder="Поделитесь своими мыслями об игре..."
                className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:border-blue-500 focus:outline-none"
                disabled={isSubmittingFeedback}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Оценка (опционально)
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setFeedbackRating(rating)}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${
                      feedbackRating === rating
                        ? 'border-yellow-400 bg-yellow-100 text-yellow-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    disabled={isSubmittingFeedback}
                  >
                    <Star className={`h-5 w-5 ${feedbackRating === rating ? 'fill-current' : ''}`} />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <button
                onClick={handleFeedbackSubmit}
                disabled={!feedbackMessage.trim() || isSubmittingFeedback}
                className="btn btn-primary"
              >
                {isSubmittingFeedback ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>Отправка...</span>
                  </div>
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4" />
                    Отправить отзыв
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-green-600 bg-green-50 p-4 rounded-lg">
            <ThumbsUp className="h-8 w-8 mx-auto mb-2" />
            <p className="font-medium">Спасибо за отзыв!</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => navigate('/')}
          className="btn btn-primary text-lg px-8 py-3"
        >
          <Home className="h-5 w-5" />
          Новая игра
        </button>
        
        <button
          onClick={() => window.location.reload()}
          className="btn btn-secondary text-lg px-8 py-3"
        >
          <RotateCcw className="h-5 w-5" />
          Попробовать снова
        </button>
      </div>
    </div>
  );
};

export default GameResultPage;
