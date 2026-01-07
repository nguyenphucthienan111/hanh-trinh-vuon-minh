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
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-10 rounded-3xl shadow-2xl max-w-lg border-t-8 border-vn-red"
        >
          <div className="w-24 h-24 bg-vn-gold rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle2 size={48} className="text-vn-red" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-vn-red mb-4">Hành Trình Hoàn Tất!</h2>
          <p className="text-ink mb-8 text-lg">
            Bạn đã xuất sắc vượt qua các thử thách tư duy. Hãy kiểm tra lại các chỉ số của mình ở trang Tổng Quan để xem bạn đã phát triển như thế nào.
          </p>
          <button 
            onClick={resetGame}
            className="flex items-center gap-2 mx-auto bg-vn-red text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition-transform hover:scale-105 shadow-lg"
          >
            <RotateCcw size={20} /> Thử Thách Lại
          </button>
        </motion.div>
      </div>
    );
  }

  if (!currentScenario) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 md:p-8 bg-parchment-dark/10">
      {/* Progress Bar */}
      <div className="w-full max-w-3xl mb-8 flex items-center gap-4">
        <span className="font-bold text-vn-red whitespace-nowrap">Cấp độ {currentIndex + 1}/{SCENARIOS.length}</span>
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
          className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px]"
        >
          {/* Left Panel: Historical Context */}
          <div className="md:w-1/3 bg-vn-red text-parchment p-8 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm">
                <BookOpen className="text-vn-gold" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4 border-b border-white/20 pb-2">Góc Nhìn Lịch Sử</h3>
              <p className="font-serif italic leading-relaxed text-sm md:text-base opacity-90">
                "{currentScenario.historicalParallel}"
              </p>
              <div className="mt-8 pt-4 border-t border-white/10 text-xs opacity-70">
                Bài học từ quá khứ soi đường cho hiện tại.
              </div>
            </div>
          </div>

          {/* Right Panel: Interactive Game */}
          <div className="md:w-2/3 p-8 flex flex-col">
            <h2 className="text-2xl font-bold text-ink mb-2">{currentScenario.title}</h2>
            <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
               <AlertTriangle className="text-orange-500 shrink-0 mt-1" size={20} />
               <p className="text-gray-600">{currentScenario.context}</p>
            </div>
            
            <h3 className="font-bold text-lg mb-4 text-vn-red">Bạn sẽ quyết định thế nào?</h3>

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
                    className="p-5 rounded-xl border-2 border-gray-100 text-left transition-all hover:shadow-md group bg-white"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 font-bold flex items-center justify-center group-hover:bg-vn-red group-hover:text-white transition-colors">
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="text-ink font-medium group-hover:text-vn-red transition-colors">{option.text}</span>
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
                   <Lightbulb size={100} className="text-green-600" />
                 </div>
                 <div className="relative z-10">
                    <h4 className="font-bold text-green-800 text-lg mb-2 flex items-center gap-2">
                      <Lightbulb size={20} /> Phân Tích & Bài Học
                    </h4>
                    <p className="text-gray-700 mb-6 leading-relaxed text-sm md:text-base">
                      {feedback}
                    </p>
                    <button
                      onClick={nextScenario}
                      className="w-full bg-vn-red text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-lg"
                    >
                      Tiếp tục hành trình <ArrowRight size={18} />
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