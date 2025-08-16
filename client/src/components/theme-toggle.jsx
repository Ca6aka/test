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
        className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-700/50 p-3 rounded-lg transition-all duration-200"
        disabled={isTransitioning}
      >
        <div className="relative flex items-center space-x-3">
          <div className="relative w-10 h-6 bg-slate-600 rounded-full transition-colors duration-300">
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 ${
              isDark ? 'left-0.5' : 'left-4'
            }`}>
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                isDark ? 'opacity-100' : 'opacity-0'
              }`}>
                <i className="fas fa-moon text-[10px] text-slate-600"></i>
              </div>
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                !isDark ? 'opacity-100' : 'opacity-0'
              }`}>
                <i className="fas fa-sun text-[10px] text-yellow-500"></i>
              </div>
            </div>
          </div>
          <span className="text-sm">
            {isDark ? t('darkTheme') : t('lightTheme')}
          </span>
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
    >
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 ${
        isDark ? 'left-0.5' : 'left-6'
      } flex items-center justify-center`}>
        <div className={`transition-opacity duration-200 ${
          isDark ? 'opacity-100' : 'opacity-0'
        }`}>
          <i className="fas fa-moon text-[10px] text-slate-600"></i>
        </div>
        <div className={`absolute transition-opacity duration-200 ${
          !isDark ? 'opacity-100' : 'opacity-0'
        }`}>
          <i className="fas fa-sun text-[10px] text-yellow-500"></i>
        </div>
      </div>
    </Button>
  );
}