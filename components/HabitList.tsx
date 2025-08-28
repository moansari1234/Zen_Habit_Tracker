import React from 'react';
import { useHabits } from '../hooks/useHabits';
import { HabitItem } from './HabitItem';
import { getTodayDateString } from '../utils/dateUtils';
import { PlusIcon } from './Icons';
import type { Habit } from '../types';

interface HabitListProps {
    onEditHabit: (habit: Habit) => void;
    openNewHabitModal: () => void;
}

export const HabitList: React.FC<HabitListProps> = ({ onEditHabit, openNewHabitModal }) => {
    const { habits, getLogForToday, updateLog, calculateStreak } = useHabits();
    const today = getTodayDateString();
    
    if (habits.length === 0) {
        return (
            <div className="text-center py-20 px-4">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Start a New Journey</h2>
                <p className="text-[var(--text-secondary)] mb-6">You haven't created any habits yet. Click the button below to add your first one!</p>
                <button
                    onClick={openNewHabitModal}
                    className="inline-flex items-center px-6 py-3 bg-[var(--accent-primary)] text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition-opacity beast-fiery-box"
                >
                    <PlusIcon className="w-5 h-5 mr-2 beast-fiery-icon" />
                    Create New Habit
                </button>
            </div>
        );
    }
    
    const habitsByCategory = habits.reduce<Record<string, Habit[]>>((acc, habit) => {
        const category = habit.category || 'Uncategorized';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(habit);
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            {Object.entries(habitsByCategory).map(([category, habitsInCategory]) => (
                <div key={category}>
                    <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3 pb-2 border-b-2 border-[var(--border-primary)]">{category}</h2>
                    <div className="space-y-3">
                         {habitsInCategory.map(habit => {
                            const logsForHabit = habit.subHabits.length > 0
                                ? habit.subHabits.map(sub => ({ ...getLogForToday(habit.id, today, sub.id), subHabitId: sub.id, habitId: habit.id }))
                                : [{ ...getLogForToday(habit.id, today), habitId: habit.id }];
                            
                            const validLogs = logsForHabit.filter(l => l.date).map(l => ({value: l.value || 0, habitId: l.habitId, subHabitId: l.subHabitId}));

                            const streak = calculateStreak(habit.id);
                            return (
                                <HabitItem 
                                    key={habit.id} 
                                    habit={habit} 
                                    logs={validLogs}
                                    onUpdateLog={(h, val, sub) => updateLog(h, today, val, sub)}
                                    streak={streak}
                                    onEdit={onEditHabit}
                                />
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};