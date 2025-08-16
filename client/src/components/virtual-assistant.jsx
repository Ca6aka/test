import { useState, useEffect } from 'react'
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
  VolumeX
} from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { useGame } from '@/contexts/game-context'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

function VirtualAssistant() {
  const [input, setInput] = useState('')
  const [isVisible, setIsVisible] = useState(false) // По умолчанию закрыт
  const [muteUserId, setMuteUserId] = useState('')
  const [muteDuration, setMuteDuration] = useState('30')
  const isMobile = useIsMobile()
  const { gameState } = useGame()
  const user = gameState?.user
  const queryClient = useQueryClient()

  // Fetch chat messages
  const { data: chatData, refetch: refetchMessages } = useQuery({
    queryKey: ['/api/chat/messages'],
    refetchInterval: 3000 // Refresh every 3 seconds
  })

  const { data: rankings } = useQuery({
    queryKey: ['/api/rankings'],
    refetchInterval: 30000
  })

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message) => {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
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

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId) => {
      const response = await fetch(`/api/chat/message/${messageId}`, {
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
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    try {
      await sendMessageMutation.mutateAsync(input.trim())
      setInput('')
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessageMutation.mutateAsync(messageId)
    } catch (error) {
      console.error('Failed to delete message:', error)
    }
  }

  const handleMuteUser = async () => {
    if (!muteUserId || !muteDuration) return
    
    try {
      await muteUserMutation.mutateAsync({ userId: muteUserId, duration: muteDuration })
      setMuteUserId('')
      setMuteDuration('30')
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

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          className="rounded-full w-12 h-12 shadow-lg bg-blue-600 hover:bg-blue-700"
          data-testid="show-chat"
        >
          <MessageSquare className="w-6 h-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${isMobile ? 'w-[calc(100vw-2rem)]' : 'w-80'}`}>
      <Card className="shadow-xl border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              Общий чат
            </CardTitle>
            <div className="flex items-center gap-1">
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
                      <DialogTitle>Панель администратора</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Заглушить пользователя</label>
                        <div className="flex gap-2 mt-2">
                          <Select value={muteUserId} onValueChange={setMuteUserId}>
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Выберите пользователя" />
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
                            Мут
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Активные муты</label>
                        <div className="mt-2 space-y-1">
                          {rankings?.rankings
                            ?.filter(u => {
                              const status = getUserStatus(u.id)
                              return status?.isMuted
                            })
                            ?.map(u => (
                              <div key={u.id} className="flex items-center justify-between text-sm">
                                <span>{u.nickname}</span>
                                <Button
                                  onClick={() => handleUnmuteUser(u.id)}
                                  disabled={unmuteUserMutation.isPending}
                                  size="sm"
                                  variant="outline"
                                >
                                  Размут
                                </Button>
                              </div>
                            ))}
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
        <CardContent className="p-0">
          <div className={`${isMobile ? 'h-60' : 'h-80'} overflow-y-auto p-3 space-y-2`}>
            {chatData?.messages?.length === 0 ? (
              <div className="text-center text-gray-500 text-sm py-8">
                Нет сообщений. Начните общение!
              </div>
            ) : (
              chatData?.messages?.map((message) => {
                const userStatus = getUserStatus(message.userId)
                return (
                  <div key={message.id} className="group">
                    {message.deleted ? (
                      <div className="text-xs text-gray-400 italic">
                        Сообщение удалено {message.deletedBy && `администратором ${message.deletedBy}`}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{message.nickname}</span>
                            {userStatus?.admin >= 1 && (
                              <Shield className="w-3 h-3 text-blue-600" />
                            )}
                            {userStatus?.isMuted && (
                              <VolumeX className="w-3 h-3 text-red-600" />
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <span>{formatTime(message.timestamp)}</span>
                            {user?.admin >= 1 && (userStatus?.admin === 0 || user.nickname === 'Ca6aka') && (
                              <Button
                                onClick={() => handleDeleteMessage(message.id)}
                                size="sm"
                                variant="ghost"
                                className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
                                data-testid={`delete-message-${message.id}`}
                              >
                                <Trash2 className="w-3 h-3 text-red-600" />
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="text-sm bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                          {message.message}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
          
          {/* Admin Panel for money management */}
          {user?.admin >= 1 && rankings?.rankings && (
            <div className="border-t p-3 bg-gray-50 dark:bg-gray-900">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                Управление игроками
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
          
          <form onSubmit={handleSubmit} className="p-3 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Введите сообщение..."
                className="text-sm"
                maxLength={500}
                disabled={sendMessageMutation.isPending || user?.muted}
                data-testid="chat-input"
              />
              <Button 
                type="submit" 
                size="sm" 
                className="px-3" 
                disabled={sendMessageMutation.isPending || !input.trim() || user?.muted}
                data-testid="send-message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            {user?.muted && (
              <div className="text-xs text-red-600 mt-1">
                Вы заглушены и не можете отправлять сообщения
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default VirtualAssistant
