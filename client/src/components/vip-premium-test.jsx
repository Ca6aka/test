import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Crown, TestTube } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export default function VipPremiumTest({ user }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const testPurchase = async (type) => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, gateway: 'fondy' })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message);
      }

      toast({
        title: 'Тест платежа запущен',
        description: data.message,
        duration: 5000,
      });

      // Обновить данные пользователя через 3 секунды
      setTimeout(() => {
        queryClient.invalidateQueries(['/api/auth/me']);
      }, 3000);

    } catch (error) {
      toast({
        title: 'Ошибка тестирования',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const hasVip = user?.vipStatus === 'active' && user?.vipExpiresAt && new Date(user.vipExpiresAt) > new Date();
  const hasPremium = user?.premiumStatus === 'active';

  return (
    <Card className="border-orange-500/30 bg-gradient-to-br from-orange-600/20 to-orange-800/20">
      <CardHeader>
        <CardTitle className="flex items-center text-orange-300">
          <TestTube className="w-5 h-5 mr-2" />
          Тестирование VIP/Premium
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Текущий статус:</span>
          <div className="flex gap-2">
            {hasVip && (
              <Badge className="bg-blue-600 text-white">
                <Star className="w-3 h-3 mr-1" />
                VIP
              </Badge>
            )}
            {hasPremium && (
              <Badge className="bg-purple-600 text-white">
                <Crown className="w-3 h-3 mr-1" />
                PREMIUM
              </Badge>
            )}
            {!hasVip && !hasPremium && (
              <Badge variant="outline">Обычный пользователь</Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={() => testPurchase('vip')}
            disabled={loading || hasVip || hasPremium}
            variant="outline"
            className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
          >
            <Star className="w-4 h-4 mr-2" />
            Тест VIP ($2.50)
          </Button>
          
          <Button 
            onClick={() => testPurchase('premium')}
            disabled={loading || hasPremium || hasVip}
            variant="outline" 
            className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
          >
            <Crown className="w-4 h-4 mr-2" />
            Тест Premium ($10)
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          Это демо-версия платежной системы с украинскими шлюзами Fondy и WayForPay.
          В реальной версии будут настоящие платежи.
        </div>
      </CardContent>
    </Card>
  );
}