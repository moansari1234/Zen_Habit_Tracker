
import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, CalendarIcon, UserIcon } from './Icons';

export const BottomNav: React.FC = () => {
    const navLinkClass = ({ isActive }: { isActive: boolean }): string => 
        `flex flex-col items-center justify-center space-y-1 w-full pt-2 pb-1 transition-colors ${isActive ? 'text-[var(--accent-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`;

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--bg-secondary)] border-t border-[var(--border-primary)] flex justify-around z-40 pb-[env(safe-area-inset-bottom)]">
            <NavLink to="/" className={navLinkClass}>
                <HomeIcon className="w-6 h-6" />
                <span className="text-xs">Today</span>
            </NavLink>
            <NavLink to="/calendar" className={navLinkClass}>
                <CalendarIcon className="w-6 h-6" />
                <span className="text-xs">Calendar</span>
            </NavLink>
            <NavLink to="/profile" className={navLinkClass}>
                <UserIcon className="w-6 h-6" />
                <span className="text-xs">Profile</span>
            </NavLink>
        </nav>
    );
};
