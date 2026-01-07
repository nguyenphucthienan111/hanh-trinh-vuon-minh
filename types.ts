export enum AppView {
  DASHBOARD = 'DASHBOARD',
  TIMELINE = 'TIMELINE',
  SCENARIO = 'SCENARIO',
  MENTOR = 'MENTOR'
}

export interface UserStats {
  resilience: number; // Kiên trì
  creativity: number; // Sáng tạo
  trust: number; // Vốn lòng tin
  knowledge: number; // Kiến thức lịch sử
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
  context: string; // Modern context
  historicalParallel: string; // Linked to HCM history
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