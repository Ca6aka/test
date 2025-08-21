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
  Lock,
  Eye,
  Database,
  Shield,
  Cookie,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { ThemeToggle } from '@/components/theme-toggle';

export default function PrivacyPage() {
  const { t, language, changeLanguage } = useLanguage();

  const privacySections = [
    {
      title: language === 'ru' ? 'Сбор Информации' : 
             language === 'en' ? 'Information Collection' :
             language === 'ua' ? 'Збір Інформації' :
             'Informationssammlung',
      icon: Database,
      content: [
        language === 'ru' ? 'Мы собираем только необходимую информацию для функционирования игры: никнейм, email (опционально), игровую статистику и прогресс.' : 
        language === 'en' ? 'We collect only necessary information for game functioning: nickname, email (optional), game statistics and progress.' :
        language === 'ua' ? 'Ми збираємо лише необхідну інформацію для функціонування гри: нікнейм, email (опціонально), ігрову статистику та прогрес.' :
        'Wir sammeln nur notwendige Informationen für das Funktionieren des Spiels: Nickname, E-Mail (optional), Spielstatistiken und Fortschritt.',
        
        language === 'ru' ? 'Персональные данные (имя, фамилия, адрес, телефон) НЕ требуются и НЕ собираются.' : 
        language === 'en' ? 'Personal data (name, surname, address, phone) is NOT required and NOT collected.' :
        language === 'ua' ? 'Персональні дані (ім\'я, прізвище, адреса, телефон) НЕ потрібні та НЕ збираються.' :
        'Persönliche Daten (Name, Nachname, Adresse, Telefon) sind NICHT erforderlich und werden NICHT gesammelt.',
        
        language === 'ru' ? 'IP-адреса и данные браузера используются только для обеспечения безопасности и предотвращения мошенничества.' : 
        language === 'en' ? 'IP addresses and browser data are used only for security and fraud prevention.' :
        language === 'ua' ? 'IP-адреси та дані браузера використовуються лише для забезпечення безпеки та запобігання шахрайству.' :
        'IP-Adressen und Browserdaten werden nur für Sicherheit und Betrugsprävention verwendet.'
      ]
    },
    {
      title: language === 'ru' ? 'Использование Данных' : 
             language === 'en' ? 'Data Usage' :
             language === 'ua' ? 'Використання Даних' :
             'Datenverwendung',
      icon: Eye,
      content: [
        language === 'ru' ? 'Ваши данные используются исключительно для предоставления игрового сервиса и улучшения игрового опыта.' : 
        language === 'en' ? 'Your data is used exclusively to provide gaming service and improve gaming experience.' :
        language === 'ua' ? 'Ваші дані використовуються виключно для надання ігрового сервісу та покращення ігрового досвіду.' :
        'Ihre Daten werden ausschließlich zur Bereitstellung des Gaming-Service und zur Verbesserung der Spielerfahrung verwendet.',
        
        language === 'ru' ? 'Мы НЕ продаем, НЕ передаем и НЕ арендуем ваши данные третьим лицам для рекламных целей.' : 
        language === 'en' ? 'We do NOT sell, transfer or rent your data to third parties for advertising purposes.' :
        language === 'ua' ? 'Ми НЕ продаємо, НЕ передаємо та НЕ орендуємо ваші дані третім особам для рекламних цілей.' :
        'Wir verkaufen, übertragen oder vermieten Ihre Daten NICHT an Dritte für Werbezwecke.',
        
        language === 'ru' ? 'Игровая статистика может быть использована для создания общих рейтингов и аналитики (без привязки к личности).' : 
        language === 'en' ? 'Game statistics may be used to create general rankings and analytics (without personal identification).' :
        language === 'ua' ? 'Ігрова статистика може використовуватися для створення загальних рейтингів та аналітики (без прив\'язки до особистості).' :
        'Spielstatistiken können zur Erstellung allgemeiner Ranglisten und Analysen verwendet werden (ohne persönliche Identifikation).'
      ]
    },
    {
      title: language === 'ru' ? 'Защита Данных' : 
             language === 'en' ? 'Data Protection' :
             language === 'ua' ? 'Захист Даних' :
             'Datenschutz',
      icon: Shield,
      content: [
        language === 'ru' ? 'Все данные хранятся в зашифрованном виде на защищенных серверах с ограниченным доступом.' : 
        language === 'en' ? 'All data is stored encrypted on secure servers with restricted access.' :
        language === 'ua' ? 'Усі дані зберігаються в зашифрованому вигляді на захищених серверах з обмеженим доступом.' :
        'Alle Daten werden verschlüsselt auf sicheren Servern mit eingeschränktem Zugang gespeichert.',
        
        language === 'ru' ? 'Пароли хешируются с использованием современных алгоритмов шифрования и никогда не хранятся в открытом виде.' : 
        language === 'en' ? 'Passwords are hashed using modern encryption algorithms and never stored in plain text.' :
        language === 'ua' ? 'Паролі хешуються з використанням сучасних алгоритмів шифрування та ніколи не зберігаються у відкритому вигляді.' :
        'Passwörter werden mit modernen Verschlüsselungsalgorithmen gehasht und niemals im Klartext gespeichert.',
        
        language === 'ru' ? 'Доступ к серверам имеют только авторизованные сотрудники с подписанными соглашениями о неразглашении.' : 
        language === 'en' ? 'Only authorized employees with signed non-disclosure agreements have access to servers.' :
        language === 'ua' ? 'Доступ до серверів мають лише авторизовані співробітники з підписаними угодами про нерозголошення.' :
        'Nur autorisierte Mitarbeiter mit unterzeichneten Geheimhaltungsvereinbarungen haben Zugang zu den Servern.'
      ]
    },
    {
      title: language === 'ru' ? 'Cookies и Сессии' : 
             language === 'en' ? 'Cookies and Sessions' :
             language === 'ua' ? 'Cookies та Сесії' :
             'Cookies und Sitzungen',
      icon: Cookie,
      content: [
        language === 'ru' ? 'Мы используем технические cookies для поддержания вашей игровой сессии и сохранения настроек интерфейса.' : 
        language === 'en' ? 'We use technical cookies to maintain your gaming session and save interface settings.' :
        language === 'ua' ? 'Ми використовуємо технічні cookies для підтримки вашої ігрової сесії та збереження налаштувань інтерфейсу.' :
        'Wir verwenden technische Cookies, um Ihre Spielsitzung aufrechtzuerhalten und Schnittstelleneinstellungen zu speichern.',
        
        language === 'ru' ? 'Рекламные и отслеживающие cookies НЕ используются. Никакой рекламы третьих лиц в игре нет.' : 
        language === 'en' ? 'Advertising and tracking cookies are NOT used. There are no third-party ads in the game.' :
        language === 'ua' ? 'Рекламні та відстежуючі cookies НЕ використовуються. Жодної реклами третіх осіб у грі немає.' :
        'Werbe- und Tracking-Cookies werden NICHT verwendet. Es gibt keine Werbung von Drittanbietern im Spiel.',
        
        language === 'ru' ? 'Вы можете отключить cookies в настройках браузера, но это может повлиять на функциональность игры.' : 
        language === 'en' ? 'You can disable cookies in browser settings, but this may affect game functionality.' :
        language === 'ua' ? 'Ви можете вимкнути cookies в налаштуваннях браузера, але це може вплинути на функціональність гри.' :
        'Sie können Cookies in den Browsereinstellungen deaktivieren, aber dies kann die Spielfunktionalität beeinträchtigen.'
      ]
    },
    {
      title: language === 'ru' ? 'Ваши Права' : 
             language === 'en' ? 'Your Rights' :
             language === 'ua' ? 'Ваші Права' :
             'Ihre Rechte',
      icon: Lock,
      content: [
        language === 'ru' ? 'Вы имеете право запросить копию всех ваших данных, хранящихся в нашей системе.' : 
        language === 'en' ? 'You have the right to request a copy of all your data stored in our system.' :
        language === 'ua' ? 'Ви маєте право запросити копію всіх ваших даних, що зберігаються в нашій системі.' :
        'Sie haben das Recht, eine Kopie aller Ihrer in unserem System gespeicherten Daten anzufordern.',
        
        language === 'ru' ? 'Вы можете в любой момент удалить свой аккаунт и все связанные с ним данные без объяснения причин.' : 
        language === 'en' ? 'You can delete your account and all associated data at any time without explanation.' :
        language === 'ua' ? 'Ви можете в будь-який момент видалити свій аккаунт та всі пов\'язані з ним дані без пояснення причин.' :
        'Sie können Ihr Konto und alle damit verbundenen Daten jederzeit ohne Begründung löschen.',
        
        language === 'ru' ? 'Вы можете обратиться в службу поддержки для исправления неточных данных в вашем профиле.' : 
        language === 'en' ? 'You can contact support to correct inaccurate data in your profile.' :
        language === 'ua' ? 'Ви можете звернутися до служби підтримки для виправлення неточних даних у вашому профілі.' :
        'Sie können sich an den Support wenden, um unrichtige Daten in Ihrem Profil zu korrigieren.'
      ]
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
              <Lock className="w-12 h-12 text-blue-400 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                {language === 'ru' ? 'Политика Конфиденциальности' : 
                 language === 'en' ? 'Privacy Policy' :
                 language === 'ua' ? 'Політика Конфіденційності' :
                 'Datenschutzrichtlinie'}
              </h1>
            </div>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              {language === 'ru' ? 'Мы серьезно относимся к защите ваших данных. Узнайте, как мы собираем, используем и защищаем вашу информацию.' : 
               language === 'en' ? 'We take data protection seriously. Learn how we collect, use and protect your information.' :
               language === 'ua' ? 'Ми серйозно ставимося до захисту ваших даних. Дізнайтеся, як ми збираємо, використовуємо та захищаємо вашу інформацію.' :
               'Wir nehmen den Datenschutz ernst. Erfahren Sie, wie wir Ihre Informationen sammeln, verwenden und schützen.'}
            </p>
          </motion.div>

          {/* Privacy Sections */}
          <div className="space-y-8 mb-16">
            {privacySections.map((section, index) => {
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
                        <IconComponent className="w-6 h-6 mr-3 text-blue-400" />
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {section.content.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                            <p className="text-slate-300 leading-relaxed">{item}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mb-16"
          >
            <Card className="bg-blue-500/10 border-blue-500/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <AlertCircle className="w-6 h-6 mr-3 text-blue-400" />
                  {language === 'ru' ? 'Вопросы о Конфиденциальности' : 
                   language === 'en' ? 'Privacy Questions' :
                   language === 'ua' ? 'Питання про Конфіденційність' :
                   'Datenschutzfragen'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-slate-300">
                    {language === 'ru' ? 'Если у вас есть вопросы о нашей политике конфиденциальности или вы хотите воспользоваться своими правами на защиту данных, свяжитесь с нами:' : 
                     language === 'en' ? 'If you have questions about our privacy policy or want to exercise your data protection rights, contact us:' :
                     language === 'ua' ? 'Якщо у вас є питання про нашу політику конфіденційності або ви хочете скористатися своїми правами на захист даних, зв\'яжіться з нами:' :
                     'Wenn Sie Fragen zu unserer Datenschutzrichtlinie haben oder Ihre Datenschutzrechte ausüben möchten, kontaktieren Sie uns:'}
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <a 
                      href="https://t.me/Ca6aka" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors p-3 bg-slate-800/50 rounded-lg"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Telegram Support</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <a 
                      href="mailto:root.tycoon.games@gmail.com" 
                      className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors p-3 bg-slate-800/50 rounded-lg"
                    >
                      <Mail className="w-5 h-5" />
                      <span>root.tycoon.games@gmail.com</span>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Last Updated */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-center"
          >
            <Badge variant="outline" className="text-slate-400 border-slate-600">
              {language === 'ru' ? 'Последнее обновление: 21 августа 2025 г.' : 
               language === 'en' ? 'Last updated: August 21, 2025' :
               language === 'ua' ? 'Останнє оновлення: 21 серпня 2025 р.' :
               'Letzte Aktualisierung: 21. August 2025'}
            </Badge>
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