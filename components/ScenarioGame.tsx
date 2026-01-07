import React, { useState } from 'react';
import { SCENARIOS } from '../constants';
import { UserStats, Scenario } from '../types';
import { ArrowRight, BookOpen, Lightbulb, CheckCircle2, AlertTriangle, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScenarioGameProps {
  onUpdateStats: (effect: Partial<UserStats>) => void;
}

export const ScenarioGame: React.FC<ScenarioGameProps> = ({ onUpdateStats }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [gameFinished, setGameFinished] = useState(false);

  const currentScenario: Scenario | undefined = SCENARIOS[currentIndex];

  const handleChoice = (optionIndex: number) => {
    if (!currentScenario) return;
    const choice = currentScenario.options[optionIndex];
    setSelectedOptionId(choice.id);
    onUpdateStats(choice.statsEffect);
    setFeedback(choice.feedback);
  };

  const nextScenario = () => {
    setFeedback(null);
    setSelectedOptionId(null);
    if (currentIndex < SCENARIOS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setGameFinished(true);
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setGameFinished(false);
    setFeedback(null);
    setSelectedOptionId(null);
  };

  if (gameFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 sm:p-6 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-3xl shadow-2xl max-w-lg w-full border-t-4 sm:border-t-8 border-vn-red"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-vn-gold rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-inner">
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-vn-red" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-vn-red mb-3 sm:mb-4">Hành Trình Hoàn Tất!</h2>
          <p className="text-ink mb-6 sm:mb-8 text-sm sm:text-base md:text-lg px-2">
            Bạn đã xuất sắc vượt qua các thử thách tư duy. Hãy kiểm tra lại các chỉ số của mình ở trang Tổng Quan để xem bạn đã phát triển như thế nào.
          </p>
          <button 
            onClick={resetGame}
            className="flex items-center justify-center gap-2 mx-auto bg-vn-red text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold hover:bg-red-700 transition-transform hover:scale-105 shadow-lg text-sm sm:text-base"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" /> Thử Thách Lại
          </button>
        </motion.div>
      </div>
    );
  }

  if (!currentScenario) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center h-full p-3 sm:p-4 md:p-6 lg:p-8 bg-parchment-dark/10">
      {/* Progress Bar */}
      <div className="w-full max-w-3xl mb-4 sm:mb-6 md:mb-8 flex items-center gap-2 sm:gap-4 px-2">
        <span className="font-bold text-vn-red whitespace-nowrap text-xs sm:text-sm md:text-base">Cấp độ {currentIndex + 1}/{SCENARIOS.length}</span>
        <div className="flex-1 h-2 sm:h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
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
          className="max-w-4xl w-full bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[400px] sm:min-h-[500px]"
        >
          {/* Left Panel: Historical Context */}
          <div className="lg:w-1/3 bg-vn-red text-parchment p-4 sm:p-6 md:p-8 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center mb-4 sm:mb-6 backdrop-blur-sm">
                <BookOpen className="text-vn-gold w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 border-b border-white/20 pb-2">Góc Nhìn Lịch Sử</h3>
              <p className="font-serif italic leading-relaxed text-xs sm:text-sm md:text-base opacity-90">
                "{currentScenario.historicalParallel}"
              </p>
              <div className="mt-4 sm:mt-6 md:mt-8 pt-3 sm:pt-4 border-t border-white/10 text-[10px] sm:text-xs opacity-70">
                Bài học từ quá khứ soi đường cho hiện tại.
              </div>
            </div>
          </div>

          {/* Right Panel: Interactive Game */}
          <div className="lg:w-2/3 p-4 sm:p-6 md:p-8 flex flex-col">
            <h2 className="text-xl sm:text-2xl font-bold text-ink mb-2">{currentScenario.title}</h2>
            <div className="flex items-start gap-2 sm:gap-3 bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-100 mb-4 sm:mb-6">
               <AlertTriangle className="text-orange-500 shrink-0 mt-1 w-4 h-4 sm:w-5 sm:h-5" />
               <p className="text-gray-600 text-sm sm:text-base">{currentScenario.context}</p>
            </div>
            
            <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-vn-red">Bạn sẽ quyết định thế nào?</h3>

            {!feedback ? (
              <div className="grid gap-3 sm:gap-4 mt-auto">
                {currentScenario.options.map((option, idx) => (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + (idx * 0.1) }}
                    whileHover={{ scale: 1.02, backgroundColor: "#FFF5F5", borderColor: "#DA251D" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleChoice(idx)}
                    className="p-4 sm:p-5 rounded-xl border-2 border-gray-100 text-left transition-all hover:shadow-md group bg-white"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 text-gray-500 font-bold flex items-center justify-center group-hover:bg-vn-red group-hover:text-white transition-colors text-sm sm:text-base">
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="text-ink font-medium group-hover:text-vn-red transition-colors text-sm sm:text-base">{option.text}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-auto bg-green-50 border border-green-200 p-4 sm:p-5 md:p-6 rounded-xl relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 p-2 sm:p-4 opacity-10">
                   <Lightbulb className="w-[60px] h-[60px] sm:w-[100px] sm:h-[100px] text-green-600" />
                 </div>
                 <div className="relative z-10">
                    <h4 className="font-bold text-green-800 text-base sm:text-lg mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" /> Phân Tích & Bài Học
                    </h4>
                    <p className="text-gray-700 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                      {feedback}
                    </p>
                    <button
                      onClick={nextScenario}
                      className="w-full bg-vn-red text-white py-2.5 sm:py-3 rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base"
                    >
                      Tiếp tục hành trình <ArrowRight className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                    </button>
                 </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};