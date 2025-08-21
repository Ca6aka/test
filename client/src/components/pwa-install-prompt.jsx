import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Download, Smartphone } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { MobileShortcutGenerator } from './mobile-shortcut-generator';

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Проверяем, установлено ли уже приложение
    const checkIfInstalled = () => {
      // Способ 1: проверка display-mode
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      // Способ 2: проверка navigator.standalone (iOS Safari)
      const isIOSStandalone = window.navigator.standalone === true;
      
      return isStandalone || isIOSStandalone;
    };

    setIsInstalled(checkIfInstalled());

    // Слушаем событие beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      console.log('PWA: beforeinstallprompt event fired');
      e.preventDefault(); // Отменяем стандартный промпт
      setDeferredPrompt(e);
      
      // Показываем кастомный промпт только если приложение не установлено
      if (!checkIfInstalled()) {
        // Задержка перед показом промпта (дать пользователю ознакомиться с сайтом)
        setTimeout(() => {
          setIsVisible(true);
        }, 10000); // 10 секунд
      }
    };

    // Слушаем событие установки
    const handleAppInstalled = () => {
      console.log('PWA: appinstalled event fired');
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
      
      // Показать уведомление об успешной установке
      if (typeof window !== 'undefined' && window.toast) {
        window.toast({
          title: t('appInstalled') || 'Приложение установлено!',
          description: t('appInstalledDesc') || 'Теперь вы можете запускать игру с рабочего стола',
        });
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [t]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log('PWA: No deferred prompt available');
      return;
    }

    try {
      // Показать нативный промпт установки
      deferredPrompt.prompt();
      
      // Ждем ответа пользователя
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log(`PWA: User response to install prompt: ${outcome}`);
      
      if (outcome === 'accepted') {
        console.log('PWA: User accepted the install prompt');
      } else {
        console.log('PWA: User dismissed the install prompt');
      }
      
      // Скрываем наш кастомный промпт
      setIsVisible(false);
      setDeferredPrompt(null);
    } catch (error) {
      console.error('PWA: Error during installation:', error);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Запомнить, что пользователь отклонил (можно сохранить в localStorage)
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Проверить, не отклонял ли пользователь недавно
  const isDismissedRecently = () => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (!dismissed) return false;
    
    const dismissedTime = parseInt(dismissed);
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;
    
    return (now - dismissedTime) < (dayInMs * 7); // 7 дней
  };

  // Не показывать, если уже установлено, отклонено недавно, или нет промпта
  if (isInstalled || isDismissedRecently() || !isVisible || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-blue-500 shadow-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-white" />
              <CardTitle className="text-white text-sm">
                {t('installApp') || 'Установить приложение'}
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription className="text-blue-100 text-xs">
            {t('installAppDesc') || 'Добавьте ярлык на рабочий стол для быстрого доступа к игре'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col gap-2">
            <Button 
              onClick={handleInstallClick}
              className="bg-white text-blue-600 hover:bg-blue-50 w-full text-sm"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              {t('installNow') || 'Установить сейчас'}
            </Button>
            <div className="px-2">
              <MobileShortcutGenerator />
            </div>
            <div className="text-xs text-blue-200 text-center">
              {t('installBenefits') || 'Быстрый запуск • Оффлайн режим • Полноэкранный режим'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// iOS Safari специальный компонент для инструкций по установке
export function IOSInstallInstructions() {
  const [showInstructions, setShowInstructions] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Показать только на iOS Safari и если не установлено
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isIOSSafari = isIOS && !navigator.standalone && !window.MSStream;
    const isNotInstalled = !window.matchMedia('(display-mode: standalone)').matches;
    
    if (isIOSSafari && isNotInstalled) {
      // Показать через некоторое время
      setTimeout(() => {
        setShowInstructions(true);
      }, 15000); // 15 секунд
    }
  }, []);

  if (!showInstructions) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <Card className="bg-gradient-to-r from-green-600 to-blue-600 border-green-500 shadow-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-sm">
              📱 {t('addToHomeScreen') || 'Добавить на главный экран'}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInstructions(false)}
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-xs text-green-100 space-y-1">
            <div>1. {t('tapShareButton') || 'Нажмите кнопку "Поделиться"'} 📤</div>
            <div>2. {t('selectAddToHome') || 'Выберите "Добавить на главный экран"'}</div>
            <div>3. {t('confirmInstall') || 'Подтвердите установку'}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}