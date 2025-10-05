import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import StudyMode from '../components/course/StudyMode';
import TestMode from '../components/course/TestMode';
import HintModal from '../components/course/HintModal';

type CourseMode = 'study' | 'test';

const Course: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<CourseMode>('study');
  const [showHint, setShowHint] = useState(false);
  const [hintData, setHintData] = useState<{
    correctAnswer: {
      hero: string;
      action: string;
      object: string;
    };
    number: number;
  } | null>(null);

  useEffect(() => {
    const modeParam = searchParams.get('mode');
    if (modeParam === 'study' || modeParam === 'test') {
      setMode(modeParam);
    }
  }, [searchParams]);

  const handleStudyComplete = () => {
    setMode('test');
    // Обновляем URL без перезагрузки страницы
    navigate('/course?mode=test', { replace: true });
  };

  const handleTestComplete = async () => {
    // Обновляем прогресс пользователя
    try {
      const response = await fetch('http://localhost:4000/user-progress/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          number: 0, // Это будет обновлено в backend
        }),
      });

      if (response.ok) {
        // Перенаправляем на dashboard с сообщением об успехе
        navigate('/dashboard?completed=true');
      }
    } catch (error) {
      console.error('Failed to update progress:', error);
      // Все равно перенаправляем на dashboard
      navigate('/dashboard');
    }
  };

  const handleShowHint = (correctAnswer: {
    hero: string;
    action: string;
    object: string;
  }, number: number) => {
    setHintData({ correctAnswer, number });
    setShowHint(true);
  };

  const handleCloseHint = () => {
    setShowHint(false);
    setHintData(null);
  };

  const handleRetry = () => {
    setShowHint(false);
    setHintData(null);
    // Перезагружаем тест
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-orange-900">
      {mode === 'study' && (
        <StudyMode onComplete={handleStudyComplete} />
      )}
      
      {mode === 'test' && (
        <TestMode onComplete={handleTestComplete} />
      )}

      {/* Hint Modal */}
      {hintData && (
        <HintModal
          isOpen={showHint}
          onClose={handleCloseHint}
          onRetry={handleRetry}
          correctAnswer={hintData.correctAnswer}
          number={hintData.number}
        />
      )}
    </div>
  );
};

export default Course;
