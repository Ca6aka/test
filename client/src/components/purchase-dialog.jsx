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
  const [selectedGateway, setSelectedGateway] = useState('crypto');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const purchaseMutation = useMutation({
    mutationFn: ({ type, gateway }) => apiRequest('/api/crypto-purchase', 'POST', { type, gateway }),
    onSuccess: (data) => {
      if (data.paymentUrl) {
        window.open(data.paymentUrl, '_blank');
        toast({
          title: 'Переход к оплате',
          description: 'Откроется новая вкладка для завершения платежа',
          duration: 5000,
        });
      } else if (data.cryptoAddresses) {
        // Show crypto addresses in a more user-friendly way
        const addressList = Object.entries(data.amounts)
          .map(([coin, amount]) => `${coin.toUpperCase()}: ${amount}`)
          .join(' | ');
        
        toast({
          title: 'Криптоадреса для оплаты',
          description: `Переведите: ${addressList}. Адреса скопированы в буфер обмена.`,
          duration: 15000,
        });
        
        // Copy addresses to clipboard
        const addressText = Object.entries(data.cryptoAddresses)
          .map(([coin, addr]) => `${coin.toUpperCase()}: ${addr}`)
          .join('\n');
        navigator.clipboard?.writeText(addressText);
      }
      setIsOpen(false);
      // Reload user data after payment completion
      setTimeout(() => {
        queryClient.invalidateQueries(['/api/auth/me']);
      }, 5000);
    },
    onError: (error) => {
      toast({
        title: 'Ошибка платежа',
        description: error.message || 'Произошла ошибка при создании платежа',
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
                <SelectItem value="crypto">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 3c-3.866 0-7 3.134-7 7s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7zm0 2c2.761 0 5 2.239 5 5s-2.239 5-5 5-5-2.239-5-5 2.239-5 5-5z"/>
                    </svg>
                    <span>Криптовалюты (BTC/ETH/USDT)</span>
                  </div>
                </SelectItem>
                <SelectItem value="card-to-crypto">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4" />
                    <span>Карта → Криптовалюта</span>
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