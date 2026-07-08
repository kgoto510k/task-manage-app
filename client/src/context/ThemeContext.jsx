import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const theme = {
    isDarkMode,
    toggleDarkMode,
    colors: {
      bg: isDarkMode ? '#111827' : '#f9fafb',
      cardBg: isDarkMode ? '#1f2937' : '#ffffff',
      text: isDarkMode ? '#f3f4f6' : '#1e293b',
      border: isDarkMode ? '#374151' : '#e2e8f0',
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
