import React, { useEffect, useState } from "react";
import { LeaderboardEntry } from "../types";
import { getLeaderboard, deleteLeaderboardEntry } from "../services/storageService";
import { Trophy, Medal, User, Loader2, Trash2, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

export const Leaderboard: React.FC = () => {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeaders = async (forceRefresh: boolean = false) => {
    setIsLoading(true);
    const data = await getLeaderboard(forceRefresh);
    setLeaders(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchLeaders();
  }, []);

  const handleDelete = async (entryId: string, entryName: string) => {
    if (!confirm(`Bạn có chắc muốn xóa "${entryName}" khỏi Bảng Vàng?`)) {
      return;
    }

    // Optimistic update - xóa ngay khỏi UI
    const previousLeaders = [...leaders];
    setLeaders(leaders.filter(entry => entry.id !== entryId));
    
    // Xóa trên Firebase trong background
    const success = await deleteLeaderboardEntry(entryId);
    
    if (!success) {
      // Nếu lỗi thì khôi phục lại
      setLeaders(previousLeaders);
      alert("Không thể xóa. Vui lòng thử lại!");
    }
  };

  const handleRefresh = () => {
    fetchLeaders(true);
  };

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
        <p className="text-sm text-vn-red font-bold mt-2">
          Trò Chơi Kiến Thức - Top 50 Điểm Cao Nhất
        </p>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-vn-red text-white rounded-full hover:bg-vn-red/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-parchment-dark overflow-hidden min-h-[300px]">
        <div className="bg-vn-red p-4 grid grid-cols-12 gap-4 text-white font-bold text-sm uppercase tracking-wider">
          <div className="col-span-2 text-center">Hạng</div>
          <div className="col-span-5">Cán Bộ</div>
          <div className="col-span-3 text-right">Điểm Quiz</div>
          <div className="col-span-2 text-center">Thao tác</div>
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
                <div className="col-span-5 flex items-center gap-3">
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
                <div className="col-span-3 text-right font-mono font-bold text-vn-red text-lg">
                  {entry.totalXp.toLocaleString()}
                </div>
                <div className="col-span-2 flex justify-center">
                  <button
                    onClick={() => handleDelete(entry.id, entry.name)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
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
