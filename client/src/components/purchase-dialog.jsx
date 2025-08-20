import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Crown, CreditCard, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export default function PurchaseDialog({ type, price, children, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const purchaseMutation = useMutation({
    mutationFn: ({ type }) => apiRequest('/api/card-crypto-purchase', 'POST', { type }),
    onSuccess: (data) => {
      if (data.paymentUrl) {
        window.open(data.paymentUrl, '_blank');
        toast({
          title: 'Переход к оплате',
          description: 'Откроется новая вкладка с формой оплаты. После оплаты вы сможете скачать PDF документ.',
          duration: 8000,
        });
      }
      setIsOpen(false);
      // Reload user data after payment
      setTimeout(() => {
        queryClient.invalidateQueries(['/api/auth/me']);
      }, 3000);
    },
    onError: (error) => {
      toast({
        title: 'Ошибка создания платежа',
        description: error.message || 'Попробуйте снова',
        variant: 'destructive',
      });
    },
  });

  const handlePurchase = () => {
    if (disabled) {
      toast({
        title: 'Недоступно',
        description: 'У вас уже есть активный статус',
        variant: 'destructive',
      });
      return;
    }
    
    purchaseMutation.mutate({ type });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div>
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

          <div className="bg-slate-800 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-green-400" />
              <span className="font-medium">Документ об оплате</span>
            </div>
            <p className="text-sm text-slate-400">
              После успешной оплаты вы сможете скачать PDF документ с подтверждением покупки и деталями заказа.
            </p>
          </div>

          <div className="bg-slate-800 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-blue-400" />
              <span className="font-medium">Оплата картой</span>
            </div>
            <p className="text-sm text-slate-400">
              Безопасная оплата через NOWPayments. 
              Выберите USD как валюту для оплаты картой Visa/Mastercard через Mercuryo.
            </p>
          </div>

          <Button 
            onClick={handlePurchase}
            disabled={purchaseMutation.isPending}
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