import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion } from 'framer-motion';
import { 
  Server, 
  MessageCircle,
  ExternalLink,
  Mail,
  ArrowLeft,
  HelpCircle,
  Coins,
  Shield,
  Users,
  Clock
} from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { ThemeToggle } from '@/components/theme-toggle';

export default function FAQPage() {
  const { t, language, changeLanguage } = useLanguage();

  const faqItems = [
    {
      id: "faq1",
      question: language === 'ru' ? 'Что такое Root Tycoon?' : 
                language === 'en' ? 'What is Root Tycoon?' :
                language === 'ua' ? 'Що таке Root Tycoon?' :
                'Was ist Root Tycoon?',
      answer: language === 'ru' ? 'Root Tycoon - это реалистичный симулятор управления серверами, где вы можете создать свою IT-империю, покупать и настраивать виртуальные серверы, изучать новые технологии и зарабатывать криптовалюту.' : 
              language === 'en' ? 'Root Tycoon is a realistic server management simulator where you can build your IT empire, buy and configure virtual servers, learn new technologies and earn cryptocurrency.' :
              language === 'ua' ? 'Root Tycoon - це реалістичний симулятор управління серверами, де ви можете створити свою IT-імперію, купувати та налаштовувати віртуальні сервери, вивчати нові технології та заробляти криптовалюту.' :
              'Root Tycoon ist ein realistischer Server-Management-Simulator, in dem Sie Ihr IT-Imperium aufbauen, virtuelle Server kaufen und konfigurieren, neue Technologien erlernen und Kryptowährung verdienen können.'
    },
    {
      id: "faq2", 
      question: language === 'ru' ? 'Как начать играть?' : 
                language === 'en' ? 'How to start playing?' :
                language === 'ua' ? 'Як почати грати?' :
                'Wie fange ich an zu spielen?',
      answer: language === 'ru' ? 'Зарегистрируйтесь на сайте, пройдите обучающий туториал и получите стартовый капитал. Затем покупайте свой первый сервер и начинайте зарабатывать!' : 
              language === 'en' ? 'Register on the website, complete the tutorial and get starting capital. Then buy your first server and start earning!' :
              language === 'ua' ? 'Зареєструйтеся на сайті, пройдіть навчальний туторіал та отримайте стартовий капітал. Потім купуйте свій перший сервер та починайте заробляти!' :
              'Registrieren Sie sich auf der Website, absolvieren Sie das Tutorial und erhalten Sie Startkapital. Dann kaufen Sie Ihren ersten Server und beginnen zu verdienen!'
    },
    {
      id: "faq3",
      question: language === 'ru' ? 'Как работают криптоплатежи?' : 
                language === 'en' ? 'How do crypto payments work?' :
                language === 'ua' ? 'Як працюють криптоплатежі?' :
                'Wie funktionieren Krypto-Zahlungen?',
      answer: language === 'ru' ? 'Мы используем NOWPayments для обработки криптоплатежей. Поддерживаются Bitcoin, Ethereum, USDT и более 50 других криптовалют. Все транзакции безопасны и обрабатываются автоматически.' : 
              language === 'en' ? 'We use NOWPayments to process crypto payments. Bitcoin, Ethereum, USDT and over 50 other cryptocurrencies are supported. All transactions are secure and processed automatically.' :
              language === 'ua' ? 'Ми використовуємо NOWPayments для обробки криптоплатежів. Підтримуються Bitcoin, Ethereum, USDT та понад 50 інших криптовалют. Усі транзакції безпечні та обробляються автоматично.' :
              'Wir verwenden NOWPayments zur Verarbeitung von Krypto-Zahlungen. Bitcoin, Ethereum, USDT und über 50 andere Kryptowährungen werden unterstützt. Alle Transaktionen sind sicher und werden automatisch verarbeitet.'
    },
    {
      id: "faq4",
      question: language === 'ru' ? 'Что дает VIP и Premium статус?' : 
                language === 'en' ? 'What do VIP and Premium status give?' :
                language === 'ua' ? 'Що дає VIP та Premium статус?' :
                'Was bieten VIP- und Premium-Status?',
      answer: language === 'ru' ? 'VIP ($20, 6 месяцев): увеличенный лимит серверов до 30, эксклюзивные эмодзи в чате, приоритет в поддержке. Premium ($25, навсегда): все преимущества VIP + лимит серверов до 35, особые бонусы и rewards.' : 
              language === 'en' ? 'VIP ($20, 6 months): increased server limit to 30, exclusive chat emojis, priority support. Premium ($25, lifetime): all VIP benefits + server limit up to 35, special bonuses and rewards.' :
              language === 'ua' ? 'VIP ($20, 6 місяців): збільшений ліміт серверів до 30, ексклюзивні емодзі в чаті, пріоритет у підтримці. Premium ($25, назавжди): усі переваги VIP + ліміт серверів до 35, особливі бонуси та нагороди.' :
              'VIP ($20, 6 Monate): erhöhtes Serverlimit auf 30, exklusive Chat-Emojis, Priority-Support. Premium ($25, lebenslang): alle VIP-Vorteile + Serverlimit bis 35, spezielle Boni und Belohnungen.'
    },
    {
      id: "faq5",
      question: language === 'ru' ? 'Как работает система уровней?' : 
                language === 'en' ? 'How does the level system work?' :
                language === 'ua' ? 'Як працює система рівнів?' :
                'Wie funktioniert das Level-System?',
      answer: language === 'ru' ? 'Ваш уровень повышается с накоплением опыта. Опыт получается за выполнение курсов, достижений, мини-игр и активность в игре. Каждый новый уровень открывает доступ к более мощным серверам.' : 
              language === 'en' ? 'Your level increases with experience accumulation. Experience is gained from completing courses, achievements, mini-games and game activity. Each new level unlocks access to more powerful servers.' :
              language === 'ua' ? 'Ваш рівень підвищується з накопиченням досвіду. Досвід отримується за виконання курсів, досягнень, міні-ігор та активність у грі. Кожен новий рівень відкриває доступ до потужніших серверів.' :
              'Ihr Level steigt mit der Ansammlung von Erfahrung. Erfahrung wird durch das Abschließen von Kursen, Errungenschaften, Mini-Spielen und Spielaktivität gesammelt. Jedes neue Level schaltet den Zugang zu leistungsfähigeren Servern frei.'
    },
    {
      id: "faq6",
      question: language === 'ru' ? 'Можно ли потерять сервера?' : 
                language === 'en' ? 'Can I lose servers?' :
                language === 'ua' ? 'Чи можна втратити сервери?' :
                'Kann ich Server verlieren?',
      answer: language === 'ru' ? 'Да, сервера могут выходить из строя при высокой нагрузке (90%+) или недостатке средств на обслуживание. Регулярно следите за состоянием серверов и своевременно их ремонтируйте.' : 
              language === 'en' ? 'Yes, servers can fail under high load (90%+) or lack of maintenance funds. Regularly monitor server status and repair them timely.' :
              language === 'ua' ? 'Так, сервери можуть виходити з ладу при високому навантаженні (90%+) або нестачі коштів на обслуговування. Регулярно стежте за станом серверів та своєчасно їх ремонтуйте.' :
              'Ja, Server können bei hoher Last (90%+) oder mangelnden Wartungsgeldern ausfallen. Überwachen Sie regelmäßig den Serverstatus und reparieren Sie sie rechtzeitig.'
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
              <Link to="/">
                <div className="flex items-center space-x-3 cursor-pointer">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Server className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">Root Tycoon</h1>
                    <p className="text-xs text-slate-400">
                      {language === 'ru' ? 'Управление Серверами' : 
                       language === 'en' ? 'Server Management' :
                       language === 'ua' ? 'Керування Серверами' :
                       'Server-Verwaltung'}
                    </p>
                  </div>
                </div>
              </Link>
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
                <Link to="/">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {language === 'ru' ? 'На главную' : 
                     language === 'en' ? 'Home' :
                     language === 'ua' ? 'На головну' :
                     'Startseite'}
                  </Button>
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center mb-6">
              <HelpCircle className="w-12 h-12 text-blue-400 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                {language === 'ru' ? 'Часто Задаваемые Вопросы' : 
                 language === 'en' ? 'Frequently Asked Questions' :
                 language === 'ua' ? 'Часто Задавані Питання' :
                 'Häufig Gestellte Fragen'}
              </h1>
            </div>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              {language === 'ru' ? 'Найдите ответы на самые популярные вопросы о Root Tycoon. Если не нашли нужный ответ, обратитесь в поддержку.' : 
               language === 'en' ? 'Find answers to the most popular questions about Root Tycoon. If you didn\'t find the answer you need, contact support.' :
               language === 'ua' ? 'Знайдіть відповіді на найпопулярніші питання про Root Tycoon. Якщо не знайшли потрібну відповідь, зверніться до підтримки.' :
               'Finden Sie Antworten auf die beliebtesten Fragen zu Root Tycoon. Wenn Sie die gewünschte Antwort nicht gefunden haben, wenden Sie sich an den Support.'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-2xl text-center">
                  {language === 'ru' ? 'База Знаний' : 
                   language === 'en' ? 'Knowledge Base' :
                   language === 'ua' ? 'База Знань' :
                   'Wissensdatenbank'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={item.id} value={item.id} className="border-slate-700">
                      <AccordionTrigger className="text-white hover:text-blue-400 text-left">
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-3 text-blue-300 border-blue-500/50">
                            {index + 1}
                          </Badge>
                          {item.question}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-300 pt-4 pb-6 leading-relaxed">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2 text-blue-400" />
                    {language === 'ru' ? 'Нужна помощь?' : 
                     language === 'en' ? 'Need help?' :
                     language === 'ua' ? 'Потрібна допомога?' :
                     'Brauchen Sie Hilfe?'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 mb-4">
                    {language === 'ru' ? 'Свяжитесь с нашей службой поддержки для получения персональной помощи.' : 
                     language === 'en' ? 'Contact our support team for personalized assistance.' :
                     language === 'ua' ? 'Зв\'яжіться з нашою службою підтримки для отримання персональної допомоги.' :
                     'Kontaktieren Sie unser Support-Team für persönliche Hilfe.'}
                  </p>
                  <div className="space-y-3">
                    <a 
                      href="https://t.me/Ca6aka" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Telegram Support
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                    <a 
                      href="mailto:root.tycoon.games@gmail.com" 
                      className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email Support
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-green-400" />
                    {language === 'ru' ? 'Время ответа' : 
                     language === 'en' ? 'Response time' :
                     language === 'ua' ? 'Час відповіді' :
                     'Antwortzeit'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-slate-300">
                    <div className="flex justify-between">
                      <span>VIP/Premium:</span>
                      <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50">
                        {language === 'ru' ? '< 2 часов' : 
                         language === 'en' ? '< 2 hours' :
                         language === 'ua' ? '< 2 години' :
                         '< 2 Stunden'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        {language === 'ru' ? 'Обычные пользователи:' : 
                         language === 'en' ? 'Regular users:' :
                         language === 'ua' ? 'Звичайні користувачі:' :
                         'Normale Benutzer:'}
                      </span>
                      <Badge variant="outline" className="text-slate-300 border-slate-500">
                        {language === 'ru' ? '< 24 часов' : 
                         language === 'en' ? '< 24 hours' :
                         language === 'ua' ? '< 24 години' :
                         '< 24 Stunden'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </main>

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
                 language === 'en' ? 'The best server management simulator with crypto payments and real economy.' :
                 language === 'ua' ? 'Найкращий симулятор управління серверами з криптоплатежами та реальною економікою.' :
                 'Der beste Server-Management-Simulator mit Krypto-Zahlungen und realer Wirtschaft.'}
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
                   language === 'en' ? 'Register' :
                   language === 'ua' ? 'Реєстрація' :
                   'Registrieren'}
                </Link></li>
                <li><Link to="/login" className="hover:text-white transition">
                  {language === 'ru' ? 'Вход' : 
                   language === 'en' ? 'Login' :
                   language === 'ua' ? 'Вхід' :
                   'Anmelden'}
                </Link></li>
                <li><Link to="/#features" className="hover:text-white transition">
                  {language === 'ru' ? 'Возможности' : 
                   language === 'en' ? 'Features' :
                   language === 'ua' ? 'Можливості' :
                   'Features'}
                </Link></li>
                <li><Link to="/#rankings" className="hover:text-white transition">
                  {language === 'ru' ? 'Рейтинги' : 
                   language === 'en' ? 'Rankings' :
                   language === 'ua' ? 'Рейтинги' :
                   'Rankings'}
                </Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">
                {language === 'ru' ? 'Поддержка' : 
                 language === 'en' ? 'Support' :
                 language === 'ua' ? 'Підтримка' :
                 'Support'}
              </h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/faq" className="hover:text-white transition">FAQ</Link></li>
                <li><Link to="/rules" className="hover:text-white transition">
                  {language === 'ru' ? 'Правила' : 
                   language === 'en' ? 'Rules' :
                   language === 'ua' ? 'Правила' :
                   'Regeln'}
                </Link></li>
                <li><Link to="/privacy" className="hover:text-white transition">
                  {language === 'ru' ? 'Конфиденциальность' : 
                   language === 'en' ? 'Privacy' :
                   language === 'ua' ? 'Конфіденційність' :
                   'Datenschutz'}
                </Link></li>
                <li><Link to="/terms" className="hover:text-white transition">
                  {language === 'ru' ? 'Условия использования' : 
                   language === 'en' ? 'Terms of Use' :
                   language === 'ua' ? 'Умови використання' :
                   'Nutzungsbedingungen'}
                </Link></li>
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
                       language === 'en' ? 'Email Support' :
                       language === 'ua' ? 'Email підтримка' :
                       'Email-Support'}
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2025 Root Tycoon. {language === 'ru' ? 'Все права защищены.' : 
                                        language === 'en' ? 'All rights reserved.' :
                                        language === 'ua' ? 'Усі права захищені.' :
                                        'Alle Rechte vorbehalten.'}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}