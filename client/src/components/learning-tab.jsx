import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useGame } from '@/contexts/game-context';
import { useLanguage } from '@/contexts/language-context';
import { useToast } from '@/hooks/use-toast';
import { LEARNING_COURSES, formatCurrency, formatTime } from '@/lib/constants';
import { Lock } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

// Helper function to get learning course colors based on difficulty
const getLearningColors = (difficulty) => {
  if (difficulty === 'Beginner') return { bg: 'from-blue-500/20 to-blue-600/20', icon: 'text-blue-400', border: 'border-blue-500/50' };
  if (difficulty === 'Intermediate') return { bg: 'from-orange-500/20 to-orange-600/20', icon: 'text-orange-400', border: 'border-orange-500/50' };
  if (difficulty === 'Advanced') return { bg: 'from-red-500/20 to-red-600/20', icon: 'text-red-400', border: 'border-red-500/50' };
  if (difficulty === 'Expert') return { bg: 'from-purple-500/20 to-purple-600/20', icon: 'text-purple-400', border: 'border-purple-500/50' };
  if (difficulty === 'Master') return { bg: 'from-cyan-500/20 to-cyan-600/20', icon: 'text-cyan-400', border: 'border-cyan-500/50' };
  
  // Default fallback
  return { bg: 'from-blue-500/20 to-blue-600/20', icon: 'text-blue-400', border: 'border-blue-500/50' };
};

// Helper function to format reward text
const getRewardText = (reward, t) => {
  if (!reward || typeof reward !== 'object') return t('unknownReward');
  
  if (reward.type === 'serverSlots') {
    const amount = reward.amount ?? 0;
    return t('serverSlotReward')
      .replace('{amount}', amount)
      .replace('{plural}', amount > 1 ? 's' : '');
  } else if (reward.type === 'efficiency') {
    const amount = reward.amount ?? 0;
    return t('serverEfficiencyReward').replace('{amount}', amount);
  } else if (reward.type === 'serverUnlock') {
    const serverType = reward.serverType;
    const serverTypeName = serverType === 'gpu-server' ? t('gpuServer') : 
                           serverType === 'tpu-server' ? t('tpuServer') : 
                           t('specialServer');
    return t('unlockServerReward').replace('{serverType}', serverTypeName);
  }
  return t('unknownReward');
};

export function LearningTab() {
  const { gameState, startLearning } = useGame();
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleStartCourse = async (courseId) => {
    const course = LEARNING_COURSES.find(c => c.id === courseId);
    
    if (gameState.currentLearning) {
      toast({
        title: t('learningInProgressError'),
        description: t('oneCourseAtTime'),
        variant: "destructive",
      });
      return;
    }

    if (gameState.user.balance < course.price) {
      toast({
        title: t('insufficientFunds'),
        description: t('needMoneyForCourse').replace('{amount}', formatCurrency(course.price)),
        variant: "destructive",
      });
      return;
    }

    try {
      await startLearning(courseId);
      // Immediately update balance and user data
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      queryClient.invalidateQueries({ queryKey: ['/api/learning/current'] });
      toast({
        title: t('courseStarted'),
        description: t('courseStartedDesc').replace('{courseTitle}', course.title),
      });
    } catch (error) {
      toast({
        title: t('failedToStartCourse'),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!gameState.user) return null;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-100">{t('learningCenter')}</h2>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-slate-400">{t('currentBalance')}:</span>
          <span className="bg-slate-700 px-3 py-1 rounded-lg text-sm font-medium">
            {formatCurrency(gameState.user.balance)}
          </span>
        </div>
      </div>

      {/* Current Learning Progress */}
      {gameState.currentLearning && gameState.currentLearning.progress < 100 && (
        <div className="mb-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-purple-400">{t('currentCourse')}</h3>
            <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-lg text-sm font-medium">
              {gameState.currentLearning.difficulty}
            </span>
          </div>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <i className="fas fa-brain text-purple-400 text-lg"></i>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-slate-200">{gameState.currentLearning.title}</h4>
              <p className="text-sm text-slate-400">{gameState.currentLearning.description}</p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">{t('progress')}</span>
              <span className="text-purple-400">
                {gameState.currentLearning.progress}% ({gameState.currentLearning.timeRemaining} {t('timeRemaining')})
              </span>
            </div>
            <Progress value={gameState.currentLearning.progress} className="h-3" />
          </div>

          <div className="p-3 bg-purple-500/10 rounded-lg">
            <p className="text-sm text-purple-300">
              <i className="fas fa-gift mr-1"></i>
              <strong>{t('reward')}:</strong> {getRewardText(gameState.currentLearning.reward, t)}
            </p>
          </div>
        </div>
      )}

      {/* Available Courses */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">{t('availableCourses')}</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {LEARNING_COURSES.map((course) => {
          const userLevel = gameState.user.level || 1;
          const canAfford = gameState.user.balance >= course.price;
          const hasLevelRequirement = userLevel >= course.requiredLevel;
          const completedLearning = gameState.user.completedLearning || [];
          const isServerLimit25 = course.reward?.type === 'serverSlots' && (gameState.user.serverLimit || 3) >= 25;
          
          // For server slot courses, only consider them completed if we've reached the 25 server limit
          const isCompleted = course.reward?.type === 'serverSlots' 
            ? isServerLimit25
            : completedLearning.includes(course.id);
            
          const isLearning = gameState.currentLearning?.id === course.id;
          const hasLearning = gameState.currentLearning && !isLearning;
          const isDisabled = !canAfford || hasLearning || !hasLevelRequirement || isCompleted;

          

          return (
            <div key={course.id} className={`relative overflow-hidden bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:${getLearningColors(course.difficulty).border} transition-all duration-300 transform hover:scale-105 ${
              isLearning ? 'border-purple-500/50 bg-purple-500/5' :
              isCompleted ? 'border-green-500/50 bg-green-500/5' :
              isDisabled ? 'opacity-60' : ''
            }`}>
              {/* Gradient Background */}
              {!isDisabled && (
                <div className={`absolute inset-0 ${!hasLevelRequirement ? 'bg-gradient-to-br from-slate-500/20 to-slate-600/20' : isCompleted ? 'bg-gradient-to-br from-green-500/20 to-green-600/20' : isLearning ? 'bg-gradient-to-br from-purple-500/20 to-purple-600/20' : `bg-gradient-to-br ${getLearningColors(course.difficulty).bg}`} opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl`}></div>
              )}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border ${
                    !hasLevelRequirement ? 'bg-slate-500/20 border-slate-500/50' :
                    isCompleted ? 'bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/50' : 
                    isLearning ? 'bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/50' :
                    `bg-gradient-to-br ${getLearningColors(course.difficulty).bg} ${getLearningColors(course.difficulty).border}`
                  }`}>
                    {!hasLevelRequirement ? (
                      <Lock className="text-slate-400 text-lg" />
                    ) : isCompleted ? (
                      <i className="fas fa-check text-green-400 text-lg"></i>
                    ) : isLearning ? (
                      <i className="fas fa-brain text-purple-400 text-lg"></i>
                    ) : (
                      <i className={`fas fa-brain ${getLearningColors(course.difficulty).icon} text-lg`}></i>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-100">{course.title}</h3>
                    <p className="text-sm text-slate-400">{course.difficulty}</p>
                    {!hasLevelRequirement && (
                      <p className="text-xs text-red-400 mt-1">{t('requiresLevelX').replace('{level}', course.requiredLevel)}</p>
                    )}
                  </div>
                </div>
                <div className="relative z-10 text-right">
                  <p className="text-base font-bold text-primary">{formatCurrency(course.price)}</p>
                </div>
              </div>

              <p className="relative z-10 text-sm text-slate-400 mb-4">{course.description}</p>
              
              <div className="relative z-10 grid grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">{t('duration')}</p>
                  <p className="text-sm font-medium text-slate-300">
                    <i className="fas fa-clock mr-1"></i>
                    {formatTime(course.duration)}
                  </p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">{t('reward')}</p>
                  <p className="text-sm font-medium text-secondary">
                    <i className="fas fa-gift mr-1"></i>
                    {getRewardText(course.reward, t)}
                  </p>
                </div>
              </div>

              <Button 
                className="relative z-10 w-full"
                disabled={isDisabled}
                onClick={() => !isCompleted && handleStartCourse(course.id)}
                variant={isCompleted ? "secondary" : isLearning ? "secondary" : isDisabled ? "ghost" : "default"}
              >
                {!hasLevelRequirement ? t('requiresLevelX').replace('{level}', course.requiredLevel) :
                 isServerLimit25 ? t('unavailable') :
                 isCompleted && course.reward?.type !== 'serverSlots' ? t('completed') :
                 isLearning ? t('inProgress') :
                 hasLearning ? t('completeCurrentFirst') :
                 !canAfford ? t('insufficientFunds') :
                 t('startCourse')}
              </Button>

              {!canAfford && !hasLearning && (
                <p className="relative z-10 text-xs text-red-400 mt-2 text-center">
                  {t('needMoreForCourse').replace('{amount}', formatCurrency(course.price - gameState.user.balance))}
                </p>
              )}
            </div>
          );
        })}
        </div>
      </div>

      {/* Benefits Overview */}
      <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-secondary/10 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-3">{t('learningBenefits')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="relative overflow-hidden bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105 text-center">
            {/* Blue Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/20 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <div className="relative z-10 w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-2 border border-blue-500/50">
              <i className="fas fa-server text-blue-400"></i>
            </div>
            <h4 className="relative z-10 font-medium text-slate-200">{t('moreServers')}</h4>
            <p className="relative z-10 text-xs text-slate-400">{t('unlockAdditionalServerSlots')}</p>
          </div>
          <div className="relative overflow-hidden bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 hover:border-orange-500/50 transition-all duration-300 transform hover:scale-105 text-center">
            {/* Orange Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-600/20 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <div className="relative z-10 w-12 h-12 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-2 border border-orange-500/50">
              <i className="fas fa-tachometer-alt text-orange-400"></i>
            </div>
            <h4 className="relative z-10 font-medium text-slate-200">{t('higherEfficiency')}</h4>
            <p className="relative z-10 text-xs text-slate-400">{t('increaseServerIncomeRates')}</p>
          </div>
          <div className="relative overflow-hidden bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 hover:border-red-500/50 transition-all duration-300 transform hover:scale-105 text-center">
            {/* Red Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-600/20 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <div className="relative z-10 w-12 h-12 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center mx-auto mb-2 border border-red-500/50">
              <i className="fas fa-trophy text-red-400"></i>
            </div>
            <h4 className="relative z-10 font-medium text-slate-200">{t('betterRankings')}</h4>
            <p className="relative z-10 text-xs text-slate-400">{t('climbTheLeaderboards')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
