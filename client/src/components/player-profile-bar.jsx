import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useGame } from '@/contexts/game-context';
import { useLanguage } from '@/contexts/language-context';
import { formatCurrency } from '@/lib/constants';
import { X, TrendingUp, TrendingDown, Star, Award } from 'lucide-react';

// Level and Experience System (60 levels, 10% increase per level)
function calculateLevel(experience) {
  let level = 1;
  let requiredExp = 100;
  let totalExp = 0;
  
  while (totalExp + requiredExp <= experience && level < 60) {
    totalExp += requiredExp;
    level++;
    requiredExp = Math.floor(requiredExp * 1.1);
  }
  
  return level;
}

function getExperienceForLevel(level) {
  let totalExp = 0;
  let currentExp = 100;
  
  for (let i = 1; i < level && i < 60; i++) {
    totalExp += currentExp;
    currentExp = Math.floor(currentExp * 1.1);
  }
  
  return totalExp;
}

function getExperienceToNextLevel(experience) {
  const currentLevel = calculateLevel(experience);
  if (currentLevel >= 60) return 0;
  const nextLevelExp = getExperienceForLevel(currentLevel + 1);
  return nextLevelExp - experience;
}

function getExperienceProgress(experience) {
  const currentLevel = calculateLevel(experience);
  if (currentLevel >= 60) return 100;
  const currentLevelStart = getExperienceForLevel(currentLevel);
  const nextLevelStart = getExperienceForLevel(currentLevel + 1);
  const currentExp = experience - currentLevelStart;
  const neededExp = nextLevelStart - currentLevelStart;
  return Math.floor((currentExp / neededExp) * 100);
}

function PlayerAvatar({ user, size = 'md', showLevel = true, showExperienceRing = true, onClick, className = "" }) {
  if (!user?.avatar) return null;

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const avatarSizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-14 h-14'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  const level = user.level || calculateLevel(user.experience || 0);
  const experience = user.experience || 0;
  const expProgress = getExperienceProgress(experience);

  return (
    <div className={`relative ${className}`} onClick={onClick}>
      {/* Avatar with experience ring */}
      <div className={`${sizeClasses[size]} relative ${onClick ? 'cursor-pointer group' : ''}`}>
        {/* Experience ring (only show in game context) */}
        {showLevel && showExperienceRing && (
          <svg className="absolute inset-0 w-full h-full -rotate-90 opacity-80">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="transparent"
              stroke="rgba(59, 130, 246, 0.2)"
              strokeWidth="3"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="transparent"
              stroke="rgba(59, 130, 246, 0.8)"
              strokeWidth="3"
              strokeDasharray="100"
              strokeDashoffset={100 - expProgress}
              className="transition-all duration-500 ease-out"
            />
          </svg>
        )}
        
        {/* Avatar with gradient */}
        <div 
          className={`${avatarSizeClasses[size]} rounded-full bg-gradient-to-br ${user.avatar.gradient} flex items-center justify-center text-white font-bold ${textSizes[size]} shadow-lg border-2 border-white/20 relative overflow-hidden ${user.nickname === 'Ca6aka' ? 'animate-rainbow-pulse' : ''}`}
        >
          {/* Static background gradient for regular users */}
          {user.nickname !== 'Ca6aka' && (
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-40"></div>
          )}
          {/* Special animated rainbow effect for super admin */}
          {user.nickname === 'Ca6aka' && (
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 via-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 animate-rainbow-pulse opacity-80"></div>
          )}
          <span className="relative z-10">{user.nickname[0].toUpperCase()}</span>
        </div>

        {/* Level badge */}
        {showLevel && (
          <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center border-2 border-white shadow-lg font-bold">
            {level}
          </div>
        )}
      </div>
    </div>
  );
}

export function PlayerProfileBar({ isOpen, onClose }) {
  const { gameState } = useGame();
  const { t } = useLanguage();
  
  if (!gameState.user || !isOpen) return null;

  const user = gameState.user;
  const level = user.level || calculateLevel(user.experience || 0);
  const experience = user.experience || 0;
  const expProgress = getExperienceProgress(experience);
  const expToNext = getExperienceToNextLevel(experience);
  const totalEarnings = user.totalEarnings || user.balance || 0;
  const totalSpent = user.totalSpent || 0;
  const netProfit = totalEarnings - totalSpent;

  const achievements = user.achievements || [];
  const completedJobs = user.completedJobsCount || 0;
  const completedCourses = user.completedCoursesCount || 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden"
        style={{ zIndex: 999999 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <CardHeader className="relative pb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>

            <div className="flex items-center space-x-6">
              <PlayerAvatar user={user} size="xl" />
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold text-white mb-2">
                  {user.nickname}
                </CardTitle>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-slate-300">Level {level}</span>
                    <Badge variant="outline" className="border-blue-500 text-blue-400">
                      {experience} XP
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm text-slate-400">
                      <span>Progress to Level {level + 1}</span>
                      <span>{expToNext} XP needed</span>
                    </div>
                    <Progress value={expProgress} className="h-2" />
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Financial Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-slate-700/50 border-slate-600">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">
                    {formatCurrency(totalEarnings)}
                  </div>
                  <div className="text-sm text-slate-400">Total Earnings</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/50 border-slate-600">
                <CardContent className="p-4 text-center">
                  <TrendingDown className="w-6 h-6 text-red-500 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">
                    {formatCurrency(totalSpent)}
                  </div>
                  <div className="text-sm text-slate-400">Total Spent</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/50 border-slate-600">
                <CardContent className="p-4 text-center">
                  <Star className={`w-6 h-6 ${netProfit >= 0 ? 'text-yellow-500' : 'text-orange-500'} mx-auto mb-2`} />
                  <div className={`text-lg font-bold ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCurrency(netProfit)}
                  </div>
                  <div className="text-sm text-slate-400">Net Profit</div>
                </CardContent>
              </Card>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-700/30 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{completedJobs}</div>
                  <div className="text-sm text-slate-400">Jobs Completed</div>
                </div>
              </div>

              <div className="bg-slate-700/30 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{completedCourses}</div>
                  <div className="text-sm text-slate-400">Courses Completed</div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <Award className="w-5 h-5 text-yellow-500 mr-2" />
                Achievements ({achievements.length})
              </h3>
              {achievements.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {achievements.slice(0, 6).map((achievementId, index) => (
                    <Badge 
                      key={achievementId}
                      variant="outline" 
                      className="border-yellow-500 text-yellow-400 justify-center py-2"
                    >
                      Achievement {index + 1}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400">
                  <Award className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No achievements yet</p>
                  <p className="text-sm">Complete jobs and reach milestones to earn achievements!</p>
                </div>
              )}
            </div>

            {/* Current Balance */}
            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg p-4 border border-green-500/30">
              <div className="text-center">
                <div className="text-sm text-slate-400 mb-1">Current Balance</div>
                <div className="text-3xl font-bold text-green-400">
                  {formatCurrency(user.balance)}
                </div>
              </div>
            </div>
          </CardContent>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export { PlayerAvatar };