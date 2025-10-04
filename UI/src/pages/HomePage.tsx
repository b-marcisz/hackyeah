import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { GameType, GameInfo } from '../types';
import { 
  Target, 
  Zap, 
  Clock, 
  BookOpen, 
  Swords, 
  Play,
  Star,
  Timer,
  Brain
} from 'lucide-react';

const gameTypes: GameInfo[] = [
  {
    id: GameType.MATCH_HAO,
    name: 'Match HAO',
    description: 'Сопоставь героя, действие и объект для числа',
    icon: 'Target',
    difficulty: 2,
    estimatedTime: '2-3 мин'
  },
  {
    id: GameType.MEMORY_FLASH,
    name: 'Memory Flash',
    description: 'Запомни сцену и найди отличия',
    icon: 'Zap',
    difficulty: 3,
    estimatedTime: '3-5 мин'
  },
  {
    id: GameType.SPEED_RECALL,
    name: 'Speed Recall',
    description: 'Быстро вспомни ассоциацию для числа',
    icon: 'Clock',
    difficulty: 4,
    estimatedTime: '1-2 мин'
  },
  {
    id: GameType.NUMBER_STORY,
    name: 'Number Story',
    description: 'Создай историю с элементами HAO',
    icon: 'BookOpen',
    difficulty: 5,
    estimatedTime: '5-10 мин'
  },
  {
    id: GameType.ASSOCIATION_DUEL,
    name: 'Association Duel',
    description: 'Соревнование на скорость с числами',
    icon: 'Swords',
    difficulty: 4,
    estimatedTime: '10-15 мин'
  }
];

const iconMap = {
  Target,
  Zap,
  Clock,
  BookOpen,
  Swords
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { startGame, state } = useGame();
  const [selectedDifficulty, setSelectedDifficulty] = useState(1);
  const [selectedNumber, setSelectedNumber] = useState<number | undefined>(undefined);

  const handleStartGame = async (gameType: GameType) => {
    try {
      await startGame({
        type: gameType,
        number: selectedNumber,
        difficulty: selectedDifficulty,
        settings: gameType === GameType.MEMORY_FLASH ? { memorizationTime: 5 } : {}
      });
      
      if (state.currentGame) {
        navigate(`/game/${state.currentGame.id}`);
      }
    } catch (error) {
      console.error('Failed to start game:', error);
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return 'text-green-600 bg-green-50 border-green-200';
    if (difficulty <= 3) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getDifficultyStars = (difficulty: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < difficulty ? 'fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Тренируй память с числами
        </h1>
        <p className="text-xl text-white/80 mb-8">
          Выбери игру и начни развивать ассоциативную память
        </p>
      </div>

      {/* Game Settings */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Настройки игры</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Сложность
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedDifficulty(level)}
                  className={`px-3 py-2 rounded-lg border transition-colors ${
                    selectedDifficulty === level
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Конкретное число (опционально)
            </label>
            <input
              type="number"
              min="0"
              max="99"
              value={selectedNumber || ''}
              onChange={(e) => setSelectedNumber(e.target.value ? parseInt(e.target.value) : undefined)}
              className="input"
              placeholder="0-99"
            />
          </div>
        </div>
      </div>

      {/* Game Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gameTypes.map((game) => {
          const IconComponent = iconMap[game.icon as keyof typeof iconMap];
          const isDisabled = state.isLoading;
          
          return (
            <div key={game.id} className="card hover:shadow-lg transition-shadow">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full mb-4">
                  <IconComponent className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{game.name}</h3>
                <p className="text-gray-600 mb-4">{game.description}</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Сложность:</span>
                  <div className="flex items-center space-x-1">
                    {getDifficultyStars(game.difficulty)}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Время:</span>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Timer className="h-4 w-4" />
                    <span>{game.estimatedTime}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleStartGame(game.id as GameType)}
                disabled={isDisabled}
                className="btn btn-primary w-full"
              >
                {isDisabled ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Начать игру
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Recent Games */}
      {state.gameHistory.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Последние игры
          </h2>
          <div className="card">
            <div className="space-y-4">
              {state.gameHistory.slice(0, 5).map((game) => (
                <div key={game.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full">
                      <Brain className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {gameTypes.find(g => g.id === game.type)?.name || game.type}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Число: {game.number} • Очки: {game.points}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      {game.status === 'completed' ? '✅ Завершена' : 
                       game.status === 'failed' ? '❌ Неудача' : 
                       '🔄 В процессе'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {game.completedAt ? 
                        new Date(game.completedAt).toLocaleDateString() :
                        new Date(game.createdAt).toLocaleDateString()
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {state.error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <span>❌</span>
            <span>{state.error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
