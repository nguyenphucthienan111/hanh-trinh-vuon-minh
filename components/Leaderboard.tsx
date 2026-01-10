import React, { useEffect, useState } from "react";
import { LeaderboardEntry } from "../types";
import { getLeaderboard } from "../services/storageService";
import { Trophy, Medal, User, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export const Leaderboard: React.FC = () => {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      setIsLoading(true);
      const data = await getLeaderboard();
      setLeaders(data);
      setIsLoading(false);
    };
    fetchLeaders();
  }, []);

  const getRankIcon = (index: number) => {
    if (index === 0)
      return <Trophy className="w-6 h-6 text-yellow-500 fill-yellow-500" />;
    if (index === 1)
      return <Medal className="w-6 h-6 text-gray-400 fill-gray-400" />;
    if (index === 2)
      return <Medal className="w-6 h-6 text-orange-600 fill-orange-600" />;
    return (
      <span className="font-bold text-gray-400 font-mono">#{index + 1}</span>
    );
  };

  return (
    <div className="h-full overflow-y-auto p-6 md:p-8 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-serif font-bold text-vn-red mb-2 uppercase tracking-widest">
          Bảng Vàng
        </h2>
        <p className="text-gray-600 italic">
          "Thi đua là yêu nước, yêu nước thì phải thi đua"
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-parchment-dark overflow-hidden min-h-[300px]">
        <div className="bg-vn-red p-4 grid grid-cols-12 gap-4 text-white font-bold text-sm uppercase tracking-wider">
          <div className="col-span-2 text-center">Hạng</div>
          <div className="col-span-6">Cán Bộ</div>
          <div className="col-span-4 text-right">Tổng Điểm XP</div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-vn-red" />
            <p>Đang cập nhật danh sách...</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {leaders.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-yellow-50 transition-colors ${
                  index < 3
                    ? "bg-gradient-to-r from-yellow-50/50 to-transparent"
                    : ""
                }`}
              >
                <div className="col-span-2 flex justify-center">
                  {getRankIcon(index)}
                </div>
                <div className="col-span-6 flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${
                      entry.avatarId === "1"
                        ? "bg-red-500"
                        : entry.avatarId === "2"
                        ? "bg-blue-500"
                        : entry.avatarId === "3"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink">{entry.name}</h3>
                    <p className="text-xs text-gray-500">{entry.title}</p>
                  </div>
                </div>
                <div className="col-span-4 text-right font-mono font-bold text-vn-red text-lg">
                  {entry.totalXp.toLocaleString()}
                </div>
              </motion.div>
            ))}

            {leaders.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                Chưa có dữ liệu xếp hạng. Hãy là người đầu tiên ghi danh!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
