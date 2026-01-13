import React, { useState, useEffect } from 'react';
import { AppView, UserStats, Badge, UserProfile } from './types';
import { INITIAL_STATS, BADGES } from './constants';
import { TimelineView } from './components/TimelineView';
import { ScenarioGame } from './components/ScenarioGame';
import { MentorChat } from './components/MentorChat';
import { Dashboard } from './components/Dashboard';
import { Leaderboard } from './components/Leaderboard';
import { IntroScreen } from './components/IntroScreen';
import { QuizGame } from './components/QuizGame';
import { LayoutDashboard, History, Gamepad2, MessageSquareText, Menu, X, Trash2, Star, Award, Medal, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY_USER = 'hcm_journey_user_v2'; // Changed key version to reset data structure if needed

// --- MAIN APP ---

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.INTRO);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newBadge, setNewBadge] = useState<Badge | null>(null);
  const [isQuizActive, setIsQuizActive] = useState(false); // Lock navigation when quiz is active

  // User State - Improved initialization with data migration
  const [user, setUser] = useState<UserProfile | null>(() => {
     const saved = localStorage.getItem(STORAGE_KEY_USER);
     if (saved) {
         try {
             const parsed = JSON.parse(saved);
             // Migration: Ensure new arrays exist if they are missing from old data
             return {
                 ...parsed,
                 completedScenarioIds: Array.isArray(parsed.completedScenarioIds) ? parsed.completedScenarioIds : [],
                 // Ensure vital fields exist
                 badges: parsed.badges || BADGES,
                 stats: parsed.stats || INITIAL_STATS
             };
         } catch (e) {
             console.error("Error parsing user data", e);
             return null;
         }
     }
     return null;
  });

  // Restore session if user exists
  useEffect(() => {
    if (user && currentView === AppView.INTRO) {
        setCurrentView(AppView.DASHBOARD);
    }
  }, [user]);

  // Persistence
  useEffect(() => {
    if (user) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    }
  }, [user]);

  const handleStart = (name: string, avatarId: string) => {
    const newUser: UserProfile = {
        name,
        avatarId,
        stats: INITIAL_STATS,
        badges: BADGES,
        totalXp: 0,
        completedScenarioIds: []
    };
    setUser(newUser);
    setCurrentView(AppView.DASHBOARD);
  };

  // Updated handler to accept activity tracking
  const handleUpdateStats = (effect: Partial<UserStats>, activityType?: 'scenario' | 'minigame', activityId?: string) => {
    if (!user) return;
    
    // Check for duplicates logic with SAFE access
    const completedIds = user.completedScenarioIds || [];
    
    if (activityType === 'scenario' && activityId && completedIds.includes(activityId)) {
        console.log("Scenario already completed, no XP awarded.");
        return; 
    }

    setUser(prev => {
      if (!prev) return null;
      
      // Calculate new stats
      const newStats = {
        resilience: Math.min(100, Math.max(0, prev.stats.resilience + (effect.resilience || 0))),
        creativity: Math.min(100, Math.max(0, prev.stats.creativity + (effect.creativity || 0))),
        trust: Math.min(100, Math.max(0, prev.stats.trust + (effect.trust || 0))),
        knowledge: Math.min(100, Math.max(0, prev.stats.knowledge + (effect.knowledge || 0))),
      };
      
      const xpGain = Object.values(effect).reduce((a, b) => (a || 0) + Math.abs(b || 0), 0) || 0;
      const totalXp = prev.totalXp + xpGain;

      // Update completion lists safely
      const updatedCompletedScenarioIds = [...(prev.completedScenarioIds || [])];
      if (activityType === 'scenario' && activityId && !updatedCompletedScenarioIds.includes(activityId)) {
          updatedCompletedScenarioIds.push(activityId);
      }

      // Check badges logic...
      let justUnlocked: Badge | null = null;
      const updatedBadges = prev.badges.map(badge => {
        if (badge.unlocked) return badge;
        let unlocked = false;
        if (badge.id === '1' && newStats.knowledge >= 20) unlocked = true;
        if (badge.id === '2' && newStats.creativity >= 40) unlocked = true;
        if (badge.id === '3' && newStats.trust >= 50) unlocked = true;
        if (badge.id === '4' && newStats.knowledge >= 50 && newStats.resilience >= 50) unlocked = true;
        if (badge.id === '5' && newStats.resilience >= 70) unlocked = true;

        if (unlocked) {
          justUnlocked = { ...badge, unlocked: true };
          return justUnlocked;
        }
        return badge;
      });

      if (justUnlocked) setNewBadge(justUnlocked);

      return {
          ...prev,
          stats: newStats,
          totalXp,
          badges: updatedBadges,
          completedScenarioIds: updatedCompletedScenarioIds
      };
    });
  };

  const handleResetData = () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất và xóa phiên chơi hiện tại? Điểm trên bảng xếp hạng vẫn sẽ được lưu.')) {
      localStorage.removeItem(STORAGE_KEY_USER);
      setUser(null);
      setCurrentView(AppView.INTRO);
    }
  };

  // Handler for Quiz game score update
  const handleQuizScoreUpdate = (quizScore: number) => {
    if (!user) return;
    
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        totalXp: prev.totalXp + quizScore
      };
    });
  };

  const NavItem = ({ view, icon: Icon, label }: { view: AppView, icon: any, label: string }) => {
    const handleClick = () => {
      if (isQuizActive) {
        alert('⚠️ Bạn đang làm bài quiz! Vui lòng hoàn thành trước khi chuyển trang.');
        return;
      }
      setCurrentView(view);
      setIsSidebarOpen(false);
    };

    return (
      <button
        onClick={handleClick}
        disabled={isQuizActive && currentView !== view}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 font-medium ${
          currentView === view 
            ? 'bg-vn-red text-vn-gold shadow-md' 
            : isQuizActive && currentView !== view
            ? 'text-gray-400 cursor-not-allowed opacity-50'
            : 'text-ink hover:bg-parchment-dark'
        }`}
      >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </button>
    );
  };

  // --- RENDER ---

  if (currentView === AppView.INTRO || !user) {
      return <IntroScreen onStart={handleStart} />;
  }

  return (
    <div className="flex h-screen bg-parchment-dark font-sans overflow-hidden">
      <AnimatePresence>
        {newBadge && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            className="fixed top-20 right-8 z-50 bg-white p-4 rounded-xl shadow-2xl border-l-4 border-vn-gold flex items-center gap-4 max-w-sm"
            onAnimationComplete={() => setTimeout(() => setNewBadge(null), 4000)}
          >
            <div className="bg-vn-red p-3 rounded-full text-white">
                <Award size={24} />
            </div>
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mở khóa huy hiệu</p>
                <h4 className="font-bold text-vn-red text-lg">{newBadge.name}</h4>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 flex-col bg-parchment border-r border-parchment-dark shadow-xl z-20">
        <div className="p-6 border-b border-parchment-dark/50 flex flex-col items-center">
            <h1 className="text-2xl font-serif font-bold text-vn-red flex items-center gap-2 mb-1">
                <Star className="text-vn-gold fill-vn-gold" /> Vươn Mình
            </h1>
            <div className="text-xs text-gray-500 font-medium bg-parchment-dark px-2 py-0.5 rounded-full">
                Xin chào, {user.name}
            </div>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem view={AppView.DASHBOARD} icon={LayoutDashboard} label="Tổng Quan" />
          <NavItem view={AppView.TIMELINE} icon={History} label="Dòng Chảy Lịch Sử" />
          <NavItem view={AppView.SCENARIO} icon={Gamepad2} label="Thử Thách Nhập Vai" />
          <NavItem view={AppView.QUIZ} icon={Zap} label="Trò Chơi Kiến Thức" />
          <NavItem view={AppView.MENTOR} icon={MessageSquareText} label="Người Dẫn Đường" />
          <NavItem view={AppView.LEADERBOARD} icon={Medal} label="Bảng Vàng" />
        </nav>
        
        <div className="p-4 border-t border-parchment-dark/50">
          <button 
            onClick={handleResetData}
            className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors p-2 rounded hover:bg-red-50"
          >
            <Trash2 size={16} /> Đăng Xuất
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full bg-parchment h-16 flex items-center justify-between px-6 z-30 shadow-md">
        <h1 className="font-serif font-bold text-vn-red flex items-center gap-2 text-lg">
           <Star className="w-5 h-5 text-vn-gold fill-vn-gold"/> Vươn Mình
        </h1>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="p-2 hover:bg-parchment-dark rounded-lg transition-colors"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
            onClick={() => setIsSidebarOpen(false)}
          >
            <motion.div 
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 20 }}
              className="bg-parchment w-80 h-full shadow-2xl p-4 pt-20 space-y-2 flex flex-col" 
              onClick={e => e.stopPropagation()}
            >
              <div className="mb-4 px-4">
                  <p className="text-sm text-gray-500">Đang chơi với tên:</p>
                  <p className="font-bold text-lg text-vn-red truncate">{user.name}</p>
              </div>
              <NavItem view={AppView.DASHBOARD} icon={LayoutDashboard} label="Tổng Quan" />
              <NavItem view={AppView.TIMELINE} icon={History} label="Dòng Chảy Lịch Sử" />
              <NavItem view={AppView.SCENARIO} icon={Gamepad2} label="Thử Thách Nhập Vai" />
              <NavItem view={AppView.QUIZ} icon={Zap} label="Trò Chơi Kiến Thức" />
              <NavItem view={AppView.MENTOR} icon={MessageSquareText} label="Người Dẫn Đường" />
              <NavItem view={AppView.LEADERBOARD} icon={Medal} label="Bảng Vàng" />
              
              <div className="mt-auto pt-4 border-t border-gray-300">
                 <button 
                   onClick={handleResetData} 
                   className="w-full flex items-center gap-2 text-sm text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                 >
                  <Trash2 size={16} /> Đăng Xuất
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden pt-16 lg:pt-0 bg-[#F9F7F0]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] opacity-40 pointer-events-none mix-blend-multiply"></div>
        <div className="h-full relative z-10 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full"
            >
              {currentView === AppView.DASHBOARD && <Dashboard user={user} />}
              {currentView === AppView.TIMELINE && <TimelineView />}
              {currentView === AppView.SCENARIO && <ScenarioGame user={user} onUpdateStats={handleUpdateStats} />}
              {currentView === AppView.QUIZ && (
                <QuizGame 
                  user={user} 
                  onScoreUpdate={handleQuizScoreUpdate}
                  onQuizActive={setIsQuizActive}
                />
              )}
              {currentView === AppView.MENTOR && (
                <div className="h-full p-4 md:p-8 max-w-4xl mx-auto">
                  <MentorChat />
                </div>
              )}
              {currentView === AppView.LEADERBOARD && <Leaderboard />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default App;