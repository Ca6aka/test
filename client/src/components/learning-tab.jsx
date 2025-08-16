import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useGame } from '@/contexts/game-context';
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

export function LearningTab() {
  const { gameState, startLearning } = useGame();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      // Immediately update balance and user data
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      queryClient.invalidateQueries({ queryKey: ['/api/learning/current'] });
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
              <strong>Reward:</strong> {getRewardText(gameState.currentLearning.reward)}
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
          const completedLearning = gameState.user.completedLearning || [];
          const isCompleted = completedLearning.includes(course.id);
          const isLearning = gameState.currentLearning?.id === course.id;
          const hasLearning = gameState.currentLearning && !isLearning;
          const isServerLimit25 = course.reward?.type === 'serverSlots' && (gameState.user.serverLimit || 3) >= 25;
          const isDisabled = !canAfford || hasLearning || !hasLevelRequirement || isCompleted || isServerLimit25;

          

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
                      <p className="text-xs text-red-400 mt-1">Requires Level {course.requiredLevel}</p>
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
                className="relative z-10 w-full"
                disabled={isDisabled}
                onClick={() => !isCompleted && !isServerLimit25 && handleStartCourse(course.id)}
                variant={isCompleted ? "secondary" : isLearning ? "secondary" : isDisabled ? "ghost" : "default"}
              >
                {!hasLevelRequirement ? `Requires Level ${course.requiredLevel}` :
                 isServerLimit25 ? 'Unavailable' :
                 isCompleted ? 'Completed' :
                 isLearning ? 'In Progress...' :
                 hasLearning ? 'Complete Current Course First' :
                 !canAfford ? 'Insufficient Funds' :
                 'Start Course'}
              </Button>

              {!canAfford && !hasLearning && (
                <p className="relative z-10 text-xs text-red-400 mt-2 text-center">
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
          <div className="relative overflow-hidden bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105 text-center">
            {/* Blue Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/20 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <div className="relative z-10 w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-2 border border-blue-500/50">
              <i className="fas fa-server text-blue-400"></i>
            </div>
            <h4 className="relative z-10 font-medium text-slate-200">More Servers</h4>
            <p className="relative z-10 text-xs text-slate-400">Unlock additional server slots</p>
          </div>
          <div className="relative overflow-hidden bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 hover:border-orange-500/50 transition-all duration-300 transform hover:scale-105 text-center">
            {/* Orange Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-600/20 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <div className="relative z-10 w-12 h-12 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-2 border border-orange-500/50">
              <i className="fas fa-tachometer-alt text-orange-400"></i>
            </div>
            <h4 className="relative z-10 font-medium text-slate-200">Higher Efficiency</h4>
            <p className="relative z-10 text-xs text-slate-400">Increase server income rates</p>
          </div>
          <div className="relative overflow-hidden bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 hover:border-red-500/50 transition-all duration-300 transform hover:scale-105 text-center">
            {/* Red Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-600/20 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <div className="relative z-10 w-12 h-12 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center mx-auto mb-2 border border-red-500/50">
              <i className="fas fa-trophy text-red-400"></i>
            </div>
            <h4 className="relative z-10 font-medium text-slate-200">Better Rankings</h4>
            <p className="relative z-10 text-xs text-slate-400">Climb the leaderboards</p>
          </div>
        </div>
      </div>
    </div>
  );
}
