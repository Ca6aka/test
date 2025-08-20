import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Star, Crown, CreditCard, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export default function PurchaseDialog({ type, price, children, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState('fondy');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const purchaseMutation = useMutation({
    mutationFn: ({ type, gateway }) => apiRequest('/api/purchase', 'POST', { type, gateway }),
    onSuccess: (data) => {
      toast({
        title: 'Платеж инициирован',
        description: data.message || 'Ваш статус будет активирован через несколько секунд',
        duration: 5000,
      });
      setIsOpen(false);
      // Reload user data after a short delay
      setTimeout(() => {
        queryClient.invalidateQueries(['/api/auth/me']);
      }, 3000);
    },
    onError: (error) => {
      toast({
        title: 'Ошибка платежа',
        description: error.message || 'Произошла ошибка при обработке платежа',
        variant: 'destructive',
      });
    }
  });

  const handlePurchase = () => {
    purchaseMutation.mutate({ type, gateway: selectedGateway });
  };

  const getIcon = () => {
    return type === 'vip' ? <Star className="w-5 h-5" /> : <Crown className="w-5 h-5" />;
  };

  const getTitle = () => {
    return type === 'vip' ? 'Покупка VIP статуса' : 'Покупка Premium статуса';
  };

  const getDescription = () => {
    if (type === 'vip') {
      return 'VIP статус предоставляет синий значок в чате, сниженные кулдауны, бонус опыта 1.5x и удвоенный ежедневный бонус.';
    }
    return 'Premium статус предоставляет фиолетовый значок в чате, минимальные кулдауны, бонус опыта 1.75x, увеличенный ежедневный бонус в 5 раз и мгновенное строительство серверов.';
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
          <DialogTitle className="flex items-center space-x-2">
            {getIcon()}
            <span>{getTitle()}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {getDescription()}
          </div>
          
          <div className="flex justify-center">
            <Badge className={`${type === 'vip' ? 'bg-blue-600' : 'bg-purple-600'} text-white text-lg px-4 py-2`}>
              ${price} {type === 'vip' ? '/месяц' : 'навсегда'}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Выберите способ оплаты:</span>
            </div>
            
            <Select value={selectedGateway} onValueChange={setSelectedGateway}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fondy">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4" />
                    <span>Fondy (карты Visa/MasterCard)</span>
                  </div>
                </SelectItem>
                <SelectItem value="wayforpay">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4" />
                    <span>WayForPay (карты, PrivatBank)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button 
              onClick={handlePurchase}
              disabled={purchaseMutation.isPending}
              className={`flex-1 ${type === 'vip' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'}`}
            >
              {purchaseMutation.isPending ? 'Обработка...' : 'Оплатить'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}