import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, TrendingUp, Trophy, Zap, Server, Globe, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { useQuery } from '@tanstack/react-query';

export default function HomePage() {
  const { language, changeLanguage, t } = useLanguage();
  const [stats, setStats] = useState({
    totalPlayers: 0,
    onlinePlayers: 0,
    totalServers: 0,
    totalBalance: 0
  });

  // Fetch general stats for landing page
  const { data: statsResponse } = useQuery({
    queryKey: ['/api/stats/general'],
    retry: false,
    refetchInterval: 30000, // Update every 30 seconds
  });

  const { data: rankingsResponse } = useQuery({
    queryKey: ['/api/rankings'],
    retry: false,
    refetchInterval: 30000, // Update every 30 seconds
  });

  useEffect(() => {
    if (statsResponse) {
      setStats(statsResponse);
    }
  }, [statsResponse]);

  const features = [
    {
      icon: <Server className="h-8 w-8 text-blue-400" />,
      title: t('feature1Title'),
      description: t('feature1Desc')
    },
    {
      icon: <Globe className="h-8 w-8 text-green-400" />,
      title: t('feature2Title'),
      description: t('feature2Desc')
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-purple-400" />,
      title: t('feature3Title'),
      description: t('feature3Desc')
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-400" />,
      title: t('feature4Title'),
      description: t('feature4Desc')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Root Tycoon
              </h1>
              <span className="ml-2 text-slate-400 text-sm">Server Management Tycoon</span>
            </div>
            
            <div className="flex items-center space-x-4">
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
              
              {/* Hide login button on mobile */}
              <div className="hidden sm:block">
                <Link href="/reg">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    {t('loginRegister')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            {t('heroTitle')}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              {t('heroSubtitle')}
            </span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            {t('heroDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Link href="/reg">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                {t('startPlaying')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto border-slate-600 text-slate-300 hover:bg-slate-800"
              onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t('learnMore')}
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 sm:p-6 text-center">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-xl sm:text-2xl font-bold text-white">{stats.totalPlayers?.toLocaleString() || '0'}</div>
                <div className="text-sm sm:text-base text-slate-400">{t('totalPlayers')}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="h-2 w-2 bg-green-400 rounded-full mx-auto mb-2 animate-pulse"></div>
                <div className="text-xl sm:text-2xl font-bold text-white">{stats.onlinePlayers || '0'}</div>
                <div className="text-sm sm:text-base text-slate-400">{t('onlineNow')}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 sm:p-6 text-center">
                <Server className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400 mx-auto mb-2" />
                <div className="text-xl sm:text-2xl font-bold text-white">{stats.totalServers?.toLocaleString() || '0'}</div>
                <div className="text-sm sm:text-base text-slate-400">{t('serversHosted')}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 sm:p-6 text-center">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-400 mx-auto mb-2" />
                <div className="text-xl sm:text-2xl font-bold text-white">${stats.totalBalance?.toLocaleString() || '0'}</div>
                <div className="text-sm sm:text-base text-slate-400">{t('totalBalance')}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20" id="features-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{t('gameFeatures')}</h2>
            <p className="text-base sm:text-lg text-slate-300 px-4">{t('featuresDescription')}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="mb-3 sm:mb-4">{feature.icon}</div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-slate-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Top Players Section */}
      <section className="py-12 sm:py-16 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{t('topPlayers')}</h2>
            <p className="text-base sm:text-lg text-slate-300 px-4">{t('topPlayersDescription')}</p>
          </div>
          
          <Card className="bg-slate-800/50 border-slate-700 max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Trophy className="h-5 w-5 text-yellow-400 mr-2" />
                {t('leaderboard')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rankingsResponse?.rankings?.slice(0, 10).map((player, index) => (
                  <div key={player.id} className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-slate-700/50 hover:bg-slate-700/70 transition-colors cursor-pointer group">
                    <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                      <Badge variant="outline" className="border-slate-600 text-slate-300 text-xs sm:text-sm">
                        #{index + 1}
                      </Badge>
                      <span 
                        className="text-white font-medium group-hover:text-blue-400 transition-colors truncate text-sm sm:text-base"
                        onClick={() => window.location.href = `/player/${player.nickname}`}
                      >
                        {player.nickname}
                        {player.isOnline && <span className="ml-2 w-2 h-2 bg-green-400 rounded-full inline-block animate-pulse"></span>}
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-green-400 font-bold text-sm sm:text-base">${player.balance?.toLocaleString()}</div>
                      <div className="text-slate-400 text-xs sm:text-sm">{player.serverCount} {t('serversLowercase')}</div>
                    </div>
                  </div>
                )) || []}
              </div>
              
              <div className="mt-6 text-center">
                <Link href="/reg">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    {t('joinCompetition')}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-400 text-sm sm:text-base">
            © 2025 Root Tycoon. {t('allRightsReserved')}
          </p>
        </div>
      </footer>
    </div>
  );
}