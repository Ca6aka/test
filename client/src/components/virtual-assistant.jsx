import React, { useState, useEffect, useRef } from 'react'
import { useLocation } from 'wouter'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  MessageSquare, 
  Send, 
  User,
  Plus,
  Minus,
  Shield,
  AlertTriangle,
  Eye,
  EyeOff,
  Trash2,
  Settings,
  Volume2,
  VolumeX,
  MessageCircleWarning,
  BotMessageSquare
} from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { useGame } from '@/contexts/game-context'
import { useLanguage } from '@/contexts/language-context'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ChatMessageBadge from '@/components/chat-message-badge'

function VirtualAssistant({ hideOnReports = false }) {
  const [input, setInput] = useState('')
  const [isVisible, setIsVisible] = useState(false) // Closed by default
  const [muteUserId, setMuteUserId] = useState('')
  const [muteDuration, setMuteDuration] = useState('30')
  const [showRules, setShowRules] = useState(false)
  const [chatLanguage, setChatLanguage] = useState('en')
  const [cooldownRemaining, setCooldownRemaining] = useState(0)
  const [hasNewMessages, setHasNewMessages] = useState(false)
  const [, setLocation] = useLocation()
  const isMobile = useIsMobile()
  const { gameState } = useGame()
  const { t, language } = useLanguage()
  const user = gameState?.user
  const queryClient = useQueryClient()
  
  // Auto-scroll to bottom of chat when new messages arrive
  const chatMessagesRef = useRef(null)

  // Fetch chat messages
  const { data: chatData, refetch: refetchMessages } = useQuery({
    queryKey: ['/api/chat/messages', chatLanguage],
    queryFn: () => fetch(`/api/chat/messages?language=${chatLanguage}`).then(res => res.json()),
    refetchInterval: 3000 // Refresh every 3 seconds
  })

  // Fetch pinned message
  const { data: pinnedData } = useQuery({
    queryKey: ['/api/chat/pinned', chatLanguage],
    queryFn: () => fetch(`/api/chat/pinned?language=${chatLanguage}`).then(res => res.json()),
    refetchInterval: 10000 // Check for pinned messages every 10 seconds
  })

  // Chat achievements are now integrated into main achievements tab
  // Remove separate chat achievements display
  
  useEffect(() => {
    if (chatMessagesRef.current && chatData?.messages?.length > 0) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight
    }
  }, [chatData?.messages, isVisible])

  const { data: rankings } = useQuery({
    queryKey: ['/api/rankings'],
    refetchInterval: 30000
  })

  // Cooldown timer effect
  useEffect(() => {
    if (cooldownRemaining > 0) {
      const timer = setTimeout(() => {
        setCooldownRemaining(prev => Math.max(0, prev - 1))
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldownRemaining])

  // Check for new messages
  useEffect(() => {
    if (chatData?.messages && user?.lastChatRead) {
      const newMessages = chatData.messages.filter(msg => 
        msg.timestamp > (user.lastChatRead || 0) && msg.userId !== user.id
      )
      setHasNewMessages(newMessages.length > 0)
      setNewMessagesCount(newMessages.length)
    }
  }, [chatData?.messages, user?.lastChatRead, user?.id])

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message) => {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, language: chatLanguage })
      })
      if (!response.ok) {
        const error = await response.json()
        if (response.status === 429) {
          setCooldownRemaining(error.cooldownRemaining || 5)
        }
        throw new Error(error.message)
      }
      return response.json()
    },
    onSuccess: () => {
      setInput('')
      refetchMessages()
      setCooldownRemaining(5) // 5 second cooldown
    }
  })

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId) => {
      const response = await fetch(`/api/chat/message/${messageId}?language=${chatLanguage}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }
      return response.json()
    },
    onSuccess: () => {
      refetchMessages()
    }
  })

  // Mute user mutation
  const muteUserMutation = useMutation({
    mutationFn: async ({ userId, duration }) => {
      const response = await fetch('/api/chat/mute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, duration: parseInt(duration) })
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rankings'] })
    }
  })

  // Unmute user mutation
  const unmuteUserMutation = useMutation({
    mutationFn: async (userId) => {
      const response = await fetch('/api/chat/unmute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rankings'] })
      queryClient.invalidateQueries({ queryKey: ['/api/chat/active-mutes'] })
    }
  })

  // Fetch active mutes for admin panel
  const { data: activeMutesData, refetch: refetchMutes } = useQuery({
    queryKey: ['/api/chat/active-mutes'],
    enabled: user?.admin >= 1,
    refetchInterval: 10000 // Refresh every 10 seconds
  })

  const adminMutation = useMutation({
    mutationFn: async ({ action, targetUserId, amount }) => {
      const response = await fetch('/api/admin/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, userId: targetUserId, amount })
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rankings'] })
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] })
    },
    onError: (error) => {
      console.error('Admin action failed:', error)
    }
  })

  // Pin message mutation
  const pinMessageMutation = useMutation({
    mutationFn: async (messageId) => {
      const response = await fetch(`/api/chat/message/${messageId}/pin`, {
        method: 'POST'
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }
      return response.json()
    },
    onSuccess: () => {
      refetchMessages()
      queryClient.invalidateQueries({ queryKey: ['/api/chat/pinned'] })
    }
  })

  // Mark chat as read mutation
  const markChatAsRead = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/chat/read', {
        method: 'POST'
      })
      return response.json()
    },
    onSuccess: () => {
      setHasNewMessages(false)
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] })
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || cooldownRemaining > 0) return

    try {
      await sendMessageMutation.mutateAsync(input.trim())
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleChatOpen = () => {
    setIsVisible(true)
    if (hasNewMessages) {
      markChatAsRead.mutate()
    }
  }

  const handleDoubleClick = (messageId) => {
    // Future: Add thumbs up reaction on double click
    console.log('Double clicked message:', messageId)
  }

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessageMutation.mutateAsync(messageId)
    } catch (error) {
      console.error('Failed to delete message:', error)
    }
  }

  const handleReaction = async (messageId, emoji) => {
    try {
      const response = await fetch(`/api/chat/message/${messageId}/react?language=${chatLanguage}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji })
      })
      if (response.ok) {
        refetchMessages()
      }
    } catch (error) {
      console.error('Failed to add reaction:', error)
    }
  }

  const handlePinMessage = async (messageId) => {
    try {
      const response = await fetch(`/api/chat/message/${messageId}/pin?language=${chatLanguage}`, {
        method: 'POST'
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }
      refetchMessages()
      queryClient.invalidateQueries({ queryKey: ['/api/chat/pinned'] })
    } catch (error) {
      console.error('Failed to pin/unpin message:', error)
    }
  }

  const handleMuteUser = async () => {
    if (!muteUserId || !muteDuration) return
    
    try {
      await muteUserMutation.mutateAsync({ userId: muteUserId, duration: muteDuration })
      setMuteUserId('')
      setMuteDuration('30')
      refetchMutes()
    } catch (error) {
      console.error('Failed to mute user:', error)
    }
  }

  const handleUnmuteUser = async (userId) => {
    try {
      await unmuteUserMutation.mutateAsync(userId)
    } catch (error) {
      console.error('Failed to unmute user:', error)
    }
  }

  const handleAdminAction = async (action, targetUserId, amount = null) => {
    try {
      await adminMutation.mutateAsync({ action, targetUserId, amount })
    } catch (error) {
      console.error('Admin action failed:', error)
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getUserStatus = (userId) => {
    const targetUser = rankings?.rankings?.find(u => u.id === userId)
    if (!targetUser) return null
    
    const isMuted = targetUser.muted && targetUser.muteExpires && Date.now() < targetUser.muteExpires
    return {
      ...targetUser,
      isMuted
    }
  }

  // Hide chat if on reports tab and on mobile
  if (hideOnReports && isMobile) {
    return null;
  }

  if (!isVisible) {
    return (
      <div className={`fixed right-4 bottom-4 z-40`}>
        <div className="relative">
          <Button
            onClick={handleChatOpen}
            className="rounded-full w-15 h-14 shadow-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
                       bg-[length:200%_200%] animate-gradient-xy"
            data-testid="show-chat"
          >
            <MessageSquare className="w-6 h-6 text-white" />
            {hasNewMessages && newMessagesCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] h-5 flex items-center justify-center animate-pulse border-2 border-white">
                {newMessagesCount}
              </div>
            )}
          </Button>
        </div>
      </div>
    )
  }  

  return (
    <div className={`fixed z-40 ${isMobile ? 'w-72 h-[28rem] bottom-4 right-4' : 'w-80 bottom-4 right-4'}`}>
      <Card className="shadow-xl border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              {t('generalChat')}
            </CardTitle>
            <div className="flex items-center gap-1">
              {/* Chat Language Selector */}
              <Select value={chatLanguage} onValueChange={(value) => {
                setChatLanguage(value)
                refetchMessages()
              }}>
                <SelectTrigger className="w-14 h-6 p-1 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">EN</SelectItem>
                  <SelectItem value="ru">RU</SelectItem>
                  <SelectItem value="ua">UA</SelectItem>
                  <SelectItem value="de">DE</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Rules Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRules(!showRules)}
                className="h-6 w-6 p-0"
                title={t('chatRules')}
              >
                <MessageCircleWarning className="w-4 h-4" />
              </Button>
              {user?.admin >= 1 && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      data-testid="admin-settings"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>{t('adminPanel')}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">{t('muteUser')}</label>
                        <div className="flex gap-2 mt-2">
                          <Select value={muteUserId} onValueChange={setMuteUserId}>
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder={t('selectUser')} />
                            </SelectTrigger>
                            <SelectContent>
                              {rankings?.rankings
                                ?.filter(u => u.id !== user.id && (!u.admin || user.nickname === 'Ca6aka'))
                                ?.map(u => (
                                  <SelectItem key={u.id} value={u.id}>
                                    {u.nickname} {u.admin >= 1 ? '(Admin)' : ''}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <Select value={muteDuration} onValueChange={setMuteDuration}>
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">5м</SelectItem>
                              <SelectItem value="30">30м</SelectItem>
                              <SelectItem value="60">1ч</SelectItem>
                              <SelectItem value="1440">1д</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            onClick={handleMuteUser}
                            disabled={!muteUserId || muteUserMutation.isPending}
                            size="sm"
                          >
                            {t('mute')}
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">{t('activeMutes')}</label>
                        <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                          {activeMutesData?.mutes?.length === 0 ? (
                            <div className="text-xs text-gray-500 text-center py-2">
                              {t('noActiveMutes')}
                            </div>
                          ) : (
                            activeMutesData?.mutes?.map(mute => (
                              <div key={mute.id} className="flex items-center justify-between text-xs bg-gray-100 dark:bg-gray-800 rounded p-2">
                                <div>
                                  <div className="font-medium">{mute.nickname}</div>
                                  <div className="text-gray-500">
                                    {mute.timeLeft}м осталось
                                  </div>
                                </div>
                                <Button
                                  onClick={() => handleUnmuteUser(mute.id)}
                                  disabled={unmuteUserMutation.isPending}
                                  size="sm"
                                  variant="outline"
                                  className="h-6 px-2"
                                >
                                  {t('unmute')}
                                </Button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="h-6 w-6 p-0"
                data-testid="hide-chat"
              >
                <EyeOff className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {/* Chat Rules */}
        {showRules && (
          <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border-b">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-medium text-slate-700 dark:text-slate-300">{t('chatRules')}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRules(false)}
                className="h-4 w-4 p-0"
              >
                <MessageCircleWarning className="w-3 h-3" />
              </Button>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <div>• {t('chatRule1')}</div>
              <div>• {t('chatRule2')}</div>
              <div>• {t('chatRule3')}</div>
              <div>• {t('chatRule4')}</div>
              <div>• {t('chatRule5')}</div>
            </div>
          </div>
        )}
        
        <CardContent className="p-0">
          {/* Pinned message */}
          {pinnedData?.pinnedMessage && (
            <div className="border-b bg-yellow-50 dark:bg-yellow-900/20 p-2">
              <div className="flex items-start gap-2">
                <span className="text-yellow-600 text-xs">📌</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-yellow-700 dark:text-yellow-300 font-medium">
                    Pinned by {pinnedData.pinnedMessage.pinnedBy}
                  </div>
                  <div className="text-sm text-yellow-800 dark:text-yellow-200 break-words">
                    <strong>{pinnedData.pinnedMessage.nickname}:</strong> {pinnedData.pinnedMessage.message}
                  </div>
                </div>
                {user?.admin >= 2 && (
                  <button
                    onClick={() => handlePinMessage(pinnedData.pinnedMessage.id)}
                    className="text-yellow-600 hover:text-yellow-800 transition-colors p-1"
                    title="Unpin message"
                  >
                    <MessageCircleWarning className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}
          
          <div ref={chatMessagesRef} className={`${showRules ? (isMobile ? 'h-56' : 'h-64') : (isMobile ? 'h-72' : 'h-80')} ${pinnedData?.pinnedMessage ? 'h-56' : ''} overflow-y-auto p-3 space-y-2`}>
            {chatData?.messages?.length === 0 ? (
              <div className="text-center text-gray-500 text-sm py-8">
                {t('noMessages')}
              </div>
            ) : (
              chatData?.messages?.map((message) => {
                const userStatus = getUserStatus(message.userId)
                return (
                  <div key={message.id} className="group">
                    {message.deleted ? (
                      <div className="text-xs text-slate-500 italic py-1 px-2 bg-slate-800/30 rounded">
                        {t('messageDeletedBy')?.replace('{admin}', message.deletedBy) || `Message deleted by ${message.deletedBy}`}
                      </div>
                    ) : message.isSystem || message.isWarning ? (
                      <div className="flex items-start space-x-2 p-2">
                        <BotMessageSquare className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-slate-400 italic py-1 px-2 bg-slate-800/20 rounded flex-1">
                          {message.message}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-2">
                            {message.isSystem || message.nickname === 'System' ? (
                              <span className="font-medium text-cyan-400">
                                {message.nickname}
                              </span>
                            ) : (
                              <button
                                onClick={() => setLocation(`/player/${message.nickname}`)}
                                className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors"
                                data-testid={`link-profile-${message.nickname}`}
                              >
                                {message.nickname}
                              </button>
                            )}
                            {message.nickname === 'Ca6aka' && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white border border-red-500/50 animate-pulse shadow-lg shadow-red-500/20">
                                ADMIN
                              </span>
                            )}
                            {message.adminLevel === 1 && message.nickname !== 'Ca6aka' && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white border border-yellow-500/50 shadow-lg shadow-yellow-500/20">
                                ADMIN
                              </span>
                            )}
                            <ChatMessageBadge user={message} />
                            {userStatus?.isMuted && (
                              <VolumeX className="w-3 h-3 text-red-600" />
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <span>{formatTime(message.timestamp)}</span>
                          </div>
                        </div>
                        <div className="text-sm bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 relative group">
                          <div className="break-words" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                            {message.message}
                          </div>
                          {message.filtered && (
                            <div className="text-xs text-yellow-600 mt-1 italic">
                              ⚠️ {language === 'ru' ? 'Сообщение было автоматически отфильтровано' :
                                  language === 'uk' ? 'Повідомлення було автоматично відфільтровано' :
                                  language === 'de' ? 'Nachricht wurde automatisch gefiltert' :
                                  'Message was automatically filtered'}
                            </div>
                          )}
                          
                          {/* Reactions Display */}
                          {message.reactions && Object.keys(message.reactions).length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {Object.entries(message.reactions).map(([emoji, users]) => (
                                <button
                                  key={emoji}
                                  onClick={() => handleReaction(message.id, emoji)}
                                  className={`px-2 py-1 rounded-full text-xs transition-colors ${
                                    users.includes(user?.id) 
                                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50' 
                                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                                  }`}
                                >
                                  {emoji} {users.length}
                                </button>
                              ))}
                            </div>
                          )}
                          
                          {/* Message Controls - Visible on hover */}
                          <div className="absolute right-2 top-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800/80 rounded px-1">
                            {/* Reaction Button for all users */}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 text-slate-400 hover:text-slate-300"
                                >
                                  😊
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-slate-800 border-slate-700 max-w-xs">
                                <DialogHeader>
                                  <DialogTitle className="text-white text-sm">{t('addReaction') || 'Add Reaction'}</DialogTitle>
                                </DialogHeader>
                                <div className="grid grid-cols-3 gap-2">
                                  {/* Basic emojis - available to all users */}
                                  <Button
                                    onClick={() => {
                                      handleReaction(message.id, '👍')
                                      document.querySelector('[data-state="open"]')?.click()
                                    }}
                                    className="text-2xl p-2 bg-slate-700 hover:bg-slate-600"
                                  >
                                    👍
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      handleReaction(message.id, '👎')
                                      document.querySelector('[data-state="open"]')?.click()
                                    }}
                                    className="text-2xl p-2 bg-slate-700 hover:bg-slate-600"
                                  >
                                    👎
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      handleReaction(message.id, '❤️')
                                      document.querySelector('[data-state="open"]')?.click()
                                    }}
                                    className="text-2xl p-2 bg-slate-700 hover:bg-slate-600"
                                  >
                                    ❤️
                                  </Button>
                                  
                                  {/* VIP/Premium exclusive emojis */}
                                  {(user?.vipStatus === 'active' || user?.premiumStatus === 'active') && (
                                    <>
                                      <Button
                                        onClick={() => {
                                          handleReaction(message.id, '⭐')
                                          document.querySelector('[data-state="open"]')?.click()
                                        }}
                                        className="text-2xl p-2 bg-blue-700/30 hover:bg-blue-600/50 border border-blue-500/30"
                                        title="VIP Star"
                                      >
                                        ⭐
                                      </Button>
                                      <Button
                                        onClick={() => {
                                          handleReaction(message.id, '💎')
                                          document.querySelector('[data-state="open"]')?.click()
                                        }}
                                        className="text-2xl p-2 bg-blue-700/30 hover:bg-blue-600/50 border border-blue-500/30"
                                        title="VIP Diamond"
                                      >
                                        💎
                                      </Button>
                                      <Button
                                        onClick={() => {
                                          handleReaction(message.id, '🔥')
                                          document.querySelector('[data-state="open"]')?.click()
                                        }}
                                        className="text-2xl p-2 bg-blue-700/30 hover:bg-blue-600/50 border border-blue-500/30"
                                        title="VIP Fire"
                                      >
                                        🔥
                                      </Button>
                                    </>
                                  )}
                                  
                                  {/* Premium exclusive emojis */}
                                  {user?.premiumStatus === 'active' && (
                                    <>
                                      <Button
                                        onClick={() => {
                                          handleReaction(message.id, '👑')
                                          document.querySelector('[data-state="open"]')?.click()
                                        }}
                                        className="text-2xl p-2 bg-purple-700/30 hover:bg-purple-600/50 border border-purple-500/30"
                                        title="Premium Crown"
                                      >
                                        👑
                                      </Button>
                                      <Button
                                        onClick={() => {
                                          handleReaction(message.id, '🌟')
                                          document.querySelector('[data-state="open"]')?.click()
                                        }}
                                        className="text-2xl p-2 bg-purple-700/30 hover:bg-purple-600/50 border border-purple-500/30"
                                        title="Premium Star"
                                      >
                                        🌟
                                      </Button>
                                      <Button
                                        onClick={() => {
                                          handleReaction(message.id, '✨')
                                          document.querySelector('[data-state="open"]')?.click()
                                        }}
                                        className="text-2xl p-2 bg-purple-700/30 hover:bg-purple-600/50 border border-purple-500/30"
                                        title="Premium Sparkle"
                                      >
                                        ✨
                                      </Button>
                                    </>
                                  )}
                                  
                                  {/* Admin-only reactions - only visible to admins */}
                                  {user?.admin >= 1 && (
                                    <>
                                      <Button
                                        onClick={() => {
                                          handleReaction(message.id, '🛡️')
                                          document.querySelector('[data-state="open"]')?.click()
                                        }}
                                        className="text-2xl p-2 bg-yellow-700/30 hover:bg-yellow-600/50 border border-yellow-500/30"
                                        title="Admin Shield (Admins Only)"
                                      >
                                        🛡️
                                      </Button>
                                      <Button
                                        onClick={() => {
                                          handleReaction(message.id, '⚡')
                                          document.querySelector('[data-state="open"]')?.click()
                                        }}
                                        className="text-2xl p-2 bg-yellow-700/30 hover:bg-yellow-600/50 border border-yellow-500/30"
                                        title="Admin Power (Admins Only)"
                                      >
                                        ⚡
                                      </Button>
                                      <Button
                                        onClick={() => {
                                          handleReaction(message.id, '⚔️')
                                          document.querySelector('[data-state="open"]')?.click()
                                        }}
                                        className="text-2xl p-2 bg-red-700/30 hover:bg-red-600/50 border border-red-500/30"
                                        title="Super Admin (Admins Only)"
                                      >
                                        ⚔️
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            {/* Admin Controls */}
                            {user?.admin >= 1 && (
                              <>
                                {user?.admin >= 2 && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                                    onClick={() => handlePinMessage(message.id)}
                                    title={t('pinMessage') || 'Pin Message'}
                                  >
                                    📌
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                                  onClick={() => handleDeleteMessage(message.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
          
          {/* Admin Panel for money management - Only for super admin */}
          {false && user?.nickname === 'Ca6aka' && rankings?.rankings && (
            <div className="border-t p-3 bg-gray-50 dark:bg-gray-900">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                {t('playerManagement')}
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {rankings.rankings
                  .filter(u => u.id !== user.id)
                  .map(targetUser => (
                  <div key={targetUser.id} className="flex items-center gap-1 text-xs">
                    <span className="flex-1 truncate">{targetUser.nickname}</span>
                    <div className="flex items-center gap-1">
                      {targetUser.admin >= 1 ? (
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          <Shield className="w-3 h-3" />
                        </Badge>
                      ) : null}
                      
                      {user.nickname === 'Ca6aka' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAdminAction('addMoney', targetUser.id, 1000)}
                            className="h-6 w-6 p-0"
                            disabled={adminMutation.isPending}
                            data-testid={`add-money-${targetUser.id}`}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAdminAction('removeMoney', targetUser.id, 1000)}
                            className="h-6 w-6 p-0"
                            disabled={adminMutation.isPending}
                            data-testid={`remove-money-${targetUser.id}`}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                      
                      {(user.nickname === 'Ca6aka' || targetUser.admin === 0) && (
                        <Button
                          size="sm"
                          variant={targetUser.banned ? "default" : "destructive"}
                          onClick={() => handleAdminAction(targetUser.banned ? 'unbanUser' : 'banUser', targetUser.id)}
                          className="h-6 w-8 p-0 text-xs"
                          disabled={adminMutation.isPending}
                          data-testid={`${targetUser.banned ? 'unban' : 'ban'}-${targetUser.id}`}
                        >
                          {targetUser.banned ? 'ON' : 'BAN'}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={cooldownRemaining > 0 ? `Wait ${cooldownRemaining}s...` : (user?.muted ? t('youAreMuted') : t('typeMessage'))}
                className="flex-1 text-sm pr-16"
                disabled={sendMessageMutation.isPending || user?.muted || cooldownRemaining > 0}
                maxLength={200}
                style={{ 
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                {input.length}/200
              </div>
            </div>
            <Button
              type="submit"
              size="sm"
              disabled={sendMessageMutation.isPending || !input.trim() || user?.muted || cooldownRemaining > 0}
              className={cooldownRemaining > 0 ? 'opacity-50' : ''}
            >
              {cooldownRemaining > 0 ? cooldownRemaining : <Send className="w-4 h-4" />}
            </Button>
          </form>
          
          {/* Chat achievements moved to main achievements tab */}
        </CardContent>
      </Card>
    </div>
  )
}

export default VirtualAssistant
