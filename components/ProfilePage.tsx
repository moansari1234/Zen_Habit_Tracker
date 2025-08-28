import React from 'react';
import { useHabits, ALL_BADGES } from '../hooks/useHabits';
import * as Icons from './Icons';

export const ProfilePage: React.FC = () => {
    const { habits, logs, calculateStreak, getEarnedBadges } = useHabits();
    
    const earnedBadges = getEarnedBadges();
    const earnedBadgeIds = new Set(earnedBadges.map(b => b.id));

    const totalCompletions = logs.filter(log => log.value > 0).length;
    const longestStreakOverall = Math.max(0, ...habits.map(h => calculateStreak(h.id).longest));

    const StatCard: React.FC<{label: string, value: string | number}> = ({ label, value}) => (
        <div className="bg-[var(--bg-secondary)] p-4 rounded-lg border border-[var(--border-primary)]">
            <p className="text-sm text-[var(--text-secondary)]">{label}</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
        </div>
    );
    
    const BadgeCard: React.FC<{badge: typeof ALL_BADGES[0], isEarned: boolean}> = ({ badge, isEarned }) => {
        const IconComponent = Icons[badge.icon as keyof typeof Icons] || Icons.AwardIcon;
        return (
            <div className={`p-4 rounded-lg border flex items-center space-x-4 transition-all ${isEarned ? 'bg-[var(--bg-secondary)] border-[var(--border-primary)] beast-badge-earned' : 'bg-[var(--bg-tertiary)] border-transparent opacity-50'}`}>
                <div className={`p-3 rounded-full ${isEarned ? 'bg-[var(--accent-secondary)] text-[var(--accent-primary)]' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'}`}>
                   <IconComponent className="w-6 h-6" />
                </div>
                <div>
                    <p className="font-bold text-[var(--text-primary)]">{badge.name}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{badge.description}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <StatCard label="Total Habits" value={habits.length} />
                   <StatCard label="Total Completions" value={totalCompletions} />
                   <StatCard label="Longest Streak" value={`${longestStreakOverall} days`} />
                </div>
            </div>
             <div>
                <h2 className="text-xl font-bold mb-4">Badges</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ALL_BADGES.map(badge => (
                        <BadgeCard key={badge.id} badge={badge} isEarned={earnedBadgeIds.has(badge.id)} />
                    ))}
                 </div>
            </div>
        </div>
    );
};