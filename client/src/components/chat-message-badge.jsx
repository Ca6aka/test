import { Badge } from '@/components/ui/badge';
import { Crown, Star, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChatMessageBadge({ user }) {
  const hasVip = user?.vipExpires && new Date(user.vipExpires) > new Date();
  const hasPremium = user?.premiumActive;
  const isAdmin = user?.role === 'admin';
  const isSuperAdmin = user?.role === 'superadmin';
  
  // Priority: Super Admin > Admin > Premium > VIP
  if (isSuperAdmin) {
    return (
      <motion.div
        animate={{ 
          background: [
            'linear-gradient(45deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6, #ef4444)',
            'linear-gradient(45deg, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6, #ef4444, #f97316)',
            'linear-gradient(45deg, #eab308, #22c55e, #3b82f6, #8b5cf6, #ef4444, #f97316, #eab308)'
          ]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="px-2 py-0.5 rounded text-white text-xs font-bold shadow-lg"
      >
        <div className="flex items-center space-x-1">
          <Shield className="w-3 h-3" />
          <span>SUPER ADMIN</span>
        </div>
      </motion.div>
    );
  }
  
  if (isAdmin) {
    return (
      <Badge className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white text-xs font-bold">
        <Shield className="w-3 h-3 mr-1" />
        ADMIN
      </Badge>
    );
  }
  
  if (hasPremium) {
    return (
      <motion.div
        animate={{ 
          boxShadow: [
            '0 0 5px rgba(147, 51, 234, 0.5)',
            '0 0 15px rgba(147, 51, 234, 0.8)',
            '0 0 5px rgba(147, 51, 234, 0.5)'
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="px-2 py-0.5 rounded text-white text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600"
      >
        <div className="flex items-center space-x-1">
          <Crown className="w-3 h-3" />
          <span>PREMIUM</span>
        </div>
      </motion.div>
    );
  }
  
  if (hasVip) {
    return (
      <motion.div
        animate={{ 
          opacity: [1, 0.8, 1],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="px-2 py-0.5 rounded text-white text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-600"
      >
        <div className="flex items-center space-x-1">
          <Star className="w-3 h-3" />
          <span>VIP</span>
        </div>
      </motion.div>
    );
  }
  
  return null;
}