import React, { useState } from 'react';
import { GameResponse, GameState } from '../../types';
import { useGame } from '../../contexts/GameContext';
import { BookOpen, Send, RotateCcw, Star } from 'lucide-react';

interface NumberStoryGameProps {
  game: GameResponse;
  gameState: GameState;
  onComplete: () => void;
  startTime: number | null;
}

const NumberStoryGame: React.FC<NumberStoryGameProps> = ({ 
  game, 
  gameState, 
  onComplete, 
  startTime 
}) => {
  const { submitAnswer } = useGame();
  const [selectedHero, setSelectedHero] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [selectedObject, setSelectedObject] = useState<string>('');
  const [storyText, setStoryText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'elements' | 'story'>('elements');

  const association = gameState.association;
  const categories = gameState.categories || { 
    hero: [association.hero], 
    action: [association.action], 
    object: [association.object] 
  };

  const handleElementsSubmit = () => {
    if (!selectedHero || !selectedAction || !selectedObject) {
      alert('Proszę wybrać wszystkie trzy elementy');
      return;
    }
    setStep('story');
  };

  const handleStorySubmit = async () => {
    if (!storyText.trim()) {
      alert('Proszę napisać historię');
      return;
    }

    setIsSubmitting(true);
    const timeSpent = startTime ? Date.now() - startTime : undefined;

    try {
      await submitAnswer(game.id, {
        hero: selectedHero,
        action: selectedAction,
        object: selectedObject,
        story: storyText.trim(),
      }, timeSpent);
      
      onComplete();
    } catch (error) {
      console.error('Failed to submit answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isElementsComplete = selectedHero && selectedAction && selectedObject;

  if (step === 'elements') {
    return (
      <div className="card">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Wybierz elementy do historii
          </h2>
          <div className="text-6xl font-bold text-blue-600 mb-4">
            {game.number}
          </div>
          <p className="text-lg text-gray-600">
            Wybierz bohatera, działanie i przedmiot, które będą użyte w Twojej historii
          </p>
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
                      <Star className="h-5 w-5 text-blue-500" />
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
                      <Star className="h-5 w-5 text-blue-500" />
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
                      <Star className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Elements Preview */}
        {isElementsComplete && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
              Wybrane elementy:
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

        <div className="text-center">
          <button
            onClick={handleElementsSubmit}
            disabled={!isElementsComplete}
            className="btn btn-primary text-lg px-8 py-3"
          >
            <BookOpen className="h-5 w-5" />
            Przejdź do pisania historii
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Napisz historię
        </h2>
        <div className="text-6xl font-bold text-blue-600 mb-4">
          {game.number}
        </div>
        <p className="text-lg text-gray-600">
          Stwórz interesującą historię, używając wybranych elementów
        </p>
      </div>

      {/* Selected Elements Reminder */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
          Użyj tych elementów w historii:
        </h3>
        <div className="text-center text-xl">
          <span className="font-bold text-red-600">{selectedHero}</span>
          <span className="mx-2 text-gray-500">+</span>
          <span className="font-bold text-green-600">{selectedAction}</span>
          <span className="mx-2 text-gray-500">+</span>
          <span className="font-bold text-purple-600">{selectedObject}</span>
        </div>
      </div>

      {/* Story Writing Area */}
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-700 mb-4">
          Twoja historia:
        </label>
        <textarea
          value={storyText}
          onChange={(e) => setStoryText(e.target.value)}
          placeholder="Napisz interesującą historię, używając wybranych elementów..."
          className="w-full h-48 p-4 border-2 border-gray-300 rounded-lg resize-none focus:border-blue-500 focus:outline-none"
          disabled={isSubmitting}
        />
        <div className="text-right text-sm text-gray-500 mt-2">
          {storyText.length} znaków
        </div>
      </div>

      {/* Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-yellow-800 mb-2">💡 Wskazówki do dobrej historii:</h4>
        <ul className="text-yellow-700 text-sm space-y-1">
          <li>• Uczyń historię logiczną i spójną</li>
          <li>• Użyj wszystkich trzech elementów w naturalny sposób</li>
          <li>• Dodaj szczegóły i emocje</li>
          <li>• Uczyń historię niezapomnianą</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleStorySubmit}
          disabled={!storyText.trim() || isSubmitting}
          className="btn btn-primary text-lg px-8 py-3"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              <span>Wysyłanie...</span>
            </div>
          ) : (
            <>
              <Send className="h-5 w-5" />
              Wyślij historię
            </>
          )}
        </button>
        
        <button
          onClick={() => setStoryText('')}
          disabled={isSubmitting || !storyText.trim()}
          className="btn btn-secondary text-lg px-8 py-3"
        >
          <RotateCcw className="h-5 w-5" />
          Wyczyść
        </button>
        
        <button
          onClick={() => setStep('elements')}
          disabled={isSubmitting}
          className="btn btn-secondary text-lg px-8 py-3"
        >
          Zmień elementy
        </button>
      </div>
    </div>
  );
};

export default NumberStoryGame;
