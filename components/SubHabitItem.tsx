
import React from 'react';
import type { SubHabit } from '../types';
import { MinusIcon, PlusIcon } from './Icons';
import { ProgressCircle } from './ProgressCircle';

interface SubHabitItemProps {
    subHabit: SubHabit;
    logValue: number;
    onUpdateLog: (value: number) => void;
}

export const SubHabitItem: React.FC<SubHabitItemProps> = ({ subHabit, logValue, onUpdateLog }) => {
    const isCompleted = (subHabit.type === 'boolean' && logValue === 1) || (subHabit.type === 'quantifiable' && logValue >= subHabit.target);
    const progress = subHabit.type === 'quantifiable' ? (logValue / subHabit.target) * 100 : (logValue * 100);

    const handleBooleanToggle = () => {
        onUpdateLog(logValue === 1 ? 0 : 1);
    };

    const handleQuantifiableChange = (increment: number) => {
        onUpdateLog(logValue + increment);
    };
    
    const minusButtonActive = logValue > 0;
    const plusButtonActive = logValue < subHabit.target;

    return (
        <div className={`p-3 rounded-md bg-[var(--bg-primary)] border border-[var(--border-primary)] transition-all duration-300 ${isCompleted ? 'opacity-50' : ''}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    {subHabit.type === 'boolean' ? (
                         <button onClick={handleBooleanToggle} className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${isCompleted ? 'bg-[var(--accent-positive)] border-[var(--accent-positive)]' : 'border-[var(--border-primary)] beast-fiery-box'}`}>
                             {isCompleted && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path className="beast-checkmark" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                         </button>
                    ) : (
                        <div className="flex items-center space-x-2">
                             <button onClick={() => handleQuantifiableChange(-1)} disabled={!minusButtonActive} className={`p-1.5 rounded-full bg-[var(--bg-tertiary)] disabled:opacity-50 ${minusButtonActive ? 'beast-fiery-box' : ''}`}><MinusIcon className="w-4 h-4 beast-interactive-icon beast-fiery-icon"/></button>
                        </div>
                    )}
                    <div>
                        <p className="font-medium text-[var(--text-primary)] text-sm">{subHabit.name}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3 text-sm text-[var(--text-secondary)]">
                    {subHabit.type === 'quantifiable' && (
                        <div className="font-mono text-xs px-2 py-1 bg-[var(--bg-tertiary)] rounded-full">
                            {logValue}/{subHabit.target}
                        </div>
                    )}
                     {subHabit.type === 'quantifiable' && (
                          <button onClick={() => handleQuantifiableChange(1)} disabled={!plusButtonActive} className={`p-1.5 rounded-full bg-[var(--bg-tertiary)] disabled:opacity-50 ${plusButtonActive ? 'beast-fiery-box' : ''}`}><PlusIcon className="w-4 h-4 beast-interactive-icon beast-fiery-icon"/></button>
                     )}
                </div>
            </div>
        </div>
    );
};
