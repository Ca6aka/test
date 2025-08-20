import { Badge } from '@/components/ui/badge';
import { Crown, Star } from 'lucide-react';

export default function SubscriptionBadge({ user, size = 'sm' }) {
  const hasVip = user?.vipExpires && new Date(user.vipExpires) > new Date();
  const hasPremium = user?.premiumActive;

  if (hasPremium) {
    return (
      <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold animate-pulse">
        <Star className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} mr-1`} />
        PREMIUM
      </Badge>
    );
  }

  if (hasVip) {
    return (
      <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold">
        <Crown className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} mr-1`} />
        VIP
      </Badge>
    );
  }

  return null;
}