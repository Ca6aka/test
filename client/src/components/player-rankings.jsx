import { useQuery } from '@tanstack/react-query';
import { useGame } from '@/contexts/game-context';
import { useLanguage } from '@/contexts/language-context';
import { formatCurrency } from '@/lib/constants';
import { Link } from 'wouter';
import { useState, useEffect } from 'react';

// Component for countdown timer
export function RankingsCountdown() {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          return 30; // Reset to 30 seconds
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-xs text-slate-500 ml-1">
      ({timeLeft} {t('secondsShort')})
    </span>
  );
}

export function PlayerRankings() {
  const { gameState } = useGame();
  
  const { data: rankingsData } = useQuery({
    queryKey: ['/api/rankings'],
    enabled: !!gameState.user,
    refetchInterval: 30000, // Update every 30 seconds
  });

  // Check if user is level 5 or higher to show rankings
  const userLevel = Math.floor(Math.sqrt(gameState.user?.experience / 100)) + 1;
  const canViewRankings = userLevel >= 5;

  if (!canViewRankings || !rankingsData?.rankings) return null;

  const rankings = rankingsData.rankings;
  const userRank = rankings.find(r => r.id === gameState.user?.id);

  return (
    <div className="bg-slate-700/30 rounded-lg p-3 space-y-2 max-h-80 overflow-y-auto relative z-10">
      {rankings.slice(0, 10).map((player, index) => {
        const isCurrentUser = player.id === gameState.user?.id;
        
        return (
          <div 
            key={player.id}
            className={`flex items-center justify-between p-2 rounded-lg ${
              isCurrentUser 
                ? 'bg-primary/20 border border-primary/30' 
                : 'bg-slate-600/30 hover:bg-slate-600/50'
            }`}
          >
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  player.isOnline ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className={`font-bold text-xs ${
                  index === 0 ? 'text-yellow-400' : 
                  index === 1 ? 'text-slate-300' : 
                  index === 2 ? 'text-amber-600' : 
                  isCurrentUser ? 'text-primary' : 'text-slate-400'
                }`}>
                  #{player.rank}
                </span>
              </div>
              {isCurrentUser ? (
                <span className="text-xs text-primary font-medium">You</span>
              ) : (
                <Link href={`/player/${player.nickname}`}>
                  <span className="text-xs text-slate-300 hover:text-primary cursor-pointer transition-colors">
                    {player.nickname}
                  </span>
                </Link>
              )}
            </div>
            <span className={`text-xs font-medium ${
              isCurrentUser ? 'text-primary' : 'text-slate-400'
            }`}>
              {formatCurrency(player.balance, true)}
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
            <div className="flex items-center space-x-2">
              <span className="text-primary font-bold text-xs">#{userRank.rank}</span>
              <span className="text-xs text-primary font-medium">You</span>
            </div>
            <span className="text-xs text-primary font-medium">
              {formatCurrency(userRank.balance, true)}
            </span>
          </div>
        </>
      )}
    </div>
  );
}