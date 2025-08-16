import { useQuery } from '@tanstack/react-query';
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

  const { data: achievementsResponse } = useQuery({
    queryKey: ['/api/achievements'],
    enabled: !!gameState.user,
    refetchInterval: 30000, // Update every 30 seconds
  });

  const achievements = achievementsResponse?.achievements || [];
  const earnedCount = achievements.filter(a => a.earned).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Trophy className="w-6 h-6 text-yellow-400 mr-2" />
            Достижения
          </h2>
          <p className="text-slate-400">
            Прогресс: {earnedCount}/{achievements.length} достижений получено
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">Завершено</div>
          <Progress value={(earnedCount / achievements.length) * 100} className="w-32" />
        </div>
      </div>

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
                    {achievement.title}
                  </span>
                </div>
                {achievement.earned && (
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
                    Получено
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 text-sm mb-4">
                {achievement.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  Награда: {formatCurrency(achievement.reward)}
                </div>
                <div className="text-xs text-slate-500">
                  {achievement.condition?.type === 'servers' && `${achievement.condition.count} серверов`}
                  {achievement.condition?.type === 'balance' && `${formatCurrency(achievement.condition.amount)} баланс`}
                  {achievement.condition?.type === 'jobs' && `${achievement.condition.count} заданий`}
                  {achievement.condition?.type === 'courses' && `${achievement.condition.count} курсов`}
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
            <p className="text-slate-400">Достижения загружаются...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}