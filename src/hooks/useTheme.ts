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

// 检查系统是否处于暗色模式
const getSystemTheme = (): Theme => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // 优先使用本地存储的主题设置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme as Theme;
    }
    // 如果没有保存的设置，则使用系统设置
    return getSystemTheme();
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

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // 只有当用户没有手动设置过主题时才自动切换
      if (!localStorage.getItem('userPreference')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    // 添加监听器
    mediaQuery.addEventListener('change', handleChange);
    
    // 清理监听器
    return () => mediaQuery.removeEventListener('change', handleChange);
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