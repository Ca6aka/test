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
  Crown
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
      title: 'Управление Серверами',
      description: 'Покупайте, настраивайте и оптимизируйте виртуальные серверы для максимальной прибыли',
      details: 'Более 15 типов серверов с уникальными характеристиками'
    },
    {
      icon: TrendingUp,
      title: 'Пассивный Доход',
      description: 'Зарабатывайте деньги даже когда не в игре благодаря автоматизированным серверам',
      details: 'Доход каждую минуту, оптимизация загрузки серверов'
    },
    {
      icon: Award,
      title: 'Система Достижений',
      description: 'Разблокируйте достижения и получайте награды за прогресс в игре',
      details: 'Более 20 достижений с денежными и опытными наградами'
    },
    {
      icon: Gamepad2,
      title: 'Мини-Игры',
      description: 'Играйте в увлекательные мини-игры для получения дополнительного опыта',
      details: 'DDoS защита, Файрвол фильтр и другие IT-челленджи'
    },
    {
      icon: Coins,
      title: 'Криптоплатежи',
      description: 'VIP и Premium подписки с оплатой в криптовалюте через NOWPayments',
      details: 'Bitcoin, Ethereum, USDT и 50+ других криптовалют'
    },
    {
      icon: Users,
      title: 'Мультиплеер',
      description: 'Общайтесь с другими игроками в реальном времени и соревнуйтесь в рейтингах',
      details: 'Глобальные рейтинги, чат с эмодзи для VIP пользователей'
    }
  ];

  const stats = [
    { label: 'Всего игроков', value: statsData?.totalPlayers || '0', icon: Users },
    { label: 'Онлайн', value: statsData?.onlinePlayers || '0', icon: Users },
    { label: 'Серверов', value: statsData?.totalServers || '0', icon: Server },
    { label: 'Общий баланс', value: statsData?.totalBalance ? formatCurrency(statsData.totalBalance) : '$0', icon: DollarSign }
  ];

  const testimonials = [
    {
      name: 'Александр К.',
      role: 'Premium тестер',
      content: 'Отличная игра! Реально затягивает управление серверами. VIP статус стоит своих денег.',
      rating: 5
    },
    {
      name: 'Мария С.',
      role: 'IT-тестер',
      content: 'Как IT-специалист могу сказать - игра очень реалистично передаёт процессы управления серверами.',
      rating: 5
    },
    {
      name: 'Дмитрий В.',
      role: 'VIP тестер',
      content: 'Играю уже полгода. Нравится постоянное развитие игры и новые функции.',
      rating: 4
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
                <p className="text-xs text-slate-400">Управление Серверами</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button 
                  variant={language === 'ru' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => changeLanguage('ru')}
                >
                  🇷🇺
                </Button>
                <Button 
                  variant={language === 'en' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => changeLanguage('en')}
                >
                  🇺🇸
                </Button>
                <Button 
                  variant={language === 'uk' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => changeLanguage('uk')}
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
                    Вход
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="default" size="sm">
                    Регистрация
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
              Создай свою IT-империю! Управляй серверами, зарабатывай криптовалюту, 
              соревнуйся с игроками со всего мира в самом реалистичном симуляторе серверов.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8">
                  <Play className="w-5 h-5 mr-2" />
                  Начать Играть
                </Button>
              </Link>
              
              <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                <Globe className="w-5 h-5 mr-2" />
                Смотреть Демо
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
                        <IconComponent className="w-8 h-8 mx-auto mb-2 text-blue-400" />
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
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Возможности Игры
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                Погрузитесь в мир профессионального управления серверами с реалистичной экономикой и интуитивным интерфейсом
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
                Отзывы Тестеров
              </h2>
              <p className="text-slate-300">
                Что говорят наши игроки о Root Tycoon
              </p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Рейтинг Игроков</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Топ игроки по балансу, опыту и количеству серверов
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
                            <div className="font-semibold text-white text-lg">{player.nickname}</div>
                            <div className="text-sm text-slate-400">Уровень {player.level || 1}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-400">{formatCurrency(player.balance)}</div>
                          <div className="text-sm text-slate-400">{player.totalServers || 0} серверов</div>
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
                Лучший симулятор управления серверами с криптоплатежами и реальной экономикой.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Игра</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/register" className="hover:text-white transition">Регистрация</Link></li>
                <li><Link to="/login" className="hover:text-white transition">Вход</Link></li>
                <li><a href="#features" className="hover:text-white transition">Возможности</a></li>
                <li><a href="#" className="hover:text-white transition">Рейтинги</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Поддержка</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition">Правила</a></li>
                <li><a href="#" className="hover:text-white transition">Конфиденциальность</a></li>
                <li><a href="#" className="hover:text-white transition">Условия использования</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Контакты</h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="https://t.me/ServertycoonSupport" 
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
                    href="mailto:support@roottycoon.ru" 
                    className="flex items-center space-x-2 text-slate-400 hover:text-white transition"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">Email поддержка</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700/50 mt-8 pt-8 text-center">
            <p className="text-slate-400 text-sm">
              © 2024 Root Tycoon. Все права защищены. Сделано с ❤️ для игроков по всему миру.
            </p>
          </div>
        </div>
      </footer>

      {/* Cookie Consent */}
      <CookieConsent />
    </div>
  );
}