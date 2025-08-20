import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Gift, Calendar, Flame, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/language-context';
import { useToast } from '../hooks/use-toast';
import { apiRequest } from '../lib/queryClient';

const DailyBonusTab = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bonusData, isLoading } = useQuery({
    queryKey: ['/api/daily-bonus'],
    refetchInterval: 30000,
  });

  const claimMutation = useMutation({
    mutationFn: () => apiRequest('/api/daily-bonus/claim', { method: 'POST' }),
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: t('bonusClaimed'),
          description: t('bonusClaimedDesc').replace('{amount}', data.amount).replace('{streak}', data.streak),
        });
        queryClient.invalidateQueries({ queryKey: ['/api/daily-bonus'] });
        queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      } else {
        toast({
          title: t('error'),
          description: data.message || t('bonusClaimError'),
          variant: 'destructive',
        });
      }
    },
    onError: () => {
      toast({
        title: t('error'),
        description: t('bonusClaimError'),
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center text-slate-400">Loading...</div>
      </div>
    );
  }

  const { canClaim, streak, amount, nextAmount } = bonusData || {};
  const currentStreak = streak || 0;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Gift className="w-6 h-6 text-yellow-400" />
          {t('dailyBonus')}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Bonus Card */}
        <Card className="border-2 border-yellow-500 bg-gradient-to-br from-yellow-900/30 to-yellow-800/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-300">
              <Calendar className="w-5 h-5" />
              {t('todayBonus')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {canClaim ? (
              <>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">
                    ${amount}
                  </div>
                  <p className="text-sm text-slate-300">{t('readyToClaim')}</p>
                </div>
                
                <Button 
                  onClick={() => claimMutation.mutate()}
                  disabled={claimMutation.isPending}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  {claimMutation.isPending ? t('claiming') : t('claimBonus')}
                </Button>
              </>
            ) : (
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-400 mb-2">
                  {t('alreadyClaimed')}
                </div>
                <p className="text-sm text-slate-500">{t('comeBackTomorrow')}</p>
                
                <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Clock className="w-4 h-4" />
                    {t('nextBonus')}: ${nextAmount}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Streak Card */}
        <Card className="border-2 border-orange-500 bg-gradient-to-br from-orange-900/30 to-orange-800/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-300">
              <Flame className="w-5 h-5" />
              {t('loginStreak')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">
                {currentStreak}
              </div>
              <p className="text-sm text-slate-300">
                {currentStreak === 1 ? t('dayStreak') : t('daysStreak')}
              </p>
            </div>

            {currentStreak > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">{t('streakMultiplier')}</span>
                  <span className="text-orange-400">{Math.min(currentStreak, 20)}x</span>
                </div>
                
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-600 to-orange-400 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((currentStreak / 20) * 100, 100)}%` }}
                  />
                </div>
                
                <p className="text-xs text-slate-500">
                  {currentStreak >= 20 ? t('maxMultiplier') : t('streakProgress').replace('{current}', currentStreak).replace('{max}', 20)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bonus Schedule */}
      <Card className="mt-6 border-slate-600">
        <CardHeader>
          <CardTitle className="text-slate-100">{t('bonusSchedule')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 10, 15, 20].map((day) => {
              const bonus = Math.min(100 * day, 2000);
              const isActive = currentStreak >= day;
              
              return (
                <div 
                  key={day}
                  className={`p-3 rounded-lg text-center border-2 transition-all ${
                    isActive 
                      ? 'border-green-500 bg-green-900/30' 
                      : 'border-slate-600 bg-slate-800/50'
                  }`}
                >
                  <div className={`text-sm font-medium ${
                    isActive ? 'text-green-400' : 'text-slate-400'
                  }`}>
                    {t('day')} {day}
                  </div>
                  <div className={`text-lg font-bold ${
                    isActive ? 'text-green-300' : 'text-slate-500'
                  }`}>
                    ${bonus}
                  </div>
                  {day === 20 && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      {t('max')}
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-300">
              <strong>{t('note')}:</strong> {t('bonusNote')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyBonusTab;