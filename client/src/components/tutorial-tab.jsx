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
  const { localizeError } = useLanguage();
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
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Start</h2>
        <p className="text-slate-400">Learn the basics of server hosting and earn your first income!</p>
      </div>

      {/* Tutorial Progress - Only show if not completed OR balance is under 15000 */}
      {(!gameState.user.tutorialCompleted || gameState.user.balance < 15000) && (
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-primary">Tutorial Progress</h3>
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-lg text-sm font-medium">
              {gameState.user.tutorialCompleted ? 'Completed' : 'In Progress'}
            </span>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Earn {formatCurrency(15000)} to unlock all features</span>
              <span className="text-primary">
                {formatCurrency(gameState.user.balance)} / {formatCurrency(15000)}
              </span>
            </div>
            <Progress value={tutorialProgress} className="h-3" />
          </div>

          {gameState.user.balance >= 15000 && !gameState.user.tutorialCompleted && (
            <Button onClick={handleCompleteTutorial} className="w-full">
              Complete Tutorial & Unlock All Features
            </Button>
          )}
        </div>
      )}

      {/* Tutorial Jobs */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">Tutorial Jobs</h3>
        
        {JOB_TYPES.map((job) => {
          const cooldown = cooldownTimers[job.id] || 0;
          const isOnCooldown = cooldown > 0;

          return (
            <div key={job.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-primary/30 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <i className={job.icon + " text-primary text-lg"}></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200">{job.name}</h4>
                    <p className="text-sm text-slate-400">
                      Earn {formatCurrency(job.reward)} • Cooldown: {formatTime(job.cooldown)}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  {isOnCooldown ? (
                    <div className="text-center">
                      <p className="text-xs text-slate-400 mb-1">Available in</p>
                      <p className="text-sm font-medium text-accent">
                        {formatTime(cooldown)}
                      </p>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => handleStartJob(job.id)}
                      className="bg-primary hover:bg-primary/80"
                    >
                      Start Job
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
      <div className="mt-8 bg-gradient-to-r from-accent/10 to-secondary/10 border border-accent/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-accent mb-3">
          <i className="fas fa-lightbulb mr-2"></i>
          Tutorial Tips
        </h3>
        <div className="space-y-2 text-sm text-slate-300">
          <p>• Complete jobs to earn money and gain experience</p>
          <p>• Each job has a cooldown period before you can do it again</p>
          <p>• Earn {formatCurrency(15000)} to unlock servers, learning, and the store</p>
          <p>• Purchase servers to generate passive income</p>
          <p>• Take learning courses to unlock more server slots</p>
        </div>
        
        <div className="mt-4 flex gap-3">
          <Button 
            variant="outline" 
            className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
            onClick={() => onTabChange && onTabChange('hosting')}
          >
            Browse Server Store
          </Button>
          <Button 
            variant="outline" 
            className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
            onClick={() => onTabChange && onTabChange('learning')}
          >
            Browse Learning Courses
          </Button>
        </div>
      </div>

      {/* Recent Activities */}
      {gameState.activities && gameState.activities.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-slate-200 mb-4">Recent Activities</h3>
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
