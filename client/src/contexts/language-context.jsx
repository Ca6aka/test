import { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    tutorial: 'Tutorial',
    servers: 'My Servers',
    learning: 'Learning Center',
    balance: 'Balance',
    income: 'Income/min',
    serverLimit: 'Server Limit',
    startJob: 'Start Job',
    completeJob: 'Complete Job',
    purchaseServer: 'Purchase Server',
    deleteServer: 'Delete Server',
    toggleServer: 'Toggle Server',
    online: 'Online',
    offline: 'Offline',
    settings: 'Settings',
    logout: 'Logout',
    login: 'Login',
    register: 'Register',
    nickname: 'Nickname',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    loggingIn: 'Logging in...',
    creatingAccount: 'Creating Account...',
    loginFailed: 'Login Failed',
    registrationFailed: 'Registration Failed',
    passwordsDoNotMatch: 'Passwords do not match',
    heroTitle: 'Build Your Server Empire',
    heroSubtitle: 'Master the Art of Hosting',
    heroDescription: 'Start with nothing and build the largest server hosting empire in the virtual world. Master economics, technology, and strategy.',
    startPlaying: 'Start Playing',
    learnMore: 'Learn More',
    totalPlayers: 'Total Players',
    onlineNow: 'Online Now',
    serversHosted: 'Servers Hosted',
    totalBalance: 'Total Balance',
    gameFeatures: 'Game Features',
    featuresDescription: 'Discover what makes our server hosting simulator unique',
    feature1Title: 'Build Servers',
    feature1Desc: 'Create and customize your own servers',
    feature2Title: 'Global Network',
    feature2Desc: 'Expand worldwide with data centers',
    feature3Title: 'Grow Revenue',
    feature3Desc: 'Optimize your business for maximum profit',
    feature4Title: 'Fast Performance',
    feature4Desc: 'Deliver lightning-fast hosting services',
    topPlayers: 'Top Players',
    topPlayersDescription: 'See who\'s dominating the hosting industry',
    leaderboard: 'Leaderboard',
    serversLowercase: 'servers',
    joinCompetition: 'Join the Competition',
    allRightsReserved: 'All rights reserved.',
    loginRegister: 'Login / Register',
    // Error messages
    errorNotFound: 'Not Found',
    errorServerError: 'Server Error',
    errorNetworkError: 'Network Error',
    errorUnauthorized: 'Access Denied',
    errorBadRequest: 'Invalid Request',
    errorGeneric: 'Something went wrong',
    pleaseRefresh: 'Please refresh the page and try again',
    jobOnCooldown: 'Job is on cooldown for {seconds} seconds',
    insufficientFunds: 'Insufficient funds',
    serverLimitReached: 'Server limit reached',
    // Tutorial progress
    tutorialProgress: 'Tutorial Progress',
    hideProgress: 'Hide Progress',
  },
  ru: {
    tutorial: 'Обучение',
    servers: 'Мои серверы',
    learning: 'Центр обучения',
    balance: 'Баланс',
    income: 'Доход/мин',
    serverLimit: 'Лимит серверов',
    startJob: 'Начать работу',
    completeJob: 'Завершить работу',
    purchaseServer: 'Купить сервер',
    deleteServer: 'Удалить сервер',
    toggleServer: 'Переключить сервер',
    online: 'Онлайн',
    offline: 'Офлайн',
    settings: 'Настройки',
    logout: 'Выйти',
    login: 'Вход',
    register: 'Регистрация',
    nickname: 'Никнейм',
    password: 'Пароль',
    confirmPassword: 'Подтвердите пароль',
    loggingIn: 'Вход...',
    creatingAccount: 'Создание аккаунта...',
    loginFailed: 'Ошибка входа',
    registrationFailed: 'Ошибка регистрации',
    passwordsDoNotMatch: 'Пароли не совпадают',
    heroTitle: 'Создайте Свою Серверную Империю',
    heroSubtitle: 'Освойте Искусство Хостинга',
    heroDescription: 'Начните с нуля и постройте крупнейшую империю серверного хостинга в виртуальном мире. Изучите экономику, технологии и стратегию.',
    startPlaying: 'Начать Играть',
    learnMore: 'Узнать Больше',
    totalPlayers: 'Всего Игроков',
    onlineNow: 'Сейчас Онлайн',
    serversHosted: 'Серверов Размещено',
    totalBalance: 'Общий Баланс',
    gameFeatures: 'Особенности Игры',
    featuresDescription: 'Узнайте, что делает наш симулятор хостинга уникальным',
    feature1Title: 'Создавайте Серверы',
    feature1Desc: 'Создавайте и настраивайте собственные серверы',
    feature2Title: 'Глобальная Сеть',
    feature2Desc: 'Расширяйтесь по всему миру с дата-центрами',
    feature3Title: 'Увеличивайте Доход',
    feature3Desc: 'Оптимизируйте бизнес для максимальной прибыли',
    feature4Title: 'Высокая Производительность',
    feature4Desc: 'Предоставляйте молниеносно быстрые услуги хостинга',
    topPlayers: 'Топ Игроков',
    topPlayersDescription: 'Посмотрите, кто доминирует в индустрии хостинга',
    leaderboard: 'Таблица Лидеров',
    serversLowercase: 'серверов',
    joinCompetition: 'Присоединиться к Соревнованию',
    allRightsReserved: 'Все права защищены.',
    loginRegister: 'Вход / Регистрация',
    // Error messages
    errorNotFound: 'Не найдено',
    errorServerError: 'Ошибка сервера',
    errorNetworkError: 'Ошибка сети',
    errorUnauthorized: 'Доступ запрещен',
    errorBadRequest: 'Неверный запрос',
    errorGeneric: 'Что-то пошло не так',
    pleaseRefresh: 'Пожалуйста, обновите страницу и попробуйте снова',
    jobOnCooldown: 'Работа недоступна {seconds} секунд',
    insufficientFunds: 'Недостаточно средств',
    serverLimitReached: 'Достигнут лимит серверов',
    // Tutorial progress
    tutorialProgress: 'Прогресс обучения',
    hideProgress: 'Скрыть прогресс',
  },
  de: {
    tutorial: 'Tutorial',
    servers: 'Meine Server',
    learning: 'Lernzentrum',
    balance: 'Guthaben',
    income: 'Einkommen/min',
    serverLimit: 'Server-Limit',
    startJob: 'Job starten',
    completeJob: 'Job abschließen',
    purchaseServer: 'Server kaufen',
    deleteServer: 'Server löschen',
    toggleServer: 'Server umschalten',
    online: 'Online',
    offline: 'Offline',
    settings: 'Einstellungen',
    logout: 'Abmelden',
    login: 'Anmelden',
    register: 'Registrieren',
    nickname: 'Nickname',
    password: 'Passwort',
    confirmPassword: 'Passwort bestätigen',
    loggingIn: 'Anmeldung...',
    creatingAccount: 'Konto erstellen...',
    loginFailed: 'Anmeldung fehlgeschlagen',
    registrationFailed: 'Registrierung fehlgeschlagen',
    passwordsDoNotMatch: 'Passwörter stimmen nicht überein',
    heroTitle: 'Baue Dein Server-Imperium',
    heroSubtitle: 'Meistere die Kunst des Hostings',
    heroDescription: 'Beginne mit nichts und baue das größte Server-Hosting-Imperium in der virtuellen Welt auf. Meistere Wirtschaft, Technologie und Strategie.',
    startPlaying: 'Spielen Beginnen',
    learnMore: 'Mehr Erfahren',
    totalPlayers: 'Gesamtspieler',
    onlineNow: 'Jetzt Online',
    serversHosted: 'Server Gehostet',
    totalRevenue: 'Gesamtumsatz',
    gameFeatures: 'Spiel-Features',
    featuresDescription: 'Entdecke, was unseren Server-Hosting-Simulator einzigartig macht',
    feature1Title: 'Server Erstellen',
    feature1Desc: 'Erstelle und passe deine eigenen Server an',
    feature2Title: 'Globales Netzwerk',
    feature2Desc: 'Expandiere weltweit mit Rechenzentren',
    feature3Title: 'Umsatz Steigern',
    feature3Desc: 'Optimiere dein Geschäft für maximalen Gewinn',
    feature4Title: 'Hohe Leistung',
    feature4Desc: 'Biete blitzschnelle Hosting-Services',
    topPlayers: 'Top-Spieler',
    topPlayersDescription: 'Sieh, wer die Hosting-Branche dominiert',
    leaderboard: 'Rangliste',
    serversLowercase: 'Server',
    joinCompetition: 'An der Konkurrenz teilnehmen',
    allRightsReserved: 'Alle Rechte vorbehalten.',
    loginRegister: 'Anmelden / Registrieren',
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('game-language') || 'en';
  });

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('game-language', newLanguage);
  };

  const value = {
    language,
    t,
    changeLanguage,
    localizeError: (error) => localizeError(error, language),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
