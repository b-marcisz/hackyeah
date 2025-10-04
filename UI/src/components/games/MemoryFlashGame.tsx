import React, { useState, useEffect } from 'react';
import { GameResponse, GameState } from '../../types';
import { useGame } from '../../contexts/GameContext';
import { Eye, EyeOff, Clock } from 'lucide-react';

interface MemoryFlashGameProps {
  game: GameResponse;
  gameState: GameState;
  onComplete: () => void;
  startTime: number | null;
}

const MemoryFlashGame: React.FC<MemoryFlashGameProps> = ({ 
  game, 
  gameState, 
  onComplete, 
  startTime 
}) => {
  const { submitAnswer } = useGame();
  const [phase, setPhase] = useState<'memorizing' | 'comparing'>('memorizing');
  const [timeLeft, setTimeLeft] = useState(gameState.memorizationTime || 5);
  const [selectedElement, setSelectedElement] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [memorizedScene, setMemorizedScene] = useState<{
    hero: string;
    action: string;
    object: string;
  } | null>(null);

  const association = gameState.association;
  // const memorizationTime = gameState.memorizationTime || 5;

  // Timer for memorization phase
  useEffect(() => {
    if (phase === 'memorizing' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (phase === 'memorizing' && timeLeft === 0) {
      // Store the original scene and switch to comparison phase
      setMemorizedScene({
        hero: association.hero,
        action: association.action,
        object: association.object,
      });
      setPhase('comparing');
    }
  }, [phase, timeLeft, association]);

  const handleSubmit = async () => {
    if (!selectedElement) {
      alert('Proszę wybrać element, który się zmienił');
      return;
    }

    setIsSubmitting(true);
    const timeSpent = startTime ? Date.now() - startTime : undefined;

    try {
      await submitAnswer(game.id, {
        changedElement: selectedElement,
      }, timeSpent);
      
      onComplete();
    } catch (error) {
      console.error('Failed to submit answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getChangedScene = () => {
    if (!memorizedScene) return null;
    
    // For now, we'll simulate a change by modifying one element
    // In a real implementation, the backend would provide the changed scene
    const elements = ['hero', 'action', 'object'];
    const changedElement = elements[Math.floor(Math.random() * elements.length)];
    
    return {
      hero: changedElement === 'hero' ? 'Nowy bohater' : memorizedScene.hero,
      action: changedElement === 'action' ? 'nowe działanie' : memorizedScene.action,
      object: changedElement === 'object' ? 'nowy przedmiot' : memorizedScene.object,
      changedElement,
    };
  };

  const changedScene = getChangedScene();

  if (phase === 'memorizing') {
    return (
      <div className="card">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Zapamiętaj scenę
          </h2>
          <div className="text-6xl font-bold text-blue-600 mb-4">
            {game.number}
          </div>
          <div className="flex items-center justify-center space-x-2 text-lg text-gray-600">
            <Clock className="h-5 w-5" />
            <span>Czas: {timeLeft} s</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8 mb-6">
          <div className="text-center text-2xl font-bold text-gray-800 mb-4">
            Scena do zapamiętania:
          </div>
          <div className="text-center text-3xl">
            <span className="font-bold text-red-600">{association.hero}</span>
            <span className="mx-4 text-gray-500">+</span>
            <span className="font-bold text-green-600">{association.action}</span>
            <span className="mx-4 text-gray-500">+</span>
            <span className="font-bold text-purple-600">{association.object}</span>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-lg text-gray-600">
            <Eye className="h-5 w-5" />
            <span>Patrz uważnie i zapamiętuj!</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Znajdź różnice
        </h2>
        <div className="text-6xl font-bold text-blue-600 mb-4">
          {game.number}
        </div>
        <p className="text-lg text-gray-600">
          Który element zmienił się w porównaniu z zapamiętaną sceną?
        </p>
      </div>

      {changedScene && (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-8 mb-6">
          <div className="text-center text-2xl font-bold text-gray-800 mb-4">
            Zmieniona scena:
          </div>
          <div className="text-center text-3xl">
            <span className="font-bold text-red-600">{changedScene.hero}</span>
            <span className="mx-4 text-gray-500">+</span>
            <span className="font-bold text-green-600">{changedScene.action}</span>
            <span className="mx-4 text-gray-500">+</span>
            <span className="font-bold text-purple-600">{changedScene.object}</span>
          </div>
        </div>
      )}

      <div className="space-y-4 mb-8">
        <h3 className="text-lg font-semibold text-gray-700 text-center">
          Co się zmieniło?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['hero', 'action', 'object'].map((element) => (
            <button
              key={element}
              onClick={() => setSelectedElement(element)}
              className={`p-6 text-center rounded-lg border-2 transition-colors ${
                selectedElement === element
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-lg font-medium capitalize">
                {element === 'hero' ? 'Bohater' : 
                 element === 'action' ? 'Działanie' : 'Przedmiot'}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={!selectedElement || isSubmitting}
          className="btn btn-primary text-lg px-8 py-3"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              <span>Wysyłanie...</span>
            </div>
          ) : (
            'Sprawdź odpowiedź'
          )}
        </button>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        <div className="flex items-center justify-center space-x-2">
          <EyeOff className="h-4 w-4" />
          <span>Wybierz element, który się zmienił</span>
        </div>
      </div>
    </div>
  );
};

export default MemoryFlashGame;
