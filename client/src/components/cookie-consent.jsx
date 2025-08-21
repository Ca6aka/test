import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Cookie, Shield, Settings, Check, X, Info } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { motion, AnimatePresence } from 'framer-motion';

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true, // Always true, cannot be disabled
    functional: true,
    analytics: false,
    marketing: false,
    preferences: true
  });
  const { t } = useLanguage();

  useEffect(() => {
    // Check if user has already made a choice
    const consentData = localStorage.getItem('cookie-consent');
    if (!consentData) {
      // Show consent after a short delay
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Load existing preferences
      const savedPreferences = JSON.parse(consentData);
      setCookiePreferences(savedPreferences);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    setCookiePreferences(allAccepted);
    saveConsentData(allAccepted);
    setShowConsent(false);
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
      preferences: false
    };
    setCookiePreferences(onlyNecessary);
    saveConsentData(onlyNecessary);
    setShowConsent(false);
  };

  const handleSavePreferences = () => {
    saveConsentData(cookiePreferences);
    setShowConsent(false);
    setShowSettings(false);
  };

  const saveConsentData = (preferences) => {
    const consentData = {
      ...preferences,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    localStorage.setItem('cookie-consent', JSON.stringify(consentData));
    
    // Apply cookie settings
    if (!preferences.analytics) {
      // Disable analytics cookies
      document.cookie = '_ga=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = '_gid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
    
    // Trigger custom event for other parts of the app
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { 
      detail: preferences 
    }));
  };

  const cookieTypes = [
    {
      key: 'necessary',
      title: 'Необходимые куки',
      description: 'Критически важные для работы сайта. Обеспечивают безопасность и базовую функциональность.',
      examples: 'Сессии, аутентификация, безопасность',
      required: true,
      icon: Shield,
      color: 'bg-red-500'
    },
    {
      key: 'functional',
      title: 'Функциональные куки',
      description: 'Улучшают работу сайта и сохраняют ваши предпочтения.',
      examples: 'Настройки языка, темы, прогресс игры',
      required: false,
      icon: Settings,
      color: 'bg-blue-500'
    },
    {
      key: 'preferences',
      title: 'Пользовательские настройки',
      description: 'Сохраняют ваши игровые настройки и предпочтения интерфейса.',
      examples: 'Положение элементов, избранные функции',
      required: false,
      icon: Settings,
      color: 'bg-purple-500'
    },
    {
      key: 'analytics',
      title: 'Аналитические куки',
      description: 'Помогают понять, как вы используете сайт, для его улучшения.',
      examples: 'Google Analytics, статистика посещений',
      required: false,
      icon: Info,
      color: 'bg-green-500'
    },
    {
      key: 'marketing',
      title: 'Маркетинговые куки',
      description: 'Используются для показа персонализированной рекламы.',
      examples: 'Рекламные сети, ретаргетинг',
      required: false,
      icon: Info,
      color: 'bg-orange-500'
    }
  ];

  return (
    <>
      {/* Main Cookie Consent Banner */}
      <AnimatePresence>
        {showConsent && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-4 left-4 right-4 z-50 md:left-6 md:right-6 lg:left-auto lg:right-6 lg:max-w-md"
          >
            <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700 shadow-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Cookie className="w-5 h-5 text-yellow-400" />
                  Использование куки
                </CardTitle>
                <CardDescription className="text-slate-300 text-sm">
                  Мы используем куки для улучшения работы игры, сохранения прогресса и анализа. 
                  Некоторые функции требуют согласия на использование куки.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {/* Quick info about required cookies */}
                <div className="text-xs text-slate-400 bg-slate-800/50 p-2 rounded">
                  <strong>Важно:</strong> Без базовых куки регистрация и сохранение прогресса невозможны.
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleAcceptAll}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Принять все
                    </Button>
                    <Button 
                      onClick={handleRejectAll}
                      variant="outline"
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
                      size="sm"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Только необходимые
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={() => setShowSettings(true)}
                    variant="ghost"
                    className="w-full text-slate-400 hover:text-white hover:bg-slate-800"
                    size="sm"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Настроить куки
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detailed Cookie Settings Modal */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cookie className="w-5 h-5" />
              Настройки куки
            </DialogTitle>
            <DialogDescription>
              Управляйте тем, какие куки мы можем использовать. Некоторые куки критически важны для работы игры.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {cookieTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <Card key={type.key} className="relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1 h-full ${type.color}`} />
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4" />
                          <h4 className="font-medium">{type.title}</h4>
                          {type.required && (
                            <Badge variant="destructive" className="text-xs">
                              Обязательно
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {type.description}
                        </p>
                        
                        <div className="text-xs text-muted-foreground">
                          <strong>Примеры:</strong> {type.examples}
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        <Switch
                          checked={cookiePreferences[type.key]}
                          onCheckedChange={(checked) => 
                            setCookiePreferences(prev => ({
                              ...prev,
                              [type.key]: checked
                            }))
                          }
                          disabled={type.required}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Additional Information */}
            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    📋 Дополнительная информация
                  </h4>
                  <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
                    <li>Настройки можно изменить в любое время в разделе "Настройки"</li>
                    <li>Игра не будет работать без необходимых куки</li>
                    <li>Мы не продаём ваши данные третьим лицам</li>
                    <li>Все данные обрабатываются согласно GDPR</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSavePreferences} className="flex-1">
                Сохранить настройки
              </Button>
              <Button onClick={handleAcceptAll} variant="outline" className="flex-1">
                Принять все
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}