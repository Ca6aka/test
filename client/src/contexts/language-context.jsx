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
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
