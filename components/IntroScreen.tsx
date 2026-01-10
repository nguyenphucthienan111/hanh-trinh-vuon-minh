import React, { useState } from "react";
import { User, Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface IntroScreenProps {
  onStart: (name: string, avatarId: string) => void;
}

const AVATARS = [
  { id: "1", color: "bg-red-500", label: "Nhiệt Huyết" },
  { id: "2", color: "bg-blue-500", label: "Trí Tuệ" },
  { id: "3", color: "bg-green-500", label: "Sáng Tạo" },
  { id: "4", color: "bg-yellow-500", label: "Tiên Phong" },
];

export const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  const [name, ZN] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("1");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name, selectedAvatar);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl border-4 border-vn-red/20 relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-vn-red rounded-full mb-4 shadow-lg">
            <Star className="w-12 h-12 text-vn-gold fill-vn-gold animate-pulse" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-vn-red uppercase tracking-wider mb-2">
            Đăng Ký
          </h1>
          <p className="text-gray-500 italic">
            Bắt đầu hành trình vươn mình của bạn
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-ink uppercase tracking-wide">
              Tên của bạn
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => ZN(e.target.value)}
              placeholder="Nhập tên..."
              className="w-full px-4 py-3 rounded-xl bg-parchment border border-parchment-dark focus:border-vn-red focus:ring-1 focus:ring-vn-red outline-none text-lg font-serif"
              autoFocus
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-ink uppercase tracking-wide">
              Chọn Hình Đại Diện
            </label>
            <div className="flex justify-between gap-2">
              {AVATARS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setSelectedAvatar(av.id)}
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                    selectedAvatar === av.id
                      ? "ring-4 ring-vn-red scale-110 shadow-lg"
                      : "opacity-50 hover:opacity-80 hover:scale-105"
                  } ${av.color}`}
                  title={av.label}
                >
                  <User className="text-white w-8 h-8" />
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-gray-500 mt-2 font-medium">
              {AVATARS.find((a) => a.id === selectedAvatar)?.label}
            </p>
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-vn-red hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg transform transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Bắt Đầu Ngay <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </motion.div>

      <p className="mt-8 text-sm text-gray-500 text-center max-w-md">
        "Thanh niên là người chủ tương lai của nước nhà." <br /> — Hồ Chí Minh
      </p>
    </div>
  );
};
