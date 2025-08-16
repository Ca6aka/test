import { useQuery } from '@tanstack/react-query';
import { useGame } from '@/contexts/game-context';
import { formatCurrency } from '@/lib/constants';
import { Link } from 'wouter';

export function PlayerRankings() {
  const { gameState } = useGame();
  
  const { data: rankingsData } = useQuery({
    queryKey: ['/api/rankings'],
    enabled: !!gameState.user,
    refetchInterval: 30000, // Update every 30 seconds
  });

  if (!rankingsData?.rankings) return null;

  const rankings = rankingsData.rankings;
  const userRank = rankings.find(r => r.id === gameState.user?.id);

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center">
        <i className="fas fa-trophy text-accent mr-2"></i>
        Player Rankings
      </h3>
      <div className="space-y-2">
        {rankings.slice(0, 5).map((player, index) => {
          const isCurrentUser = player.id === gameState.user?.id;
          
          return (
            <div 
              key={player.id}
              className={`flex items-center justify-between p-2 rounded-lg ${
                isCurrentUser 
                  ? 'bg-primary/20 border border-primary/30' 
                  : 'bg-slate-700/30'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${
                    player.isOnline ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className={`font-bold text-sm ${
                    index === 0 ? 'text-accent' : 
                    index === 1 ? 'text-slate-300' : 
                    index === 2 ? 'text-amber-600' : 
                    isCurrentUser ? 'text-primary' : 'text-slate-400'
                  }`}>
                    #{player.rank}
                  </span>
                </div>
                {isCurrentUser ? (
                  <span className="text-sm text-primary">You</span>
                ) : (
                  <Link href={`/player/${player.nickname}`}>
                    <span className="text-sm text-slate-300 hover:text-primary cursor-pointer transition-colors">
                      {player.nickname}
                    </span>
                  </Link>
                )}
              </div>
              <span className={`text-xs ${
                isCurrentUser ? 'text-primary' : 'text-slate-400'
              }`}>
                {formatCurrency(player.balance)}
              </span>
            </div>
          );
        })}
        
        {/* Show current user's rank if not in top 5 */}
        {userRank && userRank.rank > 5 && (
          <>
            <div className="text-center py-1">
              <span className="text-xs text-slate-500">...</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-primary/20 rounded-lg border border-primary/30">
              <div className="flex items-center space-x-2">
                <span className="text-primary font-bold text-sm">#{userRank.rank}</span>
                <span className="text-sm text-primary">You</span>
              </div>
              <span className="text-xs text-primary">
                {formatCurrency(userRank.balance)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
