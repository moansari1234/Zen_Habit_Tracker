export type HabitType = 'boolean' | 'quantifiable';

export interface SubHabit {
  id: string;
  name: string;
  type: HabitType;
  target: number;
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  category: string;
  type: HabitType;
  target: number; // For quantifiable habits, e.g., 8 glasses of water
  createdAt: string;
  subHabits: SubHabit[];
}

export interface HabitLog {
  habitId: string;
  subHabitId?: string;
  date: string; // YYYY-MM-DD
  value: number; // 1 for completed boolean, or current amount for quantifiable
}

export type ThemeMode = 'normal' | 'beast';
export type ThemeVariant = 'light' | 'dark';

export interface Theme {
  mode: ThemeMode;
  variant: ThemeVariant;
}

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleVariant: () => void;
  toggleMode: () => void;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
}
