import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useGame } from '@/contexts/game-context';
import { useLanguage } from '@/contexts/language-context';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/constants';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

// Helper function to get server tier colors
const getServerTierColors = (serverType) => {
  // Map server type to appropriate colors
  if (serverType === 'Web Hosting') return { icon: 'text-green-400' }; // Basic Web Server
  if (serverType === 'Storage') return { icon: 'text-blue-400' }; // Database Server
  if (serverType === 'Gaming/Apps') return { icon: 'text-yellow-400' }; // High Performance Server
  if (serverType === 'Content Delivery') return { icon: 'text-orange-400' }; // CDN Server
  if (serverType === 'AI') return { icon: 'text-red-400' }; // GPU Server
  if (serverType === 'Computing') return { icon: 'text-cyan-400' }; // TPU Server
  
  // Default fallback
  return { icon: 'text-green-400' };
};

// Helper function to format reward text
const getRewardText = (reward) => {
  if (!reward || typeof reward !== 'object') return 'Unknown Reward';
  
  if (reward.type === 'serverSlots') {
    const amount = reward.amount ?? 0;
    return `+${amount} Server Slot${amount > 1 ? 's' : ''}`;
  } else if (reward.type === 'efficiency') {
    const amount = reward.amount ?? 0;
    return `+${amount}% Server Efficiency`;
  } else if (reward.type === 'serverUnlock') {
    const serverType = reward.serverType;
    return `Unlocks ${serverType === 'gpu-server' ? 'GPU Server' : serverType === 'tpu-server' ? 'TPU Server' : 'Special Server'}`;
  }
  return 'Unknown Reward';
};

export function ServersTab({ onTabChange }) {
  const { gameState, toggleServer, deleteServer } = useGame();
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedServer, setSelectedServer] = useState(null);
  const [serverLoad, setServerLoad] = useState(50);
  const [localLoadValue, setLocalLoadValue] = useState(50);

  const updateServerLoad = useMutation({
    mutationFn: ({ serverId, loadPercentage }) => 
      apiRequest('POST', `/api/servers/${serverId}/load`, { loadPercentage }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/servers'] });
      toast({
        title: t('success'),
        description: 'Server load updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleToggleServer = async (serverId) => {
    try {
      await toggleServer(serverId);
      toast({
        title: "Server Status Updated",
        description: "Server status has been changed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteServer = async (serverId) => {
    const serverName = gameState.servers?.find(s => s.id === serverId)?.name;
    const firstConfirm = window.confirm(`⚠️ ВНИМАНИЕ! Вы действительно хотите УДАЛИТЬ сервер "${serverName}"?\n\nЭто действие НЕОБРАТИМО!\n\nЕсли вы хотите просто отключить сервер, используйте кнопку "Включить/Выключить" вместо удаления.`);
    
    if (firstConfirm) {
      const secondConfirm = window.confirm(`🚨 ПОСЛЕДНЕЕ ПРЕДУПРЕЖДЕНИЕ!\n\nВы уверены, что хотите НАВСЕГДА удалить сервер "${serverName}"?\n\nНапишите "УДАЛИТЬ" чтобы подтвердить:`);
      
      if (secondConfirm) {
        const finalConfirm = prompt(`Введите "УДАЛИТЬ" чтобы окончательно подтвердить удаление сервера "${serverName}":`);;
        
        if (finalConfirm === "УДАЛИТЬ") {
          try {
            await deleteServer(serverId);
            toast({
              title: "Сервер удален",
              description: `Сервер "${serverName}" был успешно удален.`,
            });
          } catch (error) {
            toast({
              title: "Ошибка",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Удаление отменено",
            description: "Сервер НЕ был удален.",
            variant: "default",
          });
        }
      }
    }
  };

  if (!gameState.user) return null;

  const serverLimit = gameState.user.serverLimit || 3;
  const currentServers = gameState.servers?.length || 0;
  const availableSlots = serverLimit - currentServers;

  return (
    <div className="p-3 sm:p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-2 sm:mb-0">{t('myServers')}</h2>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <span className="text-xs sm:text-sm text-slate-400">{t('serverLimit')}:</span>
          <span className="bg-slate-700 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium">
            {currentServers}/{serverLimit} servers
          </span>
        </div>
      </div>

      {/* Server Limit Warning */}
      {availableSlots <= 1 && (
        <div className="bg-accent/10 border border-accent/30 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex items-center space-x-2">
            <i className="fas fa-exclamation-triangle text-accent text-sm"></i>
            <span className="text-accent font-medium text-sm sm:text-base">Server Limit Notice</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            You're using {currentServers} of {serverLimit} available server slots. 
            Complete learning courses to increase your limit!
          </p>
        </div>
      )}

      {/* Active Servers Grid */}
      {gameState.servers && gameState.servers.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {gameState.servers.map((server) => (
            <div key={server.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-primary/30 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <i className={`${server.icon || "fas fa-server"} ${server.isOnline ? getServerTierColors(server.type).icon : 'text-slate-500'}`}></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-100">{server.name}</h3>
                    <p className="text-sm text-slate-400">{server.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Server Settings Button */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-slate-600/50 text-slate-300 hover:bg-slate-600/70"
                        onClick={() => {
                          setSelectedServer(server);
                          setServerLoad(server.loadPercentage || 50);
                          setLocalLoadValue(server.loadPercentage || 50);
                        }}
                      >
                        <i className="fas fa-cog"></i>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-800 border-slate-700">
                      <DialogHeader>
                        <DialogTitle className="text-white">{t('serverSettings')}: {server.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6 py-4">
                        <div className="space-y-3">
                          <Label className="text-slate-300 text-sm font-medium">
                            {t('loadPercentage')}: {selectedServer?.id === server.id ? localLoadValue : (server.loadPercentage || 50)}%
                          </Label>
                          <Slider
                            value={[selectedServer?.id === server.id ? localLoadValue : (server.loadPercentage || 50)]}
                            onValueChange={(value) => {
                              if (selectedServer?.id === server.id) {
                                setLocalLoadValue(value[0]);
                              }
                            }}
                            onValueCommit={(value) => {
                              updateServerLoad.mutate({ serverId: server.id, loadPercentage: value[0] });
                            }}
                            max={100}
                            min={10}
                            step={5}
                            className="w-full cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>10%</span>
                            <span>50%</span>
                            <span>100%</span>
                          </div>
                        </div>
                        
                        <div className="bg-slate-700/30 rounded-lg p-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-400 text-sm">{t('currentLoad')}:</span>
                            <span className="text-white font-medium">{selectedServer?.id === server.id ? localLoadValue : (server.loadPercentage || 50)}%</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-slate-400 text-sm">{t('overloadRisk')}:</span>
                            <span className={`font-medium text-sm ${
                              (server.loadPercentage || 50) <= 49 ? 'text-green-400' :
                              (server.loadPercentage || 50) <= 74 ? 'text-yellow-400' :
                              (server.loadPercentage || 50) <= 89 ? 'text-orange-400' : 'text-red-400'
                            }`}>
                              {(server.loadPercentage || 50) <= 49 ? t('low') :
                               (server.loadPercentage || 50) <= 74 ? t('moderate') :
                               (server.loadPercentage || 50) <= 89 ? t('high') : t('veryHigh')}
                            </span>
                          </div>
                          
                          {(server.loadPercentage || 50) > 49 && (
                            <div className="text-orange-300 text-xs mt-2 p-2 bg-orange-500/10 rounded">
                              <i className="fas fa-warning mr-1"></i>
                              {t('serverShutdownWarning')}
                            </div>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  {/* Server Status Toggle */}
                  <Button
                    size="sm"
                    variant={server.isOnline ? "default" : "secondary"}
                    className={server.isOnline 
                      ? "bg-secondary/20 text-secondary hover:bg-secondary/30" 
                      : "bg-slate-600/50 text-slate-400"
                    }
                    onClick={() => handleToggleServer(server.id)}
                  >
                    <i className="fas fa-power-off mr-1"></i>
                    {server.isOnline ? t('online') : t('offline')}
                  </Button>
                  {/* Delete Server Button - Made less prominent */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="bg-transparent text-slate-500 hover:bg-red-500/20 hover:text-red-400 transition-colors border border-slate-700 hover:border-red-500/50"
                    onClick={() => handleDeleteServer(server.id)}
                    title="⚠️ УДАЛИТЬ СЕРВЕР НАВСЕГДА (НЕОБРАТИМО!)"
                  >
                    <i className="fas fa-trash text-xs"></i>
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Income/min</p>
                  <p className={`font-semibold ${server.isOnline ? 'text-secondary' : 'text-slate-500'}`}>
                    {server.isOnline ? (() => {
                      const baseIncome = server.incomePerMinute;
                      const loadPercentage = server.loadPercentage || 50;
                      const loadAdjustment = baseIncome * (1 + (loadPercentage - 50) / 100);
                      const efficiencyBonus = gameState.user.efficiencyBonus || 0;
                      const finalIncome = Math.ceil(loadAdjustment * (1 + efficiencyBonus / 100));
                      return `+${formatCurrency(finalIncome)}`;
                    })() : '$0 (Offline)'}
                  </p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">{t('rentalCost')}</p>
                  <p className="font-semibold text-red-400">-{formatCurrency(Math.round(server.incomePerMinute * 0.1))}/min</p>
                </div>
              </div>

              {/* Server Usage */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">{t('currentLoad')}</span>
                  <span className="text-slate-300">{server.loadPercentage || 50}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      (server.loadPercentage || 50) <= 49 ? 'bg-green-500' :
                      (server.loadPercentage || 50) <= 74 ? 'bg-yellow-500' :
                      (server.loadPercentage || 50) <= 89 ? 'bg-orange-500' : 'bg-red-500'
                    }`} 
                    style={{ width: `${server.loadPercentage || 50}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-server text-slate-400 text-xl"></i>
          </div>
          <h3 className="text-lg font-semibold text-slate-300 mb-2">No Servers Yet</h3>
          <p className="text-sm text-slate-400 mb-4">
            Purchase your first server from the Server Store to start earning income.
          </p>
        </div>
      )}

      {/* Add New Server Section */}
      {availableSlots > 0 && (
        <div className="bg-slate-800/30 border border-dashed border-slate-600 rounded-xl p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-plus text-slate-400 text-xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-slate-300 mb-2">Add New Server</h3>
            <p className="text-sm text-slate-400 mb-4">
              You have {availableSlots} server slot{availableSlots !== 1 ? 's' : ''} available. 
              Visit the Server Store to purchase new servers.
            </p>
            <Button 
              className="bg-primary hover:bg-primary/80 text-white"
              onClick={() => onTabChange && onTabChange('hosting')}
            >
              Browse Server Store
            </Button>
          </div>
        </div>
      )}

      {/* Learning in Progress */}
      {gameState.currentLearning && (
        <div className="mt-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-purple-400">Learning in Progress</h3>
            <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-lg text-sm font-medium">
              {gameState.currentLearning.difficulty}
            </span>
          </div>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <i className="fas fa-brain text-purple-400 text-lg"></i>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-slate-200">{gameState.currentLearning.title}</h4>
              <p className="text-sm text-slate-400">{gameState.currentLearning.description}</p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Progress</span>
              <span className="text-purple-400">
                {gameState.currentLearning.progress}% ({gameState.currentLearning.timeRemaining} remaining)
              </span>
            </div>
            <Progress value={gameState.currentLearning.progress} className="h-3" />
          </div>

          <div className="p-3 bg-purple-500/10 rounded-lg">
            <p className="text-sm text-purple-300">
              <i className="fas fa-gift mr-1"></i>
              <strong>Reward:</strong> {getRewardText(gameState.currentLearning.reward)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
