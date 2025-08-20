import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, Flame, X } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { useGame } from '@/contexts/game-context';
import { formatCurrency } from '@/lib/constants';
import { toast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export function DailyBonusNotification() {
  const { t } = useLanguage();
  const { gameState } = useGame();
  const [showBonus, setShowBonus] = useState(false);
  const queryClient = useQueryClient();

  // Check for daily bonus after login
  const { data: bonusData } = useQuery({
    queryKey: ['/api/daily-bonus'],
    enabled: !!gameState.user,
    refetchInterval: 60000, // Check every minute
  });

  const claimBonusMutation = useMutation({
    mutationFn: () => apiRequest('/api/daily-bonus/claim', 'POST'),
    onSuccess: (data) => {
      toast({
        title: t('dailyBonusClaimed'),
        description: `+${formatCurrency(data.amount)} | ${t('streak')}: ${data.streak}`,
        duration: 5000,
      });
      setShowBonus(false);
      // Invalidate user data to update balance
      queryClient.invalidateQueries(['/api/auth/me']);
      queryClient.invalidateQueries(['/api/daily-bonus']);
    },
    onError: (error) => {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Show bonus notification when available
  useEffect(() => {
    if (bonusData?.canClaim && gameState.user) {
      // Check if user logged in after midnight (Berlin time)
      const now = new Date();
      const berlinTime = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Berlin"}));
      const lastLogin = new Date(gameState.user.lastLogin);
      const lastLoginBerlin = new Date(lastLogin.toLocaleString("en-US", {timeZone: "Europe/Berlin"}));
      
      // Check if it's a new day
      const isNewDay = berlinTime.getDate() !== lastLoginBerlin.getDate() || 
                       berlinTime.getMonth() !== lastLoginBerlin.getMonth() ||
                       berlinTime.getFullYear() !== lastLoginBerlin.getFullYear();
      
      if (isNewDay && bonusData.canClaim) {
        setShowBonus(true);
      }
    }
  }, [bonusData, gameState.user]);

  if (!showBonus || !bonusData?.canClaim) return null;

  const handleClaim = () => {
    claimBonusMutation.mutate();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 border-purple-500/50 max-w-md w-full">
        <CardHeader className="text-center relative">
          <Button
            variant="ghost" 
            size="sm"
            className="absolute top-2 right-2 text-purple-300 hover:text-white"
            onClick={() => setShowBonus(false)}
          >
            <X className="w-4 h-4" />
          </Button>
          <div className="flex justify-center mb-2">
            <Gift className="w-12 h-12 text-yellow-400 animate-bounce" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            {t('dailyLoginBonus')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-yellow-400">
              +{formatCurrency(bonusData.amount)}
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="text-purple-200">{t('streak')}: {bonusData.streak}</span>
            </div>
            {bonusData.streak >= 7 && (
              <Badge variant="secondary" className="bg-yellow-900/50 text-yellow-300">
                {t('weekStreak')}
              </Badge>
            )}
          </div>
          <p className="text-purple-200 text-sm">
            {t('dailyBonusMessage')}
          </p>
          <Button 
            onClick={handleClaim}
            disabled={claimBonusMutation.isPending}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            {claimBonusMutation.isPending ? t('claiming') : t('claimBonus')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}