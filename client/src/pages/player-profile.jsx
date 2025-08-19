import { useParams, Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Server, TrendingUp, Trophy, Clock, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { useGame } from '@/contexts/game-context';
import { PlayerAvatar } from '@/components/player-profile-bar';

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
    // Check if we came from the game (user is logged in) or from the homepage
    if (gameState.user) {
      setLocation('/game');
    } else {
      setLocation('/start');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">{t('loadingPlayerProfile')}</div>
      </div>
    );
  }

  if (error || !playerData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800/50 border-slate-700 max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="text-red-400 text-lg mb-4">{t('playerNotFound')}</div>
            <p className="text-slate-300 mb-6">{t('playerNotFoundDesc').replace('{nickname}', nickname)}</p>
            <Button onClick={handleBackClick} className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('goBack')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const player = playerData.player;
  const playerRank = rankingsData?.rankings?.find(r => r.nickname === nickname)?.rank || '?';
  const isOnline = playerData.isOnline;
  
  // Calculate level and experience using 60-level system (10% increase per level)
  const calculateLevel = (experience) => {
    let level = 1;
    let requiredExp = 100;
    let totalExp = 0;
    
    while (totalExp + requiredExp <= experience && level < 60) {
      totalExp += requiredExp;
      level++;
      requiredExp = Math.floor(requiredExp * 1.1);
    }
    
    return level;
  };
  const level = player.level || calculateLevel(player.experience || 0);
  const experience = player.experience || 0;
  
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
          {t('back')}
        </Button>

        {/* Root Tycoon слева */}
        <h1 
          className="text-xl font-bold cursor-pointer bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient"
          onClick={() => setLocation('/start')}
          data-testid="title-link-desktop"
        >
          Root Tycoon
        </h1>

        {/* Player profile справа */}
        <h1 className="text-xl font-bold text-primary">
          {t('playerProfile')}
        </h1>
      </div>
    </div>
  </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Player Info Card */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardContent className="p-8">
            <div className="flex items-center space-x-6">
              <PlayerAvatar 
                user={player} 
                size="xl" 
                showLevel={true}
                showExperienceRing={false}
              />
              
              <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
  <h1 className={`text-3xl font-bold ${
      player.nickname === 'Ca6aka'
        ? 'relative overflow-hidden animate-gradient-text'
        : 'text-white'
    }`} 
    data-testid="text-nickname"
  >
    {player.nickname}
  </h1>

  {isOnline && (
    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
      <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
      {t('online')}
    </Badge>
  )}

  {!isOnline && (
    <Badge variant="outline" className="border-slate-600 text-slate-400">
      <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
      {t('offline')}
    </Badge>
  )}

  {player.admin >= 1 && (
    <Badge 
      className={`${
        player.nickname === 'Ca6aka' 
          ? 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse' 
          : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      } relative overflow-hidden`}
    >
      <div className={`absolute inset-0 ${
        player.nickname === 'Ca6aka' 
          ? 'bg-gradient-to-r from-red-500/10 to-red-600/10' 
          : 'bg-gradient-to-r from-purple-500/10 to-purple-600/10'
      } animate-shimmer`}></div>
      <span className="relative z-10">
        {player.nickname === 'Ca6aka' ? 'SUPER-ADMIN' : 'Admin'}
      </span>
    </Badge>
  )}
</div>

                
                <div className="flex items-center space-x-6 text-slate-300 flex-wrap">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-blue-400" />
                    <span>{t('level')}: {level}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span>{t('rank')} #{playerRank}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Server className="w-4 h-4 text-purple-400" />
                    <span>{player.serverCount || 0} {t('servers')}</span>
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
              <div className="text-slate-400">{t('totalBalance')}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <Server className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white" data-testid="text-servers">
                {player.serverCount || 0}
              </div>
              <div className="text-slate-400">{t('activeServers')}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white" data-testid="text-rank">
                #{playerRank}
              </div>
              <div className="text-slate-400">{t('globalRank')}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        {player.activities && player.activities.length > 0 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Clock className="h-5 w-5 text-blue-400 mr-2" />
                {t('recentActivity')}
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