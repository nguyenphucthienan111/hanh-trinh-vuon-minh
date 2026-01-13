import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { QUIZ_QUESTIONS } from '../constants';
import { saveQuizScore } from '../services/storageService';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trophy, CheckCircle, XCircle, Zap, Award } from 'lucide-react';

interface QuizGameProps {
  user: UserProfile;
  onScoreUpdate: (totalScore: number) => void;
  onQuizActive: (isActive: boolean) => void; // Callback to lock/unlock navigation
}

export const QuizGame: React.FC<QuizGameProps> = ({ user, onScoreUpdate, onQuizActive }) => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [randomQuestions, setRandomQuestions] = useState<typeof QUIZ_QUESTIONS>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [answerStartTime, setAnswerStartTime] = useState<number>(Date.now());
  const [showFeedback, setShowFeedback] = useState(false);

  const currentQuestion = quizStarted && randomQuestions.length > 0 ? randomQuestions[currentQuestionIndex] : null;
  const isLastQuestion = currentQuestionIndex === randomQuestions.length - 1;

  // Notify parent when quiz is active
  useEffect(() => {
    onQuizActive(quizStarted && !gameFinished);
  }, [quizStarted, gameFinished, onQuizActive]);

  // Timer countdown
  useEffect(() => {
    if (!quizStarted || isAnswered || gameFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAnswered, gameFinished, currentQuestionIndex]);

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(30);
    setAnswerStartTime(Date.now());
  }, [currentQuestionIndex]);

  const handleTimeout = () => {
    setIsAnswered(true);
    setShowFeedback(true);
    setTimeout(() => {
      if (isLastQuestion) {
        finishGame();
      } else {
        nextQuestion();
      }
    }, 3000);
  };

  const handleAnswerClick = (answerIndex: number) => {
    if (isAnswered) return;

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    setShowFeedback(true);

    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      // Calculate score based on time remaining
      // Base score: 1000 points
      // Bonus: up to 500 points for fast answers (time remaining)
      const timeBonus = Math.floor((timeLeft / 30) * 500);
      const questionScore = 1000 + timeBonus;
      setScore((prev) => prev + questionScore);
    }

    // Move to next question or finish after showing feedback
    setTimeout(() => {
      if (isLastQuestion) {
        finishGame();
      } else {
        nextQuestion();
      }
    }, 3000);
  };

  const nextQuestion = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowFeedback(false);
  };

  const finishGame = async () => {
    setGameFinished(true);
    
    // Update score in parent component (App.tsx) for local state
    onScoreUpdate(score);
    
    // Save quiz score to Firebase leaderboard (only quiz score, not totalXp)
    await saveQuizScore(user.name, user.avatarId, score);
  };

  const restartGame = () => {
    // Reset all states to initial values
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setTimeLeft(30);
    setScore(0); // Reset score to 0 for new game
    setIsAnswered(false);
    setGameFinished(false);
    setShowFeedback(false);
    setAnswerStartTime(Date.now());
  };

  const handleStartQuiz = () => {
    // Random 15 câu từ 50 câu
    const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 15);
    setRandomQuestions(selected);
    setQuizStarted(true);
  };

  // Intro Screen - Before quiz starts
  if (!quizStarted) {
    return (
      <div className="h-full overflow-y-auto p-4 md:p-8 bg-parchment-dark/10 flex items-center justify-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl max-w-2xl w-full border-t-8 border-vn-red"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-vn-red to-vn-gold rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-serif font-bold text-vn-red mb-3 uppercase tracking-wide">
              Trò Chơi Kiến Thức
            </h2>
            <p className="text-gray-600 italic text-lg">
              "Học, học nữa, học mãi" - Hồ Chí Minh
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8 border-2 border-blue-200">
            <h3 className="font-bold text-lg text-ink mb-4 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-vn-gold" />
              Luật Chơi
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-vn-red font-bold text-xl">•</span>
                <span><strong>15 câu hỏi</strong> ngẫu nhiên về tư tưởng Hồ Chí Minh</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-vn-red font-bold text-xl">•</span>
                <span><strong>30 giây</strong> cho mỗi câu hỏi</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-vn-red font-bold text-xl">•</span>
                <span>Trả lời đúng: <strong className="text-green-600">1000 điểm</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-vn-red font-bold text-xl">•</span>
                <span>Trả lời nhanh: <strong className="text-blue-600">Bonus tối đa 500 điểm</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-vn-red font-bold text-xl">•</span>
                <span className="text-orange-600 font-bold">⚠️ Không thể thoát ra khi đang làm bài!</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-vn-red font-bold text-xl">•</span>
                <span className="text-purple-600 font-bold">🎲 Mỗi lần chơi có bộ câu hỏi khác nhau!</span>
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 mb-8">
            <p className="text-center text-gray-700">
              <strong className="text-vn-red">Tổng điểm tối đa:</strong> <span className="text-2xl font-bold text-vn-gold">22,500 điểm</span>
            </p>
            <p className="text-center text-sm text-gray-600 mt-1">
              Điểm sẽ được lưu vào Bảng Vàng khi hoàn thành!
            </p>
          </div>

          <button
            onClick={handleStartQuiz}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-vn-red to-vn-gold text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <Zap className="w-6 h-6" />
            Bắt Đầu Ngay!
          </button>
        </motion.div>
      </div>
    );
  }

  if (gameFinished) {
    return (
      <div className="h-full overflow-y-auto p-4 md:p-8 bg-parchment-dark/10 flex items-center justify-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-3xl shadow-2xl text-center border-t-8 border-vn-gold max-w-lg w-full"
        >
          <div className="w-20 h-20 bg-vn-red rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
            <Trophy className="w-10 h-10 text-vn-gold" />
          </div>
          <h3 className="text-3xl font-bold text-ink mb-2">Hoàn Thành!</h3>
          <p className="text-gray-600 mb-6">
            Bạn đã hoàn thành trò chơi kiến thức về tư tưởng Hồ Chí Minh
          </p>
          
          <div className="bg-gradient-to-r from-vn-red to-vn-gold text-white rounded-xl p-6 mb-6">
            <p className="text-sm font-medium mb-2 opacity-90">Tổng Điểm</p>
            <p className="text-5xl font-bold">{score.toLocaleString()}</p>
            <p className="text-sm mt-2 opacity-90">điểm</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
            <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
              <Award className="w-5 h-5" />
              <p className="font-bold">Điểm đã được lưu vào Bảng Vàng!</p>
            </div>
            <p className="text-sm text-gray-600">
              Tổng XP của bạn: {(user.totalXp + score).toLocaleString()}
            </p>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={restartGame}
              className="flex-1 flex items-center justify-center gap-2 bg-vn-red text-white px-6 py-3 rounded-full font-bold hover:bg-vn-red/90 transition-colors"
            >
              <Zap className="w-5 h-5" /> Chơi Lại
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 bg-parchment-dark/10">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-serif font-bold text-vn-red mb-2 uppercase tracking-wide">
            Trò Chơi Kiến Thức
          </h2>
          <p className="text-gray-600 italic">
            "Học, học nữa, học mãi" - Hồ Chí Minh
          </p>
          <p className="text-sm text-orange-600 font-bold mt-2">
            ⚠️ Không thể thoát khi đang làm bài
          </p>
        </div>

        {/* Progress & Score */}
        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">Câu hỏi:</span>
            <span className="text-lg font-bold text-vn-red">
              {currentQuestionIndex + 1}/15
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-vn-gold" />
            <span className="text-lg font-bold text-ink">{score.toLocaleString()}</span>
          </div>
        </div>

        {/* Timer */}
        <motion.div 
          className={`mb-6 p-4 rounded-xl text-center ${
            timeLeft <= 10 ? 'bg-red-100 border-2 border-red-400' : 'bg-blue-50 border-2 border-blue-200'
          }`}
          animate={timeLeft <= 10 ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.5, repeat: timeLeft <= 10 ? Infinity : 0 }}
        >
          <div className="flex items-center justify-center gap-2">
            <Clock className={`w-6 h-6 ${timeLeft <= 10 ? 'text-red-600' : 'text-blue-600'}`} />
            <span className={`text-3xl font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-blue-600'}`}>
              {timeLeft}s
            </span>
          </div>
          {timeLeft <= 10 && (
            <p className="text-sm text-red-600 font-medium mt-1">Nhanh lên!</p>
          )}
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6"
          >
            <h3 className="text-xl md:text-2xl font-bold text-ink mb-6 leading-relaxed">
              {currentQuestion?.question}
            </h3>

            <div className="space-y-3">
              {currentQuestion?.options.map((option, index) => {
                const isCorrect = index === currentQuestion.correctAnswer;
                const isSelected = selectedAnswer === index;
                const showResult = isAnswered && showFeedback;

                let bgColor = 'bg-gray-50 hover:bg-gray-100 border-gray-200';
                let icon = null;

                if (showResult) {
                  if (isCorrect) {
                    bgColor = 'bg-green-100 border-green-500';
                    icon = <CheckCircle className="w-6 h-6 text-green-600" />;
                  } else if (isSelected && !isCorrect) {
                    bgColor = 'bg-red-100 border-red-500';
                    icon = <XCircle className="w-6 h-6 text-red-600" />;
                  }
                }

                return (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswerClick(index)}
                    disabled={isAnswered}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${bgColor} ${
                      isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'
                    }`}
                    whileHover={!isAnswered ? { scale: 1.02 } : {}}
                    whileTap={!isAnswered ? { scale: 0.98 } : {}}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${
                      showResult && isCorrect 
                        ? 'bg-green-500 text-white border-green-600' 
                        : showResult && isSelected && !isCorrect
                        ? 'bg-red-500 text-white border-red-600'
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className={`flex-1 font-medium ${
                      showResult && isCorrect ? 'text-green-900' : 'text-gray-800'
                    }`}>
                      {option}
                    </span>
                    {showResult && icon}
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation */}
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-4 rounded-xl ${
                  selectedAnswer === currentQuestion.correctAnswer 
                    ? 'bg-green-50 border-2 border-green-300' 
                    : 'bg-orange-50 border-2 border-orange-300'
                }`}
              >
                <p className={`font-bold mb-2 ${
                  selectedAnswer === currentQuestion.correctAnswer 
                    ? 'text-green-800' 
                    : 'text-orange-800'
                }`}>
                  {selectedAnswer === currentQuestion.correctAnswer 
                    ? '✓ Chính xác!' 
                    : selectedAnswer === null 
                    ? '⏱ Hết giờ!' 
                    : '✗ Chưa đúng!'}
                </p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {currentQuestion?.explanation}
                </p>
                {selectedAnswer === currentQuestion?.correctAnswer && (
                  <p className="text-green-700 font-bold mt-2 text-sm">
                    +{1000 + Math.floor((timeLeft / 30) * 500)} điểm 
                    {timeLeft > 20 && ' (Bonus tốc độ! ⚡)'}
                  </p>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
