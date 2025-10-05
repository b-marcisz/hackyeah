import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Play, Hash, User, Zap, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import AssociationImage from '../components/ui/AssociationImage';
import HalloweenButton from '../components/ui/HalloweenButton';

interface Association {
  number: number;
  hero: string;
  action: string;
  object: string;
  images?: {
    hero?: string;
    action?: string;
    object?: string;
  };
}

const AssociationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [associations, setAssociations] = useState<Association[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchAssociations();
    fetchUserStats();
  }, []);


  const fetchAssociations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch associations
          const response = await fetch('http://10.250.162.191:4002/number-associations/all/primary');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setAssociations(data || []);
    } catch (err) {
      console.error('Failed to fetch associations:', err);
      setError(err instanceof Error ? err.message : 'Nie udało się załadować skojarzeń');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
        const apiUrl = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4002`;
      const response = await fetch(`${apiUrl}/user-progress`);
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch user stats:', err);
    }
  };


  const handleStartLearning = () => {
    navigate('/course?mode=study');
  };

  const handleViewAssociations = () => {
    // Прокрутка к началу страницы для просмотра ассоциаций
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return <LoadingSpinner message="Ładowanie skojarzeń..." />;
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={fetchAssociations}
        onClose={() => navigate('/')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        


      {/* Associations List */}
      <div className="bg-black/90 backdrop-blur-sm rounded-xl shadow-2xl border-2 border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-black/80 border-b-2 border-white/20">
                <th className="text-center py-4 px-4 font-bold text-white text-sm w-1/6">
                  <Hash className="h-4 w-4 mr-2 inline" />
                  Liczba
                </th>
                <th className="text-center py-4 px-4 font-bold text-red-200 text-sm w-1/4">
                  <User className="h-4 w-4 mr-2 inline" />
                  Bohater
                </th>
                <th className="text-center py-4 px-4 font-bold text-white text-sm w-1/4">
                  <Zap className="h-4 w-4 mr-2 inline" />
                  Działanie
                </th>
                <th className="text-center py-4 px-4 font-bold text-white text-sm w-1/4">
                  <Package className="h-4 w-4 mr-2 inline" />
                  Przedmiot
                </th>
              </tr>
            </thead>
            <tbody>
              {associations.map((association, index) => (
                <tr 
                  key={index} 
                  className="border-b border-white/20 hover:bg-white/5 transition-all duration-300 hover:shadow-lg"
                >
                  <td className="py-4 px-4 w-1/6">
                    <div className="text-center">
                      <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400 animate-pulse">
                        #{association.number}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 w-1/4">
                    <div className="flex items-center justify-center">
                      <AssociationImage
                        src={`${process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4002`}/images/heroes/${association.number}_${association.hero.toLowerCase().replace(/[^a-z0-9]/g, '_')}.svg`}
                        alt={association.hero}
                        title={association.hero}
                        size="md"
                        className="w-16 h-16"
                      />
                    </div>
                  </td>
                  <td className="py-4 px-4 w-1/4">
                    <div className="flex items-center justify-center">
                      <AssociationImage
                        src={`${process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4002`}/images/actions/${association.number}_${association.action.toLowerCase().replace(/[^a-z0-9]/g, '_')}.svg`}
                        alt={association.action}
                        title={association.action}
                        size="md"
                        className="w-16 h-16"
                      />
                    </div>
                  </td>
                  <td className="py-4 px-4 w-1/4">
                    <div className="flex items-center justify-center">
                      <AssociationImage
                        src={`${process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4002`}/images/objects/${association.number}_${association.object.toLowerCase().replace(/[^a-z0-9]/g, '_')}.svg`}
                        alt={association.object}
                        title={association.object}
                        size="md"
                        className="w-16 h-16"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Fixed Cards Icon - Top Right */}
      <motion.div
        className="fixed top-8 right-8 z-50"
        style={{ 
          position: 'fixed',
          top: '32px',
          right: '32px',
          zIndex: 50
        }}
        initial={{ scale: 1, opacity: 1 }}
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
          variant="secondary"
          size="lg"
          onClick={handleViewAssociations}
          disabled={isLoading}
          icon={<BookOpen className="h-6 w-6" />}
          className="w-[60px]"
        >
          {''}
        </HalloweenButton>
      </motion.div>

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
          <span style={{ marginLeft: '20px' }}>
            {stats && stats.currentPool >= 3 ? 'Kontynuuj Naukę' : 'Rozpocznij Naukę'}
          </span>
        </HalloweenButton>
      </motion.div>
      </div>
    </div>
  );
};

export default AssociationsPage;
