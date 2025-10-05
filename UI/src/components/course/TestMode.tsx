import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, RotateCcw, ArrowRight } from 'lucide-react';

interface NumberAssociation {
  number: number;
  hero: string;
  action: string;
  object: string;
}

interface TestModeProps {
  onComplete: () => void;
  onError?: (correctAnswer: NumberAssociation) => void;
}

const TestMode: React.FC<TestModeProps> = ({ onComplete, onError }) => {
  const navigate = useNavigate();
  const [associations, setAssociations] = useState<NumberAssociation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [selectedHero, setSelectedHero] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [selectedObject, setSelectedObject] = useState<string>('');
  const [isChecking, setIsChecking] = useState(false);
  const [showResult, setShowResult] = useState<boolean | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<{
    hero: string;
    action: string;
    object: string;
  } | null>(null);

  const fetchAssociations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const apiUrl = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4000`;
      
      // Сначала получаем прогресс пользователя
      const progressResponse = await fetch(`${apiUrl}/user-progress`);
      if (!progressResponse.ok) {
        throw new Error(`HTTP error! status: ${progressResponse.status}`);
      }
      const progressData = await progressResponse.json();
      
      // Получаем все ассоциации
      const response = await fetch(`${apiUrl}/number-associations/all/primary`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched associations:', data);
      setAssociations(data);
      
      // Устанавливаем первое число из текущего пула
      const currentPool = progressData.currentPool;
      const poolStart = currentPool;
      const poolEnd = currentPool + 2;
      const poolAssociations = data.filter((a: NumberAssociation) => 
        a.number >= poolStart && a.number <= poolEnd
      );
      
      if (poolAssociations.length > 0) {
        console.log('Setting currentNumber to:', poolAssociations[0].number);
        setCurrentNumber(poolAssociations[0].number);
      }
    } catch (err) {
      console.error('Failed to fetch associations for test:', err);
      setError(err instanceof Error ? err.message : 'Nie udało się załadować skojarzeń');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssociations();
  }, []);

  const handleSubmitAnswer = async () => {
    console.log('handleSubmitAnswer called', { currentNumber, selectedHero, selectedAction, selectedObject });
    if (!selectedHero || !selectedAction || !selectedObject) {
      console.log('Missing required fields:', { 
        selectedHero: !!selectedHero, 
        selectedAction: !!selectedAction, 
        selectedObject: !!selectedObject 
      });
      return;
    }

    console.log('Starting answer submission...');
    setIsChecking(true);
    
    try {
      // Проверяем, соответствует ли выбранная комбинация текущему числу
      const currentAssociation = associations.find(a => a.number === currentNumber);
      const isCorrect = currentAssociation && 
        currentAssociation.hero === selectedHero && 
        currentAssociation.action === selectedAction && 
        currentAssociation.object === selectedObject;
      setShowResult(isCorrect || false);
      
      if (!isCorrect) {
        // Показываем правильную ассоциацию для текущего числа
        if (currentAssociation) {
          setCorrectAnswer({
            hero: currentAssociation.hero,
            action: currentAssociation.action,
            object: currentAssociation.object,
          });
          if (onError) {
            onError(currentAssociation);
          }
        }
      } else {
        // Если правильный ответ, обновляем прогресс на сервере
        const apiUrl = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4000`;
        await fetch(`${apiUrl}/user-progress/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            success: true,
            number: currentAssociation?.number || currentNumber,
          }),
        });
      }
    } catch (err) {
      console.error('Failed to check answer:', err);
      setError('Nie udało się sprawdzić odpowiedzi');
    } finally {
      setIsChecking(false);
    }
  };

  const handleNextQuestion = async () => {
    if (showResult === true) {
      // Правильный ответ - переходим к следующему числу в пуле
      const poolAssociations = getPoolAssociations();
      const currentIndex = poolAssociations.findIndex(a => a.number === currentNumber);
      
      if (currentIndex < poolAssociations.length - 1) {
        // Переходим к следующему числу в пуле
        setCurrentNumber(poolAssociations[currentIndex + 1].number);
        resetSelection();
      } else {
        // Пул завершен - обновляем прогресс и переходим к следующему пулу
        try {
          const apiUrl = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4000`;
          await fetch(`${apiUrl}/user-progress/update`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              success: true,
              number: currentNumber,
            }),
          });
          
          // Завершаем тест
          onComplete();
        } catch (err) {
          console.error('Failed to update progress:', err);
          onComplete(); // Все равно завершаем
        }
      }
    } else {
      // Неправильный ответ - начинаем заново с тем же числом
      resetSelection();
    }
  };

  const resetSelection = () => {
    setSelectedHero('');
    setSelectedAction('');
    setSelectedObject('');
    setShowResult(null);
    setCorrectAnswer(null);
  };

  const getPoolAssociations = () => {
    // Получаем ассоциации только из текущего пула (3 числа)
    const poolStart = Math.floor((currentNumber || 0) / 3) * 3;
    const poolEnd = poolStart + 2;
    return associations.filter(a => a.number >= poolStart && a.number <= poolEnd);
  };

  const getUniqueValues = (field: 'hero' | 'action' | 'object') => {
    const poolAssociations = getPoolAssociations();
    return Array.from(new Set(poolAssociations.map(a => a[field])));
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-orange-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-orange-200 text-xl">Ładowanie testu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-orange-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">❌</div>
          <p className="text-red-200 text-xl mb-4">Błąd: {error}</p>
          <button
            onClick={fetchAssociations}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-purple-500 text-white rounded-xl hover:from-orange-600 hover:to-purple-600 transition-all duration-300 font-bold"
          >
            🔄 Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }

  if (associations.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-orange-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-orange-400 text-6xl mb-4">⚠️</div>
          <p className="text-orange-200 text-xl">Brak skojarzeń do testowania</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-orange-900 relative overflow-hidden">
      {/* Halloween Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 bg-orange-500 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-yellow-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-32 w-12 h-12 bg-red-500 rounded-full animate-ping"></div>
        <div className="absolute bottom-40 right-10 w-14 h-14 bg-green-400 rounded-full animate-pulse"></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400 animate-pulse mb-4">
            🧪 Tryb Testowania
          </h1>
          <p className="text-xl text-orange-200">
            Wybierz prawidłowe skojarzenia dla liczby {currentNumber}
          </p>
        </div>

        {/* Test Content */}
        <div className="bg-gradient-to-r from-purple-800 to-orange-800 rounded-xl p-8 shadow-2xl border-2 border-orange-500 mb-8">
          {/* Current Number Display */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-orange-500 to-purple-500 rounded-full shadow-2xl">
              <span className="text-4xl font-bold text-white">
                {currentNumber}
              </span>
            </div>
          </div>

          {/* Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Hero Selection */}
            <div className="bg-gradient-to-r from-red-800 to-pink-800 rounded-xl p-6 shadow-2xl border-2 border-red-500">
              <h3 className="text-xl font-bold text-red-200 mb-4 text-center">👻 Wybierz Bohatera</h3>
              <div className="grid grid-cols-1 gap-2">
                {getUniqueValues('hero').map((hero, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedHero(hero)}
                    className={`p-3 rounded-lg text-left transition-all duration-300 flex items-center space-x-3 ${
                      selectedHero === hero
                        ? 'bg-red-500 text-white shadow-lg scale-105'
                        : 'bg-red-700 text-red-200 hover:bg-red-600'
                    }`}
                  >
                    <img 
                      src={`${process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4000`}/images/heroes/${currentNumber}_${hero.toLowerCase().replace(/[^a-z0-9]/g, '_')}.svg`}
                      alt={hero}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <span>{hero}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Selection */}
            <div className="bg-gradient-to-r from-green-800 to-emerald-800 rounded-xl p-6 shadow-2xl border-2 border-green-500">
              <h3 className="text-xl font-bold text-green-200 mb-4 text-center">⚡ Wybierz Działanie</h3>
              <div className="grid grid-cols-1 gap-2">
                {getUniqueValues('action').map((action, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedAction(action)}
                    className={`p-3 rounded-lg text-left transition-all duration-300 flex items-center space-x-3 ${
                      selectedAction === action
                        ? 'bg-green-500 text-white shadow-lg scale-105'
                        : 'bg-green-700 text-green-200 hover:bg-green-600'
                    }`}
                  >
                    <img 
                      src={`${process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4000`}/images/actions/${currentNumber}_${action.toLowerCase().replace(/[^a-z0-9]/g, '_')}.svg`}
                      alt={action}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <span>{action}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Object Selection */}
            <div className="bg-gradient-to-r from-blue-800 to-cyan-800 rounded-xl p-6 shadow-2xl border-2 border-blue-500">
              <h3 className="text-xl font-bold text-blue-200 mb-4 text-center">🎃 Wybierz Przedmiot</h3>
              <div className="grid grid-cols-1 gap-2">
                {getUniqueValues('object').map((object, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedObject(object)}
                    className={`p-3 rounded-lg text-left transition-all duration-300 flex items-center space-x-3 ${
                      selectedObject === object
                        ? 'bg-blue-500 text-white shadow-lg scale-105'
                        : 'bg-blue-700 text-blue-200 hover:bg-blue-600'
                    }`}
                  >
                    <img 
                      src={`${process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4000`}/images/objects/${currentNumber}_${object.toLowerCase().replace(/[^a-z0-9]/g, '_')}.svg`}
                      alt={object}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <span>{object}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result Display */}
          {showResult !== null && (
            <div className={`text-center p-6 rounded-xl mb-6 ${
              showResult 
                ? 'bg-gradient-to-r from-green-800 to-emerald-800 border-2 border-green-500' 
                : 'bg-gradient-to-r from-red-800 to-pink-800 border-2 border-red-500'
            }`}>
              {showResult ? (
                <div className="flex items-center justify-center space-x-3">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                  <span className="text-2xl font-bold text-green-200">✅ Poprawna odpowiedź!</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-3">
                    <XCircle className="h-8 w-8 text-red-400" />
                    <span className="text-2xl font-bold text-red-200">❌ Niepoprawna odpowiedź</span>
                  </div>
                  {correctAnswer && (
                    <div className="text-red-200">
                      <p className="text-lg">Poprawna odpowiedź to:</p>
                      <p className="text-xl font-bold">
                        {correctAnswer.hero} + {correctAnswer.action} + {correctAnswer.object}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            {showResult === null ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedHero || !selectedAction || !selectedObject || isChecking}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-purple-500 text-white rounded-xl hover:from-orange-600 hover:to-purple-600 transition-all duration-300 font-bold text-xl shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3"
              >
                {isChecking ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                ) : (
                  <CheckCircle className="h-6 w-6" />
                )}
                <span>Sprawdź Odpowiedź</span>
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-bold text-xl shadow-2xl hover:scale-105 flex items-center space-x-3"
              >
                <ArrowRight className="h-6 w-6" />
                <span>{showResult ? 'Następne Pytanie' : 'Spróbuj Ponownie'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={fetchAssociations}
            className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-bold flex items-center space-x-2"
          >
            <RotateCcw className="h-5 w-5" />
            <span>🔄 Restart</span>
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-bold flex items-center space-x-2"
          >
            <span>🏠 Powrót do Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestMode;