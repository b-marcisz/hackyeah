import React, { useState, useEffect } from 'react';
import { GameResponse, GameState } from '../../types';
import { useGame } from '../../contexts/GameContext';
import { Swords, Clock, Target, Zap } from 'lucide-react';

interface AssociationDuelGameProps {
  game: GameResponse;
  gameState: GameState;
  onComplete: () => void;
  startTime: number | null;
}

const AssociationDuelGame: React.FC<AssociationDuelGameProps> = ({ 
  game, 
  gameState, 
  onComplete, 
  startTime 
}) => {
  const { submitAnswer } = useGame();
  const [currentRound, setCurrentRound] = useState(1);
  const [currentNumber, setCurrentNumber] = useState(game.number);
  const [selectedHero, setSelectedHero] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [selectedObject, setSelectedObject] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per round
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [rounds, setRounds] = useState(5);
  const [completedRounds, setCompletedRounds] = useState<Array<{
    number: number;
    hero: string;
    action: string;
    object: string;
    timeSpent: number;
    isCorrect: boolean;
  }>>([]);

  const association = gameState.association;
  const categories = gameState.categories || { 
    hero: [association.hero], 
    action: [association.action], 
    object: [association.object] 
  };

  // Timer for each round
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitting) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      // Time's up - submit empty answer
      handleSubmit(true);
    }
  }, [timeLeft, isSubmitting]);

  const handleSubmit = async (timeUp = false) => {
    if (!timeUp && (!selectedHero || !selectedAction || !selectedObject)) {
      alert('Пожалуйста, выберите все три элемента');
      return;
    }

    setIsSubmitting(true);
    const timeSpent = startTime ? Date.now() - startTime : undefined;
    const roundTime = 30 - timeLeft;

    try {
      const answer = timeUp ? {} : {
        hero: selectedHero,
        action: selectedAction,
        object: selectedObject,
      };

      await submitAnswer(game.id, answer, timeSpent);
      
      // Add to completed rounds
      const roundResult = {
        number: currentNumber,
        hero: selectedHero || '',
        action: selectedAction || '',
        object: selectedObject || '',
        timeSpent: roundTime,
        isCorrect: !timeUp && selectedHero && selectedAction && selectedObject,
      };
      
      setCompletedRounds(prev => [...prev, roundResult]);
      
      if (roundResult.isCorrect) {
        setScore(prev => prev + 100 + Math.max(0, 20 - roundTime));
        setStreak(prev => {
          const newStreak = prev + 1;
          setMaxStreak(prevMax => Math.max(prevMax, newStreak));
          return newStreak;
        });
      } else {
        setStreak(0);
      }

      // Check if game is complete
      if (currentRound >= rounds) {
        onComplete();
        return;
      }

      // Move to next round
      setCurrentRound(prev => prev + 1);
      setCurrentNumber(Math.floor(Math.random() * 100));
      setSelectedHero('');
      setSelectedAction('');
      setSelectedObject('');
      setTimeLeft(30);
      setStartTime(Date.now());
    } catch (error) {
      console.error('Failed to submit answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isComplete = selectedHero && selectedAction && selectedObject;

  if (completedRounds.length >= rounds) {
    return (
      <div className="card">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            🏆 Дуэль завершена!
          </h2>
          <div className="text-6xl font-bold text-blue-600 mb-4">
            {score}
          </div>
          <p className="text-xl text-gray-600">Очков набрано</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">{score}</div>
            <div className="text-gray-600">Общий счет</div>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">{maxStreak}</div>
            <div className="text-gray-600">Максимальная серия</div>
          </div>
          <div className="text-center p-6 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600">
              {completedRounds.filter(r => r.isCorrect).length}/{rounds}
            </div>
            <div className="text-gray-600">Правильных ответов</div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onComplete}
            className="btn btn-primary text-lg px-8 py-3"
          >
            Посмотреть результаты
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Association Duel
        </h2>
        <div className="text-6xl font-bold text-blue-600 mb-4">
          {currentNumber}
        </div>
        <div className="flex items-center justify-center space-x-6 text-lg text-gray-600">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Раунд {currentRound}/{rounds}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span className={timeLeft <= 5 ? 'text-red-600 font-bold' : ''}>
              {timeLeft}с
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Серия: {streak}</span>
          </div>
        </div>
      </div>

      {/* Score Display */}
      <div className="flex justify-center mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg">
          <div className="text-2xl font-bold">{score}</div>
          <div className="text-sm">Очков</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Hero Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 text-center">
            Герой
          </h3>
          <div className="space-y-2">
            {categories.hero.map((hero, index) => (
              <button
                key={index}
                onClick={() => setSelectedHero(hero)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                  selectedHero === hero
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{hero}</span>
                  {selectedHero === hero && (
                    <Swords className="h-5 w-5 text-blue-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Action Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 text-center">
            Действие
          </h3>
          <div className="space-y-2">
            {categories.action.map((action, index) => (
              <button
                key={index}
                onClick={() => setSelectedAction(action)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                  selectedAction === action
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{action}</span>
                  {selectedAction === action && (
                    <Swords className="h-5 w-5 text-blue-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Object Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 text-center">
            Объект
          </h3>
          <div className="space-y-2">
            {categories.object.map((object, index) => (
              <button
                key={index}
                onClick={() => setSelectedObject(object)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                  selectedObject === object
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{object}</span>
                  {selectedObject === object && (
                    <Swords className="h-5 w-5 text-blue-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Combination Preview */}
      {isComplete && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
            Ваша комбинация:
          </h3>
          <div className="text-center text-xl">
            <span className="font-bold text-red-600">{selectedHero}</span>
            <span className="mx-2 text-gray-500">+</span>
            <span className="font-bold text-green-600">{selectedAction}</span>
            <span className="mx-2 text-gray-500">+</span>
            <span className="font-bold text-purple-600">{selectedObject}</span>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="text-center">
        <button
          onClick={() => handleSubmit(false)}
          disabled={!isComplete || isSubmitting}
          className="btn btn-primary text-lg px-8 py-3"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              <span>Отправка...</span>
            </div>
          ) : (
            'Отправить ответ'
          )}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Прогресс</span>
          <span>{currentRound}/{rounds}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentRound / rounds) * 100}%` }}
          />
        </div>
      </div>

      {/* Time Warning */}
      {timeLeft <= 5 && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg animate-pulse">
            <Clock className="h-4 w-4" />
            <span className="font-medium">Время заканчивается!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssociationDuelGame;
