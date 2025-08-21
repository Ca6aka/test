import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Crown, CreditCard, FileText, Loader2, Coins } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useLanguage } from '@/contexts/language-context';

// Список доступных криптовалют с названиями
const cryptocurrencies = [
  { code: 'usdttrc20', name: 'USDT (TRC20)', description: 'Tether USD on Tron' },
  { code: 'usdterc20', name: 'USDT (ERC20)', description: 'Tether USD on Ethereum' },
  { code: 'usdc', name: 'USDC', description: 'USD Coin' },
  { code: 'ltc', name: 'Litecoin (LTC)', description: 'Litecoin' },
  { code: 'trx', name: 'Tron (TRX)', description: 'Tron' },
  { code: 'btc', name: 'Bitcoin (BTC)', description: 'Bitcoin' },
  { code: 'eth', name: 'Ethereum (ETH)', description: 'Ethereum' },
];

export default function PurchaseDialog({ type, price, children, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState('usdttrc20'); // По умолчанию USDT TRC20
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const purchaseMutation = useMutation({
    mutationFn: ({ type, crypto }) => apiRequest('/api/card-crypto-purchase', 'POST', { type, crypto }),
    onSuccess: (data) => {
      if (data.paymentUrl) {
        window.open(data.paymentUrl, '_blank');
        toast({
          title: t('paymentInitiated'),
          description: t('redirectedToPayment'),
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

  const fiatPurchaseMutation = useMutation({
    mutationFn: ({ type }) => apiRequest('/api/donate/fiat', 'POST', { type }),
    onSuccess: (data) => {
      if (data.paymentUrl) {
        window.open(data.paymentUrl, '_blank');
        toast({
          title: 'Переход к оплате',
          description: 'На странице оплаты выберите USD, затем оплачивайте картой. Ваши доллары конвертируются в крипту автоматически.',
          duration: 10000,
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
        title: 'Ошибка создания fiat-платежа',
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
    
    purchaseMutation.mutate({ type, crypto: selectedCrypto });
  };

  const handleFiatPurchase = () => {
    if (disabled) {
      toast({
        title: 'Недоступно',
        description: 'У вас уже есть активный статус',
        variant: 'destructive',
      });
      return;
    }
    fiatPurchaseMutation.mutate({ type });
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
                VIP {t('status')}
              </>
            ) : (
              <>
                <Crown className="w-5 h-5 text-purple-400" />
                PREMIUM {t('status')}
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center p-4 bg-slate-800 rounded-lg">
            <div className="text-2xl font-bold text-green-400">${price}</div>
            <div className="text-sm text-slate-400">
              {type === 'vip' ? `8 ${t('months')}` : t('forever')}
            </div>
          </div>

          <div className="bg-slate-800 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-green-400" />
              <span className="font-medium">{t('paymentDocument')}</span>
            </div>
            <p className="text-sm text-slate-400">
              {t('paymentDocumentDesc')}
            </p>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-500/30 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-yellow-400" />
              <span className="font-medium text-yellow-300">{t('unavailableCardPayment')}</span>
            </div>
            <p className="text-sm text-yellow-200">
              {t('cardPaymentUnavailable')}
            </p>
            <p className="text-xs text-yellow-300 mt-2">
              {t('useStablecoins')}
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              disabled={true}
              className="w-full bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              {t('unavailableCardPayment')} ${price} USD
            </Button>

            {/* Crypto Currency Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('selectCurrency')}</label>
              <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('selectCurrency')} />
                </SelectTrigger>
                <SelectContent>
                  {cryptocurrencies.map((crypto) => (
                    <SelectItem key={crypto.code} value={crypto.code}>
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4" />
                        <div>
                          <div className="font-medium">{crypto.name}</div>
                          <div className="text-xs text-muted-foreground">{crypto.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handlePurchase}
              disabled={purchaseMutation.isPending}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {purchaseMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('processing')}
                </>
              ) : (
                <>
                  <Coins className="w-4 h-4 mr-2" />
                  {t('payWithCrypto')} ${price}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}