import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  Play, 
  Server, 
  TrendingUp, 
  Shield, 
  Coins, 
  Users, 
  Globe, 
  Mail, 
  MessageCircle,
  ExternalLink,
  Star,
  Award,
  Gamepad2,
  DollarSign,
  Clock,
  Smartphone,
  Trophy,
  Crown,
  Activity
} from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { ThemeToggle } from '@/components/theme-toggle';
import { CookieConsent } from '@/components/cookie-consent';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import MobileShortcutGenerator from '@/components/mobile-shortcut-generator';
import { formatCurrency } from '@/lib/constants';

export default function HomePage() {
  const { t, language, changeLanguage } = useLanguage();
  const [selectedFeature, setSelectedFeature] = useState(0);

  // Fetch real-time statistics
  const { data: statsData } = useQuery({
    queryKey: ['/api/stats/general'],
    refetchInterval: 30000, // Update every 30 seconds
  });

  // Fetch player rankings  
  const { data: rankingsData } = useQuery({
    queryKey: ['/api/rankings'],
    refetchInterval: 30000, // Update every 30 seconds
  });

  const features = [
    {
      icon: Server,
      title: language === 'ru' ? 'Управление Серверами' : 
             language === 'en' ? 'Server Management' :
             language === 'ua' ? 'Керування Серверами' :
             'Server-Verwaltung',
      description: language === 'ru' ? 'Покупайте, настраивайте и оптимизируйте виртуальные серверы для максимальной прибыли' : 
                   language === 'en' ? 'Buy, configure and optimize virtual servers for maximum profit' :
                   language === 'ua' ? 'Купуйте, налаштовуйте та оптимізуйте віртуальні сервери для максимального прибутку' :
                   'Kaufen, konfigurieren und optimieren Sie virtuelle Server für maximalen Profit',
      details: language === 'ru' ? 'Более 5 типов серверов с уникальными характеристиками' : 
               language === 'en' ? 'Over 5 server types with unique characteristics' :
               language === 'ua' ? 'Понад 5 типів серверів з унікальними характеристиками' :
               'Über 5 Servertypen mit einzigartigen Eigenschaften'
    },
    {
      icon: TrendingUp,
      title: language === 'ru' ? 'Пассивный Доход' : 
      language === 'en' ? 'Passive Income' :
      language === 'ua' ? 'Пасивний дохід' :
      'Passives Einkommen',
      description: language === 'ru' ? 'Зарабатывайте деньги даже когда не в игре благодаря автоматизированным серверам' : 
      language === 'en' ? "Earn money even when you're not playing thanks to automated servers" :
      language === 'ua' ? 'Заробляйте гроші навіть коли не граєте завдяки автоматизованим серверам' :
      'Verdienen Sie Geld, auch wenn Sie nicht spielen, dank automatisierter Server.',
      details: language === 'ru' ? 'Доход каждую минуту, оптимизация загрузки серверов' : 
      language === 'en' ? 'Revenue every minute, server load optimization' :
      language === 'ua' ? 'Дохід щохвилини, оптимізація завантаження серверів' :
      'Einnahmen jede Minute, Optimierung der Serverauslastung'
    },
    {
      icon: Award,
      title: language === 'ru' ? 'Система Достижений' : 
      language === 'en' ? 'Achievement System' :
      language === 'ua' ? 'Система досягнень' :
      'Erfolgssystem',
      description: language === 'ru' ? 'Разблокируйте достижения и получайте награды за прогресс в игре' : 
      language === 'en' ? 'Unlock achievements and receive rewards for your progress in the game.' :
      language === 'ua' ? 'Розблокуйте досягнення та отримуйте нагороди за прогрес у грі' :
      'Schalte Erfolge frei und erhalte Belohnungen für deine Fortschritte im Spiel.',
      details: language === 'ru' ? 'Более 30 достижений с денежными и опытными наградами' : 
      language === 'en' ? 'Over 30 achievements with cash and experience rewards' :
      language === 'ua' ? 'Понад 30 досягнень з грошовими та досвідченими нагородами' :
      'Über 30 Erfolge mit Geld- und Erfahrungsbelohnungen',
    },
    {
      icon: Gamepad2,
      title: language === 'ru' ? 'Мини-игры' : 
      language === 'en' ? 'Mini-games' :
      language === 'ua' ? 'Міні-ігри' :
      'Minispiele',
      description: language === 'ru' ? 'Играйте в увлекательные мини-игры для получения дополнительного опыта' : 
      language === 'en' ? 'Play exciting mini-games to gain additional experience' :
      language === 'ua' ? 'Грайте в захоплюючі міні-ігри для отримання додаткового досвіду' :
      'Spielen Sie spannende Minispiele, um zusätzliche Erfahrung zu sammeln.',
      details: language === 'ru' ? 'DDoS защита, Файрвол фильтр и другие IT-челленджи' : 
      language === 'en' ? 'DDoS protection, firewall filter, and other IT challenges' :
      language === 'ua' ? 'DDoS захист, Файрвол фільтр та інші IT-челенджі' :
      'DDoS-Schutz, Firewall-Filter und andere IT-Herausforderungen',
    },
    {
      icon: Coins,
      title: language === 'ru' ? 'Криптоплатежи' : 
      language === 'en' ? 'Crypto payments' :
      language === 'ua' ? 'Криптоплатежі' :
      'Krypto-Zahlungen',
      description: language === 'ru' ? 'VIP и Premium подписки с оплатой в криптовалюте через NOWPayments' : 
      language === 'en' ? 'VIP and Premium subscriptions with payment in cryptocurrency via NOWPayments' :
      language === 'ua' ? 'VIP та Premium підписки з оплатою в криптовалюті через NOWPayments' :
      'VIP- und Premium-Abonnements mit Zahlung in Kryptowährung über NOWPayments',
      details: language === 'ru' ? 'Bitcoin, Ethereum, USDT и 50+ других криптовалют' : 
      language === 'en' ? 'Bitcoin, Ethereum, USDT, and 50+ other cryptocurrencies' :
      language === 'ua' ? 'Bitcoin, Ethereum, USDT та 50+ інших криптовалют' :
      'Bitcoin, Ethereum, USDT und über 50 weitere Kryptowährungen',
    },
    {
      icon: Users,
      title: language === 'ru' ? 'Мультиплеер' : 
      language === 'en' ? 'Multiplayer' :
      language === 'ua' ? 'Мультиплеєр' :
      'Mehrspieler',
      description: language === 'ru' ? 'Общайтесь с другими игроками в реальном времени и соревнуйтесь в рейтингах' : 
      language === 'en' ? 'Communicate with other players in real time and compete in rankings' :
      language === 'ua' ? 'Спілкуйтеся з іншими гравцями в реальному часі та змагайтеся в рейтингах' :
      'Kommuniziere mit anderen Spielern in Echtzeit und konkurriere in den Ranglisten.',
      details: language === 'ru' ? 'Глобальные рейтинги, чат с эмодзи для VIP пользователей' : 
      language === 'en' ? 'Global rankings, emoji chat for VIP users' :
      language === 'ua' ? 'Глобальні рейтинги, чат з емодзі для VIP-користувачів' :
      'Globale Rankings, Chat mit Emojis für VIP-Nutzer',
    }
  ];

  const stats = [
    { 
      label: language === 'ru' ? 'Всего игроков' : 
              language === 'en' ? 'Total Players' :
              language === 'ua' ? 'Всього гравців' :
              'Spieler gesamt', 
      value: statsData?.totalPlayers || '0', 
      icon: Users 
    },
    { 
      label: language === 'ru' ? 'Онлайн' : 
              language === 'en' ? 'Online' :
              language === 'ua' ? 'Онлайн' :
              'Online', 
      value: statsData?.onlinePlayers || '0', 
      icon: Activity 
    },
    { 
      label: language === 'ru' ? 'Серверов' : 
              language === 'en' ? 'Servers' :
              language === 'ua' ? 'Серверів' :
              'Server', 
      value: statsData?.totalServers || '0', 
      icon: Server 
    },
    { 
      label: language === 'ru' ? 'Общий баланс' : 
              language === 'en' ? 'Total Balance' :
              language === 'ua' ? 'Загальний баланс' :
              'Gesamtsaldo', 
      value: statsData?.totalBalance ? formatCurrency(statsData.totalBalance) : '$0', 
      icon: DollarSign 
    }
  ];

  const testimonials = [
    {
      name: 'TESTER #1',
      role: 'Beta Tester',
      content: language === 'ru' ? 'Помогал тестировать игровую механику. Отличный баланс и интересные функции!' : 
               language === 'en' ? 'Helped test game mechanics. Great balance and interesting features!' :
               language === 'ua' ? 'Допомагав тестувати ігрову механіку. Відмінний баланс та цікаві функції!' :
               'Geholfen, die Spielmechanik zu testen. Großartige Balance und interessante Features!',
      rating: 5
    },
    {
      name: 'TESTER #2',
      role: 'UI/UX Tester',
      content: language === 'ru' ? 'Тестировал интерфейс и удобство использования. Все работает интуитивно!' : 
               language === 'en' ? 'Tested interface and usability. Everything works intuitively!' :
               language === 'ua' ? 'Тестував інтерфейс та зручність використання. Все працює інтуїтивно!' :
               'Testete Interface und Benutzerfreundlichkeit. Alles funktioniert intuitiv!',
      rating: 5
    },
    {
      name: 'TESTER #3',
      role: 'Payment Tester',
      content: language === 'ru' ? 'Проверял криптоплатежи и VIP функции. Система работает стабильно!' : 
               language === 'en' ? 'Tested crypto payments and VIP features. System works stably!' :
               language === 'ua' ? 'Перевіряв криптоплатежі та VIP функції. Система працює стабільно!' :
               'Testete Krypto-Zahlungen und VIP-Funktionen. System funktioniert stabil!',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDk5LCAxMDIsIDI0MSwgMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-40 left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Header */}
      <header className="relative z-10 border-b border-slate-700/50 backdrop-blur-sm bg-slate-900/50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Server className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Root Tycoon</h1>
                <p className="text-xs text-slate-400">{t('homename2')}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button 
                  variant={language === 'en' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => changeLanguage('en')}
                >
                  🇺🇸
                </Button>
                <Button 
                  variant={language === 'ru' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => changeLanguage('ru')}
                >
                  🇷🇺
                </Button>
                <Button 
                  variant={language === 'ua' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => changeLanguage('ua')}
                >
                  🇺🇦
                </Button>
                <Button 
                  variant={language === 'de' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => changeLanguage('de')}
                >
                  🇩🇪
                </Button>
              </div>
              <ThemeToggle />
              <div className="flex gap-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    {language === 'ru' ? 'Вход' : 
                     language === 'en' ? 'Login' :
                     language === 'ua' ? 'Вхід' :
                     'Anmelden'}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" size="sm">
                    {language === 'ru' ? 'Регистрация' : 
                     language === 'en' ? 'Register' :
                     language === 'ua' ? 'Реєстрація' :
                     'Registrieren'}
                  </Button>
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 text-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >

            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Root Tycoon
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              {language === 'ru' ? 'Создай свою IT-империю! Управляй серверами, зарабатывай криптовалюту, соревнуйся с игроками со всего мира в самом реалистичном симуляторе серверов.' : 
               language === 'en' ? 'Build your IT empire! Manage servers, earn cryptocurrency, compete with players worldwide in the most realistic server simulator.' :
               language === 'ua' ? 'Створи свою IT-імперію! Керуй серверами, заробляй криптовалюту, змагайся з гравцями з усього світу в найреалістичнішому симуляторі серверів.' :
               'Baue dein IT-Imperium auf! Verwalte Server, verdiene Kryptowährung, konkurriere mit Spielern weltweit im realistischsten Server-Simulator.'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8">
                  <Play className="w-5 h-5 mr-2" />
                  {language === 'ru' ? 'Начать Играть' : 
                   language === 'en' ? 'Start Playing' :
                   language === 'ua' ? 'Почати Грати' :
                   'Spielen Starten'}
                </Button>
              </Link>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Globe className="w-5 h-5 mr-2" />
                {language === 'ru' ? 'Узнать больше' : 
                 language === 'en' ? 'Learn More' :
                 language === 'ua' ? 'Дізнатися більше' :
                 'Mehr erfahren'}
              </Button>
            </div>

            {/* Shimmering Add to Home Screen Button */}
            <div className="mt-6 flex justify-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="relative bg-gradient-to-r from-black via-gray-900 to-white bg-[length:200%_100%] animate-shimmer text-white border border-gray-300 hover:border-gray-100 transition-all duration-300 px-6"
                  >
                    <Smartphone className="w-5 h-5 mr-2" />
                    {t('addToHomeScreen') || 'Добавить на главный экран'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-bold">
                      {t('addToHomeScreenModal') || 'Установить на устройство'}
                    </DialogTitle>
                  </DialogHeader>
                  <MobileShortcutGenerator />
                </DialogContent>
              </Dialog>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardContent className="pt-6 text-center">
                        <IconComponent className="w-8 h-8 mx-auto mb-2 text-blue-400 animate-pulse" />
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <div className="text-sm text-slate-400">{stat.label}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 bg-slate-800/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-16" id="features">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {language === 'ru' ? 'Возможности Игры' : 
                 language === 'en' ? 'Game Features' :
                 language === 'ua' ? 'Можливості Гри' :
                 'Spiel-Features'}
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                {language === 'ru' ? 'Погрузитесь в мир профессионального управления серверами с реалистичной экономикой и интуитивным интерфейсом' : 
                 language === 'en' ? 'Dive into the world of professional server management with realistic economy and intuitive interface' :
                 language === 'ua' ? 'Поринайте у світ професійного управління серверами з реалістичною економікою та інтуїтивним інтерфейсом' :
                 'Tauchen Sie in die Welt des professionellen Server-Managements mit realistischer Wirtschaft und intuitiver Benutzeroberfläche ein'}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <Card 
                      key={index}
                      className={`cursor-pointer transition-all duration-300 ${
                        selectedFeature === index 
                          ? 'bg-blue-500/20 border-blue-500/50 scale-105' 
                          : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50'
                      }`}
                      onClick={() => setSelectedFeature(index)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-lg ${
                            selectedFeature === index 
                              ? 'bg-blue-500/30' 
                              : 'bg-slate-700/50'
                          }`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                            <p className="text-slate-300 text-sm">{feature.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="lg:pl-8">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      {React.createElement(features[selectedFeature].icon, { 
                        className: "w-8 h-8 text-blue-400" 
                      })}
                      <CardTitle className="text-white">
                        {features[selectedFeature].title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 mb-4">
                      {features[selectedFeature].description}
                    </p>
                    <Badge variant="outline" className="text-blue-300 border-blue-500/50">
                      {features[selectedFeature].details}
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {language === 'ru' ? 'Спасибо тестерам за помощь в создании и тестировании игры' : 
                 language === 'en' ? 'Thank you to testers for help in creating and testing the game' :
                 language === 'ua' ? 'Дякуємо тестерам за допомогу у створенні та тестуванні гри' :
                 'Danke an die Tester für die Hilfe bei der Erstellung und dem Testen des Spiels'}
                <span className="text-2xl ml-2 animate-pulse" style={{background: 'linear-gradient(45deg, #ef4444, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>❤️</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="pt-6">
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-slate-300 mb-4">"{testimonial.content}"</p>
                      <div>
                        <div className="font-semibold text-white">{testimonial.name}</div>
                        <div className="text-sm text-slate-400">{testimonial.role}</div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Player Rankings Section */}
      <section className="relative z-10 py-20" id="rankings">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {language === 'ru' ? 'Рейтинг Игроков' : 
               language === 'en' ? 'Player Rankings' :
               language === 'ua' ? 'Рейтинг Гравців' :
               'Spieler-Rangliste'}
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              {language === 'ru' ? 'Топ игроки по балансу, опыту и количеству серверов' : 
               language === 'en' ? 'Top players by balance, experience and server count' :
               language === 'ua' ? 'Топ гравці за балансом, досвідом та кількістю серверів' :
               'Top-Spieler nach Guthaben, Erfahrung und Serveranzahl'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="max-w-4xl mx-auto">
              {rankingsData?.rankings?.slice(0, 5).map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="mb-4"
                >
                  <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {index === 0 && <Crown className="w-6 h-6 text-yellow-400" />}
                            {index === 1 && <Trophy className="w-6 h-6 text-gray-400" />}
                            {index === 2 && <Trophy className="w-6 h-6 text-amber-600" />}
                            <span className="text-2xl font-bold text-white">#{index + 1}</span>
                          </div>
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">{player.nickname?.[0]?.toUpperCase()}</span>
                          </div>
                          <div>
                            <Link to={`/player/${player.nickname}`}>
                              <div className="font-semibold text-white text-lg hover:text-blue-400 cursor-pointer transition-colors">{player.nickname}</div>
                            </Link>
                            <div className="text-sm text-slate-400">{language === 'ru' ? 'Уровень' : language === 'en' ? 'Level' : language === 'ua' ? 'Рівень' : 'Stufe'} {player.level || 1}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-400">{formatCurrency(player.balance)}</div>
                          <div className="text-sm text-slate-400">{player.serverCount || 0} {language === 'ru' ? 'серверов' : language === 'en' ? 'servers' : language === 'ua' ? 'серверів' : 'Server'}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-700/50 bg-slate-900/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Server className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">Root Tycoon</span>
              </div>
              <p className="text-slate-400 text-sm">
              {language === 'ru' ? 'Лучший симулятор управления серверами с криптоплатежами и реальной экономикой.' : 
               language === 'en' ? 'The best server management simulator with crypto payments and a real economy.' :
               language === 'ua' ? 'Кращий симулятор управління серверами з криптоплатежами і реальною економікою.' :
               'Der beste Simulator für die Verwaltung von Servern mit Kryptowährungen und realer Wirtschaft.'}
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">
              {language === 'ru' ? 'Игра' : 
               language === 'en' ? 'Game' :
               language === 'ua' ? 'Гра' :
               'Spiel'}
              </h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/register" className="hover:text-white transition">
              {language === 'ru' ? 'Регистрация' : 
               language === 'en' ? 'Registration' :
               language === 'ua' ? 'Реєстрація' :
               'Registrierung'}
               </Link></li>
                <li><Link to="/login" className="hover:text-white transition">
                {language === 'ru' ? 'Войти' : 
               language === 'en' ? 'Log in' :
               language === 'ua' ? 'Увійти' :
               'Anmelden'}</Link></li>
                <li><a href="#features" className="hover:text-white transition">
              {language === 'ru' ? 'Возможности' : 
               language === 'en' ? 'Capabilities' :
               language === 'ua' ? 'Можливості' :
               'Möglichkeiten'}</a></li>
                <li><a href="#rankings" className="hover:text-white transition">
              {language === 'ru' ? 'Рейтинги' : 
               language === 'en' ? 'Ratings' :
               language === 'ua' ? 'Рейтинги' :
               'Bewertungen'}</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">
              {language === 'ru' ? 'Поддержка' : 
               language === 'en' ? 'Support' :
               language === 'ua' ? 'Підтримка' :
               'Unterstützung'}
              </h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="faq" className="hover:text-white transition">FAQ</a></li>
                <li><a href="rules" className="hover:text-white transition">
              {language === 'ru' ? 'Правила' : 
               language === 'en' ? 'Rules' :
               language === 'ua' ? 'Правила' :
               'Regeln'}</a></li>
                <li><a href="privacy" className="hover:text-white transition">
                {language === 'ru' ? 'Конфиденциальность' : 
               language === 'en' ? 'Privacy' :
               language === 'ua' ? 'Конфіденційність' :
               'Datenschutz'}</a></li>
                <li><a href="terms" className="hover:text-white transition">
              {language === 'ru' ? 'Условия использования' : 
               language === 'en' ? 'Terms of Use' :
               language === 'ua' ? 'Умови використання' :
               'Nutzungsbedingungen'}</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">
              {language === 'ru' ? 'Контакты' : 
               language === 'en' ? 'Contacts' :
               language === 'ua' ? 'Контакти' :
               'Kontakte'}
              </h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="https://t.me/Ca6aka" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-slate-400 hover:text-white transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">Telegram</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a 
                    href="mailto:root.tycoon.games@gmail.com" 
                    className="flex items-center space-x-2 text-slate-400 hover:text-white transition"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">
              {language === 'ru' ? 'Email поддержка' : 
               language === 'en' ? 'Email support' :
               language === 'ua' ? 'Email підтримка' :
               'Email Unterstützung'}
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700/50 mt-8 pt-8 text-center">
            <p className="text-slate-400 text-sm">
            {language === 'ru' ? '© 2025 Root Tycoon. Все права защищены. Сделано с ❤️ для игроков по всему миру.' : 
               language === 'en' ? '© 2025 Root Tycoon. All rights reserved. Made with ❤️ for gamers around the world.' :
               language === 'ua' ? '© 2025 Root Tycoon. Всі права захищені. Зроблено з ❤️ для гравців по всьому світу' :
               '© 2025 Root Tycoon. Alle Rechte vorbehalten. Mit ❤️ für Spieler auf der ganzen Welt erstellt.'}
            </p>
          </div>
        </div>
      </footer>

      {/* Cookie Consent */}
      <CookieConsent />
    </div>
  );
}