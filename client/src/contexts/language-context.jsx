import { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    // Navigation
    tutorial: 'Start',
    servers: 'My Servers',
    hosting: 'Server Store',
    learning: 'Learning Center',
    myServers: 'My Servers',
    serverStore: 'Server Store',
    learningCenter: 'Learning Center',
    
    // Basic UI
    balance: 'Balance',
    income: 'Income/min',
    serverLimit: 'Server Limit',
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
    
    // Hero section
    heroTitle: 'Build Your Server Empire',
    heroSubtitle: 'Master the Art of Hosting',
    heroDescription: 'Start with nothing and build the largest server hosting empire in the virtual world. Master economics, technology, and strategy.',
    startPlaying: 'Start Playing',
    learnMore: 'Learn More',
    
    // Statistics
    totalPlayers: 'Total Players',
    onlineNow: 'Online Now',
    serversHosted: 'Servers Hosted',
    totalBalance: 'Total Balance',
    
    // Features
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
    
    // Leaderboard
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
    
    // Tutorial
    tutorialProgress: 'Tutorial Progress',
    hideProgress: 'Hide Progress',
    tutorialCompleted: 'Tutorial Completed!',
    tutorialCompletedDesc: 'Congratulations! You\'ve unlocked all game features.',
    completeTutorialUnlock: 'Complete Tutorial & Unlock All Features',
    allFeaturesUnlocked: 'All features unlocked!',
    tutorialCompletedTitle: 'Tutorial Completed!',
    tutorialCompletedMessage: 'Congratulations! You\'ve unlocked all game features.',
    
    // Interface states
    start: 'Start',
    inProgress: 'In Progress',
    completed: 'Completed',
    active: 'Active',
    available: 'Available',
    unavailable: 'Unavailable',
    locked: 'Locked',
    unlocked: 'Unlocked',
    online: 'Online',
    offline: 'Offline',
    
    // Jobs and actions
    tutorialJobs: 'Tutorial Jobs',
    startJob: 'Start Job',
    completeJob: 'Complete Job',
    availableIn: 'Available in',
    earnMoney: 'Earn {amount}',
    cooldownTime: 'Cooldown: {time}',
    jobStarted: 'Job Started',
    jobStartedDesc: '{jobName} started! You\'ll earn {reward} when completed.',
    
    // Job types
    serverMaintenance: 'Server Maintenance',
    performanceOptimization: 'Performance Optimization',
    securityAudit: 'Security Audit',
    
    // Tutorial tips
    tutorialTips: 'Tutorial Tips',
    tipCompleteJobs: 'Complete jobs to earn money and gain experience',
    tipJobCooldown: 'Each job has a cooldown period before you can do it again',
    tipEarnToUnlock: 'Earn {amount} to unlock servers, learning, and the store',
    tipPurchaseServers: 'Purchase servers to generate passive income',
    tipTakeCourses: 'Take learning courses to unlock more server slots',
    browseServerStore: 'Browse Server Store',
    browseLearningCourses: 'Browse Learning Courses',
    
    // Activities
    recentActivities: 'Recent Activities',
    
    // Server management
    purchaseServer: 'Purchase Server',
    deleteServer: 'Delete Server',
    toggleServer: 'Toggle Server',
    noServersYet: 'No Servers Yet',
    purchaseServersFromStore: 'Purchase servers from the store to start hosting and earning passive income!',
    visitServerStore: 'Visit Server Store',
    serverSettings: 'Server Settings',
    loadPercentage: 'Load Percentage',
    currentLoad: 'Current Load',
    overloadRisk: 'Overload Risk',
    low: 'Low',
    moderate: 'Moderate',
    high: 'High',
    veryHigh: 'Very High',
    serverShutdownWarning: 'High load increases shutdown risk',
    rentalCost: 'Rental Cost/min',
    
    // Server products
    basicWebServer: 'Basic Web Server',
    highPerformanceServer: 'High Performance Server',
    databaseServer: 'Database Server',
    cdnServer: 'CDN Server',
    webHosting: 'Web Hosting',
    gamingApps: 'Gaming/Apps',
    storage: 'Storage',
    contentDelivery: 'Content Delivery',
    
    // Learning courses
    basicServerSetup: 'Basic Server Setup',
    advancedServerManagement: 'Advanced Server Management',
    securityProtocols: 'Security Protocols',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    coursesGenitive: 'courses',
    
    // Quest system
    dailyQuests: 'Daily Quests',
    achievements: 'Achievements',
    rankings: 'Rankings',
    claimReward: 'Claim Reward',
    rewardClaimed: 'Reward Claimed',
    questCompleted: 'Quest Completed',
    reward: 'Reward',
    progress: 'Progress',
    claiming: 'Claiming...',
    
    // Admin panel
    adminManagement: 'Admin Management',
    selectUser: 'Select User',
    chooseUser: 'Choose User',
    action: 'Action',
    chooseAction: 'Choose Action',
    executeAction: 'Execute Action',
    giveAdmin: 'Give Admin',
    removeAdmin: 'Remove Admin',
    banUser: 'Ban User',
    unbanUser: 'Unban User',
    totalUsers: 'Total Users',
    onlineUsers: 'Online Users',
    totalAdmins: 'Total Admins',
    userList: 'User List',
    superAdminPanel: 'Super Admin Panel',
    adminPanel: 'Admin Panel',
    pleaseSelectUserAndAction: 'Please select user and action',
    pleaseEnterValidAmount: 'Please enter a valid amount',
    actionSuccessfullyCompleted: 'Action "{action}" successfully completed',
    
    // Chat system
    generalChat: 'General Chat',
    muteUser: 'Mute User',
    unmute: 'Unmute',
    playerManagement: 'Player Management',
    enterMessage: 'Enter message...',
    usefulTips: 'Useful Tips',
    giveMoney: 'Give Money',
    takeMoney: 'Take Money',
    amount: 'Amount',
    enterAmount: 'Enter amount',
    youAreMuted: 'You are muted and cannot send messages',
    noMessages: 'No messages. Start chatting!',
    messageDeleted: 'Message deleted',
    messageDeletedBy: 'Message deleted by administrator {admin}',
    selectMuteDuration: '5m',
    mute: 'Mute',
    activeMutes: 'Active Mutes',
    
    // Profile and level system
    progressToLevel: 'Progress to Level',
    xpNeeded: 'XP needed',
    totalEarnings: 'Total Earnings',
    totalSpent: 'Total Spent',
    netProfit: 'Net Profit',
    jobsCompleted: 'Jobs Completed',
    coursesCompleted: 'Courses Completed',
    achievement: 'Achievement',
    noAchievementsYet: 'No achievements yet',
    earnAchievementsDesc: 'Complete jobs and reach milestones to earn achievements!',
    currentBalance: 'Current Balance',
    levelUp: 'Level Up!',
    levelUpCongrats: 'Congratulations! You\'ve reached level',
    newAbilitiesUnlocked: 'New abilities unlocked!',
    
    // Tooltips and hints
    profileTooltip: 'Click on your avatar to see progress and other interesting information',
    nicknameTooltip: 'Click on your nickname or someone else\'s to view their profile',
    adminControlsInfo: 'Avatar tooltip: Click on your avatar to see progress and other interesting information',
    
    // Theme system
    darkTheme: 'Switch to Dark Theme',
    lightTheme: 'Switch to Light Theme',
    
    // Server durability system
    serverRepaired: 'Server Repaired',
    serverRepairedDesc: 'Server repaired for ${cost}. Durability restored: {durability}%',
    repairFailed: 'Repair Failed',
    durability: 'Durability',
    serverCondition: 'Server Condition',
    partialRepair: 'Partial Repair',
    fullRepair: 'Full Repair',
    repairCostInfo: 'Repair cost depends on damage level and server income',
    serverStatusUpdated: 'Server Status Updated',
    serverStatusUpdatedDesc: 'Server status has been changed successfully.',
    maintenanceRequired: 'Server requires maintenance before it can be turned on',
    
    // Server deletion confirmations
    deleteWarningTitle: '⚠️ WARNING! Do you really want to DELETE server "{serverName}"?',
    deleteWarningMessage: 'This action is IRREVERSIBLE!\\n\\nIf you just want to turn off the server, use the "Turn On/Off" button instead of deleting.',
    deleteLastWarning: '🚨 FINAL WARNING!\\n\\nAre you sure you want to PERMANENTLY delete server "{serverName}"?\\n\\nType "DELETE" to confirm:',
    deleteFinalConfirm: 'Type "DELETE" to finally confirm deletion of server "{serverName}":',
    deleteKeyword: 'DELETE',
    serverDeleted: 'Server deleted',
    serverDeletedDesc: 'Server "{serverName}" was successfully deleted.',
    deleteCancelled: 'Deletion cancelled',
    deleteCancelledDesc: 'Server was NOT deleted.',
    deleteServerTooltip: '⚠️ DELETE SERVER FOREVER (IRREVERSIBLE!)',
    
    // Common UI elements
    close: 'Close',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add',
    remove: 'Remove',
    update: 'Update',
    refresh: 'Refresh',
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
    
    // Time formats
    minutes: 'minutes',
    hours: 'hours',
    seconds: 'seconds',
    secondsShort: 'sec',
    until: 'until',
    reset: 'reset',
    resetAvailable: 'Reset available',
    progressLabel: 'Progress',
    earnedLabel: 'Earned',
    completedTasks: 'tasks',
  },
  
  ru: {
    // Navigation
    tutorial: 'Старт',
    servers: 'Мои серверы',
    hosting: 'Магазин серверов',
    learning: 'Центр обучения',
    myServers: 'Мои серверы',
    serverStore: 'Магазин серверов',
    learningCenter: 'Центр обучения',
    
    // Basic UI
    balance: 'Баланс',
    income: 'Доход/мин',
    serverLimit: 'Лимит серверов',
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
    
    // Hero section
    heroTitle: 'Создайте Свою Серверную Империю',
    heroSubtitle: 'Освойте Искусство Хостинга',
    heroDescription: 'Начните с нуля и постройте крупнейшую империю серверного хостинга в виртуальном мире. Изучите экономику, технологии и стратегию.',
    startPlaying: 'Начать Играть',
    learnMore: 'Узнать Больше',
    
    // Statistics
    totalPlayers: 'Всего Игроков',
    onlineNow: 'Сейчас Онлайн',
    serversHosted: 'Серверов Размещено',
    totalBalance: 'Общий Баланс',
    
    // Features
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
    
    // Leaderboard
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
    
    // Tutorial
    tutorialProgress: 'Прогресс обучения',
    hideProgress: 'Скрыть прогресс',
    tutorialCompleted: 'Обучение завершено!',
    tutorialCompletedDesc: 'Поздравляем! Вы разблокировали все возможности игры.',
    completeTutorialUnlock: 'Завершить обучение и разблокировать все возможности',
    allFeaturesUnlocked: 'Все возможности разблокированы!',
    tutorialCompletedTitle: 'Обучение завершено!',
    tutorialCompletedMessage: 'Поздравляем! Вы разблокировали все возможности игры.',
    
    // Interface states
    start: 'Старт',
    inProgress: 'В процессе',
    completed: 'Завершено',
    active: 'Активно',
    available: 'Доступно',
    unavailable: 'Недоступно',
    locked: 'Заблокировано',
    unlocked: 'Разблокировано',
    online: 'Онлайн',
    offline: 'Офлайн',
    
    // Jobs and actions
    tutorialJobs: 'Обучающие задания',
    startJob: 'Начать работу',
    completeJob: 'Завершить работу',
    availableIn: 'Доступно через',
    earnMoney: 'Заработать {amount}',
    cooldownTime: 'Перезарядка: {time}',
    jobStarted: 'Работа начата',
    jobStartedDesc: '{jobName} начата! Вы получите {reward} после завершения.',
    
    // Job types
    serverMaintenance: 'Обслуживание сервера',
    performanceOptimization: 'Оптимизация производительности',
    securityAudit: 'Аудит безопасности',
    
    // Tutorial tips
    tutorialTips: 'Подсказки обучения',
    tipCompleteJobs: 'Выполняйте задания, чтобы заработать деньги и получить опыт',
    tipJobCooldown: 'У каждого задания есть период перезарядки перед повторным выполнением',
    tipEarnToUnlock: 'Заработайте {amount}, чтобы разблокировать серверы, обучение и магазин',
    tipPurchaseServers: 'Покупайте серверы для получения пассивного дохода',
    tipTakeCourses: 'Проходите курсы обучения, чтобы разблокировать больше слотов для серверов',
    browseServerStore: 'Просмотреть магазин серверов',
    browseLearningCourses: 'Просмотреть курсы обучения',
    
    // Activities
    recentActivities: 'Недавние действия',
    
    // Server management
    purchaseServer: 'Купить сервер',
    deleteServer: 'Удалить сервер',
    toggleServer: 'Переключить сервер',
    noServersYet: 'Серверов пока нет',
    purchaseServersFromStore: 'Покупайте серверы в магазине, чтобы начать хостинг и получать пассивный доход!',
    visitServerStore: 'Посетить магазин серверов',
    serverSettings: 'Настройки сервера',
    loadPercentage: 'Процент нагрузки',
    currentLoad: 'Текущая нагрузка',
    overloadRisk: 'Риск перегрузки',
    low: 'Низкий',
    moderate: 'Умеренный',
    high: 'Высокий',
    veryHigh: 'Очень высокий',
    serverShutdownWarning: 'Высокая нагрузка увеличивает риск отключения',
    rentalCost: 'Аренда/мин',
    
    // Server products
    basicWebServer: 'Базовый веб-сервер',
    highPerformanceServer: 'Высокопроизводительный сервер',
    databaseServer: 'Сервер базы данных',
    cdnServer: 'CDN сервер',
    webHosting: 'Веб-хостинг',
    gamingApps: 'Игры/Приложения',
    storage: 'Хранилище',
    contentDelivery: 'Доставка контента',
    
    // Learning courses
    basicServerSetup: 'Базовая настройка сервера',
    advancedServerManagement: 'Продвинутое управление сервером',
    securityProtocols: 'Протоколы безопасности',
    beginner: 'Начинающий',
    intermediate: 'Средний',
    advanced: 'Продвинутый',
    coursesGenitive: 'курсов',
    
    // Quest system
    dailyQuests: 'Ежедневные задания',
    achievements: 'Достижения',
    rankings: 'Рейтинг',
    claimReward: 'Забрать награду',
    rewardClaimed: 'Награда получена',
    questCompleted: 'Задание выполнено',
    reward: 'Награда',
    progress: 'Прогресс',
    claiming: 'Получение...',
    
    // Admin panel
    adminManagement: 'Управление администраторами',
    selectUser: 'Выберите пользователя',
    chooseUser: 'Выберите пользователя',
    action: 'Действие',
    chooseAction: 'Выберите действие',
    executeAction: 'Выполнить действие',
    giveAdmin: 'Выдать администратора',
    removeAdmin: 'Убрать администратора',
    banUser: 'Забанить пользователя',
    unbanUser: 'Разбанить пользователя',
    totalUsers: 'Всего пользователей',
    onlineUsers: 'Онлайн пользователей',
    totalAdmins: 'Всего администраторов',
    userList: 'Список пользователей',
    superAdminPanel: 'Панель супер-администратора',
    adminPanel: 'Панель администратора',
    pleaseSelectUserAndAction: 'Пожалуйста, выберите пользователя и действие',
    pleaseEnterValidAmount: 'Пожалуйста, введите корректную сумму',
    actionSuccessfullyCompleted: 'Действие "{action}" успешно выполнено',
    
    // Chat system
    generalChat: 'Общий чат',
    muteUser: 'Заглушить пользователя',
    unmute: 'Размут',
    playerManagement: 'Управление игроками',
    enterMessage: 'Введите сообщение...',
    usefulTips: 'Полезные советы',
    giveMoney: 'Выдать деньги',
    takeMoney: 'Забрать деньги',
    amount: 'Сумма',
    enterAmount: 'Введите сумму',
    youAreMuted: 'Вы заглушены и не можете отправлять сообщения',
    noMessages: 'Нет сообщений. Начните общение!',
    messageDeleted: 'Сообщение удалено',
    messageDeletedBy: 'Сообщение удалено администратором {admin}',
    selectMuteDuration: '5м',
    mute: 'Мут',
    activeMutes: 'Активные муты',
    
    // Profile and level system
    progressToLevel: 'Прогресс до уровня',
    xpNeeded: 'нужно опыта',
    totalEarnings: 'Общий доход',
    totalSpent: 'Потрачено всего',
    netProfit: 'Чистая прибыль',
    jobsCompleted: 'Выполнено работ',
    coursesCompleted: 'Пройдено курсов',
    achievement: 'Достижение',
    noAchievementsYet: 'Пока нет достижений',
    earnAchievementsDesc: 'Выполняйте работы и достигайте целей, чтобы получить достижения!',
    currentBalance: 'Текущий баланс',
    levelUp: 'Повышение уровня!',
    levelUpCongrats: 'Поздравляем! Вы достигли уровня',
    newAbilitiesUnlocked: 'Новые способности разблокированы!',
    
    // Tooltips and hints
    profileTooltip: 'Нажмите на свою аватарку, чтобы увидеть прогресс и другую интересную информацию',
    nicknameTooltip: 'Если нажать на свой ник или чужой, можно заглянуть на чей-то профиль',
    adminControlsInfo: 'Нажав на свой аватар, можно узнать больше полезной информации',
    
    // Theme system
    darkTheme: 'Переключить на темную тему',
    lightTheme: 'Переключить на светлую тему',
    
    // Server durability system
    serverRepaired: 'Сервер отремонтирован',
    serverRepairedDesc: 'Сервер отремонтирован за ${cost}. Прочность восстановлена: {durability}%',
    repairFailed: 'Ремонт не удался',
    durability: 'Прочность',
    serverCondition: 'Состояние сервера',
    partialRepair: 'Частичный ремонт',
    fullRepair: 'Полный ремонт',
    repairCostInfo: 'Стоимость ремонта зависит от уровня повреждений и дохода сервера',
    serverStatusUpdated: 'Статус сервера обновлен',
    serverStatusUpdatedDesc: 'Статус сервера был успешно изменен.',
    maintenanceRequired: 'Сервер требует обслуживания перед включением',
    
    // Server deletion confirmations
    deleteWarningTitle: '⚠️ ВНИМАНИЕ! Вы действительно хотите УДАЛИТЬ сервер "{serverName}"?',
    deleteWarningMessage: 'Это действие НЕОБРАТИМО!\\n\\nЕсли вы хотите просто отключить сервер, используйте кнопку "Включить/Выключить" вместо удаления.',
    deleteLastWarning: '🚨 ПОСЛЕДНЕЕ ПРЕДУПРЕЖДЕНИЕ!\\n\\nВы уверены, что хотите НАВСЕГДА удалить сервер "{serverName}"?\\n\\nНапишите "УДАЛИТЬ" чтобы подтвердить:',
    deleteFinalConfirm: 'Введите "УДАЛИТЬ" чтобы окончательно подтвердить удаление сервера "{serverName}":',
    deleteKeyword: 'УДАЛИТЬ',
    serverDeleted: 'Сервер удален',
    serverDeletedDesc: 'Сервер "{serverName}" был успешно удален.',
    deleteCancelled: 'Удаление отменено',
    deleteCancelledDesc: 'Сервер НЕ был удален.',
    deleteServerTooltip: '⚠️ УДАЛИТЬ СЕРВЕР НАВСЕГДА (НЕОБРАТИМО!)',
    
    // Common UI elements
    close: 'Закрыть',
    cancel: 'Отмена',
    confirm: 'Подтвердить',
    save: 'Сохранить',
    edit: 'Редактировать',
    delete: 'Удалить',
    add: 'Добавить',
    remove: 'Удалить',
    update: 'Обновить',
    refresh: 'Обновить',
    loading: 'Загрузка...',
    success: 'Успешно',
    error: 'Ошибка',
    
    // Time formats
    minutes: 'минут',
    hours: 'часов',
    seconds: 'секунд',
    secondsShort: 'сек',
    until: 'до',
    reset: 'сброс',
    resetAvailable: 'Сброс доступен',
    progressLabel: 'Прогресс',
    earnedLabel: 'Получено',
    completedTasks: 'заданий',
  },
  
  ua: {
    // Navigation
    tutorial: 'Старт',
    servers: 'Мої сервери',
    hosting: 'Магазин серверів',
    learning: 'Центр навчання',
    myServers: 'Мої сервери',
    serverStore: 'Магазин серверів',
    learningCenter: 'Центр навчання',
    
    // Basic UI
    balance: 'Баланс',
    income: 'Дохід/хв',
    serverLimit: 'Ліміт серверів',
    settings: 'Налаштування',
    logout: 'Вийти',
    login: 'Вхід',
    register: 'Реєстрація',
    nickname: 'Нікнейм',
    password: 'Пароль',
    confirmPassword: 'Підтвердіть пароль',
    loggingIn: 'Вхід...',
    creatingAccount: 'Створення акаунту...',
    loginFailed: 'Помилка входу',
    registrationFailed: 'Помилка реєстрації',
    passwordsDoNotMatch: 'Паролі не співпадають',
    
    // Hero section
    heroTitle: 'Створіть Свою Серверну Імперію',
    heroSubtitle: 'Опануйте Мистецтво Хостингу',
    heroDescription: 'Почніть з нуля і збудуйте найбільшу імперію серверного хостингу у віртуальному світі. Вивчіть економіку, технології та стратегію.',
    startPlaying: 'Почати Гру',
    learnMore: 'Дізнатися Більше',
    
    // Statistics
    totalPlayers: 'Всього Гравців',
    onlineNow: 'Зараз Онлайн',
    serversHosted: 'Серверів Розміщено',
    totalBalance: 'Загальний Баланс',
    
    // Features
    gameFeatures: 'Особливості Гри',
    featuresDescription: 'Дізнайтеся, що робить наш симулятор хостингу унікальним',
    feature1Title: 'Створюйте Сервери',
    feature1Desc: 'Створюйте та налаштовуйте власні сервери',
    feature2Title: 'Глобальна Мережа',
    feature2Desc: 'Розширюйтеся по всьому світу з дата-центрами',
    feature3Title: 'Збільшуйте Дохід',
    feature3Desc: 'Оптимізуйте бізнес для максимального прибутку',
    feature4Title: 'Висока Продуктивність',
    feature4Desc: 'Надавайте блискавично швидкі послуги хостингу',
    
    // Leaderboard
    topPlayers: 'Топ Гравців',
    topPlayersDescription: 'Подивіться, хто домінує в індустрії хостингу',
    leaderboard: 'Таблиця Лідерів',
    serversLowercase: 'серверів',
    joinCompetition: 'Приєднатися до Змагання',
    allRightsReserved: 'Всі права захищені.',
    loginRegister: 'Вхід / Реєстрація',
    
    // Error messages
    errorNotFound: 'Не знайдено',
    errorServerError: 'Помилка сервера',
    errorNetworkError: 'Помилка мережі',
    errorUnauthorized: 'Доступ заборонено',
    errorBadRequest: 'Неправильний запит',
    errorGeneric: 'Щось пішло не так',
    pleaseRefresh: 'Будь ласка, оновіть сторінку та спробуйте знову',
    jobOnCooldown: 'Робота недоступна {seconds} секунд',
    insufficientFunds: 'Недостатньо коштів',
    serverLimitReached: 'Досягнуто ліміт серверів',
    
    // Tutorial
    tutorialProgress: 'Прогрес навчання',
    hideProgress: 'Приховати прогрес',
    tutorialCompleted: 'Навчання завершено!',
    tutorialCompletedDesc: 'Вітаємо! Ви розблокували всі можливості гри.',
    completeTutorialUnlock: 'Завершити навчання та розблокувати всі можливості',
    allFeaturesUnlocked: 'Всі можливості розблоковані!',
    tutorialCompletedTitle: 'Навчання завершено!',
    tutorialCompletedMessage: 'Вітаємо! Ви розблокували всі можливості гри.',
    
    // Interface states
    start: 'Старт',
    inProgress: 'В процесі',
    completed: 'Завершено',
    active: 'Активно',
    available: 'Доступно',
    unavailable: 'Недоступно',
    locked: 'Заблоковано',
    unlocked: 'Розблоковано',
    online: 'Онлайн',
    offline: 'Офлайн',
    
    // Jobs and actions
    tutorialJobs: 'Навчальні завдання',
    startJob: 'Почати роботу',
    completeJob: 'Завершити роботу',
    availableIn: 'Доступно через',
    earnMoney: 'Заробити {amount}',
    cooldownTime: 'Перезарядка: {time}',
    jobStarted: 'Робота почата',
    jobStartedDesc: '{jobName} почата! Ви отримаєте {reward} після завершення.',
    
    // Job types
    serverMaintenance: 'Обслуговування сервера',
    performanceOptimization: 'Оптимізація продуктивності',
    securityAudit: 'Аудит безпеки',
    
    // Tutorial tips
    tutorialTips: 'Підказки навчання',
    tipCompleteJobs: 'Виконуйте завдання, щоб заробити гроші та отримати досвід',
    tipJobCooldown: 'У кожного завдання є період перезарядки перед повторним виконанням',
    tipEarnToUnlock: 'Заробіть {amount}, щоб розблокувати сервери, навчання та магазин',
    tipPurchaseServers: 'Купуйте сервери для отримання пасивного доходу',
    tipTakeCourses: 'Проходьте курси навчання, щоб розблокувати більше слотів для серверів',
    browseServerStore: 'Переглянути магазин серверів',
    browseLearningCourses: 'Переглянути курси навчання',
    
    // Activities
    recentActivities: 'Недавні дії',
    
    // Server management
    purchaseServer: 'Купити сервер',
    deleteServer: 'Видалити сервер',
    toggleServer: 'Перемкнути сервер',
    noServersYet: 'Серверів поки немає',
    purchaseServersFromStore: 'Купуйте сервери в магазині, щоб почати хостинг та отримувати пасивний дохід!',
    visitServerStore: 'Відвідати магазин серверів',
    serverSettings: 'Налаштування сервера',
    loadPercentage: 'Відсоток навантаження',
    currentLoad: 'Поточне навантаження',
    overloadRisk: 'Ризик перевантаження',
    low: 'Низький',
    moderate: 'Помірний',
    high: 'Високий',
    veryHigh: 'Дуже високий',
    serverShutdownWarning: 'Високе навантаження збільшує ризик відключення',
    rentalCost: 'Оренда/хв',
    
    // Server products
    basicWebServer: 'Базовий веб-сервер',
    highPerformanceServer: 'Високопродуктивний сервер',
    databaseServer: 'Сервер бази даних',
    cdnServer: 'CDN сервер',
    webHosting: 'Веб-хостинг',
    gamingApps: 'Ігри/Додатки',
    storage: 'Сховище',
    contentDelivery: 'Доставка контенту',
    
    // Learning courses
    basicServerSetup: 'Базове налаштування сервера',
    advancedServerManagement: 'Просунуте управління сервером',
    securityProtocols: 'Протоколи безпеки',
    beginner: 'Початківець',
    intermediate: 'Середній',
    advanced: 'Просунутий',
    coursesGenitive: 'курсів',
    
    // Quest system
    dailyQuests: 'Щоденні завдання',
    achievements: 'Досягнення',
    rankings: 'Рейтинг',
    claimReward: 'Забрати нагороду',
    rewardClaimed: 'Нагорода отримана',
    questCompleted: 'Завдання виконано',
    reward: 'Нагорода',
    progress: 'Прогрес',
    claiming: 'Отримання...',
    
    // Admin panel
    adminManagement: 'Управління адміністраторами',
    selectUser: 'Виберіть користувача',
    chooseUser: 'Оберіть користувача',
    action: 'Дія',
    chooseAction: 'Оберіть дію',
    executeAction: 'Виконати дію',
    giveAdmin: 'Видати адміністратора',
    removeAdmin: 'Забрати адміністратора',
    banUser: 'Забанити користувача',
    unbanUser: 'Розбанити користувача',
    totalUsers: 'Всього користувачів',
    onlineUsers: 'Онлайн користувачів',
    totalAdmins: 'Всього адміністраторів',
    userList: 'Список користувачів',
    superAdminPanel: 'Панель супер-адміністратора',
    adminPanel: 'Панель адміністратора',
    pleaseSelectUserAndAction: 'Будь ласка, оберіть користувача та дію',
    pleaseEnterValidAmount: 'Будь ласка, введіть коректну суму',
    actionSuccessfullyCompleted: 'Дія "{action}" успішно виконана',
    
    // Chat system
    generalChat: 'Загальний чат',
    muteUser: 'Заглушити користувача',
    unmute: 'Розглушити',
    playerManagement: 'Управління гравцями',
    enterMessage: 'Введіть повідомлення...',
    usefulTips: 'Корисні поради',
    giveMoney: 'Видати гроші',
    takeMoney: 'Забрати гроші',
    amount: 'Сума',
    enterAmount: 'Введіть суму',
    youAreMuted: 'Вас заглушено і ви не можете надсилати повідомлення',
    noMessages: 'Немає повідомлень. Почніть спілкування!',
    messageDeleted: 'Повідомлення видалено',
    messageDeletedBy: 'Повідомлення видалено адміністратором {admin}',
    selectMuteDuration: '5хв',
    mute: 'Заглушити',
    activeMutes: 'Активні заглушення',
    
    // Profile and level system
    progressToLevel: 'Прогрес до рівня',
    xpNeeded: 'потрібно досвіду',
    totalEarnings: 'Загальний дохід',
    totalSpent: 'Витрачено загалом',
    netProfit: 'Чистий прибуток',
    jobsCompleted: 'Виконано робіт',
    coursesCompleted: 'Пройдено курсів',
    achievement: 'Досягнення',
    noAchievementsYet: 'Поки немає досягнень',
    earnAchievementsDesc: 'Виконуйте роботи та досягайте цілей, щоб отримати досягнення!',
    currentBalance: 'Поточний баланс',
    levelUp: 'Підвищення рівня!',
    levelUpCongrats: 'Вітаємо! Ви досягли рівня',
    newAbilitiesUnlocked: 'Нові можливості розблоковані!',
    
    // Tooltips and hints
    profileTooltip: 'Натисніть на свою аватарку, щоб побачити прогрес та іншу цікаву інформацію',
    nicknameTooltip: 'Якщо натиснути на свій нік або чужий, можна заглянути на чийсь профіль',
    adminControlsInfo: 'Натиснувши на свій аватар, можна дізнатися більше корисної інформації',
    
    // Theme system
    darkTheme: 'Переключити на темну тему',
    lightTheme: 'Переключити на світлу тему',
    
    // Server durability system
    serverRepaired: 'Сервер відремонтовано',
    serverRepairedDesc: 'Сервер відремонтовано за ${cost}. Міцність відновлено: {durability}%',
    repairFailed: 'Ремонт не вдався',
    durability: 'Міцність',
    serverCondition: 'Стан сервера',
    partialRepair: 'Частковий ремонт',
    fullRepair: 'Повний ремонт',
    repairCostInfo: 'Вартість ремонту залежить від рівня пошкоджень і доходу сервера',
    serverStatusUpdated: 'Статус сервера оновлено',
    serverStatusUpdatedDesc: 'Статус сервера було успішно змінено.',
    maintenanceRequired: 'Сервер потребує обслуговування перед увімкненням',
    
    // Server deletion confirmations
    deleteWarningTitle: '⚠️ УВАГА! Ви дійсно хочете ВИДАЛИТИ сервер "{serverName}"?',
    deleteWarningMessage: 'Ця дія НЕЗВОРОТНА!\\n\\nЯкщо ви хочете просто вимкнути сервер, використовуйте кнопку "Увімкнути/Вимкнути" замість видалення.',
    deleteLastWarning: '🚨 ОСТАННЄ ПОПЕРЕДЖЕННЯ!\\n\\nВи впевнені, що хочете НАЗАВЖДИ видалити сервер "{serverName}"?\\n\\nНапишіть "ВИДАЛИТИ" щоб підтвердити:',
    deleteFinalConfirm: 'Введіть "ВИДАЛИТИ" щоб остаточно підтвердити видалення сервера "{serverName}":',
    deleteKeyword: 'ВИДАЛИТИ',
    serverDeleted: 'Сервер видалено',
    serverDeletedDesc: 'Сервер "{serverName}" було успішно видалено.',
    deleteCancelled: 'Видалення скасовано',
    deleteCancelledDesc: 'Сервер НЕ було видалено.',
    deleteServerTooltip: '⚠️ ВИДАЛИТИ СЕРВЕР НАЗАВЖДИ (НЕЗВОРОТНО!)',
    
    // Common UI elements
    close: 'Закрити',
    cancel: 'Скасувати',
    confirm: 'Підтвердити',
    save: 'Зберегти',
    edit: 'Редагувати',
    delete: 'Видалити',
    add: 'Додати',
    remove: 'Видалити',
    update: 'Оновити',
    refresh: 'Оновити',
    loading: 'Завантаження...',
    success: 'Успішно',
    error: 'Помилка',
    
    // Time formats
    minutes: 'хвилин',
    hours: 'годин',
    seconds: 'секунд',
    secondsShort: 'сек',
    until: 'до',
    reset: 'скидання',
    resetAvailable: 'Скидання доступне',
    progressLabel: 'Прогрес',
    earnedLabel: 'Отримано',
    completedTasks: 'завдань',
  },
  
  de: {
    // Navigation
    tutorial: 'Start',
    servers: 'Meine Server',
    hosting: 'Server Shop',
    learning: 'Lernzentrum',
    myServers: 'Meine Server',
    serverStore: 'Server Shop',
    learningCenter: 'Lernzentrum',
    
    // Basic UI
    balance: 'Guthaben',
    income: 'Einkommen/min',
    serverLimit: 'Server-Limit',
    settings: 'Einstellungen',
    logout: 'Abmelden',
    login: 'Anmelden',
    register: 'Registrieren',
    nickname: 'Nickname',
    password: 'Passwort',
    confirmPassword: 'Passwort bestätigen',
    loggingIn: 'Anmelden...',
    creatingAccount: 'Konto erstellen...',
    loginFailed: 'Anmeldung fehlgeschlagen',
    registrationFailed: 'Registrierung fehlgeschlagen',
    passwordsDoNotMatch: 'Passwörter stimmen nicht überein',
    
    // Hero section
    heroTitle: 'Bauen Sie Ihr Server-Imperium',
    heroSubtitle: 'Meistern Sie die Kunst des Hostings',
    heroDescription: 'Beginnen Sie mit nichts und bauen Sie das größte Server-Hosting-Imperium in der virtuellen Welt. Meistern Sie Wirtschaft, Technologie und Strategie.',
    startPlaying: 'Spielen Beginnen',
    learnMore: 'Mehr Erfahren',
    
    // Statistics
    totalPlayers: 'Gesamtspieler',
    onlineNow: 'Jetzt Online',
    serversHosted: 'Gehostete Server',
    totalBalance: 'Gesamtguthaben',
    
    // Features
    gameFeatures: 'Spiel-Features',
    featuresDescription: 'Entdecken Sie, was unseren Hosting-Simulator einzigartig macht',
    feature1Title: 'Server Erstellen',
    feature1Desc: 'Erstellen und anpassen Sie Ihre eigenen Server',
    feature2Title: 'Globales Netzwerk',
    feature2Desc: 'Erweitern Sie weltweit mit Rechenzentren',
    feature3Title: 'Umsatz Steigern',
    feature3Desc: 'Optimieren Sie Ihr Geschäft für maximalen Gewinn',
    feature4Title: 'Hohe Leistung',
    feature4Desc: 'Bieten Sie blitzschnelle Hosting-Services',
    
    // Leaderboard
    topPlayers: 'Top-Spieler',
    topPlayersDescription: 'Sehen Sie, wer die Hosting-Branche dominiert',
    leaderboard: 'Rangliste',
    serversLowercase: 'server',
    joinCompetition: 'Am Wettbewerb Teilnehmen',
    allRightsReserved: 'Alle Rechte vorbehalten.',
    loginRegister: 'Anmelden / Registrieren',
    
    // Error messages
    errorNotFound: 'Nicht gefunden',
    errorServerError: 'Serverfehler',
    errorNetworkError: 'Netzwerkfehler',
    errorUnauthorized: 'Zugriff verweigert',
    errorBadRequest: 'Ungültige Anfrage',
    errorGeneric: 'Etwas ist schiefgelaufen',
    pleaseRefresh: 'Bitte aktualisieren Sie die Seite und versuchen Sie es erneut',
    jobOnCooldown: 'Job ist für {seconds} Sekunden gesperrt',
    insufficientFunds: 'Unzureichende Mittel',
    serverLimitReached: 'Server-Limit erreicht',
    
    // Tutorial
    tutorialProgress: 'Tutorial-Fortschritt',
    hideProgress: 'Fortschritt ausblenden',
    tutorialCompleted: 'Tutorial abgeschlossen!',
    tutorialCompletedDesc: 'Herzlichen Glückwunsch! Sie haben alle Spiel-Features freigeschaltet.',
    completeTutorialUnlock: 'Tutorial abschließen und alle Features freischalten',
    allFeaturesUnlocked: 'Alle Features freigeschaltet!',
    tutorialCompletedTitle: 'Tutorial abgeschlossen!',
    tutorialCompletedMessage: 'Herzlichen Glückwunsch! Sie haben alle Spiel-Features freigeschaltet.',
    
    // Interface states
    start: 'Start',
    inProgress: 'In Bearbeitung',
    completed: 'Abgeschlossen',
    active: 'Aktiv',
    available: 'Verfügbar',
    unavailable: 'Nicht verfügbar',
    locked: 'Gesperrt',
    unlocked: 'Entsperrt',
    online: 'Online',
    offline: 'Offline',
    
    // Jobs and actions
    tutorialJobs: 'Tutorial-Aufgaben',
    startJob: 'Job starten',
    completeJob: 'Job abschließen',
    availableIn: 'Verfügbar in',
    earnMoney: '{amount} verdienen',
    cooldownTime: 'Abklingzeit: {time}',
    jobStarted: 'Job gestartet',
    jobStartedDesc: '{jobName} gestartet! Sie erhalten {reward} nach Abschluss.',
    
    // Job types
    serverMaintenance: 'Server-Wartung',
    performanceOptimization: 'Leistungsoptimierung',
    securityAudit: 'Sicherheitsaudit',
    
    // Tutorial tips
    tutorialTips: 'Tutorial-Tipps',
    tipCompleteJobs: 'Schließen Sie Jobs ab, um Geld zu verdienen und Erfahrung zu sammeln',
    tipJobCooldown: 'Jeder Job hat eine Abklingzeit, bevor Sie ihn erneut ausführen können',
    tipEarnToUnlock: 'Verdienen Sie {amount}, um Server, Lernen und Shop freizuschalten',
    tipPurchaseServers: 'Kaufen Sie Server, um passives Einkommen zu generieren',
    tipTakeCourses: 'Nehmen Sie an Lernkursen teil, um mehr Server-Slots freizuschalten',
    browseServerStore: 'Server Shop durchsuchen',
    browseLearningCourses: 'Lernkurse durchsuchen',
    
    // Activities
    recentActivities: 'Kürzliche Aktivitäten',
    
    // Server management
    purchaseServer: 'Server kaufen',
    deleteServer: 'Server löschen',
    toggleServer: 'Server umschalten',
    noServersYet: 'Noch keine Server',
    purchaseServersFromStore: 'Kaufen Sie Server im Shop, um mit dem Hosting zu beginnen und passives Einkommen zu erzielen!',
    visitServerStore: 'Server Shop besuchen',
    serverSettings: 'Server-Einstellungen',
    loadPercentage: 'Auslastung in Prozent',
    currentLoad: 'Aktuelle Auslastung',
    overloadRisk: 'Überlastungsrisiko',
    low: 'Niedrig',
    moderate: 'Mäßig',
    high: 'Hoch',
    veryHigh: 'Sehr hoch',
    serverShutdownWarning: 'Hohe Auslastung erhöht das Abschaltungsrisiko',
    rentalCost: 'Mietkosten/min',
    
    // Server products
    basicWebServer: 'Basic Web Server',
    highPerformanceServer: 'Hochleistungsserver',
    databaseServer: 'Datenbankserver',
    cdnServer: 'CDN Server',
    webHosting: 'Web-Hosting',
    gamingApps: 'Gaming/Apps',
    storage: 'Speicher',
    contentDelivery: 'Content Delivery',
    
    // Learning courses
    basicServerSetup: 'Grundlegende Server-Einrichtung',
    advancedServerManagement: 'Erweiterte Server-Verwaltung',
    securityProtocols: 'Sicherheitsprotokolle',
    beginner: 'Anfänger',
    intermediate: 'Fortgeschritten',
    advanced: 'Experte',
    coursesGenitive: 'kurse',
    
    // Quest system
    dailyQuests: 'Tägliche Aufgaben',
    achievements: 'Erfolge',
    rankings: 'Rangliste',
    claimReward: 'Belohnung einfordern',
    rewardClaimed: 'Belohnung erhalten',
    questCompleted: 'Aufgabe abgeschlossen',
    reward: 'Belohnung',
    progress: 'Fortschritt',
    claiming: 'Einfordern...',
    
    // Admin panel
    adminManagement: 'Admin-Verwaltung',
    selectUser: 'Benutzer auswählen',
    chooseUser: 'Benutzer auswählen',
    action: 'Aktion',
    chooseAction: 'Aktion auswählen',
    executeAction: 'Aktion ausführen',
    giveAdmin: 'Admin geben',
    removeAdmin: 'Admin entfernen',
    banUser: 'Benutzer bannen',
    unbanUser: 'Benutzer entbannen',
    totalUsers: 'Gesamtbenutzer',
    onlineUsers: 'Online-Benutzer',
    totalAdmins: 'Gesamt-Admins',
    userList: 'Benutzerliste',
    superAdminPanel: 'Super-Admin-Panel',
    adminPanel: 'Admin-Panel',
    pleaseSelectUserAndAction: 'Bitte wählen Sie Benutzer und Aktion aus',
    pleaseEnterValidAmount: 'Bitte geben Sie einen gültigen Betrag ein',
    actionSuccessfullyCompleted: 'Aktion "{action}" erfolgreich ausgeführt',
    
    // Chat system
    generalChat: 'Allgemeiner Chat',
    muteUser: 'Benutzer stummschalten',
    unmute: 'Stummschaltung aufheben',
    playerManagement: 'Spielerverwaltung',
    enterMessage: 'Nachricht eingeben...',
    usefulTips: 'Nützliche Tipps',
    giveMoney: 'Geld geben',
    takeMoney: 'Geld nehmen',
    amount: 'Betrag',
    enterAmount: 'Betrag eingeben',
    youAreMuted: 'Sie sind stummgeschaltet und können keine Nachrichten senden',
    noMessages: 'Keine Nachrichten. Starten Sie ein Gespräch!',
    messageDeleted: 'Nachricht gelöscht',
    messageDeletedBy: 'Nachricht gelöscht von Administrator {admin}',
    selectMuteDuration: '5m',
    mute: 'Stumm',
    activeMutes: 'Aktive Stummschaltungen',
    
    // Profile and level system
    progressToLevel: 'Fortschritt zu Level',
    xpNeeded: 'XP benötigt',
    totalEarnings: 'Gesamteinnahmen',
    totalSpent: 'Gesamt ausgegeben',
    netProfit: 'Nettogewinn',
    jobsCompleted: 'Jobs abgeschlossen',
    coursesCompleted: 'Kurse abgeschlossen',
    achievement: 'Erfolg',
    noAchievementsYet: 'Noch keine Erfolge',
    earnAchievementsDesc: 'Schließen Sie Jobs ab und erreichen Sie Meilensteine, um Erfolge zu erhalten!',
    currentBalance: 'Aktuelles Guthaben',
    levelUp: 'Level aufgestiegen!',
    levelUpCongrats: 'Herzlichen Glückwunsch! Sie haben Level erreicht',
    newAbilitiesUnlocked: 'Neue Fähigkeiten freigeschaltet!',
    
    // Tooltips and hints
    profileTooltip: 'Klicken Sie auf Ihren Avatar, um Fortschritt und andere interessante Informationen zu sehen',
    nicknameTooltip: 'Klicken Sie auf Ihren oder einen anderen Nickname, um das Profil anzuzeigen',
    adminControlsInfo: 'Avatar-Tooltip: Klicken Sie auf Ihren Avatar, um Fortschritt und andere interessante Informationen zu sehen',
    
    // Theme system
    darkTheme: 'Zu dunklem Theme wechseln',
    lightTheme: 'Zu hellem Theme wechseln',
    
    // Server durability system
    serverRepaired: 'Server repariert',
    serverRepairedDesc: 'Server repariert für ${cost}. Haltbarkeit wiederhergestellt: {durability}%',
    repairFailed: 'Reparatur fehlgeschlagen',
    durability: 'Haltbarkeit',
    serverCondition: 'Server-Zustand',
    partialRepair: 'Teilreparatur',
    fullRepair: 'Vollreparatur',
    repairCostInfo: 'Reparaturkosten hängen vom Schädigungsgrad und Server-Einkommen ab',
    serverStatusUpdated: 'Server-Status aktualisiert',
    serverStatusUpdatedDesc: 'Der Server-Status wurde erfolgreich geändert.',
    maintenanceRequired: 'Server benötigt Wartung, bevor er eingeschaltet werden kann',
    
    // Server deletion confirmations
    deleteWarningTitle: '⚠️ WARNUNG! Möchten Sie wirklich Server "{serverName}" LÖSCHEN?',
    deleteWarningMessage: 'Diese Aktion ist IRREVERSIBEL!\\n\\nWenn Sie den Server nur ausschalten möchten, verwenden Sie die "Ein/Aus"-Taste anstatt zu löschen.',
    deleteLastWarning: '🚨 LETZTE WARNUNG!\\n\\nSind Sie sicher, dass Sie Server "{serverName}" PERMANENT löschen möchten?\\n\\nGeben Sie "LÖSCHEN" ein, um zu bestätigen:',
    deleteFinalConfirm: 'Geben Sie "LÖSCHEN" ein, um die Löschung von Server "{serverName}" endgültig zu bestätigen:',
    deleteKeyword: 'LÖSCHEN',
    serverDeleted: 'Server gelöscht',
    serverDeletedDesc: 'Server "{serverName}" wurde erfolgreich gelöscht.',
    deleteCancelled: 'Löschung abgebrochen',
    deleteCancelledDesc: 'Server wurde NICHT gelöscht.',
    deleteServerTooltip: '⚠️ SERVER PERMANENT LÖSCHEN (IRREVERSIBEL!)',
    
    // Common UI elements
    close: 'Schließen',
    cancel: 'Abbrechen',
    confirm: 'Bestätigen',
    save: 'Speichern',
    edit: 'Bearbeiten',
    delete: 'Löschen',
    add: 'Hinzufügen',
    remove: 'Entfernen',
    update: 'Aktualisieren',
    refresh: 'Aktualisieren',
    loading: 'Laden...',
    success: 'Erfolg',
    error: 'Fehler',
    
    // Time formats
    minutes: 'Minuten',
    hours: 'Stunden',
    seconds: 'Sekunden',
    secondsShort: 'Sek',
    until: 'bis',
    reset: 'zurücksetzen',
    resetAvailable: 'Zurücksetzen verfügbar',
    progressLabel: 'Fortschritt',
    earnedLabel: 'Verdient',
    completedTasks: 'aufgaben',
  }
};

// Function to localize error messages based on language
export function localizeError(error, language = 'en') {
  const t = (key) => translations[language]?.[key] || translations.en[key] || key;
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.message) {
    // Map common error types to translation keys
    const errorMap = {
      'Not Found': 'errorNotFound',
      'Server Error': 'errorServerError', 
      'Network Error': 'errorNetworkError',
      'Access Denied': 'errorUnauthorized',
      'Invalid Request': 'errorBadRequest',
      'Insufficient funds': 'insufficientFunds',
      'Server limit reached': 'serverLimitReached'
    };
    
    return errorMap[error.message] ? t(errorMap[error.message]) : error.message;
  }
  
  return t('errorGeneric');
}

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