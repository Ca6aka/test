import { useTheme } from '@/components/theme-provider';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function ThemeToggle({ variant = 'desktop' }) {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const isDark = theme === 'dark';
  
  const toggleTheme = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setTheme(isDark ? 'light' : 'dark');
      setIsTransitioning(false);
    }, 150);
  };

  if (variant === 'mobile') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className="h-6 w-8 p-0 rounded-full bg-slate-600 hover:bg-slate-500 transition-colors duration-300 flex items-center justify-center"
        disabled={isTransitioning}
      >
        <div className={`transition-all duration-300 ${isTransitioning ? 'scale-75' : 'scale-100'}`}>
          {isDark ? (
            <i className="fas fa-moon text-xs text-slate-200"></i>
          ) : (
            <i className="fas fa-sun text-xs text-yellow-400"></i>
          )}
        </div>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="relative w-12 h-6 p-0 rounded-full bg-slate-600 hover:bg-slate-500 transition-colors duration-300"
      disabled={isTransitioning}
      title={isDark ? t('lightTheme') : t('darkTheme')}
    >
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 ${
        isDark ? 'left-0.5' : 'left-6'
      } flex items-center justify-center shadow-sm`}>
        <div className={`transition-all duration-300 ${
          isDark ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}>
          <i className="fas fa-moon text-[10px] text-slate-600"></i>
        </div>
        <div className={`absolute transition-all duration-300 ${
          !isDark ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}>
          <i className="fas fa-sun text-[10px] text-yellow-500"></i>
        </div>
      </div>
    </Button>
  );
}