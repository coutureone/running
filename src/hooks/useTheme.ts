import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
});

interface ThemeProviderProps {
  children: React.ReactNode;
}

const isNightTime = () => {
  const hour = new Date().getHours();
  return hour < 6 || hour >= 18; // 晚上6点到早上6点是暗色模式
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // 优先使用本地存储的主题设置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme as Theme;
    }
    // 如果没有保存的设置，则根据时间判断
    return isNightTime() ? 'dark' : 'light';
  });

  useEffect(() => {
    // 保存主题设置到 localStorage
    localStorage.setItem('theme', theme);
    // 更新 document.documentElement 的 class
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // 监听时间变化，自动切换主题
  useEffect(() => {
    const checkTime = () => {
      // 只有当用户没有手动设置过主题时才自动切换
      if (!localStorage.getItem('userPreference')) {
        setTheme(isNightTime() ? 'dark' : 'light');
      }
    };

    // 每分钟检查一次时间
    const interval = setInterval(checkTime, 60000);
    
    // 组件卸载时清除定时器
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    // 用户手动切换时，记录偏好
    localStorage.setItem('userPreference', 'true');
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return React.createElement(ThemeContext.Provider, 
    { value: { theme, toggleTheme } },
    children
  );
};

export const useTheme = () => useContext(ThemeContext); 