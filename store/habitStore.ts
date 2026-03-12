import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserData, Habit, Task } from '../types';

const KEY = '@habitforge_data';

const defaultData: UserData = {
  isPremium: false,
  habits: [],
  tasks: [],
  notes: [],
  joinDate: new Date().toISOString(),
  totalCompletions: 0,
};

export const getData = async (): Promise<UserData> => {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? { ...defaultData, ...JSON.parse(raw) } : defaultData;
  } catch { return defaultData; }
};

export const saveData = async (data: UserData): Promise<void> => {
  await AsyncStorage.setItem(KEY, JSON.stringify(data));
};

export const getTodayKey = () => new Date().toISOString().split('T')[0];

export const isHabitCompletedToday = (habit: Habit): boolean => {
  return habit.completedDates.includes(getTodayKey());
};

export const toggleHabitToday = async (habitId: string): Promise<UserData> => {
  const data = await getData();
  const today = getTodayKey();
  const habit = data.habits.find(h => h.id === habitId);
  if (!habit) return data;

  const idx = habit.completedDates.indexOf(today);
  if (idx >= 0) {
    habit.completedDates.splice(idx, 1);
    habit.streak = Math.max(0, habit.streak - 1);
  } else {
    habit.completedDates.push(today);
    data.totalCompletions += 1;
    // Calculate streak
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (habit.completedDates.includes(yesterday) || habit.streak === 0) {
      habit.streak += 1;
    } else {
      habit.streak = 1;
    }
    habit.longestStreak = Math.max(habit.streak, habit.longestStreak);
  }
  await saveData(data);
  return data;
};

export const addHabit = async (habit: Omit<Habit, 'id' | 'streak' | 'longestStreak' | 'completedDates' | 'createdAt'>): Promise<void> => {
  const data = await getData();
  data.habits.push({ ...habit, id: Date.now().toString(), streak: 0, longestStreak: 0, completedDates: [], createdAt: new Date().toISOString() });
  await saveData(data);
};

export const deleteHabit = async (id: string): Promise<void> => {
  const data = await getData();
  data.habits = data.habits.filter(h => h.id !== id);
  await saveData(data);
};

export const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'completed'>): Promise<void> => {
  const data = await getData();
  data.tasks.push({ ...task, id: Date.now().toString(), completed: false, createdAt: new Date().toISOString() });
  await saveData(data);
};

export const toggleTask = async (id: string): Promise<void> => {
  const data = await getData();
  const task = data.tasks.find(t => t.id === id);
  if (task) { task.completed = !task.completed; task.completedAt = task.completed ? new Date().toISOString() : undefined; }
  await saveData(data);
};
