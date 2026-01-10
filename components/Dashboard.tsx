import React from "react";
import { UserProfile } from "../types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  Trophy,
  Star,
  TrendingUp,
  ScrollText,
  User,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";

interface DashboardProps {
  user: UserProfile;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const data = [
    { name: "Kiên Trì", value: user.stats.resilience, color: "#DA251D" },
    { name: "Sáng Tạo", value: user.stats.creativity, color: "#F59E0B" },
    { name: "Lòng Tin", value: user.stats.trust, color: "#10B981" },
    { name: "Kiến Thức", value: user.stats.knowledge, color: "#3B82F6" },
  ];

  const level = Math.floor(user.totalXp / 50) + 1;
  const nextLevelXp = level * 50;

  const getLevelTitle = (lvl: number) => {
    if (lvl === 1) return "Tân Binh";
    if (lvl === 2) return "Người Rèn Luyện";
    if (lvl === 3) return "Chiến Sĩ Cách Mạng";
    if (lvl >= 4) return "Lãnh Tụ Tương Lai";
    return "Tân Binh";
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 space-y-6 pb-20">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-vn-red to-[#8B0000] rounded-3xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6 w-full lg:w-auto">
            <div
              className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-vn-gold shadow-lg flex items-center justify-center shrink-0 ${
                user.avatarId === "1"
                  ? "bg-red-500"
                  : user.avatarId === "2"
                  ? "bg-blue-500"
                  : user.avatarId === "3"
                  ? "bg-green-500"
                  : "bg-yellow-500"
              }`}
            >
              <User className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </div>
            <div>
              <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider mb-2 backdrop-blur-sm border border-white/30">
                Hồ Sơ Cán Bộ
              </div>
              <h1 className="text-2xl md:text-4xl font-serif font-bold mb-1">
                {user.name}
              </h1>
              <p className="opacity-90 font-light text-lg">
                {getLevelTitle(level)}
              </p>
            </div>
          </div>

          <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/20 w-full lg:w-80">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-bold opacity-80">
                Cấp độ {level}
              </span>
              <span className="text-2xl font-bold text-vn-gold">
                {user.totalXp} XP
              </span>
            </div>
            <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((user.totalXp % 50) / 50) * 100}%` }}
                className="h-full bg-vn-gold"
              />
            </div>
            <p className="text-xs mt-2 text-right opacity-70">
              Cần {nextLevelXp - user.totalXp} XP để thăng cấp
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Stats */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-3xl shadow-lg border border-parchment-dark/50 h-[400px]"
          >
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-ink border-b pb-4 border-gray-100">
              <TrendingUp className="text-vn-red" /> Biểu Đồ Năng Lực
            </h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  layout="vertical"
                  margin={{ left: 10, right: 30, top: 10, bottom: 10 }}
                >
                  <XAxis
                    type="number"
                    domain={[0, 100] as [number, number]}
                    hide
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={80}
                    tick={{ fontSize: 12, fontWeight: 700, fill: "#4a4a4a" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    radius={[0, 8, 8, 0] as [number, number, number, number]}
                    barSize={24}
                    animationDuration={1500}
                    background={{ fill: "#f3f4f6" }}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Badges */}
        <div className="lg:col-span-5 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-3xl shadow-lg border border-parchment-dark/50"
          >
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-ink border-b pb-4 border-gray-100">
              <Trophy className="text-vn-gold text-shadow-sm" /> Bộ Sưu Tập Huy
              Hiệu
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {user.badges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden group ${
                    badge.unlocked
                      ? "border-vn-gold bg-gradient-to-br from-yellow-50 to-white hover:shadow-lg"
                      : "border-gray-100 bg-gray-50 opacity-60 grayscale"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                      badge.unlocked
                        ? "bg-vn-red text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    <Award className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-ink mb-1">
                    {badge.name}
                  </h4>
                  <p className="text-xs text-gray-500 leading-tight">
                    {badge.description}
                  </p>

                  {badge.unlocked && (
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-vn-gold/40 to-transparent rounded-bl-full -mr-8 -mt-8 animate-pulse"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-parchment p-6 rounded-3xl border-2 border-parchment-dark relative shadow-sm"
          >
            <div className="absolute -top-3 -left-3 bg-ink text-white p-2 rounded-lg shadow-md rotate-[-5deg]">
              <ScrollText className="w-5 h-5" />
            </div>
            <p className="text-lg font-serif italic relative z-10 leading-relaxed text-center px-4">
              "Không có việc gì khó
              <br />
              Chỉ sợ lòng không bền
              <br />
              Đào núi và lấp biển
              <br />
              Quyết chí ắt làm nên."
            </p>
            <span className="block mt-4 font-bold text-vn-red text-center text-sm uppercase tracking-widest">
              — Hồ Chí Minh
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
