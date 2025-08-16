import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useGame } from '@/contexts/game-context';
import { useLanguage } from '@/contexts/language-context';
import { useToast } from '@/hooks/use-toast';
import { JOB_TYPES, formatCurrency, formatTime } from '@/lib/constants';

export function TutorialTab({ onTabChange }) {
  const { gameState, completeJob, completeTutorial } = useGame();
  const { toast } = useToast();
  const { t, localizeError } = useLanguage();
  const [cooldownTimers, setCooldownTimers] = useState({});

  // Update cooldown timers
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameState.jobCooldowns) {
        const now = Date.now();
        const timers = {};
        
        Object.entries(gameState.jobCooldowns).forEach(([jobType, endTime]) => {
          const remaining = Math.max(0, endTime - now);
          timers[jobType] = remaining;
        });
        
        setCooldownTimers(timers);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.jobCooldowns]);

  const handleStartJob = async (jobType) => {
    try {
      await completeJob(jobType);
      const job = JOB_TYPES.find(j => j.id === jobType);
      toast({
        title: "Job Started",
        description: `${job.name} started! You'll earn ${formatCurrency(job.reward)} when completed.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCompleteTutorial = async () => {
    try {
      await completeTutorial();
      toast({
        title: "Tutorial Completed!",
        description: "Congratulations! You've unlocked all game features.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: localizeError(error),
        variant: "destructive",
      });
    }
  };

  if (!gameState.user) return null;

  const tutorialProgress = Math.min((gameState.user.balance / 15000) * 100, 100);

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-2">{t('start')}</h2>
        <p className="text-sm sm:text-base text-slate-400">{t('tipCompleteJobs')}</p>
      </div>

      {/* Tutorial Progress - Only show if not completed */}
      {!gameState.user.tutorialCompleted && (
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-primary">{t('tutorialProgress')}</h3>
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-lg text-sm font-medium">
              {gameState.user.tutorialCompleted ? t('completed') : t('inProgress')}
            </span>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">{t('tipEarnToUnlock').replace('{amount}', formatCurrency(15000))}</span>
              <span className="text-primary">
                {formatCurrency(gameState.user.balance)} / {formatCurrency(15000)}
              </span>
            </div>
            <Progress value={tutorialProgress} className="h-3" />
          </div>

          {gameState.user.balance >= 15000 && !gameState.user.tutorialCompleted && (
            <Button onClick={handleCompleteTutorial} className="w-full">
              {t('completeTutorialUnlock')}
            </Button>
          )}
        </div>
      )}

      {/* Tutorial Jobs */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">{t('tutorialJobs')}</h3>
        
        {JOB_TYPES.map((job) => {
          const cooldown = cooldownTimers[job.id] || 0;
          const isOnCooldown = cooldown > 0;

          return (
            <div key={job.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 sm:p-6 hover:border-primary/30 transition-all">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <i className={job.icon + " text-primary text-sm sm:text-lg"}></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-200 text-sm sm:text-base">
                      {job.id === 'maintenance' ? t('serverMaintenance') : 
                       job.id === 'optimization' ? t('performanceOptimization') : 
                       job.id === 'security-audit' ? t('securityAudit') : job.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-400">
                      {t('earnMoney').replace('{amount}', formatCurrency(job.reward))} • {t('cooldownTime').replace('{time}', formatTime(job.cooldown))}
                    </p>
                  </div>
                </div>
                
                <div className="w-full sm:w-auto">
                  {isOnCooldown ? (
                    <div className="text-center sm:text-right">
                      <p className="text-xs text-slate-400 mb-1">{t('availableIn')}</p>
                      <p className="text-sm font-medium text-accent">
                        {formatTime(cooldown)}
                      </p>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => handleStartJob(job.id)}
                      className="bg-primary hover:bg-primary/80 w-full sm:w-auto text-sm"
                    >
                      {t('startJob')}
                    </Button>
                  )}
                </div>
              </div>

              {isOnCooldown && (
                <div className="mt-4">
                  <Progress 
                    value={((job.cooldown - cooldown) / job.cooldown) * 100} 
                    className="h-2"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tutorial Tips */}
      <div className="mt-6 sm:mt-8 bg-gradient-to-r from-accent/10 to-secondary/10 border border-accent/30 rounded-xl p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-accent mb-3">
          <i className="fas fa-lightbulb mr-2"></i>
          {t('tutorialTips')}
        </h3>
        <div className="space-y-2 text-sm text-slate-300">
          <p>• {t('tipCompleteJobs')}</p>
          <p>• {t('tipJobCooldown')}</p>
          <p>• {t('tipEarnToUnlock').replace('{amount}', formatCurrency(15000))}</p>
          <p>• {t('tipPurchaseServers')}</p>
          <p>• {t('tipTakeCourses')}</p>
        </div>
        
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 opacity-50 cursor-not-allowed"
            disabled={true}
          >
            {t('browseServerStore')} 🔒
          </Button>
          <Button 
            variant="outline" 
            className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 opacity-50 cursor-not-allowed"
            disabled={true}
          >
            {t('browseLearningCourses')} 🔒
          </Button>
        </div>
      </div>

      {/* Recent Activities */}
      {gameState.activities && gameState.activities.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-slate-200 mb-4">{t('recentActivities')}</h3>
          <div className="space-y-2">
            {gameState.activities.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                <span className="text-sm text-slate-300">{activity.description}</span>
                <span className="text-xs text-slate-400">{activity.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
