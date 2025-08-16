import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useGame } from '@/contexts/game-context';
import { useToast } from '@/hooks/use-toast';
import { LEARNING_COURSES, formatCurrency, formatTime } from '@/lib/constants';
import { Lock } from 'lucide-react';

export function LearningTab() {
  const { gameState, startLearning } = useGame();
  const { toast } = useToast();

  const handleStartCourse = async (courseId) => {
    const course = LEARNING_COURSES.find(c => c.id === courseId);
    
    if (gameState.currentLearning) {
      toast({
        title: "Learning in Progress",
        description: "You can only take one course at a time. Please wait for the current course to complete.",
        variant: "destructive",
      });
      return;
    }

    if (gameState.user.balance < course.price) {
      toast({
        title: "Insufficient Funds",
        description: `You need ${formatCurrency(course.price)} to start this course.`,
        variant: "destructive",
      });
      return;
    }

    try {
      await startLearning(courseId);
      toast({
        title: "Course Started",
        description: `You've started the ${course.title} course. Check your progress in the servers tab!`,
      });
    } catch (error) {
      toast({
        title: "Failed to Start Course",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!gameState.user) return null;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-100">Learning Center</h2>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-slate-400">Current Balance:</span>
          <span className="bg-slate-700 px-3 py-1 rounded-lg text-sm font-medium">
            {formatCurrency(gameState.user.balance)}
          </span>
        </div>
      </div>

      {/* Current Learning Progress */}
      {gameState.currentLearning && (
        <div className="mb-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-purple-400">Current Course</h3>
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
              <span className="text-slate-400">Progress</span>
              <span className="text-purple-400">
                {gameState.currentLearning.progress}% ({gameState.currentLearning.timeRemaining} remaining)
              </span>
            </div>
            <Progress value={gameState.currentLearning.progress} className="h-3" />
          </div>

          <div className="p-3 bg-purple-500/10 rounded-lg">
            <p className="text-sm text-purple-300">
              <i className="fas fa-gift mr-1"></i>
              <strong>Reward:</strong> {gameState.currentLearning.reward}
            </p>
          </div>
        </div>
      )}

      {/* Available Courses */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">Available Courses</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {LEARNING_COURSES.map((course) => {
          const userLevel = gameState.user.level || 1;
          const canAfford = gameState.user.balance >= course.price;
          const hasLevelRequirement = userLevel >= course.requiredLevel;
          const isLearning = gameState.currentLearning?.id === course.id;
          const hasLearning = gameState.currentLearning && !isLearning;
          const isDisabled = !canAfford || hasLearning || !hasLevelRequirement;

          const getRewardText = (reward) => {
            if (!reward || typeof reward !== 'object') return 'Unknown Reward';
            
            if (reward.type === 'serverSlots') {
              const amount = reward.amount ?? 0;
              return `+${amount} Server Slot${amount > 1 ? 's' : ''}`;
            } else if (reward.type === 'efficiency') {
              const amount = reward.amount ?? 0;
              return `+${amount}% Server Efficiency`;
            } else if (reward.type === 'serverUnlock') {
              const serverType = reward.serverType;
              return `Unlocks ${serverType === 'gpu-server' ? 'GPU Server' : serverType === 'tpu-server' ? 'TPU Server' : 'Special Server'}`;
            }
            return 'Unknown Reward';
          };          

          return (
            <div key={course.id} className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-primary/30 transition-all ${
              isLearning ? 'border-purple-500/50 bg-purple-500/5' :
              isDisabled ? 'opacity-60' : ''
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isLearning ? 'bg-purple-500/20' : 'bg-primary/20'
                  }`}>
                    {!hasLevelRequirement ? (
                      <Lock className="text-slate-400 text-lg" />
                    ) : (
                      <i className={`fas fa-brain ${isLearning ? 'text-purple-400' : 'text-primary'} text-lg`}></i>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-100">{course.title}</h3>
                    <p className="text-sm text-slate-400">{course.difficulty}</p>
                    {!hasLevelRequirement && (
                      <p className="text-xs text-red-400 mt-1">Requires Level {course.requiredLevel}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold text-primary">{formatCurrency(course.price)}</p>
                </div>
              </div>

              <p className="text-sm text-slate-400 mb-4">{course.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Duration</p>
                  <p className="text-sm font-medium text-slate-300">
                    <i className="fas fa-clock mr-1"></i>
                    {formatTime(course.duration)}
                  </p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Reward</p>
                  <p className="text-sm font-medium text-secondary">
                    <i className="fas fa-gift mr-1"></i>
                    {getRewardText(course.reward)}
                  </p>
                </div>
              </div>

              <Button 
                className="w-full"
                disabled={isDisabled}
                onClick={() => handleStartCourse(course.id)}
                variant={isLearning ? "secondary" : isDisabled ? "ghost" : "default"}
              >
                {!hasLevelRequirement ? `Requires Level ${course.requiredLevel}` :
                 isLearning ? 'In Progress...' :
                 hasLearning ? 'Complete Current Course First' :
                 !canAfford ? 'Insufficient Funds' :
                 'Start Course'}
              </Button>

              {!canAfford && !hasLearning && (
                <p className="text-xs text-red-400 mt-2 text-center">
                  Need {formatCurrency(course.price - gameState.user.balance)} more
                </p>
              )}
            </div>
          );
        })}
        </div>
      </div>

      {/* Benefits Overview */}
      <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-secondary/10 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-3">Learning Benefits</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <i className="fas fa-server text-blue-400"></i>
            </div>
            <h4 className="font-medium text-slate-200">More Servers</h4>
            <p className="text-xs text-slate-400">Unlock additional server slots</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <i className="fas fa-tachometer-alt text-secondary"></i>
            </div>
            <h4 className="font-medium text-slate-200">Higher Efficiency</h4>
            <p className="text-xs text-slate-400">Increase server income rates</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <i className="fas fa-trophy text-accent"></i>
            </div>
            <h4 className="font-medium text-slate-200">Better Rankings</h4>
            <p className="text-xs text-slate-400">Climb the leaderboards</p>
          </div>
        </div>
      </div>
    </div>
  );
}
