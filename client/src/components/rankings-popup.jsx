import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/game-context';
import { useLanguage } from '@/contexts/language-context';
import { formatCurrency } from '@/lib/constants';
import { Link } from 'wouter';

export function RankingsPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const { gameState } = useGame();
  const { t } = useLanguage();
  
  const { data: rankingsData } = useQuery({
    queryKey: ['/api/rankings'],
    enabled: !!gameState.user,
    refetchInterval: 30000, // Update every 30 seconds
  });

  if (!gameState.user) return null;

  const rankings = rankingsData?.rankings || [];
  const userRank = rankings.find(r => r.id === gameState.user?.id);

  return (
    <>
      {/* Rankings Toggle Button */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 shadow-lg border-2 border-yellow-400/30 text-white flex items-center justify-center"
          data-testid="rankings-toggle"
        >
          <i className="fas fa-crown text-lg"></i>
        </Button>
      </div>

      {/* Rankings Panel */}
      {isOpen && (
        <div className="fixed top-4 right-20 z-40 w-80 max-h-96 bg-slate-800/95 backdrop-blur-lg border border-slate-700/50 rounded-lg shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <i className="fas fa-trophy text-white text-lg"></i>
              <h3 className="text-white font-bold">{t('rankings')}</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 w-6 h-6 p-0"
            >
              <i className="fas fa-times text-sm"></i>
            </Button>
          </div>
          
          <div className="p-4 max-h-80 overflow-y-auto">
            <div className="space-y-2">
              {rankings.slice(0, 10).map((player, index) => {
                const isCurrentUser = player.id === gameState.user?.id;
                
                return (
                  <div 
                    key={player.id}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      isCurrentUser 
                        ? 'bg-primary/20 border border-primary/30' 
                        : 'bg-slate-700/30 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${
                          player.isOnline ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <span className={`font-bold text-sm ${
                          index === 0 ? 'text-yellow-400' : 
                          index === 1 ? 'text-slate-300' : 
                          index === 2 ? 'text-amber-600' : 
                          isCurrentUser ? 'text-primary' : 'text-slate-400'
                        }`}>
                          #{player.rank}
                        </span>
                      </div>
                      {isCurrentUser ? (
                        <span className="text-sm text-primary font-medium">You</span>
                      ) : (
                        <Link href={`/player/${player.nickname}`}>
                          <span className="text-sm text-slate-300 hover:text-primary cursor-pointer transition-colors">
                            {player.nickname}
                          </span>
                        </Link>
                      )}
                    </div>
                    <span className={`text-xs font-medium ${
                      isCurrentUser ? 'text-primary' : 'text-slate-400'
                    }`}>
                      {formatCurrency(player.balance)}
                    </span>
                  </div>
                );
              })}
              
              {/* Show current user's rank if not in top 10 */}
              {userRank && userRank.rank > 10 && (
                <>
                  <div className="text-center py-1">
                    <span className="text-xs text-slate-500">...</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-primary/20 rounded-lg border border-primary/30">
                    <div className="flex items-center space-x-3">
                      <span className="text-primary font-bold text-sm">#{userRank.rank}</span>
                      <span className="text-sm text-primary font-medium">You</span>
                    </div>
                    <span className="text-xs text-primary font-medium">
                      {formatCurrency(userRank.balance)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}