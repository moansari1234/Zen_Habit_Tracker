
import React, { useState } from 'react';
import type { Habit, SubHabit } from '../types';
import { FlameIcon, AwardIcon, EditIcon, ChevronDownIcon, PlusIcon, MinusIcon } from './Icons';
import { SubHabitItem } from './SubHabitItem';

interface HabitItemProps {
    habit: Habit;
    logs: { habitId: string, subHabitId?: string, value: number }[];
    onUpdateLog: (habit: Habit, value: number, subHabit?: SubHabit) => void;
    streak: { current: number; longest: number };
    onEdit: (habit: Habit) => void;
}

export const HabitItem: React.FC<HabitItemProps> = ({ habit, logs, onUpdateLog, streak, onEdit }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasSubHabits = habit.subHabits && habit.subHabits.length > 0;

    const getIsCompleted = (h: Habit | SubHabit, logValue: number) => {
        return (h.type === 'boolean' && logValue === 1) || (h.type === 'quantifiable' && logValue >= h.target);
    }
    
    let isParentCompleted = false;
    let subHabitsProgress = 0;
    
    if (hasSubHabits) {
        const completedSubHabits = habit.subHabits.filter(sub => {
            const log = logs.find(l => l.subHabitId === sub.id);
            return getIsCompleted(sub, log?.value || 0);
        }).length;
        subHabitsProgress = (completedSubHabits / habit.subHabits.length) * 100;
        isParentCompleted = completedSubHabits === habit.subHabits.length;
    } else {
        const log = logs.find(l => !l.subHabitId);
        isParentCompleted = getIsCompleted(habit, log?.value || 0);
    }

    const handleBooleanToggle = () => {
        const log = logs.find(l => !l.subHabitId);
        onUpdateLog(habit, (log?.value || 0) === 1 ? 0 : 1);
    };

    const handleQuantifiableChange = (increment: number) => {
        const log = logs.find(l => !l.subHabitId);
        onUpdateLog(habit, (log?.value || 0) + increment);
    };

    const mainLogValue = logs.find(l => !l.subHabitId)?.value || 0;
    const minusButtonActive = mainLogValue > 0;
    const plusButtonActive = mainLogValue < habit.target;

    return (
        <div className={`rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] transition-all duration-300`}>
            <div className={`p-4 flex items-center justify-between ${isParentCompleted ? 'opacity-60' : ''}`}>
                <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                     {!hasSubHabits ? (
                        habit.type === 'boolean' ? (
                             <button onClick={handleBooleanToggle} className={`w-8 h-8 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${isParentCompleted ? 'bg-[var(--accent-positive)] border-[var(--accent-positive)]' : 'border-[var(--border-primary)] beast-fiery-box'}`}>
                                 {isParentCompleted && <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path className="beast-checkmark" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                             </button>
                        ) : (
                           <div className="flex items-center space-x-2">
                                <button onClick={() => handleQuantifiableChange(-1)} disabled={!minusButtonActive} className={`p-1.5 rounded-full bg-[var(--bg-tertiary)] disabled:opacity-50 ${minusButtonActive ? 'beast-fiery-box' : ''}`}>
                                    <MinusIcon className="w-5 h-5 beast-interactive-icon beast-fiery-icon"/>
                                </button>
                                <div className="font-mono text-sm px-2 py-1 bg-[var(--bg-tertiary)] rounded-full w-16 text-center">
                                    {mainLogValue}/{habit.target}
                                </div>
                                <button onClick={() => handleQuantifiableChange(1)} disabled={!plusButtonActive} className={`p-1.5 rounded-full bg-[var(--bg-tertiary)] disabled:opacity-50 ${plusButtonActive ? 'beast-fiery-box' : ''}`}>
                                    <PlusIcon className="w-5 h-5 beast-interactive-icon beast-fiery-icon"/>
                                </button>
                            </div>
                        )
                    ) : (
                        <div className="w-8 h-8 flex-shrink-0">
                           <div className="relative w-8 h-8">
                             <svg className="w-full h-full" viewBox="0 0 36 36">
                                <path className="text-[var(--bg-tertiary)]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.8"></path>
                                <path className="text-[var(--accent-primary)]" strokeDasharray={`${subHabitsProgress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.8" strokeLinecap="round"></path>
                              </svg>
                           </div>
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                            <p className="font-semibold text-[var(--text-primary)] truncate">{habit.name}</p>
                            {habit.category && (
                                <span className="text-xs px-2 py-0.5 bg-[var(--accent-secondary)] text-[var(--accent-primary)] rounded-full font-medium whitespace-nowrap flex-shrink-0">
                                    {habit.category}
                                </span>
                            )}
                        </div>
                        {habit.description && <p className="text-sm text-[var(--text-secondary)] mt-1 truncate">{habit.description}</p>}
                    </div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 text-sm text-[var(--text-secondary)]">
                    <div className="flex items-center space-x-1">
                        <FlameIcon className="w-4 h-4 text-orange-500 beast-flame" />
                        <span>{streak.current}</span>
                    </div>
                     <div className="flex items-center space-x-1">
                        <AwardIcon className="w-4 h-4 text-yellow-500" />
                        <span>{streak.longest}</span>
                    </div>
                    <button onClick={() => onEdit(habit)} className="p-1 rounded-md hover:text-[var(--text-primary)] beast-fiery-box"><EditIcon className="w-4 h-4 beast-fiery-icon"/></button>
                     {hasSubHabits && (
                        <button onClick={() => setIsExpanded(!isExpanded)} className={`p-1 rounded-md hover:text-[var(--text-primary)] transform transition-transform ${isExpanded ? 'rotate-180' : ''} beast-fiery-box`}><ChevronDownIcon className="w-5 h-5 beast-fiery-icon"/></button>
                    )}
                </div>
            </div>
             {isExpanded && hasSubHabits && (
                <div className="border-t border-[var(--border-primary)] p-4 space-y-3">
                    {habit.subHabits.map(sub => {
                        const log = logs.find(l => l.subHabitId === sub.id);
                        return (
                           <SubHabitItem 
                             key={sub.id} 
                             subHabit={sub}
                             logValue={log?.value || 0} 
                             onUpdateLog={(val) => onUpdateLog(habit, val, sub)}
                           />
                        )
                    })}
                </div>
             )}
        </div>
    );
};
