import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Settings, Smartphone, Palette, Bell, Shield, Download, Monitor } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { useGame } from '@/contexts/game-context';
import { useTheme } from '@/components/theme-provider';
import { ShortcutManager } from './shortcut-manager';
import { useToast } from '@/hooks/use-toast';

export default function SettingsTab() {
  const { language, setLanguage, t } = useLanguage();
  const { gameState } = useGame();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    dailyBonus: true,
    serverAlerts: true,
    achievements: true,
    payments: true
  });
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  const handleNotificationChange = (type, enabled) => {
    setNotifications(prev => ({
      ...prev,
      [type]: enabled
    }));
    
    toast({
      title: "Настройки обновлены",
      description: `Уведомления ${enabled ? 'включены' : 'отключены'} для: ${getNotificationLabel(type)}`
    });
  };

  const getNotificationLabel = (type) => {
    const labels = {
      dailyBonus: 'Ежедневный бонус',
      serverAlerts: 'Предупреждения серверов',
      achievements: 'Достижения',
      payments: 'Платежи'
    };
    return labels[type] || type;
  };

  // PWA Install Handler
  React.useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
      toast({
        title: "Приложение установлено!",
        description: "Теперь вы можете запускать игру с рабочего стола"
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [toast]);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) {
      toast({
        title: "Установка недоступна",
        description: "Приложение уже установлено или ваш браузер не поддерживает установку",
        variant: "destructive"
      });
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        toast({
          title: "Установка начата",
          description: "Приложение будет установлено на ваше устройство"
        });
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('PWA install error:', error);
      toast({
        title: "Ошибка установки",
        description: "Не удалось установить приложение",
        variant: "destructive"
      });
    }
  };

  const clearCache = () => {
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
      });
    }
    localStorage.removeItem('serversim-cache');
    toast({
      title: "Кеш очищен",
      description: "Все временные файлы удалены"
    });
  };

  const exportUserData = () => {
    const userData = {
      user: gameState.user,
      settings: {
        language,
        theme,
        notifications
      },
      shortcuts: localStorage.getItem('serversim-shortcuts'),
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `serversim-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Данные экспортированы",
      description: "Файл с вашими данными загружен"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="w-5 h-5" />
        <h2 className="text-lg font-semibold">Настройки</h2>
        <Badge variant="outline">v1.0</Badge>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Общие</TabsTrigger>
          <TabsTrigger value="install">Установка</TabsTrigger>
          <TabsTrigger value="shortcuts">Ярлыки</TabsTrigger>
          <TabsTrigger value="notifications">Уведомления</TabsTrigger>
          <TabsTrigger value="data">Данные</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Внешний вид
              </CardTitle>
              <CardDescription>
                Настройка темы и языка интерфейса
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Тема оформления</Label>
                  <p className="text-sm text-muted-foreground">
                    Выберите светлую или тёмную тему
                  </p>
                </div>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Светлая</SelectItem>
                    <SelectItem value="dark">Тёмная</SelectItem>
                    <SelectItem value="system">Системная</SelectItem>
                  </SelectContent>
                </Select>
              </div>


            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Информация об аккаунте</CardTitle>
              <CardDescription>
                Данные вашего игрового профиля
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Никнейм:</span>
                  <span className="font-medium">{gameState.user?.nickname || 'Гость'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Уровень:</span>
                  <span className="font-medium">{gameState.user?.level || 1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Статус:</span>
                  <Badge variant={gameState.user?.vipStatus === 'premium' ? 'default' : gameState.user?.vipStatus === 'vip' ? 'secondary' : 'outline'}>
                    {gameState.user?.vipStatus === 'premium' ? 'Premium' : 
                     gameState.user?.vipStatus === 'vip' ? 'VIP' : 'Обычный'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Регистрация:</span>
                  <span className="font-medium">
                    {gameState.user?.registrationTime ? new Date(gameState.user.registrationTime).toLocaleDateString('ru-RU') : 'Неизвестно'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="install" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                Установка приложения
              </CardTitle>
              <CardDescription>
                Установите игру на ваше устройство для быстрого доступа
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Установить на устройство</Label>
                  <p className="text-sm text-muted-foreground">
                    Добавить ярлык на рабочий стол и в меню приложений
                  </p>
                </div>
                <Button 
                  onClick={handleInstallPWA}
                  disabled={!isInstallable}
                  variant={isInstallable ? "default" : "outline"}
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isInstallable ? 'Установить' : 'Установлено'}
                </Button>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  📱 Преимущества установки
                </h4>
                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
                  <li>Быстрый запуск с рабочего стола</li>
                  <li>Работа в отдельном окне без браузера</li>
                  <li>Автоматические обновления</li>
                  <li>Оффлайн доступ к базовым функциям</li>
                  <li>Уведомления о событиях в игре</li>
                </ul>
              </div>

              {!isInstallable && (
                <div className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    💡 Если кнопка установки не активна, попробуйте:
                    <br />• Обновить страницу
                    <br />• Использовать Chrome, Edge или Safari
                    <br />• Проверить адресную строку на наличие иконки установки
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shortcuts" className="space-y-4">
          <ShortcutManager />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Уведомления
              </CardTitle>
              <CardDescription>
                Управление push-уведомлениями и алертами
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Ежедневный бонус</Label>
                  <p className="text-sm text-muted-foreground">
                    Напоминания о получении ежедневного бонуса
                  </p>
                </div>
                <Switch
                  checked={notifications.dailyBonus}
                  onCheckedChange={(checked) => handleNotificationChange('dailyBonus', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Предупреждения серверов</Label>
                  <p className="text-sm text-muted-foreground">
                    Уведомления о проблемах с серверами
                  </p>
                </div>
                <Switch
                  checked={notifications.serverAlerts}
                  onCheckedChange={(checked) => handleNotificationChange('serverAlerts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Достижения</Label>
                  <p className="text-sm text-muted-foreground">
                    Уведомления о разблокированных достижениях
                  </p>
                </div>
                <Switch
                  checked={notifications.achievements}
                  onCheckedChange={(checked) => handleNotificationChange('achievements', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Платежи</Label>
                  <p className="text-sm text-muted-foreground">
                    Подтверждения покупок и транзакций
                  </p>
                </div>
                <Switch
                  checked={notifications.payments}
                  onCheckedChange={(checked) => handleNotificationChange('payments', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Управление данными
              </CardTitle>
              <CardDescription>
                Экспорт, очистка и восстановление данных
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Экспорт данных</Label>
                  <p className="text-sm text-muted-foreground">
                    Скачать все ваши данные в JSON файле
                  </p>
                </div>
                <Button onClick={exportUserData} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Экспорт
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Очистить кеш</Label>
                  <p className="text-sm text-muted-foreground">
                    Удалить временные файлы и кешированные данные
                  </p>
                </div>
                <Button onClick={clearCache} variant="outline" size="sm">
                  Очистить
                </Button>
              </div>

              <Card className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      ⚠️ Важная информация
                    </h4>
                    <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1 list-disc list-inside">
                      <li>Данные аккаунта хранятся на сервере</li>
                      <li>Настройки сохраняются локально в браузере</li>
                      <li>Экспорт поможет восстановить настройки</li>
                      <li>Очистка кеша может потребовать повторной авторизации</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}