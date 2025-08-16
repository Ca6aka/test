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
import { Settings, Crown, Users, Shield } from 'lucide-react';

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

  const handleAdminAction = async () => {
    if (!selectedUser || !action) {
      toast({
        title: t('error'),
        description: 'Пожалуйста, выберите пользователя и действие',
        variant: 'destructive'
      });
      return;
    }

    // Check if amount is required for money actions
    if ((action === 'addMoney' || action === 'removeMoney') && (!amount || amount <= 0)) {
      toast({
        title: t('error'),
        description: 'Пожалуйста, введите корректную сумму',
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
        description: `Действие "${action}" успешно выполнено`
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
                  <span>{isSuperAdmin ? t('adminManagement') : 'Управление пользователями'}</span>
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
                              <SelectItem value="banUser" disabled={isSelf}>
                                {t('banUser')}
                              </SelectItem>
                              <SelectItem value="unbanUser" disabled={isSelf}>
                                {t('unbanUser')}
                              </SelectItem>
                              <SelectItem value="addMoney" disabled={!isSuperAdmin}>
                                Выдать деньги
                              </SelectItem>
                              <SelectItem value="removeMoney" disabled={!isSuperAdmin}>
                                Забрать деньги
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
                    <Label>Сумма</Label>
                    <Input
                      type="number"
                      placeholder="Введите сумму"
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
                        {user.admin > 0 && (
                          <Badge variant="secondary" className="text-xs">
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
        </div>
      </DialogContent>
    </Dialog>
  );
};