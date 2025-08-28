
import React from 'react';
import { NavLink } from 'react-router-dom';
import { ThemeSwitcher } from './ThemeSwitcher';
import { HomeIcon, CalendarIcon, PlusIcon, DownloadIcon, UserIcon } from './Icons';
import type { Habit } from '../types';

interface HeaderProps {
    onAddHabit: () => void;
    onExportData: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddHabit, onExportData }) => {
    const navLinkClass = ({ isActive }: { isActive: boolean }): string => 
        `flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`;

    return (
        <header className="p-4 border-b border-[var(--border-primary)] flex justify-between items-center">
            <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold text-[var(--text-primary)]">Zenith</h1>
                <nav className="hidden md:flex items-center space-x-1">
                    <NavLink to="/" className={navLinkClass}>
                        <HomeIcon className="w-4 h-4" />
                        <span>Today</span>
                    </NavLink>
                    <NavLink to="/calendar" className={navLinkClass}>
                        <CalendarIcon className="w-4 h-4" />
                        <span>Calendar</span>
                    </NavLink>
                     <NavLink to="/profile" className={navLinkClass}>
                        <UserIcon className="w-4 h-4" />
                        <span>Profile</span>
                    </NavLink>
                </nav>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
                <button onClick={onExportData} className="flex items-center space-x-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                     <DownloadIcon className="w-5 h-5"/>
                </button>
                <button 
                    onClick={onAddHabit}
                    className="flex items-center space-x-2 px-3 py-2 bg-[var(--accent-primary)] text-white font-semibold rounded-md shadow-sm hover:opacity-90 transition-opacity beast-fiery-box"
                >
                    <PlusIcon className="w-4 h-4 beast-fiery-icon" />
                    <span className="hidden sm:inline">New</span>
                </button>
                <ThemeSwitcher />
            </div>
        </header>
    );
};
