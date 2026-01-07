import React, { useState, useEffect } from 'react';
import { AppView, UserStats, Badge } from './types';
import { INITIAL_STATS, BADGES } from './constants';
import { TimelineView } from './components/TimelineView';
import { ScenarioGame } from './components/ScenarioGame';
import { MentorChat } from './components/MentorChat';
import { Dashboard } from './components/Dashboard';
import { LayoutDashboard, History, Gamepad2, MessageSquareText, Menu, X, Trash2, Star, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY_STATS = 'hcm_journey_stats_v1';
const STORAGE_KEY_BADGES = 'hcm_journey_badges_v1';

// --- COMPONENTS CON ---

// 1. Màn hình chào (Intro)
const IntroOverlay = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3500); // Intro kéo dài 3.5s
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-[#DA251D] flex flex-col items-center justify-center text-white"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 1.2, type: "spring" }}
        className="mb-8"
      >
        <Star size={120} fill="#FFFF00" stroke="#FFFF00" className="drop-shadow-2xl" />
      </motion.div>
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-serif font-bold uppercase tracking-widest text-center px-4"
      >
        Hành Trình <span className="text-[#FFFF00]">Vươn Mình</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="mt-4 text-sm sm:text-base md:text-lg font-light italic opacity-90 px-4 text-center"
      >
        "Khát vọng non sông - Bản lĩnh thế hệ mới"
      </motion.p>
      
      <motion.div 
        className="absolute bottom-10 w-64 h-1 bg-white/20 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div 
          className="h-full bg-[#FFFF00]"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  );
};

// 2. Thông báo thành tựu (Toast)
const AchievementToast = ({ badge, onClose }: { badge: Badge; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className="fixed top-16 md:top-20 right-2 md:right-4 lg:right-8 z-50 bg-white p-3 md:p-4 rounded-xl shadow-2xl border-l-4 border-vn-gold flex items-center gap-3 md:gap-4 max-w-[85%] sm:max-w-sm"
    >
      <div className="bg-vn-red p-3 rounded-full text-white">
        <Award size={24} />
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mở khóa huy hiệu</p>
        <h4 className="font-bold text-vn-red text-lg">{badge.name}</h4>
      </div>
    </motion.div>
  );
};

// --- MAIN APP ---

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newBadge, setNewBadge] = useState<Badge | null>(null);

  // Initialize stats
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_STATS);
    return saved ? JSON.parse(saved) : INITIAL_STATS;
  });

  // Initialize badges
  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_BADGES);
    return saved ? JSON.parse(saved) : BADGES;
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BADGES, JSON.stringify(badges));
  }, [badges]);

  const handleUpdateStats = (effect: Partial<UserStats>) => {
    setStats(prev => {
      const newStats = {
        resilience: Math.min(100, Math.max(0, prev.resilience + (effect.resilience || 0))),
        creativity: Math.min(100, Math.max(0, prev.creativity + (effect.creativity || 0))),
        trust: Math.min(100, Math.max(0, prev.trust + (effect.trust || 0))),
        knowledge: Math.min(100, Math.max(0, prev.knowledge + (effect.knowledge || 0))),
      };
      checkBadges(newStats);
      return newStats;
    });
  };

  const checkBadges = (currentStats: UserStats) => {
    setBadges(prevBadges => {
      let justUnlocked: Badge | null = null;
      const updatedBadges = prevBadges.map(badge => {
        if (badge.unlocked) return badge;

        let unlocked = false;
        if (badge.id === '1' && currentStats.knowledge >= 20) unlocked = true;
        if (badge.id === '2' && currentStats.creativity >= 40) unlocked = true;
        if (badge.id === '3' && currentStats.trust >= 50) unlocked = true;
        if (badge.id === '4' && currentStats.knowledge >= 50 && currentStats.resilience >= 50) unlocked = true;

        if (unlocked) {
          justUnlocked = { ...badge, unlocked: true };
          return justUnlocked;
        }
        return badge;
      });

      if (justUnlocked) {
        setNewBadge(justUnlocked);
      }
      return updatedBadges;
    });
  };

  const handleResetData = () => {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ tiến trình và chơi lại từ đầu?')) {
      localStorage.removeItem(STORAGE_KEY_STATS);
      localStorage.removeItem(STORAGE_KEY_BADGES);
      setStats(INITIAL_STATS);
      setBadges(BADGES);
      window.location.reload();
    }
  };

  const NavItem = ({ view, icon: Icon, label }: { view: AppView, icon: any, label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setIsSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg transition-colors duration-200 text-sm md:text-base ${
        currentView === view 
          ? 'bg-vn-red text-vn-gold font-bold shadow-md' 
          : 'text-ink hover:bg-parchment-dark'
      }`}
    >
      <Icon className="w-4 h-4 md:w-5 md:h-5" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-parchment-dark font-sans overflow-hidden">
      <AnimatePresence>
        {showIntro && <IntroOverlay onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {newBadge && (
          <AchievementToast badge={newBadge} onClose={() => setNewBadge(null)} />
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop & Tablet */}
      <aside className="hidden lg:flex w-64 flex-col bg-parchment border-r border-parchment-dark shadow-xl z-20">
        <div className="p-4 lg:p-6 border-b border-parchment-dark/50">
          <h1 className="text-xl lg:text-2xl font-serif font-bold text-vn-red flex items-center gap-2">
            <Star className="text-vn-gold fill-vn-gold" /> Vươn Mình
          </h1>
        </div>
        <nav className="flex-1 p-3 lg:p-4 space-y-2">
          <NavItem view={AppView.DASHBOARD} icon={LayoutDashboard} label="Tổng Quan" />
          <NavItem view={AppView.TIMELINE} icon={History} label="Dòng Chảy Lịch Sử" />
          <NavItem view={AppView.SCENARIO} icon={Gamepad2} label="Thử Thách Nhập Vai" />
          <NavItem view={AppView.MENTOR} icon={MessageSquareText} label="Người Dẫn Đường" />
        </nav>
        
        <div className="p-3 lg:p-4 border-t border-parchment-dark/50">
          <button 
            onClick={handleResetData}
            className="w-full flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-red-600 transition-colors p-2 rounded hover:bg-red-50"
          >
            <Trash2 size={14} /> Reset & Replay
          </button>
        </div>
      </aside>

      {/* Mobile & Tablet Header */}
      <div className="lg:hidden fixed top-0 w-full bg-parchment h-14 md:h-16 flex items-center justify-between px-4 md:px-6 z-30 shadow-md">
        <h1 className="font-serif font-bold text-vn-red flex items-center gap-2 text-sm md:text-base">
           <Star className="w-4 h-4 md:w-5 md:h-5 text-vn-gold fill-vn-gold"/> Vươn Mình
        </h1>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="p-2 hover:bg-parchment-dark rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile & Tablet Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
            onClick={() => setIsSidebarOpen(false)}
          >
            <motion.div 
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 20 }}
              className="bg-parchment w-64 md:w-80 h-full shadow-2xl p-4 pt-16 md:pt-20 space-y-2 flex flex-col" 
              onClick={e => e.stopPropagation()}
            >
              <NavItem view={AppView.DASHBOARD} icon={LayoutDashboard} label="Tổng Quan" />
              <NavItem view={AppView.TIMELINE} icon={History} label="Dòng Chảy Lịch Sử" />
              <NavItem view={AppView.SCENARIO} icon={Gamepad2} label="Thử Thách Nhập Vai" />
              <NavItem view={AppView.MENTOR} icon={MessageSquareText} label="Người Dẫn Đường" />
              
              <div className="mt-auto pt-4 border-t border-gray-300">
                 <button 
                   onClick={handleResetData} 
                   className="w-full flex items-center gap-2 text-sm text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                 >
                  <Trash2 size={16} /> Reset Game
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden pt-14 md:pt-16 lg:pt-0 bg-[#F9F7F0]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] opacity-40 pointer-events-none mix-blend-multiply"></div>
        <div className="h-full relative z-10 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full"
            >
              {currentView === AppView.DASHBOARD && <Dashboard stats={stats} badges={badges} />}
              {currentView === AppView.TIMELINE && <TimelineView />}
              {currentView === AppView.SCENARIO && <ScenarioGame onUpdateStats={handleUpdateStats} />}
              {currentView === AppView.MENTOR && (
                <div className="h-full p-3 md:p-6 lg:p-8 max-w-4xl mx-auto">
                  <MentorChat />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default App;