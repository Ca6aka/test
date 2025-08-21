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
  FileText,
  Scale,
  Users,
  CreditCard,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { ThemeToggle } from '@/components/theme-toggle';

export default function TermsPage() {
  const { t, language, changeLanguage } = useLanguage();

  const termsSections = [
    {
      title: language === 'ru' ? 'Принятие Условий' : 
             language === 'en' ? 'Acceptance of Terms' :
             language === 'ua' ? 'Прийняття Умов' :
             'Annahme der Bedingungen',
      icon: Scale,
      content: [
        language === 'ru' ? 'Регистрируясь в Root Tycoon, вы соглашаетесь с настоящими условиями использования и обязуетесь их соблюдать.' : 
        language === 'en' ? 'By registering in Root Tycoon, you agree to these terms of use and undertake to comply with them.' :
        language === 'ua' ? 'Реєструючись в Root Tycoon, ви погоджуєтеся з цими умовами використання та зобов\'язуєтеся їх дотримуватися.' :
        'Durch die Registrierung bei Root Tycoon stimmen Sie diesen Nutzungsbedingungen zu und verpflichten sich, diese einzuhalten.',
        
        language === 'ru' ? 'Мы оставляем за собой право изменять эти условия в любое время. Изменения вступают в силу с момента публикации на сайте.' : 
        language === 'en' ? 'We reserve the right to change these terms at any time. Changes take effect from the moment of publication on the website.' :
        language === 'ua' ? 'Ми залишаємо за собою право змінювати ці умови в будь-який час. Зміни набувають чинності з моменту публікації на сайті.' :
        'Wir behalten uns das Recht vor, diese Bedingungen jederzeit zu ändern. Änderungen treten ab dem Zeitpunkt der Veröffentlichung auf der Website in Kraft.',
        
        language === 'ru' ? 'Продолжение использования сервиса после изменения условий означает ваше согласие с новыми условиями.' : 
        language === 'en' ? 'Continued use of the service after changing the terms means your agreement to the new terms.' :
        language === 'ua' ? 'Продовження використання сервісу після зміни умов означає вашу згоду з новими умовами.' :
        'Die fortgesetzte Nutzung des Service nach Änderung der Bedingungen bedeutet Ihre Zustimmung zu den neuen Bedingungen.'
      ]
    },
    {
      title: language === 'ru' ? 'Описание Сервиса' : 
             language === 'en' ? 'Service Description' :
             language === 'ua' ? 'Опис Сервісу' :
             'Service-Beschreibung',
      icon: Server,
      content: [
        language === 'ru' ? 'Root Tycoon - это онлайн симулятор управления серверами, предоставляющий игровой опыт в области IT-технологий.' : 
        language === 'en' ? 'Root Tycoon is an online server management simulator providing gaming experience in IT technologies.' :
        language === 'ua' ? 'Root Tycoon - це онлайн симулятор управління серверами, що надає ігровий досвід у сфері IT-технологій.' :
        'Root Tycoon ist ein Online-Server-Management-Simulator, der Spielerfahrungen im Bereich IT-Technologien bietet.',
        
        language === 'ru' ? 'Сервис предоставляется "как есть" без каких-либо гарантий относительно бесперебойной работы или отсутствия ошибок.' : 
        language === 'en' ? 'The service is provided "as is" without any warranties regarding uninterrupted operation or absence of errors.' :
        language === 'ua' ? 'Сервіс надається "як є" без будь-яких гарантій щодо безперебійної роботи або відсутності помилок.' :
        'Der Service wird "wie besehen" ohne jegliche Garantien bezüglich unterbrechungsfreiem Betrieb oder Fehlerfreiheit bereitgestellt.',
        
        language === 'ru' ? 'Мы оставляем за собой право временно приостанавливать работу сервиса для технического обслуживания и обновлений.' : 
        language === 'en' ? 'We reserve the right to temporarily suspend service for maintenance and updates.' :
        language === 'ua' ? 'Ми залишаємо за собою право тимчасово призупиняти роботу сервісу для технічного обслуговування та оновлень.' :
        'Wir behalten uns das Recht vor, den Service vorübergehend für Wartung und Updates zu unterbrechen.'
      ]
    },
    {
      title: language === 'ru' ? 'Учетные Записи' : 
             language === 'en' ? 'User Accounts' :
             language === 'ua' ? 'Облікові Записи' :
             'Benutzerkonten',
      icon: Users,
      content: [
        language === 'ru' ? 'Вы несете полную ответственность за безопасность своей учетной записи и пароля. Немедленно сообщайте о любом несанкционированном использовании.' : 
        language === 'en' ? 'You are fully responsible for the security of your account and password. Report any unauthorized use immediately.' :
        language === 'ua' ? 'Ви несете повну відповідальність за безпеку свого облікового запису та паролю. Негайно повідомляйте про будь-яке несанкціоноване використання.' :
        'Sie sind vollständig verantwortlich für die Sicherheit Ihres Kontos und Passworts. Melden Sie jede unbefugte Nutzung sofort.',
        
        language === 'ru' ? 'Запрещено создавать множественные аккаунты, продавать или передавать доступ к аккаунту третьим лицам.' : 
        language === 'en' ? 'Creating multiple accounts, selling or transferring account access to third parties is prohibited.' :
        language === 'ua' ? 'Заборонено створювати множинні аккаунти, продавати або передавати доступ до аккаунта третім особам.' :
        'Das Erstellen mehrerer Konten, der Verkauf oder die Übertragung des Kontozugangs an Dritte ist verboten.',
        
        language === 'ru' ? 'Мы имеем право заблокировать или удалить аккаунт при нарушении правил использования или подозрении в мошенничестве.' : 
        language === 'en' ? 'We have the right to block or delete an account for violating usage rules or suspected fraud.' :
        language === 'ua' ? 'Ми маємо право заблокувати або видалити аккаунт при порушенні правил використання або підозрі в шахрайстві.' :
        'Wir haben das Recht, ein Konto bei Verstößen gegen Nutzungsregeln oder Betrugsverdacht zu sperren oder zu löschen.'
      ]
    },
    {
      title: language === 'ru' ? 'Платежи и Возвраты' : 
             language === 'en' ? 'Payments and Refunds' :
             language === 'ua' ? 'Платежі та Повернення' :
             'Zahlungen und Rückerstattungen',
      icon: CreditCard,
      content: [
        language === 'ru' ? 'Все платежи за VIP и Premium статус обрабатываются через NOWPayments. Транзакции необратимы после подтверждения в блокчейне.' : 
        language === 'en' ? 'All payments for VIP and Premium status are processed through NOWPayments. Transactions are irreversible after blockchain confirmation.' :
        language === 'ua' ? 'Усі платежі за VIP та Premium статус обробляються через NOWPayments. Транзакції незворотні після підтвердження в блокчейні.' :
        'Alle Zahlungen für VIP- und Premium-Status werden über NOWPayments abgewickelt. Transaktionen sind nach Blockchain-Bestätigung unwiderruflich.',
        
        language === 'ru' ? 'Возврат средств возможен только в исключительных случаях технических неполадок на нашей стороне в течение 7 дней.' : 
        language === 'en' ? 'Refunds are possible only in exceptional cases of technical problems on our side within 7 days.' :
        language === 'ua' ? 'Повернення коштів можливе лише у виняткових випадках технічних неполадок з нашого боку протягом 7 днів.' :
        'Rückerstattungen sind nur in Ausnahmefällen bei technischen Problemen unsererseits innerhalb von 7 Tagen möglich.',
        
        language === 'ru' ? 'Цены могут изменяться без предварительного уведомления. Действующие цены - те, которые указаны на момент покупки.' : 
        language === 'en' ? 'Prices may change without prior notice. Valid prices are those indicated at the time of purchase.' :
        language === 'ua' ? 'Ціни можуть змінюватися без попереднього повідомлення. Діючі ціни - ті, які вказані на момент купівлі.' :
        'Preise können sich ohne vorherige Ankündigung ändern. Gültige Preise sind die zum Zeitpunkt des Kaufs angegebenen.'
      ]
    },
    {
      title: language === 'ru' ? 'Интеллектуальная Собственность' : 
             language === 'en' ? 'Intellectual Property' :
             language === 'ua' ? 'Інтелектуальна Власність' :
             'Geistiges Eigentum',
      icon: FileText,
      content: [
        language === 'ru' ? 'Все материалы сервиса (код, дизайн, тексты, графика) являются нашей интеллектуальной собственностью и защищены авторским правом.' : 
        language === 'en' ? 'All service materials (code, design, texts, graphics) are our intellectual property and protected by copyright.' :
        language === 'ua' ? 'Усі матеріали сервісу (код, дизайн, тексти, графіка) є нашою інтелектуальною власністю та захищені авторським правом.' :
        'Alle Service-Materialien (Code, Design, Texte, Grafiken) sind unser geistiges Eigentum und urheberrechtlich geschützt.',
        
        language === 'ru' ? 'Запрещено копирование, распространение, модификация или коммерческое использование наших материалов без письменного разрешения.' : 
        language === 'en' ? 'Copying, distribution, modification or commercial use of our materials without written permission is prohibited.' :
        language === 'ua' ? 'Заборонено копіювання, розповсюдження, модифікація або комерційне використання наших матеріалів без письмового дозволу.' :
        'Das Kopieren, Verbreiten, Modifizieren oder kommerzielle Nutzen unserer Materialien ohne schriftliche Genehmigung ist verboten.',
        
        language === 'ru' ? 'Вы сохраняете права на контент, который создаете в игре, но предоставляете нам лицензию на его использование в рамках сервиса.' : 
        language === 'en' ? 'You retain rights to content you create in the game, but grant us a license to use it within the service.' :
        language === 'ua' ? 'Ви зберігаєте права на контент, який створюєте в грі, але надаєте нам ліцензію на його використання в межах сервісу.' :
        'Sie behalten die Rechte an Inhalten, die Sie im Spiel erstellen, gewähren uns aber eine Lizenz zur Nutzung innerhalb des Service.'
      ]
    },
    {
      title: language === 'ru' ? 'Ограничение Ответственности' : 
             language === 'en' ? 'Limitation of Liability' :
             language === 'ua' ? 'Обмеження Відповідальності' :
             'Haftungsbeschränkung',
      icon: AlertTriangle,
      content: [
        language === 'ru' ? 'Мы не несем ответственности за любые прямые, косвенные, случайные или специальные убытки, возникшие в результате использования сервиса.' : 
        language === 'en' ? 'We are not liable for any direct, indirect, incidental or special damages arising from use of the service.' :
        language === 'ua' ? 'Ми не несемо відповідальності за будь-які прямі, непрямі, випадкові або спеціальні збитки, що виникли в результаті використання сервісу.' :
        'Wir haften nicht für direkte, indirekte, zufällige oder besondere Schäden, die durch die Nutzung des Service entstehen.',
        
        language === 'ru' ? 'Максимальная сумма нашей ответственности ограничена суммой, которую вы заплатили за использование сервиса в течение последних 12 месяцев.' : 
        language === 'en' ? 'The maximum amount of our liability is limited to the amount you paid for using the service in the last 12 months.' :
        language === 'ua' ? 'Максимальна сума нашої відповідальності обмежена сумою, яку ви заплатили за використання сервісу протягом останніх 12 місяців.' :
        'Der maximale Betrag unserer Haftung ist auf den Betrag begrenzt, den Sie für die Nutzung des Service in den letzten 12 Monaten bezahlt haben.',
        
        language === 'ru' ? 'Мы не гарантируем отсутствие технических сбоев, потери данных или временную недоступность сервиса.' : 
        language === 'en' ? 'We do not guarantee the absence of technical failures, data loss or temporary service unavailability.' :
        language === 'ua' ? 'Ми не гарантуємо відсутність технічних збоїв, втрати даних або тимчасової недоступності сервісу.' :
        'Wir garantieren nicht das Ausbleiben von technischen Ausfällen, Datenverlusten oder vorübergehender Service-Nichtverfügbarkeit.'
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
              <FileText className="w-12 h-12 text-blue-400 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                {language === 'ru' ? 'Условия Использования' : 
                 language === 'en' ? 'Terms of Use' :
                 language === 'ua' ? 'Умови Використання' :
                 'Nutzungsbedingungen'}
              </h1>
            </div>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              {language === 'ru' ? 'Внимательно ознакомьтесь с условиями использования Root Tycoon. Использование сервиса означает ваше согласие с данными условиями.' : 
               language === 'en' ? 'Please carefully review the Root Tycoon terms of use. Using the service means you agree to these terms.' :
               language === 'ua' ? 'Уважно ознайомтеся з умовами використання Root Tycoon. Використання сервісу означає вашу згоду з цими умовами.' :
               'Bitte lesen Sie die Nutzungsbedingungen von Root Tycoon sorgfältig durch. Die Nutzung des Service bedeutet, dass Sie diesen Bedingungen zustimmen.'}
            </p>
          </motion.div>

          {/* Terms Sections */}
          <div className="space-y-8 mb-16">
            {termsSections.map((section, index) => {
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
                            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
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
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mb-16"
          >
            <Card className="bg-blue-500/10 border-blue-500/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MessageCircle className="w-6 h-6 mr-3 text-blue-400" />
                  {language === 'ru' ? 'Вопросы по Условиям' : 
                   language === 'en' ? 'Questions about Terms' :
                   language === 'ua' ? 'Питання щодо Умов' :
                   'Fragen zu den Bedingungen'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-slate-300">
                    {language === 'ru' ? 'Если у вас есть вопросы о наших условиях использования или вам нужны разъяснения, свяжитесь с нами:' : 
                     language === 'en' ? 'If you have questions about our terms of use or need clarification, contact us:' :
                     language === 'ua' ? 'Якщо у вас є питання про наші умови використання або вам потрібні роз\'яснення, зв\'яжіться з нами:' :
                     'Wenn Sie Fragen zu unseren Nutzungsbedingungen haben oder Klarstellungen benötigen, kontaktieren Sie uns:'}
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
                      href="mailto:legal@roottycoon.ru" 
                      className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors p-3 bg-slate-800/50 rounded-lg"
                    >
                      <Mail className="w-5 h-5" />
                      <span>legal@roottycoon.ru</span>
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
            transition={{ duration: 0.8, delay: 1.4 }}
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