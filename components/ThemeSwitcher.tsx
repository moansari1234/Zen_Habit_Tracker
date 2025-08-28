
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { SunIcon, MoonIcon } from './Icons';

export const ThemeSwitcher: React.FC = () => {
    const { theme, toggleVariant, toggleMode } = useTheme();

    return (
        <div className="flex items-center space-x-2 p-1 bg-[var(--bg-tertiary)] rounded-full">
            <div className="flex items-center">
                 <button 
                    onClick={() => toggleMode()} 
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${theme.mode === 'normal' ? 'bg-[var(--bg-primary)] text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}
                >
                    Normal
                </button>
                 <button 
                    onClick={() => toggleMode()} 
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${theme.mode === 'beast' ? 'bg-[var(--bg-primary)] text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}
                >
                    Beast
                </button>
            </div>
            <div className="h-5 w-px bg-[var(--border-primary)]"></div>
            <button onClick={() => toggleVariant()} className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                {theme.variant === 'light' ? <MoonIcon className="w-5 h-5"/> : <SunIcon className="w-5 h-5"/>}
            </button>
        </div>
    );
};
