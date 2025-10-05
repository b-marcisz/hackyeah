import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Trophy, Clock, Target, TrendingUp, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import GameButtons from '../components/ui/GameButtons';
import AssociationImage from '../components/ui/AssociationImage';
import HalloweenButton from '../components/ui/HalloweenButton';

interface UserStats {
  currentProgress: number;
  currentPool: number;
  completedNumbers: number[];
  failedAttempts: number[];
  totalCorrectAnswers: number;
  totalIncorrectAnswers: number;
  studyTimeSpent: number;
  testTimeSpent: number;
}

interface NumberAssociation {
  number: number;
  hero: string;
  action: string;
  object: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [associations, setAssociations] = useState<NumberAssociation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const apiUrl = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4002`;
      console.log('🔗 Fetching stats from:', `${apiUrl}/user-progress`);
      const response = await fetch(`${apiUrl}/user-progress`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📊 Stats received from API:', data);
      setStats(data);
    } catch (err) {
      console.error('❌ Failed to fetch user stats:', err);
      setError(err instanceof Error ? err.message : 'Nie udało się załadować statystyk');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAssociations = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4002`;
      console.log('🔗 Fetching associations from:', `${apiUrl}/number-associations/all/primary`);
      const response = await fetch(`${apiUrl}/number-associations/all/primary`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📚 Associations received from API:', data);
      console.log('📚 Total associations count:', data.length);
      setAssociations(data);
    } catch (err) {
      console.error('❌ Failed to fetch associations:', err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchAssociations();
  }, []);

  const handleStartLearning = () => {
    navigate('/course?mode=study');
  };

  const handleResetProgress = async () => {
    if (window.confirm('Czy na pewno chcesz zresetować postęp? Wszystkie dane zostaną utracone.')) {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4002`;
        const response = await fetch(`${apiUrl}/user-progress/reset`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          await fetchStats();
        }
      } catch (err) {
        console.error('Failed to reset progress:', err);
      }
    }
  };

  const handleRefreshData = async () => {
    console.log('🔄 Manually refreshing data...');
    await fetchStats();
    await fetchAssociations();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-orange-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-xl">Ładowanie dashboardu...</p>
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
            onClick={fetchStats}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-purple-500 text-white rounded-xl hover:from-orange-600 hover:to-purple-600 transition-all duration-300 font-bold"
          >
            🔄 Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-orange-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-orange-400 text-6xl mb-4">⚠️</div>
          <p className="text-white text-xl">Brak danych o postępie</p>
        </div>
      </div>
    );
  }

  const accuracy = stats.totalCorrectAnswers + stats.totalIncorrectAnswers > 0 
    ? Math.round((stats.totalCorrectAnswers / (stats.totalCorrectAnswers + stats.totalIncorrectAnswers)) * 100)
    : 0;

  // Фильтруем ассоциации по текущему пулу
  const currentPoolAssociations = stats ? associations.filter(association => {
    const number = association.number;
    const poolStart = stats.currentPool || 0;
    const poolEnd = poolStart + 2;
    const inRange = number >= poolStart && number <= poolEnd;
    console.log(`🔍 Filtering association ${number}: poolStart=${poolStart}, poolEnd=${poolEnd}, inRange=${inRange}`);
    return inRange;
  }) : [];
  
  console.log('📊 Dashboard - stats:', stats);
  console.log('📊 Dashboard - associations count:', associations.length);
  console.log('📊 Dashboard - currentPoolAssociations count:', currentPoolAssociations.length);
  console.log('📊 Dashboard - currentPoolAssociations:', currentPoolAssociations);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

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
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400 animate-pulse mb-4">
            🎃 Dashboard Kursu 🎃
          </h1>
          <p className="text-xl text-white">
            Ucz się i zapamiętuj skojarzenia liczb z bohaterami, działaniami i przedmiotami
          </p>
        </div>



        {/* Associations Section */}
        {stats && currentPoolAssociations.length > 0 && (
          <div className="bg-black/90 backdrop-blur-sm rounded-xl p-8 mb-8 shadow-2xl border-2 border-white/20">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              📚 Skojarzenia z Aktualnego Pula ({stats?.currentPool || 0}-{(stats?.currentPool || 0) + 2})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentPoolAssociations.map((association) => (
                <div key={association.number} className="bg-gradient-to-r from-blue-800 to-purple-800 rounded-xl p-6 shadow-xl border-2 border-blue-500 hover:scale-105 transition-transform duration-300">
                  <div className="text-center">
                    <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400 mb-6 animate-pulse shadow-2xl">
                      {association.number}
                    </div>
                    
                    {/* Images with Comic Style Labels */}
                    <div className="flex flex-row justify-center items-center gap-2 sm:gap-3 mb-4">
                      <AssociationImage
                        src={`${process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4000`}/images/heroes/${association.number}_${association.hero.toLowerCase().replace(/[^a-z0-9]/g, '_')}.svg`}
                        alt={association.hero}
                        title={association.hero}
                        size="sm"
                        className="flex-shrink-0"
                      />
                      <AssociationImage
                        src={`${process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4000`}/images/actions/${association.number}_${association.action.toLowerCase().replace(/[^a-z0-9]/g, '_')}.svg`}
                        alt={association.action}
                        title={association.action}
                        size="sm"
                        className="flex-shrink-0"
                      />
                      <AssociationImage
                        src={`${process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4000`}/images/objects/${association.number}_${association.object.toLowerCase().replace(/[^a-z0-9]/g, '_')}.svg`}
                        alt={association.object}
                        title={association.object}
                        size="sm"
                        className="flex-shrink-0"
                      />
                    </div>
                    
                  </div>
                </div>
              ))}
            </div>
            {currentPoolAssociations.length === 0 && (
              <div className="text-center mt-4">
                <p className="text-white">
                  Brak skojarzeń w aktualnym pulu. Rozpocznij naukę, aby zobaczyć skojarzenia!
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* Show message when no associations in current pool */}
        {stats && currentPoolAssociations.length === 0 && (
          <div className="bg-gradient-to-r from-red-800 to-orange-800 rounded-xl p-8 mb-8 shadow-2xl border-2 border-red-500">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              📚 Brak Skojarzeń w Aktualnym Pulu ({stats.currentPool}-{stats.currentPool + 2})
            </h2>
            <div className="text-center">
              <p className="text-white">
                Rozpocznij naukę, aby zobaczyć skojarzenia!
              </p>
            </div>
          </div>
        )}

        {/* Fixed Animated Button - Always Visible */}
        <motion.div
          className="fixed bottom-8 left-8 z-50"
          style={{ 
            position: 'fixed',
            bottom: '32px',
            left: '32px',
            zIndex: 50
          }}
          initial={{ scale: 1, opacity: 1 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            y: [0, -10, 0, -5, 0],
            rotate: [0, 2, -2, 1, 0]
          }}
          transition={{
            y: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            },
            rotate: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          whileHover={{ 
            scale: 1.1,
            y: -5,
            transition: { duration: 0.2 }
          }}
          whileTap={{ 
            scale: 0.95,
            transition: { duration: 0.1 }
          }}
        >
          <HalloweenButton
            variant="primary"
            size="lg"
            onClick={handleStartLearning}
            disabled={isLoading}
            icon={<Play className="h-6 w-6" />}
            className="w-[280px]"
          >
            {stats && stats.currentPool >= 3 ? '🚀 Kontynuuj Naukę' : '🚀 Rozpocznij Naukę'}
          </HalloweenButton>
        </motion.div>

      </div>
    </div>
  );
};

export default Dashboard;