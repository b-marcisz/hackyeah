import React, { useState } from 'react';
import { GameResponse, GameState } from '../../types';
import { useGame } from '../../contexts/GameContext';
import { Check } from 'lucide-react';

interface MatchHaoGameProps {
  game: GameResponse;
  gameState: GameState;
  onComplete: () => void;
  startTime: number | null;
}

const MatchHaoGame: React.FC<MatchHaoGameProps> = ({ 
  game, 
  gameState, 
  onComplete, 
  startTime 
}) => {
  const { submitAnswer } = useGame();
  const [selectedHero, setSelectedHero] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [selectedObject, setSelectedObject] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const association = gameState.association;
  const categories = gameState.categories || { hero: [], action: [], object: [] };

  const handleSubmit = async () => {
    if (!selectedHero || !selectedAction || !selectedObject) {
      alert('Proszę wybrać wszystkie trzy elementy');
      return;
    }

    setIsSubmitting(true);
    const timeSpent = startTime ? Date.now() - startTime : undefined;

    try {
      await submitAnswer(game.id, {
        hero: selectedHero,
        action: selectedAction,
        object: selectedObject,
      }, timeSpent);
      
      onComplete();
    } catch (error) {
      console.error('Failed to submit answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isComplete = selectedHero && selectedAction && selectedObject;

  return (
    <div className="card">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {gameState.prompt || `Dopasuj bohatera, działanie i obiekt do liczby ${game.number}`}
        </h2>
        <div className="text-6xl font-bold text-blue-600 mb-4">
          {game.number}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Hero Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 text-center">
            Bohater
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
                    <Check className="h-5 w-5 text-blue-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Action Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 text-center">
            Działanie
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
                    <Check className="h-5 w-5 text-blue-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Object Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 text-center">
            Przedmiot
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
                    <Check className="h-5 w-5 text-blue-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Combination Preview */}
      {isComplete && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
            Twoja kombinacja:
          </h3>
          <div className="text-center text-xl">
            <span className="font-bold text-blue-600">{selectedHero}</span>
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
          onClick={handleSubmit}
          disabled={!isComplete || isSubmitting}
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

      {/* Hint */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Wybierz po jednym elemencie z każdej kategorii</p>
      </div>
    </div>
  );
};

export default MatchHaoGame;
