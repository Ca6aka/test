import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Crown, Star, Clock, Users, Shield, Zap, Trophy, Timer } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { useGame } from '@/contexts/game-context';
import { toast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export default function DonateTab() {
  const { t } = useLanguage();
  const { gameState } = useGame();
  const [selectedPayment, setSelectedPayment] = useState('fondy');
  const queryClient = useQueryClient();

  const purchaseMutation = useMutation({
    mutationFn: ({ type, gateway }) => apiRequest('/api/donation/purchase', 'POST', { type, gateway }),
    onSuccess: (data) => {
      if (data.redirectUrl) {
        window.open(data.redirectUrl, '_blank');
      }
      toast({
        title: t('paymentInitiated'),
        description: t('redirectedToPayment'),
        duration: 5000,
      });
      queryClient.invalidateQueries(['/api/auth/me']);
    },
    onError: (error) => {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const handlePurchase = (type) => {
    purchaseMutation.mutate({ type, gateway: selectedPayment });
  };

  const user = gameState.user;
  const hasVip = user?.vipExpires && new Date(user.vipExpires) > new Date();
  const hasPremium = user?.premiumActive;

  const getStatusBadge = () => {
    if (hasPremium) {
      return <Badge className="bg-purple-600 text-white">{t('premium')}</Badge>;
    }
    if (hasVip) {
      return <Badge className="bg-blue-600 text-white">{t('vip')}</Badge>;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{t('donateTitle')}</h2>
        <p className="text-muted-foreground">{t('donateDescription')}</p>
        {getStatusBadge() && (
          <div className="mt-4">
            <span className="text-sm text-muted-foreground mr-2">{t('currentStatus')}:</span>
            {getStatusBadge()}
          </div>
        )}
      </div>

      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            {t('paymentMethod')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedPayment} onValueChange={setSelectedPayment}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fondy">Fondy</SelectItem>
              <SelectItem value="wayforpay">WayForPay</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* VIP Package */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
          <CardTitle className="flex items-center text-blue-600 dark:text-blue-400">
            <Crown className="w-6 h-6 mr-2" />
            VIP {t('status')}
            <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              $2.50/{t('month')}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3 mb-6">
            <div className="flex items-center">
              <Crown className="w-4 h-4 text-blue-500 mr-2" />
              <span>{t('vipBadgeChat')}</span>
            </div>
            <div className="flex items-center">
              <Timer className="w-4 h-4 text-blue-500 mr-2" />
              <span>{t('vipReducedCooldown')}</span>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-blue-500 mr-2" />
              <span>{t('vipExperienceBoost')}</span>
            </div>
            <div className="flex items-center">
              <Shield className="w-4 h-4 text-blue-500 mr-2" />
              <span>{t('vipReportPriority')}</span>
            </div>
            <div className="flex items-center">
              <Zap className="w-4 h-4 text-blue-500 mr-2" />
              <span>{t('vipUniqueEmojis')}</span>
            </div>
            <div className="flex items-center">
              <Trophy className="w-4 h-4 text-blue-500 mr-2" />
              <span>{t('vipDailyBonus')}</span>
            </div>
          </div>
          <Button 
            onClick={() => handlePurchase('vip')}
            disabled={purchaseMutation.isPending || (hasPremium && !hasVip)}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {purchaseMutation.isPending ? t('processing') : 
             hasPremium ? t('premiumBlocksVip') :
             hasVip ? t('extendVip') : t('purchaseVip')}
          </Button>
        </CardContent>
      </Card>

      {/* Premium Package */}
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
          <CardTitle className="flex items-center text-purple-600 dark:text-purple-400">
            <Star className="w-6 h-6 mr-2" />
            PREMIUM {t('status')}
            <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              $10 {t('forever')}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3 mb-6">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-purple-500 mr-2" />
              <span>{t('premiumBadgeChat')}</span>
            </div>
            <div className="flex items-center">
              <Timer className="w-4 h-4 text-purple-500 mr-2" />
              <span>{t('premiumReducedCooldown')}</span>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-purple-500 mr-2" />
              <span>{t('premiumExperienceBoost')}</span>
            </div>
            <div className="flex items-center">
              <Shield className="w-4 h-4 text-purple-500 mr-2" />
              <span>{t('premiumReportPriority')}</span>
            </div>
            <div className="flex items-center">
              <Zap className="w-4 h-4 text-purple-500 mr-2" />
              <span>{t('premiumNoMinigameCooldown')}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 text-purple-500 mr-2" />
              <span>{t('premiumServerLimit')}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-purple-500 mr-2" />
              <span>{t('premiumInstantServers')}</span>
            </div>
            <div className="flex items-center">
              <Zap className="w-4 h-4 text-purple-500 mr-2" />
              <span>{t('premiumUniqueEmojis')}</span>
            </div>
            <div className="flex items-center">
              <Shield className="w-4 h-4 text-purple-500 mr-2" />
              <span>{t('premiumSecretReactions')}</span>
            </div>
            <div className="flex items-center">
              <Trophy className="w-4 h-4 text-purple-500 mr-2" />
              <span>{t('premiumDailyBonus')}</span>
            </div>
          </div>
          <Button 
            onClick={() => handlePurchase('premium')}
            disabled={purchaseMutation.isPending || (hasVip && !hasPremium)}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {purchaseMutation.isPending ? t('processing') : 
             hasPremium ? t('alreadyHavePremium') :
             hasVip ? t('vipBlocksPremium') : t('purchasePremium')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}