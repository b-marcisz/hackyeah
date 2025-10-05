import React from 'react';
import { Play, RotateCcw, RefreshCw, Trophy, Skull, Zap } from 'lucide-react';
import HalloweenButton from './HalloweenButton';

interface GameButtonsProps {
  onStartLearning?: () => void;
  onRefresh?: () => void;
  onReset?: () => void;
  onTest?: () => void;
  onGames?: () => void;
  disabled?: boolean;
  currentPool?: number;
}

const GameButtons: React.FC<GameButtonsProps> = ({
  onStartLearning,
  onRefresh,
  onReset,
  onTest,
  onGames,
  disabled = false,
  currentPool = 0,
}) => {
  const getButtonText = () => {
    if (currentPool >= 3) {
      return '🚀 Kontynuuj Naukę';
    }
    return '🚀 Rozpocznij Naukę';
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      {/* Главная кнопка - Начать обучение */}
      <HalloweenButton
        variant="primary"
        size="md"
        onClick={onStartLearning}
        disabled={disabled}
        icon={<Play className="h-5 w-5" />}
        className="w-[220px]"
      >
        {getButtonText()}
      </HalloweenButton>

      {/* Кнопка тестирования */}
      {onTest && (
        <HalloweenButton
          variant="success"
          size="md"
          onClick={onTest}
          disabled={disabled}
          icon={<Zap className="h-5 w-5" />}
          className="w-[220px]"
        >
          ⚡ Test Szybkości
        </HalloweenButton>
      )}

      {/* Кнопка игр */}
      {onGames && (
        <HalloweenButton
          variant="secondary"
          size="md"
          onClick={onGames}
          disabled={disabled}
          icon={<Trophy className="h-5 w-5" />}
          className="w-[220px]"
        >
          🎮 Gry
        </HalloweenButton>
      )}

      {/* Кнопка обновления */}
      {onRefresh && (
        <HalloweenButton
          variant="secondary"
          size="md"
          onClick={onRefresh}
          disabled={disabled}
          icon={<RefreshCw className="h-5 w-5" />}
          className="w-[220px]"
        >
          🔄 Odśwież
        </HalloweenButton>
      )}

      {/* Кнопка сброса */}
      {onReset && (
        <HalloweenButton
          variant="danger"
          size="md"
          onClick={onReset}
          disabled={disabled}
          icon={<Skull className="h-5 w-5" />}
          className="w-[220px]"
        >
          💀 Reset
        </HalloweenButton>
      )}
    </div>
  );
};

export default GameButtons;
