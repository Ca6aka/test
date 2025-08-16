import { useParams, Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Users, Server, TrendingUp, Trophy, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { useGame } from '@/contexts/game-context';

export default function PlayerProfilePage() {
  const { nickname } = useParams();
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const { gameState } = useGame();

  // Fetch player data
  const { data: playerData, isLoading, error } = useQuery({
    queryKey: ['/api/player', nickname],
    retry: false,
    enabled: !!nickname
  });

  // Fetch rankings to get player rank
  const { data: rankingsData } = useQuery({
    queryKey: ['/api/rankings'],
    retry: false,
  });

  const handleBackClick = () => {
    if (gameState.user) {
      setLocation('/game');
    } else {
      setLocation('/reg');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading player profile...</div>
      </div>
    );
  }

  if (error || !playerData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800/50 border-slate-700 max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="text-red-400 text-lg mb-4">Player not found</div>
            <p className="text-slate-300 mb-6">The player "{nickname}" doesn't exist or the profile is private.</p>
            <Button onClick={handleBackClick} className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const player = playerData.player;
  const playerRank = rankingsData?.rankings?.find(r => r.nickname === nickname)?.rank || '?';
  const isOnline = playerData.isOnline;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button 
              variant="ghost" 
              onClick={handleBackClick}
              className="text-slate-300 hover:text-white hover:bg-slate-800"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Player Profile
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Player Info Card */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardContent className="p-8">
            <div className="flex items-center space-x-6">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600">
                  {player.nickname.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-white" data-testid="text-nickname">
                    {player.nickname}
                  </h1>
                  {isOnline && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                      Online
                    </Badge>
                  )}
                  {!isOnline && (
                    <Badge variant="outline" className="border-slate-600 text-slate-400">
                      Offline
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center space-x-6 text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span>Rank #{playerRank}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Server className="w-4 h-4 text-purple-400" />
                    <span>{player.serverCount || 0} servers</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span>${player.balance?.toLocaleString() || '0'}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white" data-testid="text-balance">
                ${player.balance?.toLocaleString() || '0'}
              </div>
              <div className="text-slate-400">Total Balance</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <Server className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white" data-testid="text-servers">
                {player.serverCount || 0}
              </div>
              <div className="text-slate-400">Active Servers</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white" data-testid="text-rank">
                #{playerRank}
              </div>
              <div className="text-slate-400">Global Rank</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        {player.activities && player.activities.length > 0 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Clock className="h-5 w-5 text-blue-400 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {player.activities.slice(0, 5).map((activity, index) => (
                  <div key={activity.id || index} className="flex justify-between items-center p-3 rounded-lg bg-slate-700/30">
                    <span className="text-slate-300">{activity.description}</span>
                    <span className="text-slate-500 text-sm">{activity.timestamp}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}