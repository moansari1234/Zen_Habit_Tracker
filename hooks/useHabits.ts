import { useState, useEffect, useCallback } from 'react';
import type { Habit, HabitLog, Badge, SubHabit } from '../types';
import { toYYYYMMDD } from '../utils/dateUtils';

const HABITS_STORAGE_KEY = 'zenith-habits';
const LOGS_STORAGE_KEY = 'zenith-logs';

export const ALL_BADGES: Badge[] = [
    { id: 'committed', name: 'Committed', description: 'Create your first habit.', icon: 'PlusIcon' },
    { id: 'completionist_5', name: 'Completionist', description: 'Create 5 habits.', icon: 'AwardIcon' },
    { id: 'perfect_day', name: 'Perfect Day', description: 'Complete all daily habits.', icon: 'StarIcon' },
    { id: 'firestarter', name: 'Firestarter', description: 'Maintain a 3-day streak.', icon: 'FlameIcon' },
    { id: 'unstoppable', name: 'Unstoppable', description: 'Maintain a 7-day streak.', icon: 'FlameIcon' },
    { id: 'legend', name: 'Legend', description: 'Maintain a 30-day streak.', icon: 'TrophyIcon' },
];

export const useHabits = () => {
    const [habits, setHabits] = useState<Habit[]>(() => {
        try {
            const storedHabits = localStorage.getItem(HABITS_STORAGE_KEY);
            return storedHabits ? JSON.parse(storedHabits) : [];
        } catch (error) {
            console.error('Error reading habits from localStorage', error);
            return [];
        }
    });

    const [logs, setLogs] = useState<HabitLog[]>(() => {
        try {
            const storedLogs = localStorage.getItem(LOGS_STORAGE_KEY);
            return storedLogs ? JSON.parse(storedLogs) : [];
        } catch (error) {
            console.error('Error reading logs from localStorage', error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
        } catch (error) {
            console.error('Error saving habits to localStorage', error);
        }
    }, [habits]);

    useEffect(() => {
        try {
            localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
        } catch (error) {
            console.error('Error saving logs to localStorage', error);
        }
    }, [logs]);

    const addHabit = (habit: Omit<Habit, 'id' | 'createdAt'>) => {
        const newHabit: Habit = {
            ...habit,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        };
        setHabits(prev => [...prev, newHabit]);
    };
    
    const updateHabit = (updatedHabit: Habit) => {
        setHabits(prev => prev.map(h => h.id === updatedHabit.id ? updatedHabit : h));
    };

    const deleteHabit = (habitId: string) => {
        setHabits(prev => prev.filter(h => h.id !== habitId));
        setLogs(prev => prev.filter(l => l.habitId !== habitId));
    };
    
    const getLogForToday = useCallback((habitId: string, date: string, subHabitId?: string): HabitLog | undefined => {
        return logs.find(log => log.habitId === habitId && log.date === date && log.subHabitId === subHabitId);
    },[logs]);

    const updateLog = (habit: Habit, date: string, value: number, subHabit?: SubHabit) => {
        setLogs(prevLogs => {
            const existingLogIndex = prevLogs.findIndex(log => log.habitId === habit.id && log.date === date && log.subHabitId === subHabit?.id);
            
            let target = habit.target;
            if(subHabit) target = subHabit.target;

            const clampedValue = Math.max(0, Math.min(value, target));

            if (existingLogIndex > -1) {
                const updatedLogs = [...prevLogs];
                updatedLogs[existingLogIndex].value = clampedValue;
                return updatedLogs;
            } else {
                return [...prevLogs, { habitId: habit.id, date, value: clampedValue, subHabitId: subHabit?.id }];
            }
        });
    };
    
     const isHabitCompletedOnDate = useCallback((habit: Habit, date: string, allLogs: HabitLog[]): boolean => {
        const logsForDate = allLogs.filter(l => l.date === date);

        if (habit.subHabits && habit.subHabits.length > 0) {
            return habit.subHabits.every(sub => {
                const log = logsForDate.find(l => l.habitId === habit.id && l.subHabitId === sub.id);
                if (!log) return false;
                return (sub.type === 'boolean' && log.value === 1) || (sub.type === 'quantifiable' && log.value >= sub.target);
            });
        } else {
            const log = logsForDate.find(l => l.habitId === habit.id && !l.subHabitId);
            if (!log) return false;
            return (habit.type === 'boolean' && log.value === 1) || (habit.type === 'quantifiable' && log.value >= habit.target);
        }
    }, []);
    
    const calculateStreak = useCallback((habitId: string): { current: number; longest: number } => {
        const habit = habits.find(h => h.id === habitId);
        if(!habit) return { current: 0, longest: 0 };
        
        const completedDates = new Set<string>();
        const uniqueDates = [...new Set(logs.filter(log => log.habitId === habitId).map(log => log.date))];
        
        for(const date of uniqueDates) {
            if(isHabitCompletedOnDate(habit, date, logs)){
                completedDates.add(date);
            }
        }

        if (completedDates.size === 0) return { current: 0, longest: 0 };
        
        let longest = 0;
        let currentStreak = 0;
        
        const sortedDates = Array.from(completedDates).sort((a,b) => new Date(b).getTime() - new Date(a).getTime());
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        
        const todayStr = toYYYYMMDD(today);
        const yesterdayStr = toYYYYMMDD(yesterday);
        
        const isTodayCompleted = completedDates.has(todayStr);
        const isYesterdayCompleted = completedDates.has(yesterdayStr);
        
        if (isTodayCompleted || isYesterdayCompleted) {
            let currentDate = isTodayCompleted ? new Date(todayStr) : new Date(yesterdayStr);
            while(completedDates.has(toYYYYMMDD(currentDate))) {
                currentStreak++;
                currentDate.setDate(currentDate.getDate() - 1);
            }
        }

        let tempStreak = 0;
        for (let i = 0; i < sortedDates.length; i++) {
             tempStreak++;
             if(i < sortedDates.length - 1) {
                 const date1 = new Date(sortedDates[i]);
                 const date2 = new Date(sortedDates[i+1]);
                 const diffTime = date1.getTime() - date2.getTime();
                 const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                 if (diffDays > 1) {
                     if (tempStreak > longest) {
                         longest = tempStreak;
                     }
                     tempStreak = 0;
                 }
             }
        }
        if (tempStreak > longest) {
            longest = tempStreak;
        }

        return { current: currentStreak, longest: longest };

    }, [logs, habits, isHabitCompletedOnDate]);
    
    const getEarnedBadges = useCallback((): Badge[] => {
        const earned: Badge[] = [];
        const streaks = habits.map(h => calculateStreak(h.id));
        const maxStreak = Math.max(0, ...streaks.map(s => s.longest));

        if (habits.length > 0) earned.push(ALL_BADGES[0]);
        if (habits.length >= 5) earned.push(ALL_BADGES[1]);
        
        const todayStr = toYYYYMMDD(new Date());
        const activeHabitsToday = habits.filter(h => new Date(h.createdAt) <= new Date(todayStr));
        if(activeHabitsToday.length > 0 && activeHabitsToday.every(h => isHabitCompletedOnDate(h, todayStr, logs))) {
            earned.push(ALL_BADGES[2]);
        }

        if (maxStreak >= 3) earned.push(ALL_BADGES[3]);
        if (maxStreak >= 7) earned.push(ALL_BADGES[4]);
        if (maxStreak >= 30) earned.push(ALL_BADGES[5]);
        
        return earned;
    }, [habits, logs, calculateStreak, isHabitCompletedOnDate]);

    
    const getAllData = useCallback(() => {
        return { habits, logs };
    }, [habits, logs]);

    return { habits, logs, addHabit, updateHabit, deleteHabit, getLogForToday, updateLog, calculateStreak, getAllData, getEarnedBadges };
};
