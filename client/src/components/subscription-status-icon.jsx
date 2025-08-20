import { Crown, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/contexts/language-context';
import { Badge } from '@/components/ui/badge';

export default function SubscriptionStatusIcon({ user, size = 'sm' }) {
  const { t } = useLanguage();
  
  const hasVip = user?.vipExpires && new Date(user.vipExpires) > new Date();
  const hasPremium = user?.premiumActive;
  
  if (!hasVip && !hasPremium) return null;
  
  const getTimeRemaining = () => {
    if (hasPremium) return t('forever');
    if (hasVip) {
      const expires = new Date(user.vipExpires);
      const now = new Date();
      const diff = expires - now;
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return `${days} ${t('daysLeft')}`;
    }
    return '';
  };
  
  const iconSize = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
  
  if (hasPremium) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              className="inline-flex items-center cursor-pointer"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Crown className={`${iconSize} text-purple-500`} />
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-center">
              <Badge className="bg-purple-600 text-white mb-2">PREMIUM</Badge>
              <div className="text-xs">
                <div>{t('premiumBenefits')}:</div>
                <div>• {t('premiumCooldownReduction')}</div>
                <div>• {t('premiumExperienceBonus')}</div>
                <div>• {t('premiumServerLimit')}</div>
                <div>• {t('premiumInstantServers')}</div>
                <div className="mt-1 font-semibold">{getTimeRemaining()}</div>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  if (hasVip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              className="inline-flex items-center cursor-pointer"
              animate={{ 
                opacity: [1, 0.7, 1],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Star className={`${iconSize} text-blue-500`} />
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-center">
              <Badge className="bg-blue-600 text-white mb-2">VIP</Badge>
              <div className="text-xs">
                <div>{t('vipBenefits')}:</div>
                <div>• {t('vipCooldownReduction')}</div>
                <div>• {t('vipExperienceBonus')}</div>
                <div>• {t('vipPriorityReports')}</div>
                <div>• {t('vipUniqueEmojis')}</div>
                <div className="mt-1 font-semibold">{getTimeRemaining()}</div>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return null;
}