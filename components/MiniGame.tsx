import React, { useState, useEffect } from 'react';
import { MemoryCard, UserProfile, UserStats } from '../types';
import { MEMORY_CARDS_DATA } from '../constants';
import { saveScore } from '../services/storageService'; // Import save service
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Trophy, BrainCircuit, Lightbulb, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'; // Add icons

interface MiniGameProps {
  user: UserProfile;
  onUpdateStats: (effect: Partial<UserStats>, activityType?: 'scenario' | 'minigame', activityId?: string) => void;
}

export const MiniGame: React.FC<MiniGameProps> = ({ user, onUpdateStats }) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<MemoryCard[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isLockBoard, setIsLockBoard] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // State for saving status

  const alreadyWon = user.hasCompletedMiniGame;

  // Shuffle and init cards
  const initGame = () => {
    // Generate unique IDs for cards to ensure keys are unique when shuffling
    const shuffled = [...MEMORY_CARDS_DATA]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, isFlipped: false, isMatched: false }));
    setCards(shuffled);
    setFlippedCards([]);
    setMatchedCount(0);
    setMoves(0);
    setIsGameWon(false);
    setIsLockBoard(false);
    setIsSaving(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (clickedCard: MemoryCard) => {
    if (isLockBoard || clickedCard.isFlipped || clickedCard.isMatched || isGameWon) return;

    // Flip the clicked card
    const newCards = cards.map((c) =>
      c.id === clickedCard.id ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    const newFlipped = [...flippedCards, clickedCard];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setIsLockBoard(true);
      setMoves((prev) => prev + 1);
      checkForMatch(newFlipped, newCards);
    }
  };

  const checkForMatch = (currentFlipped: MemoryCard[], currentCards: MemoryCard[]) => {
    const [card1, card2] = currentFlipped;
    const isMatch = card1.pairId === card2.pairId;

    if (isMatch) {
      setTimeout(() => {
        const updatedCards = currentCards.map((c) =>
          c.pairId === card1.pairId ? { ...c, isMatched: true } : c
        );
        setCards(updatedCards);
        setFlippedCards([]);
        setIsLockBoard(false);
        setMatchedCount((prev) => prev + 1);

        if ((matchedCount + 1) * 2 === MEMORY_CARDS_DATA.length) {
          handleWin();
        }
      }, 500);
    } else {
      setTimeout(() => {
        const resetCards = currentCards.map((c) =>
          c.id === card1.id || c.id === card2.id ? { ...c, isFlipped: false } : c
        );
        setCards(resetCards);
        setFlippedCards([]);
        setIsLockBoard(false);
      }, 1000);
    }
  };

  const handleWin = async () => {
    // Reward logic: Less moves = more rewards
    let creativityBonus = 5;
    let knowledgeBonus = 5;
    
    if (moves <= 8) { // Perfect game or close to it
        creativityBonus = 15;
        knowledgeBonus = 10;
    } else if (moves <= 12) {
        creativityBonus = 10;
        knowledgeBonus = 5;
    }

    setIsGameWon(true);
    setIsSaving(true);

    // 1. Update Local State (Visual) & Pass activity type to prevent duplicate XP
    onUpdateStats({
        creativity: creativityBonus,
        knowledge: knowledgeBonus
    }, 'minigame');

    // 2. Save to Leaderboard (Firebase) - only if new points were theoretically added (handled by App.tsx, but good to save state regardless)
    // Note: If alreadyWon is true, onUpdateStats won't add XP, but we might want to ensure Firebase is synced with latest session data if needed.
    // However, saving 0 XP gain is redundant but harmless.
    
    if (!alreadyWon) {
        const totalXpGain = creativityBonus + knowledgeBonus;
        const finalUserForSave = {
            ...user,
            totalXp: user.totalXp + totalXpGain
        };
        await saveScore(finalUserForSave);
    } else {
        // Just simulate saving delay for UX consistency
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setIsSaving(false);
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 bg-parchment-dark/10 flex flex-col items-center">
        <div className="max-w-4xl w-full">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-serif font-bold text-vn-red mb-2 uppercase tracking-wide flex items-center justify-center gap-3">
                    <BrainCircuit className="w-8 h-8" /> Mật Mã Di Sản
                </h2>
                <p className="text-gray-600 italic">
                    "Kết nối quá khứ, kiến tạo tương lai. Hãy tìm cặp bài trùng giữa Sự kiện Lịch sử và Bài học Hiện đại."
                </p>
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm font-bold text-ink">
                    <div className="flex gap-4">
                        <span className="bg-white px-4 py-1 rounded-full shadow-sm border border-gray-200">Lượt lật: {moves}</span>
                        <span className="bg-white px-4 py-1 rounded-full shadow-sm border border-gray-200">Đã tìm: {matchedCount}/{MEMORY_CARDS_DATA.length / 2}</span>
                    </div>
                    {alreadyWon && (
                        <span className="flex items-center gap-1 text-orange-600 bg-orange-100 px-3 py-1 rounded-full text-xs">
                            <AlertCircle className="w-4 h-4" /> Đã nhận thưởng (Chế độ rèn luyện)
                        </span>
                    )}
                </div>
            </div>

            {isGameWon ? (
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-8 rounded-3xl shadow-2xl text-center border-t-8 border-vn-gold max-w-lg mx-auto"
                >
                    <div className="w-20 h-20 bg-vn-red rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
                        <Trophy className="w-10 h-10 text-vn-gold" />
                    </div>
                    <h3 className="text-2xl font-bold text-ink mb-2">Xuất Sắc!</h3>
                    <p className="text-gray-600 mb-6">
                        Bạn đã giải mã thành công mối liên hệ giữa tư tưởng của Bác và kỹ năng thời đại số.
                    </p>
                    
                    {!alreadyWon ? (
                        <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                            <p className="text-sm font-bold text-vn-red uppercase tracking-wider mb-2">
                            Phần Thưởng
                            </p>
                            <div className="flex justify-center gap-4 text-sm font-medium">
                            <span className="text-green-600">+ Sáng Tạo</span>
                            <span className="text-blue-600">+ Kiến Thức</span>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-orange-50 rounded-xl p-4 mb-6 border border-orange-100 text-orange-800 text-sm">
                            Bạn đã nhận phần thưởng cho trò chơi này trước đó.<br/>
                            Kết quả lần chơi này không được tính thêm điểm.
                        </div>
                    )}

                    {isSaving ? (
                        <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-6">
                            <Loader2 className="w-4 h-4 animate-spin" /> Đang cập nhật dữ liệu...
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-2 text-green-600 text-sm mb-6 font-bold">
                             <CheckCircle2 className="w-4 h-4" /> Hoàn tất!
                        </div>
                    )}

                    <button 
                        onClick={initGame}
                        className="flex items-center justify-center gap-2 bg-gray-100 text-ink px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors mx-auto"
                    >
                        <RefreshCcw className="w-5 h-5" /> Chơi Lại
                    </button>
                </motion.div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto" style={{ perspective: '1000px' }}>
                    <AnimatePresence>
                        {cards.map((card) => (
                            <motion.div
                                key={card.id}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ 
                                    opacity: 1, 
                                    scale: 1,
                                    rotateY: card.isFlipped || card.isMatched ? 180 : 0
                                }}
                                transition={{ duration: 0.4 }}
                                onClick={() => handleCardClick(card)}
                                className={`aspect-[3/4] cursor-pointer relative`}
                                style={{ transformStyle: 'preserve-3d' }}
                                whileHover={{ scale: 1.05 }}
                            >
                                {/* Front Face (Hidden initially) - Represents the "Back" of the card (Red Logo) that you see first */}
                                <div 
                                    className="absolute inset-0 bg-vn-red rounded-xl shadow-md border-2 border-vn-gold flex items-center justify-center"
                                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                                >
                                    <div className="w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                                    <BrainCircuit className="text-vn-gold w-8 h-8 opacity-80" />
                                </div>

                                {/* Back Face (Revealed on flip) - Represents the content */}
                                <div 
                                    className={`absolute inset-0 rounded-xl shadow-xl border-2 flex flex-col items-center justify-center p-3 text-center ${
                                        card.isMatched 
                                            ? 'bg-green-100 border-green-400' 
                                            : card.type === 'history' 
                                                ? 'bg-parchment border-parchment-dark' 
                                                : 'bg-white border-blue-200'
                                    }`}
                                    style={{ 
                                        backfaceVisibility: 'hidden', 
                                        WebkitBackfaceVisibility: 'hidden',
                                        transform: 'rotateY(180deg)' 
                                    }}
                                >
                                    <span className="mb-2">
                                        {card.type === 'history' ? <Lightbulb className="w-5 h-5 text-vn-red" /> : <RefreshCcw className="w-5 h-5 text-blue-500" />}
                                    </span>
                                    <p className={`text-sm font-bold ${card.type === 'history' ? 'text-vn-red' : 'text-blue-800'}`}>
                                        {card.content}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    </div>
  );
};