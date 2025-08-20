import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Lock, Eye, Award } from 'lucide-react';
import { useLanguage } from '../contexts/language-context';

const HiddenAchievementsTab = () => {
  const { t } = useLanguage();

  const { data: hiddenAchievementsData, isLoading } = useQuery({
    queryKey: ['/api/hidden-achievements'],
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center text-slate-400">Loading...</div>
      </div>
    );
  }

  const achievements = hiddenAchievementsData?.achievements || [];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Eye className="w-6 h-6 text-purple-400" />
          {t('hiddenAchievements')}
        </h2>
        <Badge variant="outline" className="text-purple-400 border-purple-400">
          {achievements.filter(a => !a.isLocked).length} / {achievements.length} {t('unlocked')}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <Card key={achievement.id} className={`border-2 transition-all ${
            achievement.isLocked 
              ? 'border-slate-600 bg-slate-800/50 opacity-60' 
              : 'border-purple-500 bg-gradient-to-br from-purple-900/30 to-purple-800/20'
          }`}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {achievement.isLocked ? (
                    <Lock className="w-5 h-5 text-slate-400" />
                  ) : (
                    <Award className="w-5 h-5 text-purple-400" />
                  )}
                  <span className={`text-sm ${
                    achievement.isLocked ? 'text-slate-400' : 'text-purple-300'
                  }`}>
                    {achievement.name}
                  </span>
                </div>
                {!achievement.isLocked && achievement.reward && (
                  <Badge variant="secondary" className="text-xs bg-purple-600/30 text-purple-200">
                    +${achievement.reward}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-xs ${
                achievement.isLocked ? 'text-slate-500' : 'text-slate-300'
              }`}>
                {achievement.description}
              </p>
              
              {achievement.isLocked && (
                <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                  <Eye className="w-3 h-3" />
                  {t('hiddenRequirement')}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {achievements.length === 0 && (
        <div className="text-center py-12">
          <Eye className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-400 mb-2">{t('noHiddenAchievements')}</h3>
          <p className="text-slate-500">{t('hiddenAchievementsDesc')}</p>
        </div>
      )}
    </div>
  );
};

export default HiddenAchievementsTab;