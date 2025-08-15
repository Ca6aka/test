import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Lock } from 'lucide-react';
import { StatusBar } from '@/components/status-bar';
import { VirtualAssistant } from '@/components/virtual-assistant';
import { TutorialTab } from '@/components/tutorial-tab';
import { ServersTab } from '@/components/servers-tab';
import { HostingTab } from '@/components/hosting-tab';
import { LearningTab } from '@/components/learning-tab';
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
    return gameState.user && (gameState.user.balance >= TUTORIAL_UNLOCK_THRESHOLD || gameState.user.tutorialCompleted);
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 'tutorial': return <TutorialTab />;
      case 'servers': return <ServersTab />;
      case 'hosting': return <HostingTab />;
      case 'learning': return <LearningTab />;
      default: return <TutorialTab />;
    }
  };

  if (!gameState.user) return null;

  const progressPercentage = Math.min((gameState.user.balance / TUTORIAL_UNLOCK_THRESHOLD) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <StatusBar />
      
      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar Navigation */}
        <aside className="w-80 bg-slate-800/50 backdrop-blur-sm border-r border-slate-700 p-6">
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
                  Active
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
              <span className="font-medium">Server Store</span>
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
          </nav>

          {/* Progress to unlock sections */}
          {!gameState.user.tutorialCompleted && (
            <div className="mt-8 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
              <h3 className="text-sm font-semibold text-primary mb-2">
                Server Limit Upgrade
              </h3>
              <Progress value={progressPercentage} className="mb-2" />
              <p className="text-xs text-slate-400">
                {formatCurrency(gameState.user.balance)} / {formatCurrency(TUTORIAL_UNLOCK_THRESHOLD)}
              </p>
            </div>
          )}

          {/* Player Rankings */}
          <PlayerRankings />
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          {getTabContent()}
        </main>
      </div>

      <VirtualAssistant />
    </div>
  );
}
