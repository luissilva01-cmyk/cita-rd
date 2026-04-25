import React, { createContext, useContext } from 'react';
import { useTheme } from '../hooks/useTheme';

interface ThemeContextType {
  theme: 'light' | 'dark';
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const themeState = useTheme();
  return (
    <ThemeContext.Provider value={themeState}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
