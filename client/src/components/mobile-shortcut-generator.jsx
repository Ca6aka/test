import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Download, Share, Copy, Check, Palette, Settings } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { useToast } from '@/hooks/use-toast';

export default function MobileShortcutGenerator({ onSave }) {
  const [isOpen, setIsOpen] = useState(false);
  const [shortcutName, setShortcutName] = useState('ServerSim');
  const [selectedIcon, setSelectedIcon] = useState('default');
  const [customColor, setCustomColor] = useState('#3b82f6');
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();

  // Predefined icon variants
  const iconVariants = [
    { id: 'default', name: 'Стандартная', color: '#3b82f6' },
    { id: 'green', name: 'Зелёная', color: '#10b981' },
    { id: 'purple', name: 'Фиолетовая', color: '#8b5cf6' },
    { id: 'orange', name: 'Оранжевая', color: '#f59e0b' },
    { id: 'red', name: 'Красная', color: '#ef4444' },
    { id: 'pink', name: 'Розовая', color: '#ec4899' },
    { id: 'custom', name: 'Свой цвет', color: customColor }
  ];

  // Generate custom icon SVG
  const generateIconSVG = (color = '#3b82f6') => {
    return `<svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="180" height="180" rx="45" fill="url(#gradient)" />
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${adjustBrightness(color, -30)};stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Server Rack -->
  <rect x="33.75" y="45" width="112.5" height="90" rx="5.625" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2.8125"/>
  
  <!-- Server Units -->
  <rect x="39.375" y="50.625" width="101.25" height="11.25" rx="2.8125" fill="#64748b"/>
  <rect x="39.375" y="67.5" width="101.25" height="11.25" rx="2.8125" fill="#64748b"/>
  <rect x="39.375" y="84.375" width="101.25" height="11.25" rx="2.8125" fill="#64748b"/>
  <rect x="39.375" y="101.25" width="101.25" height="11.25" rx="2.8125" fill="#64748b"/>
  <rect x="39.375" y="118.125" width="101.25" height="11.25" rx="2.8125" fill="#64748b"/>
  
  <!-- Status Lights -->
  <circle cx="129.375" cy="56.25" r="4.21875" fill="#10b981"/>
  <circle cx="129.375" cy="73.125" r="4.21875" fill="#10b981"/>
  <circle cx="129.375" cy="90" r="4.21875" fill="#f59e0b"/>
  <circle cx="129.375" cy="106.875" r="4.21875" fill="#10b981"/>
  <circle cx="129.375" cy="123.75" r="4.21875" fill="#ef4444"/>
  
  <!-- Network Symbol -->
  <path d="M56.25 146.25 L67.5 157.5 L78.75 146.25 M90 146.25 L101.25 157.5 L112.5 146.25" stroke="${color}" stroke-width="5.625" fill="none" stroke-linecap="round"/>
  
  <!-- Dollar Sign -->
  <circle cx="154.6875" cy="28.125" r="22.5" fill="#fbbf24"/>
  <text x="154.6875" y="39.375" text-anchor="middle" fill="white" font-size="28.125" font-weight="bold">$</text>
</svg>`;
  };

  // Helper function to adjust color brightness
  function adjustBrightness(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }

  // Generate manifest for custom shortcut
  const generateCustomManifest = () => {
    const selectedVariant = iconVariants.find(v => v.id === selectedIcon);
    const iconColor = selectedIcon === 'custom' ? customColor : selectedVariant.color;
    
    return {
      name: shortcutName,
      short_name: shortcutName,
      description: "Server Simulation Game - Custom Shortcut",
      start_url: "/",
      display: "standalone",
      background_color: "#0f172a",
      theme_color: iconColor,
      orientation: "portrait-primary",
      icons: [
        {
          src: `data:image/svg+xml,${encodeURIComponent(generateIconSVG(iconColor))}`,
          sizes: "180x180",
          type: "image/svg+xml"
        }
      ]
    };
  };

  // Copy manifest to clipboard
  const copyManifest = async () => {
    try {
      const manifest = JSON.stringify(generateCustomManifest(), null, 2);
      await navigator.clipboard.writeText(manifest);
      setCopied(true);
      toast({
        title: "Манифест скопирован!",
        description: "JSON манифест скопирован в буфер обмена"
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Ошибка копирования",
        description: "Не удалось скопировать манифест",
        variant: "destructive"
      });
    }
  };

  // Generate installation instructions based on device
  const getInstallInstructions = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      return {
        device: 'iOS Safari',
        steps: [
          'Откройте сайт в Safari',
          'Нажмите кнопку "Поделиться" внизу экрана',
          'Прокрутите и выберите "Добавить на главный экран"',
          'Измените название если нужно',
          'Нажмите "Добавить"'
        ],
        icon: '📱'
      };
    } else if (userAgent.includes('android')) {
      return {
        device: 'Android Chrome',
        steps: [
          'Откройте сайт в Chrome',
          'Нажмите меню (три точки) в правом верхнем углу',
          'Выберите "Добавить на главный экран"',
          'Введите название ярлыка',
          'Нажмите "Добавить"'
        ],
        icon: '🤖'
      };
    } else {
      return {
        device: 'Desktop Chrome/Edge',
        steps: [
          'Откройте сайт в Chrome или Edge',
          'Найдите кнопку "Установить" в адресной строке',
          'Или нажмите меню → "Установить..."',
          'Подтвердите установку',
          'Приложение появится в меню Пуск'
        ],
        icon: '💻'
      };
    }
  };

  const installInstructions = getInstallInstructions();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Settings className="w-4 h-4 mr-2" />
          Генератор ярлыков
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Генератор ярлыков
          </DialogTitle>
          <DialogDescription>
            Создайте персональный ярлык для главного экрана
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="customize" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="customize">Настройки</TabsTrigger>
            <TabsTrigger value="install">Установка</TabsTrigger>
          </TabsList>

          <TabsContent value="customize" className="space-y-4">
            {/* Shortcut Name */}
            <div className="space-y-2">
              <Label htmlFor="shortcut-name">Название ярлыка</Label>
              <Input
                id="shortcut-name"
                value={shortcutName}
                onChange={(e) => setShortcutName(e.target.value)}
                placeholder="Введите название..."
                maxLength={20}
              />
              <p className="text-xs text-muted-foreground">
                {shortcutName.length}/20 символов
              </p>
            </div>

            {/* Icon Selection */}
            <div className="space-y-3">
              <Label>Цвет иконки</Label>
              <div className="grid grid-cols-2 gap-2">
                {iconVariants.map((variant) => (
                  <Button
                    key={variant.id}
                    variant={selectedIcon === variant.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedIcon(variant.id)}
                    className="flex items-center gap-2"
                  >
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: variant.id === 'custom' ? customColor : variant.color }}
                    />
                    {variant.name}
                  </Button>
                ))}
              </div>

              {selectedIcon === 'custom' && (
                <div className="space-y-2">
                  <Label htmlFor="custom-color">Свой цвет</Label>
                  <div className="flex gap-2">
                    <Input
                      id="custom-color"
                      type="color"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      placeholder="#3b82f6"
                      className="flex-1"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <Label>Предварительный просмотр</Label>
              <Card className="p-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ 
                      background: `linear-gradient(135deg, ${selectedIcon === 'custom' ? customColor : iconVariants.find(v => v.id === selectedIcon)?.color}, ${adjustBrightness(selectedIcon === 'custom' ? customColor : iconVariants.find(v => v.id === selectedIcon)?.color, -30)})`
                    }}
                  >
                    <div className="text-white text-lg font-bold">
                      💻
                    </div>
                  </div>
                  <p className="text-sm font-medium">{shortcutName}</p>
                </div>
              </Card>
            </div>

            {/* Export Options */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={copyManifest} size="sm" variant="outline">
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? 'Скопировано!' : 'Копировать'}
                </Button>
                {onSave && (
                  <Button 
                    onClick={() => {
                      const shortcutData = {
                        name: shortcutName,
                        color: selectedIcon === 'custom' ? customColor : iconVariants.find(v => v.id === selectedIcon)?.color,
                        iconSvg: generateIconSVG(selectedIcon === 'custom' ? customColor : iconVariants.find(v => v.id === selectedIcon)?.color),
                        variant: selectedIcon
                      };
                      onSave(shortcutData);
                      toast({
                        title: "Ярлык сохранён!",
                        description: `"${shortcutName}" добавлен в коллекцию`
                      });
                    }}
                    size="sm"
                  >
                    Сохранить
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="install" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  {installInstructions.icon} {installInstructions.device}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-sm">
                  {installInstructions.steps.map((step, index) => (
                    <li key={index} className="flex gap-2">
                      <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs flex-shrink-0">
                        {index + 1}
                      </Badge>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="space-y-2">
              <Button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: shortcutName,
                      text: 'Server Simulation Game',
                      url: window.location.href
                    });
                  }
                }}
                className="w-full" 
                variant="outline"
                size="sm"
                disabled={!navigator.share}
              >
                <Share className="w-4 h-4 mr-2" />
                Поделиться ссылкой
              </Button>
            </div>

            {/* Tips */}
            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-4">
                <div className="text-sm space-y-2">
                  <p className="font-medium text-blue-800 dark:text-blue-200">
                    💡 Полезные советы:
                  </p>
                  <ul className="text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside text-xs">
                    <li>Ярлык будет работать как обычное приложение</li>
                    <li>Можно запускать без открытия браузера</li>
                    <li>Поддерживается полноэкранный режим</li>
                    <li>Базовая работа оффлайн доступна</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 pt-4">
          <Button onClick={() => setIsOpen(false)} variant="outline" className="flex-1">
            Закрыть
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}