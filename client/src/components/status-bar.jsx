import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGame } from '@/contexts/game-context';
import { useLanguage } from '@/contexts/language-context';
import { formatCurrency } from '@/lib/constants';
import { AdminPanel } from './admin-panel';
import { PlayerAvatar } from './player-profile-bar';
import { ThemeToggle } from './theme-toggle';
import SubscriptionStatusIcon from './subscription-status-icon';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Crown, Shield, Server, TrendingUp, CircleDollarSign } from 'lucide-react';

export function StatusBar() {
  const { gameState, logout } = useGame();
  const { language, changeLanguage, t } = useLanguage();
  const [, setLocation] = useLocation();
  const [mobileAdminOpen, setMobileAdminOpen] = useState(false);

  if (!gameState.user) return null;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 p-3 sm:p-4 relative z-10">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Mobile Layout */}
        <div className="flex lg:hidden flex-col w-full space-y-2">
          {/* First Row - Title, Income/Avatar/Username in center, Logout button top right */}
          <div className="flex items-center">
            <h1 
              className="text-lg font-bold cursor-pointer bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient"
              onClick={() => setLocation('/start')}
              data-testid="title-link"
            >
              Root <br />Tycoon
            </h1>
            
            {/* Center content - Income, Avatar, Username */}
            <div className="flex-1 flex items-center justify-center space-x-3">
              <div className="flex items-center space-x-1 bg-blue-500/10 border border-blue-500/30 px-2 py-1 rounded text-xs">
                <i className="fas fa-chart-line text-blue-400 text-xs"></i>
                <TrendingUp className="h-5 w-4 sm:h-2 sm:w-2 text-green-400 mx-auto"/>
                <span className="text-blue-400">+{formatCurrency(gameState.totalIncomePerMinute, true)}/min</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <div className="relative">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <PlayerAvatar 
                            user={gameState.user} 
                            onClick={() => window.dispatchEvent(new CustomEvent('openProfile'))}
                            style={{ width: '50px', height: '50px' }}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{t('profileTooltip')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div className="absolute -left-8 sm:-left-10 top-1/2 transform -translate-y-1/2 z-10">
                    <SubscriptionStatusIcon user={gameState.user} showInProfile={true} size="md" />
                  </div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span 
                        className="font-medium cursor-pointer hover:text-blue-400 transition-colors text-base" 
                        onClick={() => setLocation(`/player/${gameState.user.nickname}`)}
                        data-testid="username-link-mobile"
                      >
                        {gameState.user.nickname}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{t('nicknameTooltip')}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            {/* Top right - Logout button */}
            <div className="flex flex-col items-end space-y-1">
              <Button 
                variant="ghost" 
                size="lg" 
                onClick={handleLogout}
                className="text-slate-400 hover:text-slate-200 text-md px-1 py-1 h-6"
              >
                {t('logout')}
              </Button>
              
              {/* Language selector and theme toggle under logout */}
              <div className="flex flex-col items-end space-y-1">
                <div className="flex items-center space-x-1">
                  <Select value={language} onValueChange={changeLanguage}>
                    <SelectTrigger className="w-[60px] h-6 bg-slate-700 border-slate-600 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">🇺🇸</SelectItem>
                      <SelectItem value="ru">🇷🇺</SelectItem>
                      <SelectItem value="ua">🇺🇦</SelectItem>
                      <SelectItem value="de">🇩🇪</SelectItem>
                    </SelectContent>
                  </Select>
                  <ThemeToggle variant="mobile" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Second Row - Balance and Server Count under title */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-slate-700/50 px-2 py-1 rounded text-xs">
              <i className="fas fa-coins text-accent text-xs"></i>
              <CircleDollarSign className="w-4 h-4 text-green-600" />
              <span className="font-semibold">{formatCurrency(gameState.user.balance, true)}</span>
            </div>
            <div className="flex items-center space-x-1 bg-slate-700/50 px-3 py-1 rounded text-xs">
              <i className="fas fa-server text-secondary text-xs"></i>
              <Server className="h-4 w-4 text-blue-400"/>
              <span>{gameState.servers?.length || 0}/{gameState.user.serverLimit || 3}</span>
            </div>
            
            {/* Mobile Admin Panel - compact icons only */}
            {gameState.user && gameState.user.admin > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileAdminOpen(true)}
                className="h-6 w-7 p-0 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50"
                data-testid="mobile-admin-toggle"
              >
                {gameState.user.nickname === 'Ca6aka' ? (
                  <Crown className="w-3 h-3 text-yellow-400" />
                ) : (
                  <Shield className="w-3 h-3 text-purple-400" />
                )}
              </Button>
            )}
          </div>
          
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center space-x-6">
          <h1 
          className="text-xl font-bold cursor-pointer bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient"
          onClick={() => setLocation('/start')}
          data-testid="title-link-desktop"
        >
          Root Tycoon
        </h1>
        
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 bg-slate-700/50 px-2 py-1 rounded-lg">
              <i className="fas fa-coins text-accent"></i>
              <CircleDollarSign className="w-4 h-4 text-green-600" />
              <span className="font-semibold">{formatCurrency(gameState.user.balance)}</span>
            </div>
              <div className="flex items-center space-x-2 bg-slate-700/50 px-3 py-1 rounded-lg">
              <Server className="h-4 w-4 text-blue-400"/>
              <span>{gameState.servers?.length || 0}/{gameState.user.serverLimit || 3}</span>
            </div>

            <div className="flex items-center space-x-2 bg-slate-700/50 px-3 py-1 rounded-lg">
              <i className="fas fa-chart-line text-blue-400"></i>
              <TrendingUp className="sm:h-4 sm:w-4 text-green-400 mx-auto"/>
              <span>+{formatCurrency(gameState.totalIncomePerMinute)}/min</span>
            </div>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center space-x-4">
          {/* Language Switcher */}
          <Select value={language} onValueChange={changeLanguage}>
            <SelectTrigger className="w-[100px] bg-slate-700 border-slate-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">🇺🇸 EN</SelectItem>
              <SelectItem value="ru">🇷🇺 RU</SelectItem>
              <SelectItem value="ua">🇺🇦 UA</SelectItem>
              <SelectItem value="de">🇩🇪 DE</SelectItem>
            </SelectContent>
          </Select>
          
          {/* User Menu */}
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <PlayerAvatar 
                      user={gameState.user} 
                      size="md" 
                      onClick={() => window.dispatchEvent(new CustomEvent('openProfile'))}
                    />
                    <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 z-10">
                      <SubscriptionStatusIcon user={gameState.user} showInProfile={true} size="md" />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">{t('profileTooltip')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span 
                    className="font-medium cursor-pointer hover:text-blue-400 transition-colors" 
                    onClick={() => setLocation(`/player/${gameState.user.nickname}`)}
                    data-testid="username-link"
                  >
                    {gameState.user.nickname}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">{t('nicknameTooltip')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Admin Panel */}
            {gameState.user && gameState.user.admin > 0 && (
              <AdminPanel user={gameState.user} />
            )}
            
            <ThemeToggle variant="desktop" />
            
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

      
      
      {/* Mobile Admin Panel Dialog */}
      {gameState.user && gameState.user.admin > 0 && (
        <div className="lg:hidden">
          <AdminPanel 
            user={gameState.user} 
            isOpen={mobileAdminOpen}
            onOpenChange={setMobileAdminOpen}
          />
        </div>
      )}
    </header>
  );
}
