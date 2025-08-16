import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';
import { useGame } from '@/contexts/game-context';
import { useLanguage } from '@/contexts/language-context';
import { formatCurrency } from '@/lib/constants';

export function QuestsTab() {
  const { gameState } = useGame();
  const { t } = useLanguage();

  const { data: questsResponse } = useQuery({
    queryKey: ['/api/quests'],
    enabled: !!gameState.user,
    refetchInterval: 30000, // Update every 30 seconds
  });

  const quests = questsResponse?.quests || [];
  const completedCount = quests.filter(q => q.completed).length;

  // Calculate time until reset (24 hours from last reset)
  const getTimeUntilReset = () => {
    const lastReset = gameState.user?.lastQuestReset || Date.now();
    const nextReset = lastReset + 24 * 60 * 60 * 1000; // 24 hours from last reset
    const timeLeft = nextReset - Date.now();
    
    if (timeLeft <= 0) return "Сброс доступен";
    
    const hours = Math.floor(timeLeft / (60 * 60 * 1000));
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
    
    return `${hours}ч ${minutes}м до сброса`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Calendar className="w-6 h-6 text-blue-400 mr-2" />
            Ежедневные задания
          </h2>
          <p className="text-slate-400">
            Выполнено: {completedCount}/{quests.length} заданий
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400 flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {getTimeUntilReset()}
          </div>
          <Progress value={(completedCount / Math.max(quests.length, 1)) * 100} className="w-32 mt-1" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quests.map((quest) => (
          <Card 
            key={quest.id} 
            className={`bg-slate-800/50 border transition-all duration-200 ${
              quest.completed 
                ? 'border-green-500/50 bg-green-500/5' 
                : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {quest.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  ) : (
                    <Calendar className="w-5 h-5 text-blue-400" />
                  )}
                  <span className={quest.completed ? 'text-green-400' : 'text-white'}>
                    {quest.title}
                  </span>
                </div>
                {quest.completed && (
                  <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                    Завершено
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 text-sm mb-4">
                {quest.description}
              </p>
              
              <div className="space-y-3">
                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Прогресс</span>
                    <span>
                      {quest.requirement?.type === 'job' && 
                        `${quest.progress}/${quest.requirement.count} заданий`
                      }
                      {quest.requirement?.type === 'income' && 
                        `${formatCurrency(quest.progress)}/${formatCurrency(quest.requirement.amount)}`
                      }
                    </span>
                  </div>
                  <Progress 
                    value={quest.requirement ? (quest.progress / (quest.requirement.count || quest.requirement.amount)) * 100 : 0} 
                    className="w-full"
                  />
                </div>
                
                {/* Reward */}
                <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                  <span className="text-sm text-slate-500">Награда:</span>
                  <span className="text-sm font-medium text-yellow-400">
                    {formatCurrency(quest.reward)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {quests.length === 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">Ежедневные задания загружаются...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}