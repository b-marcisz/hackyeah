import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import StudyButton from '../ui/StudyButton';
import AssociationImage from '../ui/AssociationImage';
import HalloweenButton from '../ui/HalloweenButton';

interface NumberAssociation {
  number: number;
  hero: string;
  action: string;
  object: string;
}

interface StudyModeProps {
  onComplete: () => void;
}

const StudyMode: React.FC<StudyModeProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const [associations, setAssociations] = useState<NumberAssociation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30); // 30 секунд на изучение
  const [isStudying, setIsStudying] = useState(false);
  const [selectedHero, setSelectedHero] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [showResult, setShowResult] = useState<boolean | null>(null);
  const [currentNumberIndex, setCurrentNumberIndex] = useState(0);

  const fetchAssociations = async () => {
    try {
      console.log('Fetching associations...');
      setIsLoading(true);
      setError(null);
      
      const apiUrl = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4002`;
      
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
      
      // Фильтруем только ассоциации из текущего пула
      const currentPool = progressData.currentPool;
      // currentPool уже получен из API
      const poolStart = currentPool;
      const poolEnd = currentPool + 2;
      const poolAssociations = data.filter((a: NumberAssociation) => 
        a.number >= poolStart && a.number <= poolEnd
      );
      
      console.log('Pool associations:', poolAssociations);
      console.log('Pool associations numbers:', poolAssociations.map((a: NumberAssociation) => a.number));
      
      // Перемешиваем ассоциации для случайного порядка
      const shuffledAssociations = [...poolAssociations].sort(() => Math.random() - 0.5);
      console.log('Shuffled associations:', shuffledAssociations);
      console.log('Shuffled associations numbers:', shuffledAssociations.map((a: NumberAssociation) => a.number));
      
      // Начинаем с первого числа в отфильтрованном пуле
      const firstNumberInPool = poolAssociations.length > 0 ? Math.min(...poolAssociations.map((a: NumberAssociation) => a.number)) : currentPool;
      const startIndex = shuffledAssociations.findIndex(a => a.number === firstNumberInPool);
      
      setAssociations(shuffledAssociations);
      setCurrentNumberIndex(startIndex);
      // Сбрасываем таймер при загрузке новых ассоциаций
      setTimeLeft(30);
      console.log('Timer reset to 30 seconds for new associations');
      console.log('Starting from first number in pool:', firstNumberInPool, 'at index:', startIndex);
      console.log('Pool range:', poolStart, '-', poolEnd);
      console.log('Available numbers in pool:', poolAssociations.map((a: NumberAssociation) => a.number));
      console.log('First number in pool:', firstNumberInPool);
      console.log('Shuffled order:', shuffledAssociations.map((a: NumberAssociation) => a.number));
      console.log('Starting index:', startIndex);
      console.log('fetchAssociations: currentNumberIndex set to:', startIndex);
    } catch (err) {
      console.error('Failed to fetch associations for study:', err);
      setError(err instanceof Error ? err.message : 'Nie udało się załadować skojarzeń');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssociations();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isStudying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isStudying && timeLeft === 0) {
      setIsStudying(false);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStudying, timeLeft]);

  const handleStartStudy = () => {
    console.log('=== START STUDY CLICKED ===');
    setIsStudying(true);
    setTimeLeft(30);
    setSelectedHero(null);
    setSelectedAction(null);
    setSelectedObject(null);
    setShowResult(null);
    
    // Скроллим вверх при начале изучения
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      console.log('Scrolled to top for start study');
    }, 100);
    
    // Сбрасываем на начало пула
    if (associations.length > 0) {
      const firstNumberInPool = Math.min(...associations.map((a: NumberAssociation) => a.number)); // Первое число в пуле
      const startIndex = associations.findIndex(a => a.number === firstNumberInPool);
      setCurrentNumberIndex(startIndex);
      console.log('Start study: currentNumberIndex reset to start of pool:', startIndex, 'for number:', firstNumberInPool);
    } else {
      setCurrentNumberIndex(0);
      console.log('Start study: currentNumberIndex reset to 0 (no associations)');
    }
  };


  const handleCheckAnswer = async () => {
    console.log('=== CHECK ANSWER CLICKED ===');
    console.log('Check answer clicked');
    console.log('Selected:', { selectedHero, selectedAction, selectedObject });
    
    // Скроллим вверх при каждом нажатии "Sprawdź odpowiedź"
    setTimeout(() => {
      // Пробуем несколько способов скролла
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      console.log('Scrolled to top after check answer');
    }, 100);
    
    if (!selectedHero || !selectedAction || !selectedObject) {
      console.log('Missing selections - returning early');
      return;
    }
    
    console.log('All selections present, proceeding with check...');

    const currentAssociation = associations[currentNumberIndex];
    console.log('Current association:', currentAssociation);
    console.log('Current number:', currentAssociation?.number);
    
    // Проверяем правильность для текущего числа
    const isCorrect = currentAssociation && 
      currentAssociation.hero === selectedHero && 
      currentAssociation.action === selectedAction && 
      currentAssociation.object === selectedObject;
    
    console.log('Selected combination:', { selectedHero, selectedAction, selectedObject });
    console.log('Expected combination:', { 
      hero: currentAssociation?.hero, 
      action: currentAssociation?.action, 
      object: currentAssociation?.object 
    });
    console.log('Is correct:', isCorrect);
    setShowResult(isCorrect || false);
    
    if (isCorrect) {
      console.log('Correct answer! Moving to next number...');
      console.log('Current index:', currentNumberIndex, 'Total associations:', associations.length);
      
      // Показываем всплывающее уведомление об успехе
      toast.success('Prawidłowa odpowiedź!', {
        duration: 2000,
        style: {
          background: 'linear-gradient(to right, #059669, #10b981)',
          color: '#ffffff',
          fontWeight: 'bold',
          fontSize: '16px',
          borderRadius: '12px',
          border: '2px solid #10b981',
          boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
        },
      });
      
      // Сбрасываем таймер при каждом правильном ответе
      setTimeLeft(30);
      console.log('Timer reset to 30 seconds');
      
      // Переходим к следующему числу или завершаем
      if (currentNumberIndex < associations.length - 1) {
        console.log('Moving to next number immediately...');
        const nextIndex = currentNumberIndex + 1;
        console.log('Setting index to:', nextIndex);
        console.log('Before update - currentNumberIndex:', currentNumberIndex);
        setCurrentNumberIndex(nextIndex);
        setSelectedHero(null);
        setSelectedAction(null);
        setSelectedObject(null);
        setShowResult(null);
        console.log('After update - should be:', nextIndex);
      } else {
        console.log('Pool completed, saving progress and advancing to next pool...');
        // Завершили весь пул - сохраняем прогресс и переходим к следующему пулу
        setTimeout(async () => {
          try {
            const apiUrl = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4002`;
            
            // Сохраняем прогресс для последнего числа
            await fetch(`${apiUrl}/user-progress/update`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                success: true,
                number: currentAssociation.number,
              }),
            });
            console.log('Pool completed, progress saved for number:', currentAssociation.number);
            
            // Переходим к следующему пулу
            // Получаем текущий пул из прогресса пользователя
            const progressResponse = await fetch(`${apiUrl}/user-progress`);
            const progressData = await progressResponse.json();
            const currentPoolStart = progressData.currentPool || 0; // Начало текущего пула из БД
            const nextPoolStart = currentPoolStart + 3; // Следующий пул (текущий + размер пула)
            
            console.log('🏊 Pool Advancement Details:');
            console.log(`  Current pool start: ${currentPoolStart}`);
            console.log(`  Next pool start: ${nextPoolStart}`);
            console.log(`  Pool size: 3`);
            
            const nextPoolResponse = await fetch(`${apiUrl}/user-progress/advance-pool`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                currentPool: nextPoolStart, // Следующий пул
                poolSize: 3,
                lastUpdated: new Date().toISOString()
              }),
            });
            
            if (nextPoolResponse.ok) {
              const nextPoolData = await nextPoolResponse.json();
              console.log('Advanced to next pool:', nextPoolData);
              
              // СТРОГАЯ ПРОВЕРКА ПЕРЕХОДА ПУЛА
              console.log('🔒 ENFORCING POOL TRANSITION:');
              console.log(`  Current pool: ${currentPoolStart}`);
              console.log(`  Next pool: ${nextPoolStart}`);
              
              let transitionSuccess = false;
              
              // Проверяем инкрементацию пула в БД
              console.log('🔍 Verifying pool increment in database...');
              try {
                const verificationResponse = await fetch(`${apiUrl}/user-progress`);
                if (verificationResponse.ok) {
                  const verificationData = await verificationResponse.json();
                  const actualPool = verificationData.currentPool || verificationData.pool || 0;
                  const expectedPool = nextPoolStart; // Ожидаемый пул
                  
                  console.log('📊 Pool Increment Verification:');
                  console.log(`  Expected pool: ${expectedPool}`);
                  console.log(`  Actual pool in DB: ${actualPool}`);
                  
                  if (actualPool === expectedPool) {
                    console.log('✅ Pool increment verified in database');
                    transitionSuccess = true;
                  } else {
                    console.error('❌ POOL TRANSITION FAILURE:');
                    console.error(`  Expected: ${expectedPool}, Actual: ${actualPool}`);
                    console.error('  Pool transition was not successful!');
                    
                    // Попытка повторного перехода
                    console.log('🔄 Attempting pool transition retry...');
                    try {
                      const retryResponse = await fetch(`${apiUrl}/user-progress/advance-pool`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          currentPool: nextPoolStart,
                          poolSize: 3,
                          lastUpdated: new Date().toISOString()
                        }),
                      });
                      
                      if (retryResponse.ok) {
                        console.log('✅ Pool transition retry successful');
                        transitionSuccess = true;
                      } else {
                        console.error('❌ Pool transition retry failed');
                      }
                    } catch (retryError) {
                      console.error('❌ Pool transition retry error:', retryError);
                    }
                  }
                } else {
                  console.error('❌ Failed to verify pool increment - could not fetch user progress');
                }
              } catch (verificationError) {
                console.error('❌ Pool increment verification error:', verificationError);
              }
              
              // Финальная проверка успешности перехода
              if (transitionSuccess) {
                console.log('🎉 POOL TRANSITION SUCCESSFUL!');
                console.log(`  Successfully transitioned from pool ${currentPoolStart} to pool ${nextPoolStart}`);
                
                // Перезагружаем ассоциации для нового пула
                console.log('🔄 Reloading associations for new pool...');
                await fetchAssociations();
                console.log('✅ Associations reloaded for new pool');
                
                // Скроллим вверх при переходе к новому пулу
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  document.documentElement.scrollTop = 0;
                  document.body.scrollTop = 0;
                  console.log('Scrolled to top for new pool');
                }, 100);
              } else {
                console.error('🚨 POOL TRANSITION FAILED!');
                console.error('  Pool transition was not successful - user may remain in current pool');
                console.error('  Check API endpoints and database connectivity');
              }
            } else {
              console.error('❌ POOL TRANSITION API FAILED:');
              console.error(`  API response status: ${nextPoolResponse.status}`);
              console.error('  Pool transition request was rejected by server');
            }
          } catch (err) {
            console.error('Failed to save progress or advance pool:', err);
          }
        }, 2000);
      }
    } else {
      // Неправильный ответ - показываем всплывающее уведомление
      toast.error('❌ Spróbuj ponownie!', {
        duration: 3000,
        style: {
          background: 'linear-gradient(to right, #dc2626, #ef4444)',
          color: '#ffffff',
          fontWeight: 'bold',
          fontSize: '16px',
          borderRadius: '12px',
          border: '2px solid #ef4444',
          boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)',
        },
      });
    }
  };

  // Debug info
  console.log('StudyMode render:', {
    isLoading,
    associations: associations.length,
    isStudying,
    selectedHero,
    selectedAction,
    selectedObject,
    showResult,
    currentNumberIndex,
    currentNumber: associations[currentNumberIndex]?.number,
    poolStart: associations[0]?.number,
    poolEnd: associations[associations.length - 1]?.number,
    timestamp: new Date().toLocaleTimeString()
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-orange-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-orange-200 text-xl">Ładowanie skojarzeń...</p>
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
          <p className="text-orange-200 text-xl">Brak skojarzeń do nauki</p>
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

        {/* Fixed Timer - Right Middle */}
        {isStudying && (
          <div className="fixed top-1/2 right-4 z-50 transform -translate-y-1/2" style={{ position: 'fixed', top: '50%', right: '16px', transform: 'translateY(-50%)' }}>
            <motion.div 
              className="relative w-20 h-20 bg-black/90 backdrop-blur-sm rounded-full shadow-2xl border-3 border-white/30 flex items-center justify-center"
              style={{ 
                position: 'relative',
                transform: 'translateZ(0)', // Force hardware acceleration
                willChange: 'transform' // Optimize for animations
              }}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.1 }}
            >
              {/* Timer Circle Background */}
              <div className="absolute inset-2 bg-black/20 rounded-full"></div>
              
              {/* Timer Text */}
              <div className="relative z-10 text-center">
                <div className="text-xs text-white/80 font-bold mb-1">TIME</div>
                <div className="text-lg font-black text-white">
                  {timeLeft}
                </div>
            </div>
              
              {/* Pulsing Ring Effect */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-white/40"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Clock Icon */}
              <Clock className="absolute top-1 right-1 h-3 w-3 text-white/60" />
            </motion.div>
          </div>
        )}

        {/* Study Controls */}
        <AnimatePresence>
        {!isStudying && (
            <motion.div 
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 1, y: 0 }}
              transition={{ duration: 0 }}
              className="text-center mb-8"
            >
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 0 0 rgba(255, 255, 255, 0)",
                    "0 0 30px rgba(255, 255, 255, 0.4)",
                    "0 0 0 rgba(255, 255, 255, 0)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 50
                }}
              >
                <HalloweenButton
                  onClick={handleStartStudy}
                  variant="primary"
                  size="lg"
                  icon={<Play className="h-8 w-8" />}
                  className="w-[400px] h-[400px] rounded-full uppercase pl-2"
                >
                  <span className="ml-5">START</span>
                </HalloweenButton>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Study Content */}
        <AnimatePresence mode="wait">
          {isStudying && associations.length > 0 && (
            <motion.div 
              key={currentNumberIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
              className="bg-black/90 backdrop-blur-sm rounded-xl p-8 shadow-2xl border-2 border-white/20 mb-8"
            >
              {/* Current Number Display */}
            <div className="text-center mb-8">
                <motion.div 
                  className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-orange-500 to-purple-500 rounded-full shadow-2xl"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                >
                  <motion.span 
                    key={associations[currentNumberIndex]?.number}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                    className="text-4xl font-bold text-white"
                  >
                    {associations[currentNumberIndex]?.number || 0}
                  </motion.span>
                </motion.div>
            <p className="text-xl text-orange-200 mt-4">
              Wybierz prawidłowe skojarzenia dla liczby
            </p>
            </div>

            {/* Association Selection Cards */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Hero Selection */}
              <motion.div 
                className="bg-black/80 backdrop-blur-sm rounded-xl p-6 shadow-2xl border-2 border-red-400/50"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-center">
                  <h3 className="text-xl font-bold text-red-300 mb-4">Bohater</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {associations.map((association, index) => (
                      <motion.div 
                        key={`hero-${association.number}`} 
                        initial={{ opacity: 1, x: 0 }}
                        animate={{ 
                          opacity: selectedHero && selectedHero !== association.hero ? 0.3 : 1,
                          scale: selectedHero === association.hero ? 1.1 : 1,
                          y: selectedHero === association.hero ? -10 : 0,
                          zIndex: selectedHero === association.hero ? 10 : 1
                        }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: selectedHero ? 1 : 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`rounded-lg p-3 cursor-pointer border-2 ${
                          selectedHero === association.hero 
                            ? 'bg-gradient-to-r from-red-500 to-pink-500 border-red-300 shadow-2xl ring-2 ring-red-400' 
                            : 'bg-gradient-to-r from-red-700 to-pink-700 border-red-800 hover:from-red-600 hover:to-pink-600 hover:border-red-600'
                        }`}
                        onClick={() => {
                          console.log('Hero clicked:', association.hero);
                          setSelectedHero(association.hero);
                        }}
                      >
                        <div className="flex items-center justify-center">
                          <AssociationImage
                            src={`${process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4002`}/images/heroes/${association.number}_${association.hero.toLowerCase().replace(/[^a-z0-9]/g, '_')}.svg`}
                            alt={association.hero}
                            title={association.hero}
                            size="sm"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Action Selection */}
              <motion.div 
                className="bg-black/80 backdrop-blur-sm rounded-xl p-6 shadow-2xl border-2 border-green-400/50"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-center">
                  <h3 className="text-xl font-bold text-green-300 mb-4">Działanie</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {associations.map((association, index) => (
                      <motion.div 
                        key={`action-${association.number}`} 
                        initial={{ opacity: 1, x: 0 }}
                        animate={{ 
                          opacity: selectedAction && selectedAction !== association.action ? 0.3 : 1,
                          scale: selectedAction === association.action ? 1.1 : 1,
                          y: selectedAction === association.action ? -10 : 0,
                          zIndex: selectedAction === association.action ? 10 : 1
                        }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: selectedAction ? 1 : 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`rounded-lg p-3 cursor-pointer border-2 ${
                          selectedAction === association.action 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-300 shadow-2xl ring-2 ring-green-400' 
                            : 'bg-gradient-to-r from-green-700 to-emerald-700 border-green-800 hover:from-green-600 hover:to-emerald-600 hover:border-green-600'
                        }`}
                        onClick={() => {
                          console.log('Action clicked:', association.action);
                          setSelectedAction(association.action);
                        }}
                      >
                        <div className="flex items-center justify-center">
                          <AssociationImage
                            src={`${process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4002`}/images/actions/${association.number}_${association.action.toLowerCase().replace(/[^a-z0-9]/g, '_')}.svg`}
                            alt={association.action}
                            title={association.action}
                            size="sm"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Object Selection */}
              <motion.div 
                className="bg-black/80 backdrop-blur-sm rounded-xl p-6 shadow-2xl border-2 border-blue-400/50"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-center">
                  <h3 className="text-xl font-bold text-blue-300 mb-4">Przedmiot</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {associations.map((association, index) => (
                      <motion.div 
                        key={`object-${association.number}`} 
                        initial={{ opacity: 1, x: 0 }}
                        animate={{ 
                          opacity: selectedObject && selectedObject !== association.object ? 0.3 : 1,
                          scale: selectedObject === association.object ? 1.1 : 1,
                          y: selectedObject === association.object ? -10 : 0,
                          zIndex: selectedObject === association.object ? 10 : 1
                        }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: selectedObject ? 1 : 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`rounded-lg p-3 cursor-pointer border-2 ${
                          selectedObject === association.object 
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 border-blue-300 shadow-2xl ring-2 ring-blue-400' 
                            : 'bg-gradient-to-r from-blue-700 to-cyan-700 border-blue-800 hover:from-blue-600 hover:to-cyan-600 hover:border-blue-600'
                        }`}
                        onClick={() => {
                          console.log('Object clicked:', association.object);
                          setSelectedObject(association.object);
                        }}
                      >
                        <div className="flex items-center justify-center">
                          <AssociationImage
                            src={`${process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4002`}/images/objects/${association.number}_${association.object.toLowerCase().replace(/[^a-z0-9]/g, '_')}.svg`}
                            alt={association.object}
                            title={association.object}
                            size="sm"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>


            {/* Check Button */}
            <div className="text-center mb-6">
              <StudyButton
                type="check"
                onClick={handleCheckAnswer}
                disabled={!selectedHero || !selectedAction || !selectedObject}
                className="w-[240px]"
              />
            </div>


            {/* Result Display - убрано, теперь используется Toast уведомления */}

            {/* Complete Button */}
            {showResult === true && currentNumberIndex === associations.length - 1 && (
              <div className="text-center">
          <button
                  onClick={onComplete}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-bold text-xl shadow-2xl hover:scale-105 flex items-center space-x-3 mx-auto"
                >
                  <span>✅ Zakończ Naukę</span>
          </button>
        </div>
            )}
          </motion.div>
        )}
        </AnimatePresence>

        {/* Fixed Skojarzenia Button - Top Right */}
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
            onClick={() => navigate('/associations')}
            disabled={isLoading}
            icon={<BookOpen className="h-6 w-6" />}
            className="w-[60px]"
          >
            {''}
          </HalloweenButton>
        </motion.div>

      </div>
    </div>
  );
};

export default StudyMode;