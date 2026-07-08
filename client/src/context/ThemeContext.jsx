import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // ダークモード時の色定義
  const theme = {
    isDarkMode,
    toggleDarkMode,
    colors: {
      bg: isDarkMode ? '#111827' : '#f9fafb',        // 全体の背景
      cardBg: isDarkMode ? '#1f2937' : '#ffffff',    // カードの背景
      text: isDarkMode ? '#f3f4f6' : '#1e293b',      // 文字色
      border: isDarkMode ? '#374151' : '#e2e8f0',    // 枠線
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
