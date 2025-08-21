import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Server, 
  MessageCircle,
  ExternalLink,
  Mail,
  ArrowLeft,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Users,
  Ban
} from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { ThemeToggle } from '@/components/theme-toggle';

export default function RulesPage() {
  const { t, language, changeLanguage } = useLanguage();

  const rulesSection = [
    {
      title: language === 'ru' ? 'Общие Правила' : 
             language === 'en' ? 'General Rules' :
             language === 'ua' ? 'Загальні Правила' :
             'Allgemeine Regeln',
      icon: Shield,
      color: 'blue',
      rules: [
        language === 'ru' ? 'Запрещено использование читов, ботов или любых сторонних программ для получения преимущества в игре' : 
        language === 'en' ? 'Use of cheats, bots or any third-party programs to gain advantage in the game is prohibited' :
        language === 'ua' ? 'Заборонено використання читів, ботів або будь-яких сторонніх програм для отримання переваги в грі' :
        'Die Verwendung von Cheats, Bots oder Drittanbieterprogrammen zur Erlangung von Spielvorteilen ist verboten',
        
        language === 'ru' ? 'Один аккаунт на человека. Создание множественных аккаунтов строго запрещено' : 
        language === 'en' ? 'One account per person. Creating multiple accounts is strictly prohibited' :
        language === 'ua' ? 'Один аккаунт на людину. Створення множинних аккаунтів суворо заборонено' :
        'Ein Konto pro Person. Das Erstellen mehrerer Konten ist strengstens verboten',
        
        language === 'ru' ? 'Запрещена продажа, покупка или передача аккаунтов третьим лицам' : 
        language === 'en' ? 'Selling, buying or transferring accounts to third parties is prohibited' :
        language === 'ua' ? 'Заборонено продаж, купівля або передача аккаунтів третім особам' :
        'Der Verkauf, Kauf oder die Übertragung von Konten an Dritte ist verboten',
        
        language === 'ru' ? 'Уважайте других игроков и администрацию. Любые формы дискриминации недопустимы' : 
        language === 'en' ? 'Respect other players and administration. Any forms of discrimination are unacceptable' :
        language === 'ua' ? 'Поважайте інших гравців та адміністрацію. Будь-які форми дискримінації неприпустимі' :
        'Respektieren Sie andere Spieler und die Verwaltung. Jede Form der Diskriminierung ist inakzeptabel'
      ]
    },
    {
      title: language === 'ru' ? 'Правила Чата' : 
             language === 'en' ? 'Chat Rules' :
             language === 'ua' ? 'Правила Чату' :
             'Chat-Regeln',
      icon: MessageCircle,
      color: 'green',
      rules: [
        language === 'ru' ? 'Запрещена реклама сторонних проектов, товаров или услуг без разрешения администрации' : 
        language === 'en' ? 'Advertising third-party projects, goods or services without administration permission is prohibited' :
        language === 'ua' ? 'Заборонена реклама сторонніх проектів, товарів або послуг без дозволу адміністрації' :
        'Werbung für Projekte, Waren oder Dienstleistungen Dritter ohne Genehmigung der Verwaltung ist verboten',
        
        language === 'ru' ? 'Запрещен спам, флуд и бессмысленные сообщения. Пишите по существу' : 
        language === 'en' ? 'Spam, flood and meaningless messages are prohibited. Write to the point' :
        language === 'ua' ? 'Заборонений спам, флуд та безглузді повідомлення. Пишіть по суті' :
        'Spam, Flood und sinnlose Nachrichten sind verboten. Schreiben Sie auf den Punkt',
        
        language === 'ru' ? 'Запрещены оскорбления, угрозы, мат и неприличные выражения' : 
        language === 'en' ? 'Insults, threats, profanity and indecent expressions are prohibited' :
        language === 'ua' ? 'Заборонені образи, погрози, лайка та непристойні вирази' :
        'Beleidigungen, Drohungen, Obszönitäten und unanständige Ausdrücke sind verboten',
        
        language === 'ru' ? 'Запрещено выдавать себя за администратора или модератора' : 
        language === 'en' ? 'Impersonating an administrator or moderator is prohibited' :
        language === 'ua' ? 'Заборонено видавати себе за адміністратора або модератора' :
        'Die Vortäuschung eines Administrators oder Moderators ist verboten'
      ]
    },
    {
      title: language === 'ru' ? 'Игровой Процесс' : 
             language === 'en' ? 'Gameplay' :
             language === 'ua' ? 'Ігровий Процес' :
             'Gameplay',
      icon: Users,
      color: 'purple',
      rules: [
        language === 'ru' ? 'Запрещено использование багов и эксплойтов. О найденных ошибках сообщайте в поддержку' : 
        language === 'en' ? 'Use of bugs and exploits is prohibited. Report found errors to support' :
        language === 'ua' ? 'Заборонено використання багів та експлойтів. Про знайдені помилки повідомляйте в підтримку' :
        'Die Verwendung von Bugs und Exploits ist verboten. Melden Sie gefundene Fehler an den Support',
        
        language === 'ru' ? 'Запрещены попытки взлома серверов игры или других игроков' : 
        language === 'en' ? 'Attempts to hack game servers or other players are prohibited' :
        language === 'ua' ? 'Заборонені спроби зламу серверів гри або інших гравців' :
        'Versuche, Spielserver oder andere Spieler zu hacken, sind verboten',
        
        language === 'ru' ? 'Запрещено намеренное засорение или перегрузка игровых серверов' : 
        language === 'en' ? 'Intentional littering or overloading of game servers is prohibited' :
        language === 'ua' ? 'Заборонено навмисне засмічення або перевантаження ігрових серверів' :
        'Absichtliche Verschmutzung oder Überlastung von Spielservern ist verboten',
        
        language === 'ru' ? 'Запрещена торговля игровой валютой за реальные деньги вне официальных каналов' : 
        language === 'en' ? 'Trading game currency for real money outside official channels is prohibited' :
        language === 'ua' ? 'Заборонена торгівля ігровою валютою за реальні гроші поза офіційними каналами' :
        'Der Handel mit Spielwährung für echtes Geld außerhalb offizieller Kanäle ist verboten'
      ]
    }
  ];

  const violations = [
    {
      type: language === 'ru' ? 'Легкое нарушение' : 
            language === 'en' ? 'Minor violation' :
            language === 'ua' ? 'Легке порушення' :
            'Geringfügiger Verstoß',
      punishment: language === 'ru' ? 'Предупреждение или мут на 1-24 часа' : 
                  language === 'en' ? 'Warning or mute for 1-24 hours' :
                  language === 'ua' ? 'Попередження або мут на 1-24 години' :
                  'Warnung oder Stummschaltung für 1-24 Stunden',
      color: 'yellow',
      icon: AlertTriangle
    },
    {
      type: language === 'ru' ? 'Серьезное нарушение' : 
            language === 'en' ? 'Serious violation' :
            language === 'ua' ? 'Серйозне порушення' :
            'Schwerwiegender Verstoß',
      punishment: language === 'ru' ? 'Временный бан на 1-30 дней' : 
                  language === 'en' ? 'Temporary ban for 1-30 days' :
                  language === 'ua' ? 'Тимчасовий бан на 1-30 днів' :
                  'Temporäre Sperre für 1-30 Tage',
      color: 'orange',
      icon: XCircle
    },
    {
      type: language === 'ru' ? 'Критическое нарушение' : 
            language === 'en' ? 'Critical violation' :
            language === 'ua' ? 'Критичне порушення' :
            'Kritischer Verstoß',
      punishment: language === 'ru' ? 'Перманентный бан аккаунта' : 
                  language === 'en' ? 'Permanent account ban' :
                  language === 'ua' ? 'Перманентний бан аккаунта' :
                  'Permanente Kontosperre',
      color: 'red',
      icon: Ban
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
              <Shield className="w-12 h-12 text-blue-400 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                {language === 'ru' ? 'Правила Игры' : 
                 language === 'en' ? 'Game Rules' :
                 language === 'ua' ? 'Правила Гри' :
                 'Spielregeln'}
              </h1>
            </div>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              {language === 'ru' ? 'Соблюдение правил обеспечивает комфортную игру для всех участников. Ознакомьтесь с правилами перед началом игры.' : 
               language === 'en' ? 'Following the rules ensures a comfortable game for all participants. Please read the rules before starting the game.' :
               language === 'ua' ? 'Дотримання правил забезпечує комфортну гру для всіх учасників. Ознайомтеся з правилами перед початком гри.' :
               'Die Einhaltung der Regeln gewährleistet ein angenehmes Spiel für alle Teilnehmer. Bitte lesen Sie die Regeln vor Spielbeginn.'}
            </p>
          </motion.div>

          {/* Rules Sections */}
          <div className="space-y-8 mb-16">
            {rulesSection.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center text-2xl">
                        <IconComponent className={`w-6 h-6 mr-3 text-${section.color}-400`} />
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {section.rules.map((rule, ruleIndex) => (
                          <div key={ruleIndex} className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                            <p className="text-slate-300 leading-relaxed">{rule}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Violations and Punishments */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              {language === 'ru' ? 'Система Наказаний' : 
               language === 'en' ? 'Punishment System' :
               language === 'ua' ? 'Система Покарань' :
               'Bestrafungssystem'}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {violations.map((violation, index) => {
                const IconComponent = violation.icon;
                return (
                  <Card key={index} className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <IconComponent className={`w-5 h-5 mr-2 text-${violation.color}-400`} />
                        {violation.type}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge 
                        variant="outline" 
                        className={`text-${violation.color}-300 border-${violation.color}-500/50 bg-${violation.color}-500/10`}
                      >
                        {violation.punishment}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>

          {/* Important Notice */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <Card className="bg-red-500/10 border-red-500/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <AlertTriangle className="w-6 h-6 mr-3 text-red-400" />
                  {language === 'ru' ? 'Важно Знать' : 
                   language === 'en' ? 'Important to Know' :
                   language === 'ua' ? 'Важливо Знати' :
                   'Wichtig zu wissen'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-slate-300">
                  <p>
                    {language === 'ru' ? '• Администрация оставляет за собой право изменять правила без предварительного уведомления' : 
                     language === 'en' ? '• Administration reserves the right to change rules without prior notice' :
                     language === 'ua' ? '• Адміністрація залишає за собою право змінювати правила без попереднього повідомлення' :
                     '• Die Verwaltung behält sich das Recht vor, die Regeln ohne vorherige Ankündigung zu ändern'}
                  </p>
                  <p>
                    {language === 'ru' ? '• Незнание правил не освобождает от ответственности за их нарушение' : 
                     language === 'en' ? '• Ignorance of rules does not exempt from responsibility for their violation' :
                     language === 'ua' ? '• Незнання правил не звільняє від відповідальності за їх порушення' :
                     '• Unwissenheit über die Regeln befreit nicht von der Verantwortung für deren Verletzung'}
                  </p>
                  <p>
                    {language === 'ru' ? '• Все решения администрации являются окончательными и обжалованию не подлежат' : 
                     language === 'en' ? '• All administration decisions are final and not subject to appeal' :
                     language === 'ua' ? '• Усі рішення адміністрації є остаточними та не підлягають оскарженню' :
                     '• Alle Verwaltungsentscheidungen sind endgültig und nicht anfechtbar'}
                  </p>
                </div>
              </CardContent>
            </Card>
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