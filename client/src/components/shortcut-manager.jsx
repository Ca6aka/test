import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Monitor, Tablet, Settings, Download, Share2, Trash2 } from 'lucide-react';
import { MobileShortcutGenerator } from './mobile-shortcut-generator';
import { useLanguage } from '@/contexts/language-context';
import { useToast } from '@/hooks/use-toast';

export function ShortcutManager() {
  const [savedShortcuts, setSavedShortcuts] = useState([]);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const { t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    // Load saved shortcuts from localStorage
    loadSavedShortcuts();
    
    // Detect device type
    detectDeviceInfo();
    
    // Check if app is installed
    checkInstallationStatus();
  }, []);

  const loadSavedShortcuts = () => {
    try {
      const saved = localStorage.getItem('serversim-shortcuts');
      if (saved) {
        setSavedShortcuts(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load saved shortcuts:', error);
    }
  };

  const saveShortcut = (shortcutData) => {
    const newShortcut = {
      id: Date.now().toString(),
      ...shortcutData,
      createdAt: new Date().toISOString()
    };

    const updated = [...savedShortcuts, newShortcut];
    setSavedShortcuts(updated);
    localStorage.setItem('serversim-shortcuts', JSON.stringify(updated));

    toast({
      title: "Ярлык сохранён",
      description: `Ярлык "${shortcutData.name}" добавлен в коллекцию`
    });
  };

  const deleteShortcut = (shortcutId) => {
    const updated = savedShortcuts.filter(s => s.id !== shortcutId);
    setSavedShortcuts(updated);
    localStorage.setItem('serversim-shortcuts', JSON.stringify(updated));

    toast({
      title: "Ярлык удалён",
      description: "Ярлык удалён из коллекции"
    });
  };

  const detectDeviceInfo = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isDesktop = !isMobile;

    setDeviceInfo({
      isMobile,
      isIOS,
      isAndroid,
      isDesktop,
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      standalone: window.matchMedia('(display-mode: standalone)').matches
    });
  };

  const checkInstallationStatus = () => {
    // Check if PWA is installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = window.navigator.standalone === true;
    
    return isStandalone || isIOSStandalone;
  };

  const getDeviceIcon = () => {
    if (!deviceInfo) return <Monitor className="w-4 h-4" />;
    
    if (deviceInfo.isIOS) return <Smartphone className="w-4 h-4" />;
    if (deviceInfo.isAndroid) return <Smartphone className="w-4 h-4" />;
    if (deviceInfo.isMobile) return <Tablet className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  const getDeviceLabel = () => {
    if (!deviceInfo) return 'Определение...';
    
    if (deviceInfo.isIOS) return 'iOS Device';
    if (deviceInfo.isAndroid) return 'Android Device';
    if (deviceInfo.isMobile) return 'Mobile Device';
    return 'Desktop';
  };

  const exportShortcut = async (shortcut) => {
    try {
      const manifest = {
        name: shortcut.name,
        short_name: shortcut.name,
        description: "Server Simulation Game - Custom Shortcut",
        start_url: "/",
        display: "standalone",
        background_color: "#0f172a",
        theme_color: shortcut.color || "#3b82f6",
        orientation: "portrait-primary",
        icons: [
          {
            src: `data:image/svg+xml,${encodeURIComponent(shortcut.iconSvg || '')}`,
            sizes: "180x180",
            type: "image/svg+xml"
          }
        ]
      };

      if (navigator.share) {
        await navigator.share({
          title: `Ярлык: ${shortcut.name}`,
          text: JSON.stringify(manifest, null, 2),
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(JSON.stringify(manifest, null, 2));
        toast({
          title: "Манифест скопирован",
          description: "Данные ярлыка скопированы в буфер обмена"
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка экспорта",
        description: "Не удалось экспортировать ярлык",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Менеджер ярлыков
        </CardTitle>
        <CardDescription>
          Создавайте и управляйте ярлыками для главного экрана
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Device Info */}
        {deviceInfo && (
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getDeviceIcon()}
                  <span className="text-sm font-medium">{getDeviceLabel()}</span>
                </div>
                <div className="flex gap-2">
                  {checkInstallationStatus() && (
                    <Badge variant="secondary" className="text-xs">
                      Установлено
                    </Badge>
                  )}
                  {deviceInfo.standalone && (
                    <Badge variant="default" className="text-xs">
                      Standalone
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Shortcut Generator */}
        <MobileShortcutGenerator onSave={saveShortcut} />

        {/* Saved Shortcuts */}
        {savedShortcuts.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Сохранённые ярлыки</h3>
              <Badge variant="outline">{savedShortcuts.length}</Badge>
            </div>

            <div className="grid gap-2">
              {savedShortcuts.map((shortcut) => (
                <Card key={shortcut.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: shortcut.color || '#3b82f6' }}
                      >
                        💻
                      </div>
                      <div>
                        <p className="font-medium text-sm">{shortcut.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(shortcut.createdAt).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => exportShortcut(shortcut)}
                        className="h-8 w-8 p-0"
                      >
                        <Share2 className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteShortcut(shortcut.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Installation Tips */}
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                💡 Советы по установке
              </h4>
              <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
                {deviceInfo?.isIOS && (
                  <>
                    <li>Используйте Safari для установки на iOS</li>
                    <li>Нажмите "Поделиться" → "Добавить на главный экран"</li>
                  </>
                )}
                {deviceInfo?.isAndroid && (
                  <>
                    <li>Chrome автоматически предложит установку</li>
                    <li>Или используйте меню → "Добавить на главный экран"</li>
                  </>
                )}
                {deviceInfo?.isDesktop && (
                  <>
                    <li>Ищите кнопку "Установить" в адресной строке</li>
                    <li>Приложение появится в меню Пуск или Applications</li>
                  </>
                )}
                <li>Ярлыки работают как нативные приложения</li>
                <li>Поддерживается базовая работа оффлайн</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}