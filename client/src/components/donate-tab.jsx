import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Star, Crown, Zap, Shield, Coins, Gift, Check, X } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { useGame } from '@/contexts/game-context';
import { useToast } from '@/hooks/use-toast';

const DonateTab = () => {
  const { t } = useLanguage();
  const { user } = useGame();
  const { toast } = useToast();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [hoveredPackage, setHoveredPackage] = useState(null);

  const donatePackages = [
    {
      id: 'starter',
      title: t('donate1'),
      description: t('donate1Desc'),
      price: '$1.00',
      icon: Star,
      features: [
        t('feature1'),
        t('feature2'),
        t('feature3')
      ],
      popular: false
    },
    {
      id: 'premium',
      title: t('donate2'),
      description: t('donate2Desc'), 
      price: '$1.00',
      icon: Crown,
      features: [
        t('feature4'),
        t('feature5'),
        t('feature6')
      ],
      popular: true
    },
    {
      id: 'boost',
      title: t('donate3'),
      description: t('donate3Desc'),
      price: '$1.00',
      icon: Zap,
      features: [
        t('feature7'),
        t('feature8'),
        t('feature9')
      ],
      popular: false
    },
    {
      id: 'ultimate',
      title: t('donate4'),
      description: t('donate4Desc'),
      price: '$1.00',
      icon: Shield,
      features: [
        t('feature10'),
        t('feature11'),
        t('feature12')
      ],
      popular: false
    },
    {
      id: 'coins',
      title: t('donate5'),
      description: t('donate5Desc'),
      price: '$1.00',
      icon: Coins,
      features: [
        t('feature13'),
        t('feature14'),
        t('feature15')
      ],
      popular: false
    },
    {
      id: 'special',
      title: t('donate6'),
      description: t('donate6Desc'),
      price: '$1.00',
      icon: Gift,
      features: [
        t('feature16'),
        t('feature17'),
        t('feature18')
      ],
      popular: false
    }
  ];

  const handlePurchase = (packageItem) => {
    setSelectedPackage(packageItem);
  };

  const confirmPurchase = () => {
    toast({
      title: t('purchaseNotAvailable'),
      description: t('purchaseNotAvailableDesc'),
      variant: "destructive"
    });
    setSelectedPackage(null);
  };

  const closeDialog = () => {
    setSelectedPackage(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 bg-clip-text text-transparent mb-2">
          {t('donate')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {t('donateDesc')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {donatePackages.map((pkg) => {
          const IconComponent = pkg.icon;
          const isHovered = hoveredPackage === pkg.id;
          
          return (
            <Card
              key={pkg.id}
              className={`relative overflow-hidden cursor-pointer transition-all duration-500 group ${
                pkg.popular ? 'ring-2 ring-yellow-500 shadow-lg shadow-yellow-500/25' : ''
              } ${isHovered ? 'transform scale-105' : ''}`}
              onMouseEnter={() => setHoveredPackage(pkg.id)}
              onMouseLeave={() => setHoveredPackage(null)}
              onClick={() => handlePurchase(pkg)}
              data-testid={`donate-package-${pkg.id}`}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-r from-yellow-600/20 via-yellow-500/20 to-yellow-400/20 opacity-0 transition-opacity duration-500 ${
                isHovered ? 'opacity-100' : ''
              }`} />
              
              {/* Reverse gradient on mouse leave */}
              <div className={`absolute inset-0 bg-gradient-to-l from-yellow-600/10 via-yellow-500/10 to-yellow-400/10 opacity-0 transition-opacity duration-500 ${
                !isHovered && hoveredPackage !== null ? 'opacity-100' : ''
              }`} />

              {pkg.popular && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0">
                    {t('popular')}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between">
                  <IconComponent className={`w-8 h-8 transition-colors duration-300 ${
                    isHovered ? 'text-yellow-500' : 'text-yellow-600 dark:text-yellow-400'
                  }`} />
                  <div className="text-right">
                    <div className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent">
                      {pkg.price}
                    </div>
                  </div>
                </div>
                <CardTitle className="text-xl">{pkg.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="relative z-10 space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {pkg.description}
                </p>
                
                <div className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  className={`w-full transition-all duration-300 ${
                    pkg.popular 
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white border-0 shadow-lg shadow-yellow-500/25' 
                      : 'bg-gradient-to-r from-yellow-600/80 to-yellow-500/80 hover:from-yellow-600 hover:to-yellow-500 text-white border-0'
                  }`}
                  data-testid={`purchase-${pkg.id}`}
                >
                  <Coins className="w-4 h-4 mr-2" />
                  {t('purchase')}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Purchase Confirmation Dialog */}
      <Dialog open={selectedPackage !== null} onOpenChange={closeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                {selectedPackage && React.createElement(selectedPackage.icon, { 
                  className: "w-6 h-6 text-yellow-600" 
                })}
                {t('confirmPurchase')}
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeDialog}
                className="h-6 w-6 p-0"
                data-testid="close-purchase-dialog"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          {selectedPackage && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-lg font-semibold">{selectedPackage.title}</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent">
                  {selectedPackage.price}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {selectedPackage.description}
                </p>
              </div>

              <div className="space-y-2">
                <div className="font-medium text-sm">{t('included')}:</div>
                {selectedPackage.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <div className="text-sm text-center">
                  <div className="font-medium text-yellow-800 dark:text-yellow-200">
                    {t('paymentNotice')}
                  </div>
                  <div className="text-yellow-700 dark:text-yellow-300 mt-1">
                    {t('paymentNoticeDesc')}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={closeDialog}
                  className="flex-1"
                  data-testid="cancel-purchase"
                >
                  {t('cancel')}
                </Button>
                <Button
                  onClick={confirmPurchase}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white border-0"
                  data-testid="confirm-purchase"
                >
                  <Coins className="w-4 h-4 mr-2" />
                  {t('buyNow')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DonateTab;