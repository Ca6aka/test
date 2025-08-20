import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Star, Crown, CreditCard, Shield, Mail, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export default function PurchaseDialog({ type, price, children, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const purchaseMutation = useMutation({
    mutationFn: ({ type, email }) => apiRequest('/api/card-crypto-purchase', 'POST', { type, email }),
    onSuccess: (data) => {
      if (data.paymentUrl) {
        window.open(data.paymentUrl, '_blank');
        toast({
          title: 'Переход к оплате',
          description: `Ссылка для оплаты отправлена на ${email}. Откроется новая вкладка.`,
          duration: 8000,
        });
      }
      setIsOpen(false);
      setEmail('');
      // Reload user data after payment
      setTimeout(() => {
        queryClient.invalidateQueries(['/api/auth/me']);
      }, 3000);
    },
    onError: (error) => {
      toast({
        title: 'Ошибка создания платежа',
        description: error.message || 'Проверьте email и попробуйте снова',
        variant: 'destructive',
      });
    }
  });

  const handlePurchase = () => {
    if (!email || !email.includes('@')) {
      toast({
        title: 'Некорректный email',
        description: 'Введите действительный email адрес',
        variant: 'destructive',
      });
      return;
    }
    
    purchaseMutation.mutate({ type, email });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div onClick={() => !disabled && setIsOpen(true)}>
          {children}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === 'vip' ? (
              <>
                <Star className="w-5 h-5 text-blue-400" />
                VIP статус
              </>
            ) : (
              <>
                <Crown className="w-5 h-5 text-purple-400" />
                PREMIUM статус
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center p-4 bg-slate-800 rounded-lg">
            <div className="text-2xl font-bold text-green-400">${price}</div>
            <div className="text-sm text-slate-400">
              {type === 'vip' ? 'в месяц' : 'навсегда'}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email для подтверждения платежа
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your-email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-slate-400">
              На этот email будет отправлена ссылка для оплаты и подтверждение после успешного платежа
            </p>
          </div>

          <div className="bg-slate-800 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-blue-400" />
              <span className="font-medium">Оплата картой</span>
            </div>
            <p className="text-sm text-slate-400">
              Безопасная оплата банковской картой через криптовалютный шлюз. 
              Деньги с карты конвертируются в криптовалюту и поступают на наш кошелек.
            </p>
          </div>

          <Button 
            onClick={handlePurchase}
            disabled={purchaseMutation.isPending || !email}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {purchaseMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Создание платежа...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Оплатить ${price}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}