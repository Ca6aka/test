import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGame } from '@/contexts/game-context';
import { useLanguage } from '@/contexts/language-context';
import { formatCurrency } from '@/lib/constants';

export function StatusBar() {
  const { gameState, logout } = useGame();
  const { language, setLanguage, t } = useLanguage();

  if (!gameState.user) return null;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 p-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-bold text-primary">GameStats</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-700/50 px-3 py-1 rounded-lg">
              <i className="fas fa-coins text-accent"></i>
              <span className="font-semibold">{formatCurrency(gameState.user.balance)}</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-700/50 px-3 py-1 rounded-lg">
              <i className="fas fa-server text-secondary"></i>
              <span>{gameState.servers?.length || 0}/{gameState.user.serverLimit || 3}</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-700/50 px-3 py-1 rounded-lg">
              <i className="fas fa-chart-line text-blue-400"></i>
              <span>+{formatCurrency(gameState.totalIncomePerMinute)}/min</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Language Switcher */}
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[100px] bg-slate-700 border-slate-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">🇺🇸 EN</SelectItem>
              <SelectItem value="ru">🇷🇺 RU</SelectItem>
              <SelectItem value="de">🇩🇪 DE</SelectItem>
            </SelectContent>
          </Select>
          
          {/* User Menu */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <i className="fas fa-user text-sm"></i>
            </div>
            <span className="font-medium">{gameState.user.nickname}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="text-slate-400 hover:text-slate-200"
            >
              {t('logout')}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
