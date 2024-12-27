import { useTheme } from '@/hooks/useTheme';
import { ReactComponent as SunIcon } from '@assets/sun.svg';
import { ReactComponent as MoonIcon } from '@assets/moon.svg';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle = ({ className = '' }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${className}`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <SunIcon className="w-6 h-6 text-theme-text-dark" />
      ) : (
        <MoonIcon className="w-6 h-6 text-theme-text-light" />
      )}
    </button>
  );
};

export default ThemeToggle; 