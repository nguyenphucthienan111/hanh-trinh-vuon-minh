import React, { useState, useEffect } from 'react';
import { SCENARIOS } from '../constants';
import { UserStats, Scenario, UserProfile } from '../types';
import { saveScore } from '../services/storageService';
import { ArrowRight, BookOpen, Lightbulb, CheckCircle2, AlertTriangle, RotateCcw, Loader2, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScenarioGameProps {
  user: UserProfile;
  onUpdateStats: (effect: Partial<UserStats>, activityType?: 'scenario' | 'minigame', activityId?: string) => void;
}

export const ScenarioGame: React.FC<ScenarioGameProps> = ({ user, onUpdateStats }) => {
  // Initialize index based on user progress (Auto-Resume)
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (user.completedScenarioIds && user.completedScenarioIds.length > 0) {
       // If user completed n scenarios, start at index n (which is the (n+1)th scenario)
       const nextIndex = user.completedScenarioIds.length;
       if (nextIndex < SCENARIOS.length) {
         return nextIndex;
       }
       // If finished all, let the useEffect handle the finished state, but return max index for now
       return SCENARIOS.length - 1;
    }
    return 0;
  });

  const [feedback, setFeedback] = useState<string | null>(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Check if user finished everything on mount
  useEffect(() => {
      if (user.completedScenarioIds?.length >= SCENARIOS.length) {
          setGameFinished(true);
      }
  }, []);

  const currentScenario: Scenario | undefined = SCENARIOS[currentIndex];
  
  // Check if user has already completed this scenario
  const isCompleted = user.completedScenarioIds?.includes(currentScenario?.id || '');

  const handleChoice = (optionIndex: number) => {
    if (!currentScenario) return;
    const choice = currentScenario.options[optionIndex];
    
    try {
        // Pass 'scenario' type and ID to the update function to prevent duplicate XP
        onUpdateStats(choice.statsEffect, 'scenario', currentScenario.id);
    } catch (e) {
        console.error("Error updating stats:", e);
    }
    
    setFeedback(choice.feedback);
  };

  const nextScenario = async () => {
    setFeedback(null);
    if (currentIndex < SCENARIOS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Game Finished
      setIsSaving(true);
      await saveScore(user); // Wait for firebase save
      setIsSaving(false);
      setGameFinished(true);
    }
  };

  const resetGame = () => {
    setCurrentIndex(0); // This allows replaying from start if they really want to reset
    setGameFinished(false);
    setFeedback(null);
  };

  if (gameFinished) {
    return (
      <div className="h-full overflow-y-auto bg-parchment-dark/10">
        <div className="flex flex-col items-center justify-center min-h-full p-6 text-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-10 rounded-3xl shadow-2xl max-w-lg w-full border-t-8 border-vn-red my-auto"
          >
            <div className="w-24 h-24 bg-vn-gold rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle2 className="w-12 h-12 text-vn-red" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-vn-red mb-4">Hành Trình Hoàn Tất!</h2>
            <p className="text-ink mb-8 text-lg px-2">
              Chúc mừng <strong>{user.name}</strong>! Điểm số của bạn đã được lưu vào Bảng Vàng toàn quốc. Hãy kiểm tra thứ hạng của mình.
            </p>
            <div className="flex gap-4 justify-center">
              <button 
                  onClick={resetGame}
                  className="flex items-center justify-center gap-2 bg-gray-100 text-ink px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors"
              >
                  <RotateCcw className="w-5 h-5" /> Chơi Lại (Ôn tập)
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (isSaving) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-parchment-dark/10">
            <Loader2 className="w-12 h-12 text-vn-red animate-spin mb-4" />
            <p className="text-lg font-serif">Đang ghi danh vào bảng vàng...</p>
        </div>
      );
  }

  if (!currentScenario) return <div>Loading...</div>;

  return (
    <div className="h-full overflow-y-auto bg-parchment-dark/10">
      <div className="flex flex-col items-center justify-center min-h-full p-4 md:p-8">
        {/* Progress Bar */}
        <div className="w-full max-w-3xl mb-6 md:mb-8 flex items-center gap-4 px-2 shrink-0">
          <span className="font-bold text-vn-red whitespace-nowrap text-sm md:text-base">Cấp độ {currentIndex + 1}/{SCENARIOS.length}</span>
          <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <motion.div 
              className="h-full bg-vn-red"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / SCENARIOS.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIndex}
            initial={{ opacity: 0, x: 100, rotateY: -10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -100, rotateY: 10 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[500px]"
          >
            {/* Left Panel: Historical Context */}
            {/* Adjusted padding for mobile (p-6) vs desktop (lg:p-8) to save space */}
            <div className="lg:w-1/3 bg-vn-red text-parchment p-6 lg:p-8 flex flex-col justify-center relative overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4 md:mb-6 backdrop-blur-sm">
                  <BookOpen className="text-vn-gold w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 md:mb-4 border-b border-white/20 pb-2">Góc Nhìn Lịch Sử</h3>
                <p className="font-serif italic leading-relaxed text-sm md:text-base opacity-90">
                  "{currentScenario.historicalParallel}"
                </p>
                
                {/* Only show "Completed" if it's already done AND we are NOT currently showing feedback */}
                {isCompleted && !feedback && (
                    <div className="mt-4 md:mt-6 flex items-center gap-2 bg-black/20 p-2 rounded-lg text-xs font-bold text-vn-gold border border-vn-gold/30">
                        <Award className="w-4 h-4" /> Đã hoàn thành (Chơi lại không tính điểm)
                    </div>
                )}

                <div className="mt-4 pt-4 border-t border-white/10 text-xs opacity-70">
                  Bài học từ quá khứ soi đường cho hiện tại.
                </div>
              </div>
            </div>

            {/* Right Panel: Interactive Game */}
            <div className="lg:w-2/3 p-6 md:p-8 flex flex-col">
              <h2 className="text-xl md:text-2xl font-bold text-ink mb-2">{currentScenario.title}</h2>
              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                 <AlertTriangle className="text-orange-500 shrink-0 mt-1 w-5 h-5" />
                 <p className="text-gray-600 text-sm md:text-base">{currentScenario.context}</p>
              </div>
              
              <h3 className="font-bold text-base md:text-lg mb-4 text-vn-red">Bạn sẽ quyết định thế nào?</h3>

              {!feedback ? (
                <div className="grid gap-4 mt-auto">
                  {currentScenario.options.map((option, idx) => (
                    <motion.button
                      key={option.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + (idx * 0.1) }}
                      whileHover={{ scale: 1.02, backgroundColor: "#FFF5F5", borderColor: "#DA251D" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleChoice(idx)}
                      className="p-4 md:p-5 rounded-xl border-2 border-gray-100 text-left transition-all hover:shadow-md group bg-white"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 font-bold flex items-center justify-center group-hover:bg-vn-red group-hover:text-white transition-colors shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className="text-ink font-medium text-sm md:text-base group-hover:text-vn-red transition-colors">{option.text}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-auto bg-green-50 border border-green-200 p-6 rounded-xl relative overflow-hidden"
                >
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                     <Lightbulb className="w-[100px] h-[100px] text-green-600" />
                   </div>
                   <div className="relative z-10">
                      <h4 className="font-bold text-green-800 text-lg mb-2 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5" /> Phân Tích & Bài Học
                      </h4>
                      <p className="text-gray-700 mb-6 leading-relaxed text-sm md:text-base">
                        {feedback}
                      </p>
                      <button
                        onClick={nextScenario}
                        className="w-full bg-vn-red text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-lg"
                      >
                        Tiếp tục hành trình <ArrowRight className="w-[18px] h-[18px]" />
                      </button>
                   </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};