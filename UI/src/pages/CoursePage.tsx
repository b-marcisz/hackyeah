import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, BookOpen, Brain } from 'lucide-react';
import StudyMode from '../components/course/StudyMode';
import TestMode from '../components/course/TestMode';
import HintModal from '../components/course/HintModal';
import ProgressBar from '../components/course/ProgressBar';

type CourseMode = 'study' | 'test' | 'complete';

interface UserProgress {
  totalProgress: number;
  currentPool: string;
  completedNumbers: number[];
  failedAttempts: number[];
  isInStudyMode: boolean;
  isInTestMode: boolean;
}

interface Association {
  number: number;
  hero: string;
  action: string;
  object: string;
}

const CoursePage: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<CourseMode>('study');
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<Association | null>(null);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const apiUrl = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4002`;
      const response = await fetch(`${apiUrl}/user-progress`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setProgress(data);
      
      // Определяем режим на основе состояния пользователя
      if (data.isInStudyMode) {
        setMode('study');
      } else if (data.isInTestMode) {
        setMode('test');
      } else {
        setMode('study');
      }
      
    } catch (err) {
      console.error('Failed to fetch progress:', err);
      setError(err instanceof Error ? err.message : 'Nie udało się załadować progresu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudyComplete = () => {
    setMode('test');
  };

  const handleTestComplete = () => {
    setMode('complete');
    fetchProgress(); // Обновляем прогресс
  };

  const handleTestError = (correctAnswer: Association) => {
    setCorrectAnswer(correctAnswer);
    setCurrentNumber(correctAnswer.number);
    setShowHint(true);
  };

  const handleRetry = () => {
    setShowHint(false);
    setCorrectAnswer(null);
  };

  const handleCloseHint = () => {
    setShowHint(false);
    setCorrectAnswer(null);
  };

  const startNewPool = () => {
    setMode('study');
    fetchProgress();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-orange-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-orange-200 text-xl">Ładowanie kursu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-orange-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-200 text-xl mb-4">{error}</p>
          <button
            onClick={fetchProgress}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-bold"
          >
            🔄 Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-orange-900 relative overflow-hidden">
        {/* Halloween Background Effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-20 h-20 bg-orange-500 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-yellow-400 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-32 w-12 h-12 bg-red-500 rounded-full animate-ping"></div>
          <div className="absolute bottom-40 right-10 w-14 h-14 bg-green-400 rounded-full animate-pulse"></div>
        </div>
        
        <div className="container mx-auto px-4 py-8 relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="bg-gradient-to-r from-green-800 to-emerald-800 rounded-2xl p-12 shadow-2xl border-4 border-green-500 max-w-2xl">
              <Trophy className="h-24 w-24 text-yellow-400 mx-auto mb-6 animate-bounce" />
              <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 mb-6">
                🎉 Gratulacje!
              </h1>
              <p className="text-2xl text-green-200 mb-8">
                Ukończyłeś pulę {progress?.currentPool}! 
                <br />
                Twój postęp: {progress?.totalProgress}%
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={startNewPool}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-6 shadow-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-bold text-xl hover:scale-105 flex items-center justify-center space-x-3"
                >
                  <BookOpen className="h-6 w-6" />
                  <span>📚 Kontynuuj Następny Pula</span>
                </button>
                
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-6 shadow-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-bold text-xl hover:scale-105 flex items-center justify-center space-x-3"
                >
                  <ArrowLeft className="h-6 w-6" />
                  <span>🏠 Powrót do Dashboard</span>
                </button>
              </div>
            </div>
          </div>
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
        <div className="mb-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-purple-800 to-orange-800 text-orange-200 hover:text-orange-100 transition-colors px-6 py-3 rounded-lg hover:bg-opacity-80 mb-4 shadow-2xl border-2 border-orange-500"
          >
            <ArrowLeft className="h-4 w-4 inline mr-2" />
            🏠 Powrót do Dashboard
          </button>
          
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400 animate-pulse mb-4 text-center">
            🎃 Kurs Skojarzeń 🎃
          </h1>
          <p className="text-xl text-white/80 text-center">
            {mode === 'study' ? 'Nauka skojarzeń' : 'Test wiedzy'}
          </p>
        </div>

        {/* Progress Bar */}
        {progress && (
          <div className="mb-8">
            <ProgressBar
              currentPool={parseInt(progress.currentPool.split('-')[0])}
              completedNumbers={progress.completedNumbers}
              failedAttempts={progress.failedAttempts}
              totalNumbers={3}
            />
          </div>
        )}

        {/* Mode Indicator */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-purple-800 to-orange-800 rounded-xl p-6 shadow-2xl border-2 border-orange-500 inline-block">
            <div className="flex items-center justify-center space-x-3">
              {mode === 'study' ? (
                <>
                  <BookOpen className="h-8 w-8 text-orange-400" />
                  <span className="text-2xl font-bold text-orange-200">📚 Tryb Nauki</span>
                </>
              ) : (
                <>
                  <Brain className="h-8 w-8 text-blue-400" />
                  <span className="text-2xl font-bold text-blue-200">🧪 Tryb Testu</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Course Content */}
        {mode === 'study' && (
          <StudyMode onComplete={handleStudyComplete} />
        )}

        {mode === 'test' && (
          <TestMode 
            onComplete={handleTestComplete}
            onError={handleTestError}
          />
        )}

        {/* Hint Modal */}
        <HintModal
          isOpen={showHint}
          onClose={handleCloseHint}
          onRetry={handleRetry}
          correctAnswer={correctAnswer!}
          number={currentNumber!}
        />
      </div>
    </div>
  );
};

export default CoursePage;
