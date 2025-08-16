import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Lock } from 'lucide-react';
import { StatusBar } from '@/components/status-bar';
import { AdminPanel } from '@/components/admin-panel';
import VirtualAssistant from '@/components/virtual-assistant';
import { TutorialTab } from '@/components/tutorial-tab';
import { ServersTab } from '@/components/servers-tab';
import { HostingTab } from '@/components/hosting-tab';
import { LearningTab } from '@/components/learning-tab';
import { AchievementsTab } from '@/components/achievements-tab';
import { QuestsTab } from '@/components/quests-tab';
import { PlayerRankings } from '@/components/player-rankings';
import { useGame } from '@/contexts/game-context';
import { useLanguage } from '@/contexts/language-context';
import { TUTORIAL_UNLOCK_THRESHOLD, formatCurrency } from '@/lib/constants';

export default function DashboardPage() {
  const { gameState } = useGame();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('tutorial');

  const isTabUnlocked = (tab) => {
    if (tab === 'tutorial') return true;
    // STRICT: Only allow other tabs after tutorial is actually completed
    return gameState.user && gameState.user.tutorialCompleted;
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 'tutorial': return <TutorialTab onTabChange={setActiveTab} />;
      case 'servers': return <ServersTab onTabChange={setActiveTab} />;
      case 'hosting': return <HostingTab onTabChange={setActiveTab} />;
      case 'learning': return <LearningTab />;
      case 'achievements': return <AchievementsTab />;
      case 'quests': return <QuestsTab />;
      default: return <TutorialTab onTabChange={setActiveTab} />;
    }
  };

  if (!gameState.user) return null;

  const progressPercentage = Math.min((gameState.user.balance / TUTORIAL_UNLOCK_THRESHOLD) * 100, 100);

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDk5LCAxMDIsIDI0MSwgMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
      <div className="absolute top-10 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10">
        <StatusBar />
      
      <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        {/* Mobile Navigation */}
        <div className="lg:hidden bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 p-2">
          <div className="flex overflow-x-auto scrollbar-hide space-x-1">
            <Button
              variant={activeTab === 'tutorial' ? 'default' : 'ghost'}
              size="sm"
              className={`flex items-center space-x-1 px-2 py-1 whitespace-nowrap text-xs ${
                activeTab === 'tutorial'
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'text-slate-300 hover:bg-slate-700/50'
              }`}
              onClick={() => setActiveTab('tutorial')}
            >
              <i className="fas fa-graduation-cap"></i>
              <span>{t('start')}</span>
            </Button>
            
            <Button
              variant={activeTab === 'servers' ? 'default' : 'ghost'}
              size="sm"
              className={`flex items-center space-x-1 px-2 py-1 whitespace-nowrap text-xs ${
                activeTab === 'servers'
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : isTabUnlocked('servers')
                  ? 'text-slate-300 hover:bg-slate-700/50'
                  : 'text-slate-500 opacity-50 cursor-not-allowed'
              }`}
              onClick={() => isTabUnlocked('servers') && setActiveTab('servers')}
              disabled={!isTabUnlocked('servers')}
            >
              <i className="fas fa-server"></i>
              <span>{t('servers')}</span>
              {gameState.servers && <span className="bg-secondary/20 text-secondary px-1 rounded text-xs">{gameState.servers.length}</span>}
            </Button>

            <Button
              variant={activeTab === 'hosting' ? 'default' : 'ghost'}
              size="sm"
              className={`flex items-center space-x-1 px-2 py-1 whitespace-nowrap text-xs ${
                activeTab === 'hosting'
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : isTabUnlocked('hosting')
                  ? 'text-slate-300 hover:bg-slate-700/50'
                  : 'text-slate-500 opacity-50 cursor-not-allowed'
              }`}
              onClick={() => isTabUnlocked('hosting') && setActiveTab('hosting')}
              disabled={!isTabUnlocked('hosting')}
            >
              <i className="fas fa-store"></i>
              <span>{t('serverStore')}</span>
              {!isTabUnlocked('hosting') && <Lock className="w-3 h-3 ml-1" />}
            </Button>

            <Button
              variant={activeTab === 'learning' ? 'default' : 'ghost'}
              size="sm"
              className={`flex items-center space-x-1 px-2 py-1 whitespace-nowrap text-xs ${
                activeTab === 'learning'
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : isTabUnlocked('learning')
                  ? 'text-slate-300 hover:bg-slate-700/50'
                  : 'text-slate-500 opacity-50 cursor-not-allowed'
              }`}
              onClick={() => isTabUnlocked('learning') && setActiveTab('learning')}
              disabled={!isTabUnlocked('learning')}
            >
              <i className="fas fa-book"></i>
              <span>{t('learningCenter')}</span>
              {!isTabUnlocked('learning') && <Lock className="w-3 h-3 ml-1" />}
            </Button>
            
            <Button
              variant={activeTab === 'achievements' ? 'default' : 'ghost'}
              size="sm"
              className={`flex items-center space-x-1 px-2 py-1 whitespace-nowrap text-xs ${
                activeTab === 'achievements'
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : isTabUnlocked('achievements')
                  ? 'text-slate-300 hover:bg-slate-700/50'
                  : 'text-slate-500 opacity-50 cursor-not-allowed'
              }`}
              onClick={() => isTabUnlocked('achievements') && setActiveTab('achievements')}
              disabled={!isTabUnlocked('achievements')}
            >
              <i className="fas fa-trophy"></i>
              <span>Достижения</span>
              {!isTabUnlocked('achievements') && <Lock className="w-3 h-3 ml-1" />}
            </Button>
            
            <Button
              variant={activeTab === 'quests' ? 'default' : 'ghost'}
              size="sm"
              className={`flex items-center space-x-1 px-2 py-1 whitespace-nowrap text-xs ${
                activeTab === 'quests'
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : isTabUnlocked('quests')
                  ? 'text-slate-300 hover:bg-slate-700/50'
                  : 'text-slate-500 opacity-50 cursor-not-allowed'
              }`}
              onClick={() => isTabUnlocked('quests') && setActiveTab('quests')}
              disabled={!isTabUnlocked('quests')}
            >
              <i className="fas fa-calendar"></i>
              <span>Задания</span>
              {!isTabUnlocked('quests') && <Lock className="w-3 h-3 ml-1" />}
            </Button>
          </div>
        </div>
        
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:block w-80 bg-slate-800/50 backdrop-blur-sm border-r border-slate-700 p-6">
          <nav className="space-y-2">
            {/* Tutorial Tab */}
            <Button
              variant={activeTab === 'tutorial' ? 'default' : 'ghost'}
              className={`w-full justify-start space-x-3 ${
                activeTab === 'tutorial'
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'text-slate-300 hover:bg-slate-700/50'
              }`}
              onClick={() => setActiveTab('tutorial')}
            >
              <i className="fas fa-graduation-cap text-lg"></i>
              <span className="font-medium">{t('tutorial')}</span>
              {!gameState.user.tutorialCompleted && (
                <span className="ml-auto bg-accent/20 text-accent text-xs px-2 py-1 rounded-full">
                  {t('active')}
                </span>
              )}
            </Button>

            {/* My Servers Tab */}
            <Button
              variant={activeTab === 'servers' ? 'default' : 'ghost'}
              className={`w-full justify-start space-x-3 ${
                activeTab === 'servers'
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : isTabUnlocked('servers')
                  ? 'text-slate-300 hover:bg-slate-700/50'
                  : 'text-slate-500 opacity-50 cursor-not-allowed'
              }`}
              onClick={() => isTabUnlocked('servers') && setActiveTab('servers')}
              disabled={!isTabUnlocked('servers')}
            >
              <i className="fas fa-server text-lg"></i>
              <span className="font-medium">{t('servers')}</span>
              {gameState.servers && (
                <span className="ml-auto bg-secondary/20 text-secondary text-xs px-2 py-1 rounded-full">
                  {gameState.servers.length}
                </span>
              )}
              {!isTabUnlocked('servers') && <Lock className="w-4 h-4 ml-auto" />}
            </Button>

            {/* Server Store Tab */}
            <Button
              variant={activeTab === 'hosting' ? 'default' : 'ghost'}
              className={`w-full justify-start space-x-3 ${
                activeTab === 'hosting'
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : isTabUnlocked('hosting')
                  ? 'text-slate-300 hover:bg-slate-700/50'
                  : 'text-slate-500 opacity-50 cursor-not-allowed'
              }`}
              onClick={() => isTabUnlocked('hosting') && setActiveTab('hosting')}
              disabled={!isTabUnlocked('hosting')}
            >
              <i className="fas fa-shopping-cart text-lg"></i>
              <span className="font-medium">{t('hosting')}</span>
              {!isTabUnlocked('hosting') && <Lock className="w-4 h-4 ml-auto" />}
            </Button>

            {/* Learning Center Tab */}
            <Button
              variant={activeTab === 'learning' ? 'default' : 'ghost'}
              className={`w-full justify-start space-x-3 ${
                activeTab === 'learning'
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : isTabUnlocked('learning')
                  ? 'text-slate-300 hover:bg-slate-700/50'
                  : 'text-slate-500 opacity-50 cursor-not-allowed'
              }`}
              onClick={() => isTabUnlocked('learning') && setActiveTab('learning')}
              disabled={!isTabUnlocked('learning')}
            >
              <i className="fas fa-book text-lg"></i>
              <span className="font-medium">{t('learning')}</span>
              {!isTabUnlocked('learning') && <Lock className="w-4 h-4 ml-auto" />}
            </Button>

            {/* Achievements Tab */}
            <Button
              variant={activeTab === 'achievements' ? 'default' : 'ghost'}
              className={`w-full justify-start space-x-3 ${
                activeTab === 'achievements'
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : isTabUnlocked('achievements')
                  ? 'text-slate-300 hover:bg-slate-700/50'
                  : 'text-slate-500 opacity-50 cursor-not-allowed'
              }`}
              onClick={() => isTabUnlocked('achievements') && setActiveTab('achievements')}
              disabled={!isTabUnlocked('achievements')}
            >
              <i className="fas fa-trophy text-lg"></i>
              <span className="font-medium">Достижения</span>
              {!isTabUnlocked('achievements') && <Lock className="w-4 h-4 ml-auto" />}
            </Button>

            {/* Daily Quests Tab */}
            <Button
              variant={activeTab === 'quests' ? 'default' : 'ghost'}
              className={`w-full justify-start space-x-3 ${
                activeTab === 'quests'
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : isTabUnlocked('quests')
                  ? 'text-slate-300 hover:bg-slate-700/50'
                  : 'text-slate-500 opacity-50 cursor-not-allowed'
              }`}
              onClick={() => isTabUnlocked('quests') && setActiveTab('quests')}
              disabled={!isTabUnlocked('quests')}
            >
              <i className="fas fa-calendar text-lg"></i>
              <span className="font-medium">Ежедневные задания</span>
              {!isTabUnlocked('quests') && <Lock className="w-4 h-4 ml-auto" />}
            </Button>
          </nav>

          {/* Progress to unlock sections - only show if tutorial not completed AND balance under 15000 */}
          {!gameState.user.tutorialCompleted && gameState.user.balance < TUTORIAL_UNLOCK_THRESHOLD && (
            <div className="mt-8 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
              <h3 className="text-sm font-semibold text-primary mb-2">
                {t('tutorialProgress')}
              </h3>
              <Progress value={progressPercentage} className="mb-2" />
              <p className="text-xs text-slate-400">
                {formatCurrency(gameState.user.balance)} / {formatCurrency(TUTORIAL_UNLOCK_THRESHOLD)}
              </p>
            </div>
          )}
          
          {/* Show hide progress option if tutorial is completed but user achieved 15000 */}
          {gameState.user.tutorialCompleted && gameState.user.balance >= TUTORIAL_UNLOCK_THRESHOLD && (
            <div className="mt-8 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/20">
              <h3 className="text-sm font-semibold text-green-400 mb-2">
                ✓ {t('tutorialCompleted')}
              </h3>
              <p className="text-xs text-slate-400">
                {t('allFeaturesUnlocked')}
              </p>
            </div>
          )}

          {/* Player Rankings */}
          <PlayerRankings />
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-3 lg:p-6 h-full">
            {getTabContent()}
          </div>
        </main>
      </div>

      <VirtualAssistant />
      </div>
    </div>
  );
}
