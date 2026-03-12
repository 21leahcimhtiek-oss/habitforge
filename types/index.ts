export interface Habit {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  frequency: 'daily' | 'weekly' | 'custom';
  targetDays: number[];  // 0=Sun, 1=Mon, ..., 6=Sat
  reminderTime?: string; // HH:MM
  streak: number;
  longestStreak: number;
  completedDates: string[]; // ISO date strings
  createdAt: string;
  category: string;
  isPremium: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  completedAt?: string;
  tags: string[];
  createdAt: string;
}

export interface DailyNote {
  id: string;
  date: string;
  content: string;
  mood: 1 | 2 | 3 | 4 | 5;
}

export interface UserData {
  isPremium: boolean;
  habits: Habit[];
  tasks: Task[];
  notes: DailyNote[];
  joinDate: string;
  totalCompletions: number;
}
