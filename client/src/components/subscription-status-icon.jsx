import { Crown, Star, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const SubscriptionStatusIcon = ({ 
  user, 
  size = 'md',
  showInProfile = false 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  
  if (!user) return null

  const hasPremium = user.premiumStatus === 'active'
  const hasVip = user.vipStatus === 'active' && user.vipExpiresAt && new Date(user.vipExpiresAt) > new Date()
  
  if (!hasPremium && !hasVip) return null

  const iconSize = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }[size]

  const getStatusInfo = () => {
    if (hasPremium) {
      return {
        icon: Crown,
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10 border-purple-500/20',
        title: 'PREMIUM',
        description: 'Навсегда активен',
        benefits: [
          'Фиолетовая отметка PREMIUM в чате',
          'Сокращенный КД: 1.5м/2м/5м вместо 3м/5м/7м',
          'x1.75 опыта за работу',
          'Приоритет в репортах',
          'Без КД на мини-игры',
          'Лимит серверов: 30 вместо 25',
          'Мгновенная активация серверов',
          'Премиум эмодзи для чата',
          'Секретные реакции на сообщения',
          'Ежедневный бонус: +500 вместо +100'
        ]
      }
    } else {
      return {
        icon: Star,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10 border-blue-500/20',
        title: 'VIP',
        description: user.vipExpiresAt ? `Истекает ${formatDistanceToNow(new Date(user.vipExpiresAt), { addSuffix: true })}` : 'Активен',
        benefits: [
          'Синяя отметка VIP в чате',
          'Сокращенный КД: 2м/4м/6м вместо 3м/5м/7м',
          'x1.5 опыта за работу',
          'Приоритет в репортах',
          'Уникальные эмодзи для чата',
          'Ежедневный бонус: +200 вместо +100'
        ]
      }
    }
  }

  const statusInfo = getStatusInfo()
  const IconComponent = statusInfo.icon

  if (showInProfile) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <motion.button
            className={`inline-flex items-center justify-center rounded-full p-1 ${statusInfo.bgColor} border cursor-pointer hover:scale-110 transition-transform`}
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <IconComponent className={`${iconSize} ${statusInfo.color}`} />
          </motion.button>
        </DialogTrigger>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <IconComponent className={`w-5 h-5 ${statusInfo.color}`} />
              {statusInfo.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold">
                  {user.nickname[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-white font-medium">{user.nickname}</h3>
                <p className="text-slate-400 text-sm">{statusInfo.description}</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-2">Привилегии:</h4>
              <div className="space-y-1">
                {statusInfo.benefits.map((benefit, index) => (
                  <div key={index} className="text-slate-300 text-sm flex items-center gap-2">
                    <div className={`w-1 h-1 rounded-full ${statusInfo.color.replace('text-', 'bg-')}`} />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
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
      <IconComponent className={`${iconSize} ${statusInfo.color}`} />
    </motion.div>
  )
}

export default SubscriptionStatusIcon