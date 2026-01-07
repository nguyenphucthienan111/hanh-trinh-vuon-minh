import React from 'react';
import { UserStats, Badge } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, Star, TrendingUp, Book, Lightbulb, HeartHandshake, ScrollText } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardProps {
  stats: UserStats;
  badges: Badge[];
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, badges }) => {
  const data = [
    { name: 'Kiên Trì', value: stats.resilience, color: '#DA251D', fullMark: 100 },
    { name: 'Sáng Tạo', value: stats.creativity, color: '#F59E0B', fullMark: 100 },
    { name: 'Lòng Tin', value: stats.trust, color: '#10B981', fullMark: 100 },
    { name: 'Kiến Thức', value: stats.knowledge, color: '#3B82F6', fullMark: 100 },
  ];

  const totalScore = Object.values(stats).reduce((a, b) => a + b, 0);
  const level = Math.floor(totalScore / 50) + 1;
  const nextLevel = level * 50;
  
  const getLevelTitle = (lvl: number) => {
    if (lvl === 1) return "Người Tìm Đường";
    if (lvl === 2) return "Người Rèn Luyện";
    if (lvl === 3) return "Chiến Sĩ Cách Mạng";
    if (lvl >= 4) return "Lãnh Tụ Tương Lai";
    return "Tân Binh";
  };

  return (
    <div className="h-full overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6 md:space-y-8 pb-20">
      {/* Hero Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-vn-red to-[#8B0000] rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 text-white shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-6">
          <div className="flex-1">
            <div className="inline-block px-2 sm:px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider mb-2 backdrop-blur-sm">
              Hồ Sơ Cán Bộ
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold mb-2">Xin chào, {getLevelTitle(level)}!</h1>
            <p className="opacity-90 max-w-xl text-sm sm:text-base md:text-lg font-light">
              "Không có việc gì khó, chỉ sợ lòng không bền". Hành trình vươn mình của bạn đang ở giai đoạn quan trọng.
            </p>
          </div>
          
          <div className="bg-white/10 p-3 sm:p-4 rounded-xl md:rounded-2xl backdrop-blur-md border border-white/20 w-full lg:w-auto lg:min-w-[200px]">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs sm:text-sm font-bold opacity-80">Cấp độ {level}</span>
              <span className="text-xl sm:text-2xl font-bold text-vn-gold">{totalScore} XP</span>
            </div>
            <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(totalScore % 50) / 50 * 100}%` }}
                className="h-full bg-vn-gold"
              />
            </div>
            <p className="text-xs mt-2 text-right opacity-70">Tiếp theo: {getLevelTitle(level + 1)}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8">
        {/* Left Column: Stats & Journal */}
        <div className="lg:col-span-7 space-y-8">
          {/* Stats Chart */}
          <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
             className="bg-white p-4 sm:p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-lg border border-parchment-dark/50"
          >
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2 text-ink border-b pb-3 sm:pb-4 border-gray-100">
              <TrendingUp className="text-vn-red w-5 h-5 sm:w-6 sm:h-6" /> Biểu Đồ Năng Lực
            </h3>
            <div className="h-56 sm:h-64 md:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                  <XAxis 
                    type="number" 
                    domain={[0, 100] as [number, number]} 
                    hide 
                    tick={false}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={70}
                    tick={{fontSize: 12, fontWeight: 600, fill: '#4a4a4a'}} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    cursor={{fill: 'transparent'}} 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontSize: '14px' }} 
                  />
                  <Bar 
                    dataKey="value" 
                    radius={[0, 8, 8, 0] as any} 
                    barSize={20}
                    animationDuration={1500} 
                    background={{ fill: '#f3f4f6', radius: [0, 8, 8, 0] as any }}
                  >
                      {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Quick Journaling / Reflection (Mockup) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-parchment p-4 sm:p-5 md:p-6 rounded-2xl md:rounded-3xl border-2 border-parchment-dark relative"
          >
             <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 bg-ink text-white p-1.5 sm:p-2 rounded-lg shadow-md rotate-[-5deg]">
               <ScrollText className="w-4 h-4 sm:w-5 sm:h-5" />
             </div>
             <h3 className="text-lg sm:text-xl font-serif font-bold mb-3 sm:mb-4 text-ink ml-3 sm:ml-4">Nhật Ký Phản Tư</h3>
             <div className="space-y-3 sm:space-y-4">
                <div className="bg-white/60 p-3 sm:p-4 rounded-xl border border-parchment-dark/30">
                   <p className="text-xs sm:text-sm text-gray-500 italic mb-1">Hôm nay</p>
                   <p className="text-ink text-sm sm:text-base">Đã hoàn thành bài học về "Sáng tạo trong khuôn khổ". Nhận ra rằng kỷ luật không giết chết sáng tạo, mà nó định hướng sáng tạo hiệu quả hơn.</p>
                </div>
                <div className="bg-white/60 p-3 sm:p-4 rounded-xl border border-parchment-dark/30 opacity-70">
                   <p className="text-xs sm:text-sm text-gray-500 italic mb-1">Hôm qua</p>
                   <p className="text-ink text-sm sm:text-base">Trò chuyện với Mentor AI về định hướng nghề nghiệp. Cần tập trung hơn vào tiếng Anh.</p>
                </div>
             </div>
          </motion.div>
        </div>

        {/* Right Column: Badges & Quote */}
        <div className="lg:col-span-5 space-y-8">
           {/* Badges */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-4 sm:p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-lg border border-parchment-dark/50"
          >
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2 text-ink border-b pb-3 sm:pb-4 border-gray-100">
              <Trophy className="text-vn-gold text-shadow-sm w-5 h-5 sm:w-6 sm:h-6" /> Bộ Sưu Tập Huy Hiệu
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {badges.map((badge, index) => (
                <motion.div 
                  key={badge.id} 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 + (index * 0.1) }}
                  className={`p-3 sm:p-4 rounded-xl md:rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden group ${
                    badge.unlocked 
                      ? 'border-vn-gold bg-gradient-to-br from-yellow-50 to-white hover:shadow-lg' 
                      : 'border-gray-100 bg-gray-50 opacity-60 grayscale'
                  }`}
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 sm:mb-3 ${
                    badge.unlocked ? 'bg-vn-red text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {badge.icon === 'compass' && <Star className="w-4 h-4 sm:w-5 sm:h-5" />}
                    {badge.icon === 'lightbulb' && <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />}
                    {badge.icon === 'users' && <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5" />}
                    {badge.icon === 'globe' && <Book className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-ink mb-1">{badge.name}</h4>
                  <p className="text-[10px] sm:text-xs text-gray-500 leading-tight">{badge.description}</p>
                  
                  {badge.unlocked && (
                     <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-bl from-vn-gold/40 to-transparent rounded-bl-full -mr-6 -mt-6 sm:-mr-8 sm:-mt-8 animate-pulse"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quote Block */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-vn-red p-4 sm:p-5 md:p-6 rounded-2xl md:rounded-3xl text-center text-white relative shadow-xl"
          >
             <div className="text-4xl sm:text-5xl md:text-6xl font-serif absolute top-2 left-3 sm:left-4 opacity-20">"</div>
            <p className="text-sm sm:text-base md:text-lg font-serif italic relative z-10 leading-relaxed">
              "Thanh niên là người chủ tương lai của nước nhà. Thật vậy, nước nhà thịnh hay suy, yếu hay mạnh một phần lớn là do các thanh niên."
            </p>
            <span className="block mt-3 sm:mt-4 font-bold text-vn-gold uppercase text-xs sm:text-sm tracking-widest relative z-10">— Hồ Chí Minh</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};