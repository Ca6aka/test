import { useQuery } from '@tanstack/react-query';
import { Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Lock, CheckCircle } from 'lucide-react';
import { useGame } from '@/contexts/game-context';
import { useLanguage } from '@/contexts/language-context';
import { formatCurrency } from '@/lib/constants';

export function AchievementsTab() {
  const { gameState } = useGame();
  const { t } = useLanguage();

  // Check if user has completed tutorial
  const hasCompletedTutorial = gameState.user?.tutorialCompleted;

  if (!hasCompletedTutorial) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <Lock className="w-16 h-16 text-slate-500" />
        <h3 className="text-xl font-semibold text-slate-300">{t('achievementsLocked')}</h3>
        <p className="text-slate-400 max-w-md">
          {t('completeTutorialToUnlock')}
        </p>
      </div>
    );
  }

  const { data: achievementsResponse } = useQuery({
    queryKey: ['/api/achievements'],
    enabled: !!gameState.user,
    refetchInterval: 30000, // Update every 30 seconds
  });

  const { data: hiddenAchievementsResponse } = useQuery({
    queryKey: ['/api/achievements/hidden'],
    enabled: !!gameState.user,
    refetchInterval: 30000,
  });

  const achievements = achievementsResponse?.achievements || [];
  const hiddenAchievements = hiddenAchievementsResponse?.achievements || [];
  const earnedCount = achievements.filter(a => a.earned).length;
  const hiddenEarnedCount = hiddenAchievements.filter(a => a.earned).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Trophy className="w-6 h-6 text-yellow-400 mr-2" />
{t('achievements')}
          </h2>
          <p className="text-slate-400">
{t('progressLabel')}: {earnedCount}/{achievements.length} {t('achievements')} | {hiddenEarnedCount}/{hiddenAchievements.length} {t('hiddenAchievements')}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">{t('completed')}</div>
          <Progress value={(earnedCount / achievements.length) * 100} className="w-32" />
        </div>
      </div>

      {/* Hidden Achievements Section */}
      {hiddenAchievements.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-purple-300">{t('hiddenAchievements')}</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {hiddenAchievements.map((achievement) => (
              <Card key={achievement.id} className="bg-slate-800/50 border-purple-900/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-violet-900/20" />
                <CardHeader className="relative">
                  <CardTitle className="flex items-center text-white">
                    {achievement.earned ? (
                      <CheckCircle className="w-5 h-5 text-purple-400 mr-2" />
                    ) : (
                      <Eye className="w-5 h-5 text-slate-500 mr-2" />
                    )}
                    <span className={achievement.earned ? 'text-purple-300' : 'text-slate-400'}>
                      {achievement.earned ? t(achievement.id) : '???'}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative space-y-3">
                  <p className={`text-sm ${achievement.earned ? 'text-slate-300' : 'text-slate-500'}`}>
                    {achievement.earned ? t(`${achievement.id}_desc`) : t('hiddenRequirement')}
                  </p>
                  {achievement.earned && achievement.reward && (
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-purple-900/50 text-purple-300">
                        {formatCurrency(achievement.reward)}
                      </Badge>
                      <Badge variant="outline" className="border-purple-600 text-purple-400">
                        {t('unlocked')}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <Card 
            key={achievement.id} 
            className={`bg-slate-800/50 border transition-all duration-200 ${
              achievement.earned 
                ? 'border-yellow-500/50 bg-yellow-500/5' 
                : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center space-x-2">
                  {achievement.earned ? (
                    <CheckCircle className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <Lock className="w-5 h-5 text-slate-500" />
                  )}
                  <span className={achievement.earned ? 'text-yellow-400' : 'text-slate-300'}>
                    {t('achievementsList')?.[achievement.id]?.title || achievement.title}
                  </span>
                </div>
                {achievement.earned && (
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
                    {t('rewardClaimed')}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 text-sm mb-4">
                {t('achievementsList')?.[achievement.id]?.description || achievement.description}
              </p>
              
              {achievement.isChat && achievement.progress !== undefined && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>{t('progress')}</span>
                    <span>{achievement.progress}/{achievement.requirement}</span>
                  </div>
                  <Progress value={(achievement.progress / achievement.requirement) * 100} className="h-2" />
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  {achievement.isChat ? (
                    <span className="text-blue-400">{t('chatAchievement')}</span>
                  ) : (
                    <span>{t('reward')}: {formatCurrency(achievement.reward)}</span>
                  )}
                </div>
                <div className="text-xs text-slate-500">
                  {!achievement.isChat && achievement.condition?.type === 'servers' && `${achievement.condition.count} ${t('serversLowercase')}`}
                  {!achievement.isChat && achievement.condition?.type === 'balance' && `${formatCurrency(achievement.condition.amount)} ${t('balance').toLowerCase()}`}
                  {!achievement.isChat && achievement.condition?.type === 'jobs' && `${achievement.condition.count} ${t('completedTasks')}`}
                  {!achievement.isChat && achievement.condition?.type === 'courses' && `${achievement.condition.count} ${t('coursesGenitive')}`}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {achievements.length === 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="py-12 text-center">
            <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">{t('loading')}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}