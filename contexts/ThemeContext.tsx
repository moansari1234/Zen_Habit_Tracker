
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Theme, ThemeContextType, ThemeMode, ThemeVariant } from '../types';

const defaultTheme: Theme = { mode: 'normal', variant: 'light' };

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const storedTheme = localStorage.getItem('zenith-theme');
      if (storedTheme) {
        return JSON.parse(storedTheme) as Theme;
      }
    } catch (error) {
      console.error('Error reading theme from localStorage', error);
    }
    return defaultTheme;
  });

  useEffect(() => {
    try {
      localStorage.setItem('zenith-theme', JSON.stringify(theme));
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme.variant);
      root.setAttribute('data-mode', theme.mode);
    } catch (error) {
      console.error('Error saving theme to localStorage', error);
    }
  }, [theme]);
  
  const toggleVariant = useCallback(() => {
    setTheme(prevTheme => ({
      ...prevTheme,
      variant: prevTheme.variant === 'light' ? 'dark' : 'light',
    }));
  }, []);

  const toggleMode = useCallback(() => {
    setTheme(prevTheme => ({
      ...prevTheme,
      mode: prevTheme.mode === 'normal' ? 'beast' : 'normal',
    }));
  }, []);


  const value = { theme, setTheme, toggleVariant, toggleMode };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
