export enum AppView {
  INTRO = 'INTRO',
  DASHBOARD = 'DASHBOARD',
  TIMELINE = 'TIMELINE',
  SCENARIO = 'SCENARIO',
  MENTOR = 'MENTOR',
  LEADERBOARD = 'LEADERBOARD',
  QUIZ = 'QUIZ'
}

export interface UserProfile {
  name: string;
  avatarId: string;
  stats: UserStats;
  badges: Badge[];
  totalXp: number;
  completedScenarioIds: string[]; // Danh sách ID các câu hỏi đã trả lời
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatarId: string;
  totalXp: number;
  title: string;
  timestamp: number;
}

export interface UserStats {
  resilience: number; // Kiên trì
  creativity: number; // Sáng tạo
  trust: number; // Vốn lòng tin
  knowledge: number; // Kiến thức
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  type: 'historical' | 'personal';
  image?: string;
}

export interface Scenario {
  id: string;
  title: string;
  context: string;
  historicalParallel: string;
  question: string;
  options: {
    id: 'a' | 'b';
    text: string;
    statsEffect: Partial<UserStats>;
    feedback: string;
  }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface MemoryCard {
  id: string;
  content: string;
  type: 'history' | 'modern';
  pairId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct answer (0-3)
  explanation: string;
}