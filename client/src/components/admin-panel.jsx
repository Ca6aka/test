import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/language-context';
import { Settings, Crown, Users, Shield, Wallet, Mail } from 'lucide-react';

const apiRequest = async (url, options = {}) => {
  const response = await fetch(url, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
};

export const AdminPanel = ({ user, isOpen: externalIsOpen, onOpenChange }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [action, setAction] = useState('');
  const [amount, setAmount] = useState('');
  
  // VIP/Premium management
  const [subscriptionUser, setSubscriptionUser] = useState('');
  const [subscriptionType, setSubscriptionType] = useState('vip');
  const [subscriptionAction, setSubscriptionAction] = useState('grant');
  const [subscriptionDays, setSubscriptionDays] = useState('');

  // Payment settings
  const [nowPaymentsKey, setNowPaymentsKey] = useState('');
  const [gameEmail, setGameEmail] = useState('');
  const [adminEmail, setAdminEmail] = useState('');

  // Use external control if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = onOpenChange || setInternalIsOpen;

  const isSuperAdmin = user.nickname === 'Ca6aka';

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/api/admin/users');
      setUsers(data.users);
    } catch (error) {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionAction = async () => {
    if (!subscriptionUser || !subscriptionAction) {
      toast({
        title: t('error'),
        description: 'Выберите пользователя и действие',
        variant: 'destructive'
      });
      return;
    }

    if (subscriptionAction === 'grant' && !subscriptionDays) {
      toast({
        title: t('error'),
        description: 'Укажите количество дней',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);
      await apiRequest('/api/admin/subscription', {
        method: 'POST',
        body: JSON.stringify({
          action: subscriptionAction === 'grant' ? `give${subscriptionType.charAt(0).toUpperCase() + subscriptionType.slice(1)}` : 'removeSubscription',
          targetNickname: subscriptionUser,
          days: subscriptionAction === 'grant' ? parseInt(subscriptionDays) : undefined
        })
      });

      toast({
        title: t('success'),
        description: `${subscriptionAction === 'grant' ? 'Выдан' : 'Отобран'} ${subscriptionType.toUpperCase()} статус для ${subscriptionUser}`,
      });

      // Reset form
      setSubscriptionUser('');
      setSubscriptionDays('');
      fetchUsers();
    } catch (error) {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdminAction = async () => {
    if (!selectedUser || !action) {
      toast({
        title: t('error'),
        description: t('pleaseSelectUserAndAction'),
        variant: 'destructive'
      });
      return;
    }

    // Check if amount is required for money actions
    if ((action === 'addMoney' || action === 'removeMoney') && (!amount || amount <= 0)) {
      toast({
        title: t('error'),
        description: t('pleaseEnterValidAmount'),
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);
      await apiRequest('/api/admin/manage', {
        method: 'POST',
        body: JSON.stringify({
          userId: selectedUser,
          action: action,
          amount: action === 'addMoney' || action === 'removeMoney' ? parseInt(amount) : undefined
        })
      });

      toast({
        title: t('success'),
        description: t('actionSuccessfullyCompleted').replace('{action}', action)
      });

      fetchUsers();
      setSelectedUser('');
      setAction('');
      setAmount('');
    } catch (error) {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  if (user.admin < 1) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {externalIsOpen === undefined && (
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-purple-600/20 hover:bg-purple-600/30 border-purple-500/50 text-purple-200"
            data-testid="button-admin-panel"
          >
            {isSuperAdmin ? (
              <>
                <Crown className="w-4 h-4 mr-1" />
                {t('superAdminPanel')}
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-1" />
                {t('adminPanel')}
              </>
            )}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-4xl bg-slate-900 text-slate-100 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {isSuperAdmin ? <Crown className="w-5 h-5 text-yellow-400" /> : <Shield className="w-5 h-5 text-purple-400" />}
            <span>{isSuperAdmin ? t('superAdminPanel') : t('adminPanel')}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Admin Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-400">{t('totalUsers')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-100">
                  {users.length}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-400">{t('onlineUsers')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">
                  {users.filter(u => u.isOnline).length}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-400">{t('totalAdmins')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400">
                  {users.filter(u => u.admin > 0).length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Admin Controls */}
          {(user.admin >= 1) && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>{isSuperAdmin ? t('adminManagement') : t('playerManagement')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('selectUser')}</Label>
                    <Select value={selectedUser} onValueChange={setSelectedUser}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('chooseUser')} />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.nickname} 
                            {user.admin > 0 && <Badge className="ml-2 text-xs">Admin</Badge>}
                            <span className={`ml-2 w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-400' : 'bg-red-400'}`} />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('action')}</Label>
                    <Select value={action} onValueChange={setAction}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('chooseAction')} />
                      </SelectTrigger>
                      <SelectContent>
                        {(() => {
                          const selectedUserData = users.find(u => u.id === selectedUser);
                          const isSelf = selectedUserData?.nickname === user.nickname;
                          
                          return (
                            <>
                              <SelectItem value="giveAdmin" disabled={isSelf || !isSuperAdmin}>
                                {t('giveAdmin')}
                              </SelectItem>
                              <SelectItem value="removeAdmin" disabled={isSelf || !isSuperAdmin}>
                                {t('removeAdmin')}
                              </SelectItem>
                              <SelectItem 
                                value="banUser" 
                                disabled={isSelf}
                                onClick={async () => {
                                  try {
                                    const res = await fetch('/api/admin/manage', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ action: 'banUser', userId: targetUser.id })
                                    });
                                    const data = await res.json();

                                    alert(data.message);

                                    if (targetUser.id === gameState.user?.id && data.banned) {
                                      // Очистка состояния пользователя
                                      setGameState(prev => ({ ...prev, user: null }));
                                      
                                      // Перенаправление на страницу регистрации
                                      window.location.href = '/reg';
                                    }                                    
                                  } catch (err) {
                                    console.error(err);
                                    alert('Failed to execute admin action');
                                  }
                                }}
                              >
                                {t('banUser')}
                              </SelectItem>
                              <SelectItem value="unbanUser" disabled={isSelf}>
                                {t('unbanUser')}
                              </SelectItem>
                              <SelectItem value="addMoney" disabled={!isSuperAdmin}>
                                {t('giveMoney')}
                              </SelectItem>
                              <SelectItem value="removeMoney" disabled={!isSuperAdmin}>
                                {t('takeMoney')}
                              </SelectItem>
                              <SelectItem value="deleteUser" disabled={!isSuperAdmin}>
                              {t('deleteUser')}
                            </SelectItem>

                            </>
                          );
                        })()}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {(action === 'addMoney' || action === 'removeMoney') && (
                  <div className="space-y-2">
                    <Label>{t('amount')}</Label>
                    <Input
                      type="number"
                      placeholder={t('enterAmount')}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="1"
                      data-testid="input-amount"
                    />
                  </div>
                )}
                <Button 
                  onClick={handleAdminAction}
                  disabled={loading || !selectedUser || !action}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {loading ? t('loading') : t('executeAction')}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* VIP/Premium Management - Only for Super Admin */}
          {isSuperAdmin && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <span>Управление VIP/Premium</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Пользователь</Label>
                    <Select value={subscriptionUser} onValueChange={setSubscriptionUser}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите пользователя" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map(user => (
                          <SelectItem key={user.id} value={user.nickname}>
                            {user.nickname}
                            {user.vipStatus === 'active' && <Badge className="ml-2 text-xs bg-blue-600">VIP</Badge>}
                            {user.premiumStatus === 'active' && <Badge className="ml-2 text-xs bg-purple-600">PREMIUM</Badge>}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Тип статуса</Label>
                    <Select value={subscriptionType} onValueChange={setSubscriptionType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vip">VIP</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Действие</Label>
                    <Select value={subscriptionAction} onValueChange={setSubscriptionAction}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grant">Выдать</SelectItem>
                        <SelectItem value="remove">Отобрать</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {subscriptionAction === 'grant' && (
                  <div className="space-y-2">
                    <Label>Количество дней</Label>
                    <Input
                      type="number"
                      value={subscriptionDays}
                      onChange={(e) => setSubscriptionDays(e.target.value)}
                      placeholder="Введите количество дней"
                      className="bg-slate-700 border-slate-600 text-slate-100"
                    />
                  </div>
                )}
                <Button 
                  onClick={handleSubscriptionAction}
                  disabled={loading}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  {loading ? 'Обработка...' : 'Выполнить'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* User List */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>{t('userList')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">{t('loading')}</div>
              ) : (
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {users.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${user.isOnline ? 'bg-green-400' : 'bg-red-400'}`} />
                        <span className="font-medium">{user.nickname}</span>
                        {/* Бан */}
                        {user.banned && (
                          <Badge variant="secondary" className="text-xs bg-red-500 mr-1">
                            Banned
                          </Badge>
                        )}
                        {/* VIP/Premium статусы */}
                        {user.vipStatus === 'active' && (
                          <Badge variant="secondary" className="text-xs bg-blue-600">
                            VIP
                          </Badge>
                        )}
                        {user.premiumStatus === 'active' && (
                          <Badge variant="secondary" className="text-xs bg-purple-600">
                            PREMIUM
                          </Badge>
                        )}
                        {/* Админы */}
                        {user.admin > 0 && (
                          <Badge variant="secondary" className="text-xs bg-red-500 animate-pulse">
                            {user.nickname === 'Ca6aka' ? 'Super Admin' : 'Admin'}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-slate-400">
                        {t('balance')}: ${user.balance?.toLocaleString() || 0}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Configuration - Super Admin Only */}
          {isSuperAdmin && (
            <Card className="bg-slate-800/50 border-slate-700 border-green-500/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-400">
                  <Wallet className="w-5 h-5" />
                  <span>Настройки платежей NOWPayments</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label>NOWPayments API ключ</Label>
                    <Input
                      type="password"
                      placeholder="0BYBCND-44G4DAZ-K5FPR03-WQKCRAF"
                      value={nowPaymentsKey}
                      onChange={(e) => setNowPaymentsKey(e.target.value)}
                      className="bg-slate-900 border-slate-600"
                    />
                    <p className="text-xs text-slate-400">Получить на https://nowpayments.io/</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Игровой Email (от чьего имени отправляются письма)
                    </Label>
                    <Input
                      type="email"
                      placeholder="noreply@yourgame.com"
                      value={gameEmail}
                      onChange={(e) => setGameEmail(e.target.value)}
                      className="bg-slate-900 border-slate-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Админский Email (для уведомлений о платежах)</Label>
                    <Input
                      type="email"
                      placeholder="admin@yourgame.com"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="bg-slate-900 border-slate-600"
                    />
                  </div>

                  <div className="bg-slate-900 p-3 rounded-lg">
                    <h4 className="font-medium text-slate-200 mb-2">Настройка Webhook URL в NOWPayments:</h4>
                    <div className="bg-slate-800 p-2 rounded text-xs text-green-400 font-mono mb-2">
                      {window.location.origin}/api/payment-webhook
                    </div>
                    <p className="text-xs text-slate-400 mb-3">
                      Скопируйте эту ссылку и вставьте в настройках NOWPayments как Webhook URL
                    </p>
                    
                    <h4 className="font-medium text-slate-200 mb-2">Как работает система:</h4>
                    <ul className="text-xs text-slate-400 space-y-1">
                      <li>• Пользователь нажимает "Купить VIP/Premium"</li>
                      <li>• Вводит email для подтверждения</li>
                      <li>• Перенаправляется на NOWPayments</li>
                      <li>• Платит банковской картой или криптой</li>
                      <li>• NOWPayments конвертирует в USDT TRC20</li>
                      <li>• USDT поступают на ваш кошелек в NOWPayments</li>
                      <li>• Статус активируется автоматически через webhook</li>
                    </ul>
                  </div>

                  <Button
                    onClick={() => {
                      toast({
                        title: 'Настройки сохранены',
                        description: 'Конфигурация платежей NOWPayments обновлена'
                      });
                    }}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Сохранить настройки платежей
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
};