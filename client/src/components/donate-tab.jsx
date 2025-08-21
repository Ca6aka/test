import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// Removed Select import since payment selection is removed
import { Crown, Star, Clock, Users, Shield, Zap, Trophy, Timer, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { useGame } from '@/contexts/game-context';
import { toast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
// Removed VipPremiumTest import
import PurchaseDialog from './purchase-dialog';

export default function DonateTab() {
  const { t } = useLanguage();
  const { gameState } = useGame();
  // Removed old payment system state
  const queryClient = useQueryClient();



  const user = gameState.user;
  const hasVip = user?.vipStatus === 'active' && user?.vipExpiresAt && new Date(user.vipExpiresAt) > new Date();
  const hasPremium = user?.premiumStatus === 'active';

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

      {/* Crypto Payment Info */}
      <Card className="border-green-500/30 bg-gradient-to-br from-green-600/10 to-emerald-800/10">
        <CardHeader>
          <CardTitle className="flex items-center text-green-400">
            <Shield className="w-5 h-5 mr-2" />
            {t('securePayment')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-300">
            {t('cryptoPaymentInfo')}
          </p>
        </CardContent>
      </Card>

      {/* VIP Package */}
      <Card className="border-2 border-blue-500/30 bg-gradient-to-br from-blue-600/20 to-blue-800/20 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 group relative overflow-visible">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-blue-500/5 opacity-50 -z-10"></div>
        <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 relative z-10">
          <CardTitle className="flex items-center justify-between text-blue-300">
            <div className="flex items-center">
              <div className="p-2 bg-blue-500/20 rounded-full border border-blue-400/30 mr-3">
                <Star className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="text-xl font-bold">VIP {t('status')}</div>
                <div className="text-blue-200/90 text-sm">{t('popular')}</div>
              </div>
            </div>
            <Badge className="bg-blue-500/30 text-blue-200 border-blue-400/50 px-3 py-1 text-lg font-semibold">
              $20 - 8 {t('month')}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3 mb-6">
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-3 rounded-lg border border-blue-400/30">
              <h4 className="text-blue-300 font-semibold mb-2">🎁 {t('vipBonusPackage')}</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center">
                  <span className="text-green-400 font-semibold">💰 +$10,000</span> {t('startingCapital')}
                </div>
                <div className="flex items-center">
                  <span className="text-purple-400 font-semibold">⚡ +2,500</span> {t('experience')}
                </div>
                <div className="flex items-center">
                  <span className="text-blue-400 font-semibold">🖥️ 30</span> {t('serverSlots')}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-blue-500 mr-2" />
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
                <Trophy className="w-4 h-4 text-blue-500 mr-2" />
                <span>{t('vipDailyBonus')}</span>
              </div>
            </div>
          </div>
          <div className="relative z-10">
            <PurchaseDialog 
              type="vip" 
              price="20"
              disabled={hasPremium || hasVip}
            >
              <Button 
                disabled={hasPremium || hasVip}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 relative z-10"
              >
                {hasPremium ? t('premiumBlocksVip') :
                 hasVip ? t('alreadyHavePremium') : t('purchaseVip') + ' - $20 8 ' + t('month')}
              </Button>
            </PurchaseDialog>
          </div>
        </CardContent>
      </Card>

      {/* Premium Package */}
      <Card className="border-2 border-purple-500/30 bg-gradient-to-br from-purple-600/20 to-purple-800/20 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 group relative overflow-visible">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-purple-500/5 opacity-50 -z-10"></div>
        <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 relative z-10">
          <CardTitle className="flex items-center justify-between text-purple-300">
            <div className="flex items-center">
              <div className="p-2 bg-purple-500/20 rounded-full border border-purple-400/30 mr-3">
                <Crown className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="text-xl font-bold">PREMIUM {t('status')}</div>
                <div className="text-purple-200/90 text-sm">{t('maximum')}</div>
              </div>
            </div>
            <Badge className="bg-purple-500/30 text-purple-200 border-purple-400/50 px-3 py-1 text-lg font-semibold">
              $25 {t('forever')}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3 mb-6">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-3 rounded-lg border border-purple-400/30">
              <h4 className="text-purple-300 font-semibold mb-2">🎁 {t('premiumBonusPackage')}</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center">
                  <span className="text-green-400 font-semibold">💰 +$50,000</span> {t('startingCapital')}
                </div>
                <div className="flex items-center">
                  <span className="text-purple-400 font-semibold">⚡ +5,000</span> {t('experience')}
                </div>
                <div className="flex items-center">
                  <span className="text-purple-400 font-semibold">🖥️ 35</span> {t('serverSlots')}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Crown className="w-4 h-4 text-purple-500 mr-2" />
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
                <Clock className="w-4 h-4 text-purple-500 mr-2" />
                <span>{t('premiumInstantServers')}</span>
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
          </div>
          <div className="relative z-10">
            <PurchaseDialog 
              type="premium" 
              price="25"
              disabled={hasVip || hasPremium}
            >
              <Button 
                disabled={hasVip || hasPremium}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 relative z-10"
              >
                {hasPremium ? t('alreadyHavePremium') :
                 hasVip ? t('vipBlocksPremium') : t('purchasePremium') + ' - $25 ' + t('forever')}
              </Button>
            </PurchaseDialog>
          </div>
        </CardContent>
      </Card>

      {/* Payment Document Information */}
      <Card className="border-2 border-slate-600/30 bg-slate-800/30">
        <CardHeader>
          <CardTitle className="flex items-center text-slate-300">
            <FileText className="w-5 h-5 mr-2" />
            {t('paymentDocument')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-300">
            {t('paymentDocumentDesc')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}