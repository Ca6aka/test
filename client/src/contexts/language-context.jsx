import { createContext, useContext, useState } from 'react';

const newTranslations = {
  // Hidden achievements
  hiddenAchievements: { en: 'Hidden Achievements', ru: 'Скрытые достижения' },
  unlocked: { en: 'unlocked', ru: 'открыто' },
  hiddenRequirement: { en: 'Secret requirement', ru: 'Секретное требование' },
  noHiddenAchievements: { en: 'No hidden achievements found', ru: 'Скрытых достижений не найдено' },
  hiddenAchievementsDesc: { en: 'Complete special actions to unlock hidden rewards', ru: 'Выполняйте особые действия для получения скрытых наград' },
  
  // Hidden achievement names and descriptions
  firstConnectionName: { en: 'First Connection', ru: 'Первое подключение' },
  firstConnectionDesc: { en: 'Successfully establish your first server connection', ru: 'Успешно установите первое подключение к серверу' },
  securityExpertName: { en: 'Security Expert', ru: 'Эксперт безопасности' },
  securityExpertDesc: { en: 'Complete 50 security mini-games without errors', ru: 'Завершите 50 мини-игр по безопасности без ошибок' },
  speedDemonName: { en: 'Speed Demon', ru: 'Демон скорости' },
  speedDemonDesc: { en: 'Complete any mini-game in under 10 seconds', ru: 'Завершите любую мини-игру менее чем за 10 секунд' },
  wealthAccumulatorName: { en: 'Wealth Accumulator', ru: 'Накопитель богатства' },
  wealthAccumulatorDesc: { en: 'Accumulate $100,000 total earnings', ru: 'Накопите $100,000 общего дохода' },
  
  // Daily bonus
  dailyBonus: { en: 'Daily Bonus', ru: 'Ежедневный бонус' },
  dailyLoginBonus: { en: 'Daily Login Bonus', ru: 'Ежедневный бонус за вход' },
  claimBonus: { en: 'Claim Bonus', ru: 'Получить бонус' },
  claiming: { en: 'Claiming...', ru: 'Получение...' },
  dailyBonusClaimed: { en: 'Daily Bonus Claimed!', ru: 'Ежедневный бонус получен!' },
  streak: { en: 'Streak', ru: 'Серия' },
  weekStreak: { en: 'Week Streak!', ru: 'Недельная серия!' },
  dailyBonusMessage: { en: 'Log in daily to maintain your streak and earn more rewards!', ru: 'Заходите каждый день, чтобы поддерживать серию и получать больше наград!' },
  hiddenAchievements: { en: 'Hidden Achievements', ru: 'Скрытые достижения' },
  hiddenRequirement: { en: 'Requirements hidden until unlocked', ru: 'Требования скрыты до получения' },
  unlocked: { en: 'Unlocked', ru: 'Разблокировано' },
  todayBonus: { en: "Today's Bonus", ru: 'Сегодняшний бонус' },
  readyToClaim: { en: 'Ready to claim', ru: 'Готов к получению' },
  claimBonus: { en: 'Claim Bonus', ru: 'Получить бонус' },
  claiming: { en: 'Claiming...', ru: 'Получаем...' },
  alreadyClaimed: { en: 'Already claimed', ru: 'Уже получен' },
  comeBackTomorrow: { en: 'Come back tomorrow for your next bonus', ru: 'Вернитесь завтра за следующим бонусом' },
  nextBonus: { en: 'Tomorrow', ru: 'Завтра' },
  loginStreak: { en: 'Login Streak', ru: 'Серия входов' },
  dayStreak: { en: 'day streak', ru: 'день подряд' },
  daysStreak: { en: 'days streak', ru: 'дней подряд' },
  streakMultiplier: { en: 'Multiplier', ru: 'Множитель' },
  maxMultiplier: { en: 'Maximum multiplier reached!', ru: 'Максимальный множитель достигнут!' },
  streakProgress: { en: '{current}/20 days for max bonus', ru: '{current}/20 дней для максимального бонуса' },
  bonusSchedule: { en: 'Bonus Schedule', ru: 'Расписание бонусов' },
  day: { en: 'Day', ru: 'День' },
  max: { en: 'MAX', ru: 'МАКС' },
  note: { en: 'Note', ru: 'Примечание' },
  bonusNote: { en: 'Login consecutively to maintain your streak. Missing a day resets it to 1.', ru: 'Заходите ежедневно подряд для сохранения серии. Пропуск дня сбрасывает её на 1.' },
  bonusClaimed: { en: 'Bonus Claimed!', ru: 'Бонус получен!' },
  bonusClaimedDesc: { en: 'You received ${amount}! Current streak: {streak} days', ru: 'Вы получили ${amount}! Текущая серия: {streak} дней' },
  bonusClaimError: { en: 'Failed to claim bonus', ru: 'Не удалось получить бонус' },
  
  // Tutorial
  tutorial: { en: 'Tutorial', ru: 'Обучение' },
  welcomeToGame: { en: 'Welcome to the Server Management Game!', ru: 'Добро пожаловать в игру управления серверами!' },
  tutorialStep1: { en: 'Learn how to earn money and manage your virtual servers', ru: 'Изучите как зарабатывать деньги и управлять виртуальными серверами' },
  tutorialStep2: { en: 'Visit the shop to purchase your first server', ru: 'Посетите магазин чтобы купить свой первый сервер' },
  tutorialStep3: { en: 'Manage your servers and generate income', ru: 'Управляйте серверами и генерируйте доход' },
  tutorialStep4: { en: 'Complete learning courses to unlock new features', ru: 'Проходите курсы обучения для разблокировки новых функций' },
  tutorialStep5: { en: 'Complete the tutorial and start playing!', ru: 'Завершите обучение и начните играть!' },
  nextStep: { en: 'Next Step', ru: 'Следующий шаг' },
  completeTutorial: { en: 'Complete Tutorial', ru: 'Завершить обучение' },
  tutorialCompleted: { en: 'Tutorial completed!', ru: 'Обучение завершено!' },
  tutorialCompletedDesc: { en: 'You can now use all game features', ru: 'Теперь вы можете использовать все функции игры' },
  skipTutorial: { en: 'Skip', ru: 'Пропустить' },
  updating: { en: 'Updating...', ru: 'Обновляем...' },
  step: { en: 'Step', ru: 'Шаг' },
  of: { en: 'of', ru: 'из' },
  tutorialReward: { en: 'Tutorial reward', ru: 'Награда за обучение' },
  earnMoney: { en: 'Earn Money', ru: 'Заработать деньги' },
  visitShop: { en: 'Visit Shop', ru: 'Посетить магазин' },
  manageServers: { en: 'Manage Servers', ru: 'Управление серверами' },
  learningCenter: { en: 'Learning Center', ru: 'Центр обучения' },
  activeServers: { en: 'Active Servers', ru: 'Активные сервера' }
};

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
    achievements: 'Achievements',
    dailyQuests: 'Daily Quests',
    reports: 'Reports',
    
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
    nicknameTooLong: 'Nickname must be 8 characters or less',
    nicknameInvalidChars: 'Nickname can only contain letters, numbers, hyphens, and underscores',
    nicknameMax8Chars: 'Max 8 characters, letters/numbers only',
    
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
    errorjob: 'Error, work is not yet available',
    
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
    tutorialJobs: 'Remote work',
    startJob: 'Start Job',
    completeJob: 'Complete Job',
    availableIn: 'Available in',
    earnMoney: 'Earn {amount}',
    cooldownTime: 'Cooldown: {time}',
    jobStarted: 'Job done',
    jobStartedDesc: '{jobName} is done! You have earned {reward}.',
    
    // Job types
    serverMaintenance: 'Server Maintenance',
    performanceOptimization: 'Performance Optimization',
    securityAudit: 'Security Audit',
    
    // Tutorial tips
    tutorialTips: 'Tutorial Tips',
    tipCompleteJobs: 'With mini-games, you can get some experience',
    tipJobCooldown: 'To open the rating and get into it - you need at least level 5',
    tipEarnToUnlock: 'If you have a question or found any errors - go to the "Report" tab',
    tipPurchaseServers: "Buy servers for passive income, don't forget to keep an eye on them",
    tipTakeCourses: 'Take training courses to unlock more server slots and more',
    browseServerStore: 'Browse Server Store',
    browseLearningCourses: 'Browse Learning Courses',
    
    // Activities
    recentActivities: 'Recent Activities',
    
    // Server management
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
    achievementsList: {
      'first-steps': {
        title: "First Steps",
        description: "Complete your first job",
      },
      'first-server': {
        title: "First Server",
        description: "Purchase your first server",
      },
      'server-collection': {
        title: "Server Collector",
        description: "Own 5 servers simultaneously",
      },
      'millionaire': {
        title: "Millionaire",
        description: "Accumulate $1,000,000 in balance",
      },
      'job-master': {
        title: "Job Master",
        description: "Complete 100 jobs",
      },
      'learning-enthusiast': {
        title: "Learning Enthusiast",
        description: "Complete all learning courses",
      },
      'early-earner': {
        title: "Early Earner",
        description: "Earn your first $10,000",
      },
      'efficient-worker': {
        title: "Efficient Worker",
        description: "Complete 10 jobs",
      },
      'server-builder': {
        title: "Server Builder",
        description: "Own 3 different types of servers",
      },
      'security-expert': {
        title: "Security Expert",
        description: "Complete 50 Security Audit jobs",
      },
      'maintenance-guru': {
        title: "Maintenance Guru",
        description: "Complete 75 Maintenance jobs",
      },
      'optimization-master': {
        title: "Optimization Master",
        description: "Complete 60 Optimization jobs",
      },
      'wealthy-investor': {
        title: "Wealthy Investor",
        description: "Accumulate $100,000 in balance",
      },
      'server-mogul': {
        title: "Server Mogul",
        description: "Own 10 servers simultaneously",
      },
      'persistent-learner': {
        title: "Persistent Learner",
        description: "Complete 3 learning courses",
      },
      'speed-demon': {
        title: "Speed Demon",
        description: "Complete 200 jobs total",
      },
      'infrastructure-king': {
        title: "Infrastructure King",
        description: "Own 15 servers simultaneously",
      },
      'multi-millionaire': {
        title: "Multi-Millionaire",
        description: "Accumulate $5,000,000 in balance",
      },
      'course-completionist': {
        title: "Course Completionist",
        description: "Complete all available learning courses",
      },
      'workaholic': {
        title: "Workaholic",
        description: "Complete 500 jobs total",
      },
      'server-empire': {
        title: "Server Empire",
        description: "Own 20 servers simultaneously",
      },
      'financial-titan': {
        title: "Financial Titan",
        description: "Accumulate $10,000,000 in balance",
      },
      'legendary-worker': {
        title: "Legendary Worker",
        description: "Complete 1000 jobs total",
      },
      'server-overlord': {
        title: "Server Overlord",
        description: "Own 30 servers simultaneously",
      },
      'billionaire-club': {
        title: "Billionaire Club",
        description: "Accumulate $100,000,000 in balance",
      },
      'ultimate-legend': {
        title: "Ultimate Legend",
        description: "Complete 2500 jobs total",
      }
    },
    rankings: 'Rankings',
    claimReward: 'Claim Reward',
    rewardClaimed: 'Reward Claimed',
    questCompleted: 'Quest Completed',
    reward: 'Reward',
    progress: 'Progress',
    claiming: 'Claiming...',
    
    // Daily quests
    dailyQuestsList: {
      'daily-maintenance': {
        title: 'Daily Maintenance',
        description: 'Complete 3 Server Maintenance jobs'
      },
      'daily-income': {
        title: 'Passive Income',
        description: 'Earn $5,000 from server income'
      },
      'daily-optimization': {
        title: 'Server Optimization',
        description: 'Complete 2 Performance Optimization jobs'
      },
      'daily-security': {
        title: 'Security Check',
        description: 'Complete 1 Security Audit job'
      },
      'daily-earnings': {
        title: 'Daily Earnings',
        description: 'Earn $10,000 from server income'
      },
      'daily-worker': {
        title: 'Hard Worker',
        description: 'Complete 5 jobs of any type'
      },
      'daily-mixed-jobs': {
        title: 'Mixed Tasks',
        description: 'Complete 2 Maintenance and 1 Optimization job'
      },
      'daily-income-boost': {
        title: 'Income Boost',
        description: 'Earn $20,000 from server income'
      },
      'daily-job-spree': {
        title: 'Job Spree',
        description: 'Complete 8 jobs of any type'
      },
      'daily-mega-earner': {
        title: 'Mega Earner',
        description: 'Earn $50,000 from server income'
      }
    },
    
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
    chatRules: 'Chat Rules',
    chatRule1: "Don't spam or flood - no caps, identical messages, meaningless symbols.",
    chatRule2: 'Respect other players - no insults, provocations and discrimination.',
    chatRule3: 'No mat and profanity - the filter can automatically block such words..',
    chatRule4: 'Advertising and links to third-party resources are prohibited.',
    chatRule5: 'Administration always has the last word - moderator decisions are only discussed in support.',
    achievementsLocked: 'Achievements Locked',
    completeTutorialToUnlock: 'Complete the tutorial to unlock achievements',
    mute: 'Mute',
    activeMutes: 'Active Mutes',
    noActiveMutes: 'No active mutes',
    youAreMuted: 'You are muted',
    noMessages: 'No messages yet...',
    
    // Server management additional
    serverLimitNotice: 'Server Limit Notice',
    serverLimitWarning: 'You\'re using {currentServers} of {serverLimit} available server slots. Complete learning courses to increase your limit!',
    purchaseFirstServer: 'Purchase your first server from the Server Store to start earning income.',
    noServersYet: 'No Servers Yet',
    addNewServer: 'Add New Server',
    availableServerSlots: 'You have {availableSlots} server slot{plural} available. Visit the Server Store to purchase new servers.',
    browseServerStore: 'Browse Server Store',
    serverLoadUpdated: 'Server load updated successfully',
    
    // Learning progress
    learningInProgress: 'Learning in Progress',
    timeRemaining: 'remaining',
    
    // Common
    success: 'Success',
    error: 'Error',
    
    // Server actions
    serverRepaired: 'Server Repaired',
    serverRepairedDesc: 'Server repaired for ${cost}. Durability restored by {durability}%',
    repairFailed: 'Repair Failed',
    serverStatusUpdated: 'Server Status Updated',
    serverStatusUpdatedDesc: 'Server status has been updated successfully',
    deleteWarningTitle: 'Delete Server: {serverName}',
    deleteWarningMessage: 'This action cannot be undone!',
    deleteLastWarning: 'Are you absolutely sure you want to delete {serverName}?',
    deleteFinalConfirm: 'Type "DELETE" to confirm deletion of {serverName}:',
    deleteKeyword: 'DELETE',
    serverDeleted: 'Server Deleted',
    serverDeletedDesc: '{serverName} has been successfully deleted',
    deleteCancelled: 'Deletion Cancelled',
    deleteCancelledDesc: 'Server deletion was cancelled',
    deleteServerTooltip: 'Delete Server',
    
    // Server details
    durability: 'Durability',
    serverCondition: 'Server Condition',
    partialRepair: 'Partial Repair',
    fullRepair: 'Full Repair',
    repairCostInfo: 'Repair costs scale with server value and damage',
    maintenanceRequired: 'Maintenance required - server may shutdown!',
    
    // Additional hosting translations
    availableSlots: 'Available Slots',
    needMoreMoney: 'You need {amount} to purchase this server',
    serverAddedToYourServers: '{serverName} has been added to your servers!',
    needLearningCourse: 'Need Learning Course',
    monthlyCost: 'Monthly cost',
    netProfitMonth: 'Net profit/month',
    needMoreFunds: 'Need {amount} more',
    wantMoreServers: 'Want More Servers?',
    learningCoursesBenefit: 'Each completed course can unlock additional server slots and improve your server efficiency. Visit the Learning Center to start your next course!',
    
    // Learning tab specific
    unknownReward: 'Unknown Reward',
    serverSlotReward: '+{amount} Server Slot{plural}',
    serverEfficiencyReward: '+{amount}% Server Efficiency',
    unlockServerReward: 'Unlocks {serverType}',
    gpuServer: 'GPU Server',
    tpuServer: 'TPU Server', 
    specialServer: 'Special Server',
    learningInProgressError: 'Learning in Progress',
    oneCourseAtTime: 'You can only take one course at a time. Please wait for the current course to complete.',
    needMoneyForCourse: 'You need {amount} to start this course.',
    courseStarted: 'Course Started',
    courseStartedDesc: 'You\'ve started the {courseTitle} course. Check your progress in the servers tab!',
    failedToStartCourse: 'Failed to Start Course',
    learningCenter: 'Learning Center',
    currentBalance: 'Current Balance',
    currentCourse: 'Current Course',
    progress: 'Progress',
    remaining: 'remaining',
    reward: 'Reward',
    availableCourses: 'Available Courses',
    duration: 'Duration',
    requiresLevelX: 'Requires Level {level}',
    unavailable: 'Unavailable',
    completed: 'Completed',
    inProgress: 'In Progress...',
    completeCurrentFirst: 'Complete Current Course First',
    startCourse: 'Start Course',
    needMoreForCourse: 'Need {amount} more',
    learningBenefits: 'Learning Benefits',
    moreServers: 'More Servers',
    unlockAdditionalServerSlots: 'Unlock additional server slots',
    higherEfficiency: 'Higher Efficiency',
    increaseServerIncomeRates: 'Increase server income rates',
    betterRankings: 'Better Rankings',
    climbTheLeaderboards: 'Climb the leaderboards',
    
    // Player profile
    loadingPlayerProfile: 'Loading player profile...',
    playerNotFound: 'Player not found',
    playerNotFoundDesc: 'The player "{nickname}" doesn\'t exist or the profile is private.',
    goBack: 'Go Back',
    back: 'Back',
    playerProfile: 'Player Profile',
    online: 'Online',
    offline: 'Offline',
    level: 'Level',
    rank: 'Rank',
    servers: 'servers',
    totalBalance: 'Total Balance',
    activeServers: 'Active Servers',
    globalRank: 'Global Rank',
    recentActivity: 'Recent Activity',
    
    giveMoney: 'Give Money',
    takeMoney: 'Take Money',
    deleteUser: 'Delete User Account',
    amount: 'Amount',
    enterAmount: 'Enter amount',
    youAreMuted: 'You are muted and cannot send messages',
    noMessages: 'No messages. Start chatting!',
    messageDeleted: 'Message deleted',
    messageDeletedBy: 'Message deleted by administrator {admin}',
    selectMuteDuration: '5m',
    mute: 'Mute',
    activeMutes: 'Active Mutes',
    noActiveMutes: 'No active mutes',
    
    // Chat achievements translations
    first_message: {
      title: 'First Message',
      description: 'Send your first message in chat'
    },
    chatty: {
      title: 'Chatty',
      description: 'Send 25 messages'
    },
    social_butterfly: {
      title: 'Social Butterfly',
      description: 'Send 100 messages'
    },
    chat_master: {
      title: 'Chat Master',
      description: 'Send 500 messages'
    },
    
    // Profile and level system
    progressToLevel: 'Progress to Level',
    registrationdate: 'Registration date: ',
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
    levelUpCongrats: 'Congratulations! You\'ve reached',
    levelUpCongrats3: 'level',
    levelUpCongrats2: 'To close the window, click somewhere',
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
    deleteWarningMessage: 'This action is IRREVERSIBLE!\nIf you just want to turn off the server, use the "Turn On/Off" button instead of deleting.',
    deleteLastWarning: '🚨 FINAL WARNING!\nAre you sure you want to PERMANENTLY delete server "{serverName}"?\nType "DELETE" to confirm:',
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
    minutes: ' min.',
    hours: ' hour.',
    seconds: ' sec.',
    secondsShort: 'sec',
    until: 'until',
    reset: 'reset',
    resetAvailable: 'Reset available',
    progressLabel: 'Progress',
    earnedLabel: 'Earned',
    completedTasks: 'quests',
    
    // Additional UI strings
    serverLimitNotice: 'Server Limit Notice',
    serverLimitWarning: 'You\'re using {currentServers} of {serverLimit} available server slots. Complete learning courses to increase your limit!',
    requiresLevel: 'Requires Level {level}',
    purchaseFirstServer: 'Purchase your first server from the Server Store to start earning income.',
    serverPurchased: 'Server Purchased',
    purchaseFailed: 'Purchase Failed',
    serverLimitReached: 'Server Limit Reached',
    serverLimitReachedDesc: 'You can only have {serverLimit} servers. Complete learning courses to increase your limit.',
    serverAlreadyOnline: 'Server Already Online',
    serverAlreadyOnlineDesc: 'This server is already activated and running.',
    purchaseServer: 'Purchase Server',
    reachedServerLimit: 'You\'ve reached your server limit of {serverLimit}. Complete learning courses to unlock more slots!',
    completeLearningCoursesToIncrease: 'Complete learning courses to increase your server limit',
    turnOnOff: 'Turn On/Off',
    
    // Reports system
    reports: 'Reports',
    createNewReport: 'Create New Report',
    reportSubject: 'Report Subject',
    reportCategory: 'Report Category',
    initialMessage: 'Initial Message',
    general: 'General',
    technical: 'Technical',
    createReport: 'Create Report',
    reportSent: 'Report Sent',
    reportSentDescription: 'Your report has been sent successfully.',
    reportClosed: 'Report Closed',
    reportClosedDescription: 'Report has been closed successfully.',
    reportDeleted: 'Report Deleted',
    reportDeletedDescription: 'Report has been deleted successfully.',
    reportMarked: 'Report Marked',
    reportUnmarked: 'Report Unmarked',
    closeReport: 'Close Report',
    markReport: 'Mark Report',
    deleteReport: 'Delete Report',
    sendMessage: 'Send Message',
    typeMessage: 'Message...',
    noReports: 'No reports yet',
    createFirstReport: 'Create your first report using the button above.',
    reportStatus: 'Status',
    reportCreated: 'Created',
    reportClosed: 'Closed',
    reportMarked: 'Marked',
    fillAllFields: 'Please fill all required fields',
    subjectTooLong: 'Subject must be no more than 50 characters',
    messageTooLong: 'Message must be no more than 500 characters',
    characters: 'characters',
    reportType: 'Report type',
    reportTypeFeature: 'Function request',
    reportTypeComplaint: 'Complaint',
    reportTypeOther: 'Other',
    reportMessage: 'Message',
    submitReport: 'Send report',
    
    // Reports reopen functionality
    reopenChat: 'Reopen chat',
    reportReopened: 'Report reopened',
    reportReopenedDescription: 'Report has been successfully reopened for further communication',
    chatClosedByAdmin: 'Chat closed by administrator',
    
    // Additional reports translations
    myReports: 'My Reports',
    incomingReports: 'Incoming Reports',
    newTicket: 'New Ticket',
    createNewTicket: 'Create New Ticket',
    subject: 'Subject',
    category: 'Category',
    description: 'Description',
    selectCategory: 'Select category',
    reportTypeBug: 'Bug or other error',
    otherIssue: 'Other',
    featureIssue: 'Feature request',
    reportTypeComplaint: 'Complaint',
    generalIssue: 'General Issue',
    technicalIssue: 'Technical Issue',
    startChat: 'Start Chat',
    sending: 'Sending...',
    activeReportExists: 'You already have an active report. Please wait for admin response.',
    noIncomingReports: 'No incoming reports',
    selectReportToView: 'Select a report to view the conversation',
    closeChat: 'Close chat',
    deleteChat: 'Delete chat',
    markChat: 'Mark chat',
    unmarkChat: 'Unmark chat',
    admin: 'Admin',
    open: 'Open',
    closed: 'Closed',
    
    // Mini Games translations
    miniGames: 'Mini Games',
    miniGamesDesc: 'Test your skills with fun mini-games and earn XP!',
    minigame1: 'DDoS Protection',
    minigame1Desc: 'Defend your servers from incoming packet attacks',
    minigame2: 'Firewall Filter',
    minigame2Desc: 'Allow legitimate requests and block malicious ones',
    requests: 'requests',
    howToPlay: 'How to Play',
    ddosInstructions: 'Click on the red packets to destroy them before they reach your server. The speed increases over time! For each destruction +1 experience.',
    firewallInstructions: 'Review each request and choose to Allow safe requests or Block dangerous ones. Be quick and accurate! For each correct answer +1 XP.',
    startGame: 'Start Game',
    gameCompleted: 'Game Completed!',
    earnedXP: 'You earned {amount} XP!',
    packetsDestroyed: 'Packets Destroyed',
    correct: 'Correct',
    correct2: 'right',
    packet: 'packet',
    wrong: 'Wrong',
    score: 'Score',
    timeLeft: 'Time Left',
    requestsLeft: 'Requests Left',
    blockOrAllow: 'Block dangerous requests or Allow safe ones',
    block: 'Block',
    allow: 'Allow',
    yourServer: 'Your Server',
    medium: 'Medium',
    
    // Donate translations
    donate: 'Donate',
    donateDesc: 'Support the game development and get exclusive benefits!',
    donate1: 'Starter Pack',
    donate1Desc: 'Get started with basic benefits',
    donate2: 'Premium Pack (Forever)',
    donate2Desc: 'Advanced features for serious players',
    donate3: 'Boost Pack',
    donate3Desc: 'Accelerate your progress significantly',
    donate4: 'Ultimate Pack',
    donate4Desc: 'Maximum benefits and exclusive content',
    donate5: 'Coin Pack',
    donate5Desc: 'In-game currency for purchases',
    donate6: 'Special Pack',
    donate6Desc: 'Limited time offer with unique rewards',
    feature1: 'Extra server slots',
    feature2: 'Faster learning courses',
    feature3: 'Bonus daily rewards',
    feature4: 'VIP support priority',
    feature5: 'Exclusive server types',
    feature6: 'Double XP events',
    feature7: 'Instant server repairs',
    feature8: 'Advanced analytics',
    feature9: 'Custom server themes',
    feature10: 'Maximum server capacity',
    feature11: 'Priority chat support',
    feature12: 'Exclusive achievements',
    feature13: '10,000 in-game coins',
    feature14: 'No transaction fees',
    feature15: 'Coin bonus multiplier',
    feature16: 'Seasonal rewards',
    feature17: 'Early access features',
    feature18: 'Community events access',
    popular: 'Popular',
    purchase: 'Purchase',
    confirmPurchase: 'Confirm Purchase',
    included: 'Included',
    paymentNotice: 'Payment Processing',
    paymentNoticeDesc: 'This is a demo version. Real payments are not processed.',
    buyNow: 'Buy Now',
    purchaseNotAvailable: 'Purchase Not Available',
    purchaseNotAvailableDesc: 'This is a demo version. Payment processing is not implemented.',
    
    // Server mini-game translations
    serverminigame1: 'Server Connection',
    serverminigame2: 'Connect all cables by colors to bring the server online. You have 30 seconds!',
    serverminigame3: 'Wrong Connection',
    serverminigame4: 'Make sure to connect cables of the same color!',
    serverminigame5: 'Success!',
    serverminigame6: 'Server is now online and ready to use.',
    serverminigame7: 'Failed!',
    serverminigame8: 'Time ran out! Server durability decreased by 1.',
    serverminigame9: 'Connected:',
    serverminigame10: 'Your server is now online and generating income.',
    serverminigame11: 'Try again when your server is repaired.',
    connectServer: 'Connect Server',
    serverNowOnline: 'Server is now online and generating income.',
    yourServer: 'Server',
    timeLeft: 'Time Left',
    startGame: 'Start Game',
    close: 'Close',
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
    achievements: 'Достижения',
    dailyQuests: 'Ежедневные задания',
    reports: 'Репорты',
    
    // Basic UI
    balance: 'Баланс',
    income: 'Доход/мин',
    monthlyCost: 'Месячная оплата',
    netProfitMonth: 'Доход в месяц',
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
    nicknameTooLong: 'Никнейм должен быть не более 8 символов',
    nicknameInvalidChars: 'Никнейм может содержать только буквы, цифры, дефисы и подчеркивания',
    nicknameMax8Chars: 'Макс 8 символов, только буквы/цифры',
    
    // Hero section
    heroTitle: 'Создайте Свою Серверную Империю',
    heroSubtitle: 'Освойте Искусство Хостинга',
    heroDescription: 'Начните с нуля и постройте крупнейшую империю серверного хостинга в виртуальном мире. Изучите экономику, технологии и стратегию.',
    startPlaying: 'Начать Играть',
    learnMore: 'Узнать Больше',
    
    // Learning progress
    learningInProgress: 'Обучение в процессе',
    timeRemaining: 'осталось',
    serverSlotReward: '+{amount} Серверный слот',

    // Statistics
    totalPlayers: 'Всего Игроков',
    onlineNow: 'Сейчас Онлайн',
    serversHosted: 'Серверов Размещено',
    totalBalance: 'Общий Баланс',

    // Additional hosting translations
    availableSlots: 'Доступные слоты',
    needMoreMoney: 'cДля покупки этого сервера вам потребуется {amount}',
    serverAddedToYourServers: '{serverName} был добавлен к вашим серверам!',
    needLearningCourse: 'Необходимый курс обучения',
    monthlyCost: 'Ежемесячная стоимость',
    netProfitMonth: 'Чистая прибыль/месяц',
    needMoreFunds: 'Не хватает {amount}',
    wantMoreServers: 'Хотите больше серверов?',
    learningCoursesBenefit: 'Каждый пройденный курс позволяет разблокировать дополнительные серверные слоты и повысить эффективность работы сервера. Посетите Учебный центр, чтобы начать свой следующий курс!',
    
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
    errorjob: 'Ошибка, работа пока еще недоступна',
    
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
    tutorialJobs: 'Удаленная работа',
    startJob: 'Начать работу',
    completeJob: 'Завершить работу',
    availableIn: 'Доступно через',
    earnMoney: 'Заработать {amount}',
    cooldownTime: 'Перезарядка: {time}',
    jobStarted: 'Работа выполнена',
    jobStartedDesc: '{jobName} выполнена! Вы заработали {reward}.',
    
    // Job types
    serverMaintenance: 'Обслуживание сервера',
    performanceOptimization: 'Оптимизация производительности',
    securityAudit: 'Аудит безопасности',
    
    // Tutorial tips
    tutorialTips: 'Подсказки обучения',
    tipCompleteJobs: 'С помощью мини-игр можно получить немного опыта',
    tipJobCooldown: 'Чтобы открыть рейтинг и попасть в него - нужен как минимум 5 уровень',
    tipEarnToUnlock: 'Если имеется вопрос или нашли какую-то ошибку - отправляйтесь во вкладку "Репорт"',
    tipPurchaseServers: 'Покупайте серверы для получения пассивного дохода, не забывайте следить за ними',
    tipTakeCourses: 'Проходите курсы обучения, чтобы разблокировать больше слотов для серверов и не только',
    browseServerStore: 'Просмотреть магазин серверов',
    browseLearningCourses: 'Просмотреть курсы обучения',
    
    // Activities
    recentActivities: 'Недавние действия',
    
    // Server management
    purchaseServer: 'Купить сервер',
    deleteServer: 'Удалить сервер',
    toggleServer: 'Переключить сервер',
    noServersYet: 'Серверов пока нет',
    addNewServer: 'Добавить новый сервер',
    availableServerSlots: 'Доступно серверных слотов: {availableSlots}. Посетите магазин серверов, чтобы приобрести новые серверы.',
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
    achievementsList: {
      'first-steps': {
        title: "Первые шаги",
        description: "Выполните свою первую работу",
      },
      'first-server': {
        title: "Первый сервер",
        description: "Купите свой первый сервер",
      },
      'server-collection': {
        title: "Коллекционер серверов",
        description: "Владейте 5 серверами одновременно",
      },
      'millionaire': {
        title: "Миллионер",
        description: "Достигните баланса $1.000.000",
      },
      'job-master': {
        title: "Мастер заданий",
        description: "Выполните 100 работ",
      },
      'learning-enthusiast': {
        title: "Любитель учёбы",
        description: "Пройти все обучающие курсы",
      },
      'early-earner': {
        title: "Ранний заработок",
        description: "Получить первые $10.000",
      },
      'efficient-worker': {
        title: "Эффективный работник",
        description: "Завершите 10 работ",
      },
      'server-builder': {
        title: "Конструктор серверов",
        description: "Владейте 3 различными типами серверов",
      },
      'security-expert': {
        title: "Эксперт по безопасности",
        description: "Выполнить 50 работ по аудиту безопасности",
      },
      'maintenance-guru': {
        title: "Гуру технического обслуживания",
        description: "Выполнить 75 работ по техническому обслуживанию",
      },
      'optimization-master': {
        title: "Мастер оптимизации",
        description: "Выполните 60 работ по оптимизации",
      },
      'wealthy-investor': {
        title: "Богатый инвестор",
        description: "Накопите на балансе $100.000",
      },
      'server-mogul': {
        title: "Серверный магнат",
        description: "Владейте 10 серверами одновременно",
      },
      'persistent-learner': {
        title: "Настойчивый ученик",
        description: "Пройдите 3 учебных курса",
      },
      'speed-demon': {
        title: "Демон скорости",
        description: "Выполните 200 работ",
      },
      'infrastructure-king': {
        title: "Король инфраструктуры",
        description: "Владейте 15 серверами одновременно",
      },
      'multi-millionaire': {
        title: "Мультимиллионер",
        description: "Накопите $5.000.000 на балансе",
      },
      'course-completionist': {
        title: "Завершитель курсов",
        description: "Пройдите все доступные учебные курсы",
      },
      'workaholic': {
        title: "Трудоголик",
        description: "Выполните в общей сложности 500 работ",
      },
      'server-empire': {
        title: "Империя серверов",
        description: "Владейте 20 серверами одновременно",
      },
      'financial-titan': {
        title: "Финансовый титан",
        description: "Накопите $10.000.000 на балансе",
      },
      'legendary-worker': {
        title: "Легендарный работник",
        description: "Выполните 1000 работ",
      },
      'server-overlord': {
        title: "Повелитель серверов",
        description: "Владейте 30 серверами одновременно",
      },
      'billionaire-club': {
        title: "Клуб миллиардеров",
        description: "Накопите $100.000.000 на балансе",
      },
      'ultimate-legend': {
        title: "Абсолютная легенда",
        description: "Выполните 2500 работ",
      }
    },
    rankings: 'Рейтинг',
    claimReward: 'Забрать награду',
    rewardClaimed: 'Награда получена',
    questCompleted: 'Задание выполнено',
    reward: 'Награда',
    progress: 'Прогресс',
    claiming: 'Получение...',
    
    // Daily quests
    dailyQuestsList: {
      'daily-maintenance': {
        title: 'Ежедневное обслуживание',
        description: 'Выполните 3 работы по обслуживанию серверов'
      },
      'daily-income': {
        title: 'Пассивный доход',
        description: 'Заработайте $5.000 от доходов серверов'
      },
      'daily-optimization': {
        title: 'Оптимизация серверов',
        description: 'Выполните 2 работы по оптимизации производительности'
      },
      'daily-security': {
        title: 'Проверка безопасности',
        description: 'Выполните 1 работу по аудиту безопасности'
      },
      'daily-earnings': {
        title: 'Ежедневные доходы',
        description: 'Заработайте $10.000 от доходов серверов'
      },
      'daily-worker': {
        title: 'Трудяга',
        description: 'Выполните 5 работ любого типа'
      },
      'daily-mixed-jobs': {
        title: 'Смешанные задания',
        description: 'Выполните 2 работы по обслуживанию и 1 по оптимизации'
      },
      'daily-income-boost': {
        title: 'Ускорение дохода',
        description: 'Заработайте $20.000 от доходов серверов'
      },
      'daily-job-spree': {
        title: 'Череда работ',
        description: 'Выполните 8 работ любого типа'
      },
      'daily-mega-earner': {
        title: 'Кодер-магнат',
        description: 'Заработайте $50.000 от доходов серверов'
      }
    },
    
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
    chatRules: 'Правила чата',
    chatRule1: 'Не спамить и не флудить — без капса, одинаковых сообщений, бессмысленных символов.',
    chatRule2: 'Уважай других игроков — никаких оскорблений, провокаций и дискриминации.',
    chatRule3: 'Без мата и ненормативной лексики — фильтр может автоматически блокировать такие слова.',
    chatRule4: 'Запрещена реклама и ссылки на сторонние ресурсы.',
    chatRule5: 'Администрация всегда имеет последнее слово — решения модераторов обсуждаются только в поддержке.',
    achievementsLocked: 'Достижения заблокированы',
    completeTutorialToUnlock: 'Пройдите обучение для разблокировки достижений',
    giveMoney: 'Выдать деньги',
    takeMoney: 'Забрать деньги',
    deleteUser: 'Удалить аккаунт игрока',
    amount: 'Сумма',
    enterAmount: 'Введите сумму',
    youAreMuted: 'Вы заглушены и не можете отправлять сообщения',
    noMessages: 'Нет сообщений. Начните общение!',
    messageDeleted: 'Сообщение удалено',
    messageDeletedBy: 'Сообщение удалено администратором {admin}',
    selectMuteDuration: '5м',
    mute: 'Мут',
    activeMutes: 'Активные муты',
    noActiveMutes: 'Нет активных мутов',
    
    // Chat achievements translations - Russian
    first_message: {
      title: 'Первое сообщение',
      description: 'Отправить первое сообщение в чат'
    },
    chatty: {
      title: 'Болтун',
      description: 'Отправить 25 сообщений'
    },
    social_butterfly: {
      title: 'Социальная бабочка',
      description: 'Отправить 100 сообщений'
    },
    chat_master: {
      title: 'Мастер чата',
      description: 'Отправить 500 сообщений'
    },
    
    // Profile and level system
    progressToLevel: 'Прогресс до уровня',
    registrationdate: 'Дата регистрации: ',
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
    levelUpCongrats: 'Поздравляем! Вы достигли',
    levelUpCongrats3: 'уровня',
    levelUpCongrats2: 'Чтобы закрыть окно, нажмите куда-нибудь',
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
    deleteWarningMessage: 'Это действие НЕОБРАТИМО!\nЕсли вы хотите просто отключить сервер, используйте кнопку "Включить/Выключить" вместо удаления.',
    deleteLastWarning: '🚨 ПОСЛЕДНЕЕ ПРЕДУПРЕЖДЕНИЕ!\nВы уверены, что хотите НАВСЕГДА удалить сервер "{serverName}"?\nНапишите "УДАЛИТЬ" чтобы подтвердить:',
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
    minutes: ' мин.',
    hours: ' час.',
    seconds: ' сек.',
    secondsShort: 'сек',
    until: 'до',
    reset: 'сброса',
    resetAvailable: 'Сброс доступен',
    progressLabel: 'Прогресс',
    earnedLabel: 'Получено',
    completedTasks: 'заданий',
    
    // Additional UI strings
    serverLimitNotice: 'Уведомление о лимите серверов',
    serverLimitWarning: 'Вы используете {currentServers} из {serverLimit} доступных слотов серверов. Пройдите курсы обучения, чтобы увеличить лимит!',
    requiresLevel: 'Требуется уровень {level}',
    purchaseFirstServer: 'Купите свой первый сервер в магазине серверов, чтобы начать получать доход.',
    serverPurchased: 'Сервер куплен',
    purchaseFailed: 'Покупка не удалась',
    serverLimitReached: 'Лимит серверов достигнут',
    serverLimitReachedDesc: 'У вас может быть только {serverLimit} серверов. Пройдите курсы обучения, чтобы увеличить лимит.',
    serverAlreadyOnline: 'Сервер уже онлайн',
    serverAlreadyOnlineDesc: 'Этот сервер уже активирован и работает.',
    purchaseServer: 'Купить сервер',
    reachedServerLimit: 'Вы достигли лимита серверов {serverLimit}. Пройдите курсы обучения, чтобы разблокировать больше слотов!',
    completeLearningCoursesToIncrease: 'Пройдите курсы обучения, чтобы увеличить лимит серверов',
    
    // Learning Center specific translations
    learningBenefits: 'Преимущества обучения',
    moreServers: 'Больше серверов',
    unlockAdditionalServerSlots: 'Разблокируйте дополнительные слоты серверов',
    higherEfficiency: 'Высокая эффективность',
    increaseServerIncomeRates: 'Увеличьте доходность серверов',
    betterRankings: 'Лучший рейтинг',
    climbTheLeaderboards: 'Поднимайтесь в таблице лидеров',
    
    // Learning tab specific
    unknownReward: 'Неизвестная награда',
    serverSlotReward: '+{amount} слот сервера',
    serverEfficiencyReward: '+{amount}% эффективности серверов',
    unlockServerReward: 'Разблокирует {serverType}',
    gpuServer: 'GPU сервер',
    tpuServer: 'TPU сервер', 
    specialServer: 'Специальный сервер',
    learningInProgressError: 'Обучение в процессе',
    oneCourseAtTime: 'Вы можете проходить только один курс за раз. Пожалуйста, дождитесь завершения текущего курса.',
    needMoneyForCourse: 'Вам нужно {amount} для начала этого курса.',
    courseStarted: 'Курс начат',
    courseStartedDesc: 'Вы начали курс {courseTitle}. Проверьте свой прогресс во вкладке серверов!',
    failedToStartCourse: 'Не удалось начать курс',
    currentCourse: 'Текущий курс',
    availableCourses: 'Доступные курсы',
    duration: 'Длительность',
    requiresLevelX: 'Требуется уровень {level}',
    startCourse: 'Начать курс',
    needMoreForCourse: 'Нужно еще {amount}',
    completeCurrentFirst: 'Сначала завершите текущий курс',
    
    // Player profile
    loadingPlayerProfile: 'Загрузка профиля игрока...',
    playerNotFound: 'Игрок не найден',
    playerNotFoundDesc: 'Игрок "{nickname}" не существует или профиль закрыт.',
    goBack: 'Назад',
    back: 'Назад',
    playerProfile: 'Профиль игрока',
    online: 'Онлайн',
    offline: 'Офлайн',
    level: 'Уровень',
    rank: 'Место',
    servers: 'серверов',
    totalBalance: 'Общий баланс',
    activeServers: 'Активные серверы',
    globalRank: 'Глобальное место',
    recentActivity: 'Недавняя активность',
    turnOnOff: 'Включить/Выключить',
    
    // Reports system
    reports: 'Репорты',
    createNewReport: 'Создать новый репорт',
    reportSubject: 'Тема репорта',
    reportCategory: 'Категория репорта',
    initialMessage: 'Начальное сообщение',
    general: 'Общий',
    technical: 'Технический',
    createReport: 'Создать репорт',
    reportSent: 'Репорт отправлен',
    reportSentDescription: 'Ваш репорт был успешно отправлен.',
    reportClosed: 'Репорт закрыт',
    reportClosedDescription: 'Репорт был успешно закрыт.',
    reportDeleted: 'Репорт удален',
    reportDeletedDescription: 'Репорт был успешно удален.',
    reportMarked: 'Репорт отмечен',
    reportUnmarked: 'Репорт не отмечен',
    closeReport: 'Закрыть репорт',
    markReport: 'Отметить репорт',
    deleteReport: 'Удалить репорт',
    sendMessage: 'Отправить сообщение',
    typeMessage: 'Сообщение...',
    noReports: 'Репортов пока нет',
    createFirstReport: 'Создайте ваш первый репорт, используя кнопку выше.',
    reportStatus: 'Статус',
    reportCreated: 'Создан',
    reportClosed: 'Закрыт',
    reportMarked: 'Отмечен',
    fillAllFields: 'Пожалуйста, заполните все обязательные поля',
    subjectTooLong: 'Тема не должна превышать 50 символов',
    messageTooLong: 'Сообщение не должно превышать 500 символов',
    characters: 'символов',
    reportSubject: 'Тема отчета',
    reportType: 'Тип отчета',
    reportTypeFeature: 'Запрос функции',
    reportTypeComplaint: 'Жалоба',
    reportTypeOther: 'Другое',
    reportMessage: 'Сообщение',
    submitReport: 'Отправить отчет',
    
    // Reports reopen functionality
    reopenChat: 'Переоткрыть чат',
    reportReopened: 'Репорт переоткрыт',
    reportReopenedDescription: 'Репорт был успешно переоткрыт для дальнейшего общения',
    chatClosedByAdmin: 'Чат закрыт администратором',
    
    // Additional reports translations
    myReports: 'Мои репорты',
    incomingReports: 'Входящие репорты',
    newTicket: 'Новый тикет',
    createNewTicket: 'Создать новый тикет',
    subject: 'Тема',
    category: 'Категория',
    description: 'Описание',
    selectCategory: 'Выберите категорию',
    reportTypeBug: 'Баг или другая ошибка',
    generalIssue: 'Общая проблема',
    technicalIssue: 'Техническая проблема',
    otherIssue: 'Другое',
    featureIssue: 'Запрос функции',
    reportTypeComplaint: 'Жалоба',
    startChat: 'Начать чат',
    sending: 'Отправка...',
    activeReportExists: 'У вас уже есть активный репорт. Дождитесь ответа администратора.',
    noIncomingReports: 'Нет входящих репортов',
    selectReportToView: 'Выберите репорт для просмотра беседы',
    closeChat: 'Закрыть чат',
    deleteChat: 'Удалить чат',
    markChat: 'Отметить чат',
    unmarkChat: 'Снять отметку с чата',
    admin: 'Админ',
    open: 'Открыт',
    closed: 'Закрыт',
    
    // Mini Games translations
    miniGames: 'Мини-игры',
    miniGamesDesc: 'Проверьте свои навыки в веселых мини-играх и зарабатывайте опыт!',
    minigame1: 'Защита от DDoS',
    minigame1Desc: 'Защитите свои серверы от атак вредоносных пакетов',
    minigame2: 'Фильтр Файрвола',
    minigame2Desc: 'Разрешайте легальные запросы и блокируйте вредоносные',
    requests: 'ответов',
    howToPlay: 'Как играть',
    ddosInstructions: 'Кликайте по красным пакетам, чтобы уничтожить их до того, как они достигнут вашего сервера. Скорость увеличивается со временем! За каждое уничтожение +1 опыт.',
    firewallInstructions: 'Просматривайте каждый запрос и выбирайте Разрешить для безопасных запросов или Заблокировать для опасных. Будьте быстры и точны! За каждый правильный ответ +1 опыт.',
    startGame: 'Начать игру',
    gameCompleted: 'Игра завершена!',
    earnedXP: 'Вы заработали {amount} опыта!',
    packetsDestroyed: 'Пакетов уничтожено',
    correct: 'Правильно',
    correct2: 'правильный',
    packet: 'пакет',
    wrong: 'Неправильно',
    score: 'Счет',
    timeLeft: 'Осталось времени',
    requestsLeft: 'Осталось запросов',
    blockOrAllow: 'Блокируйте опасные запросы или разрешайте безопасные',
    block: 'Заблокировать',
    allow: 'Разрешить',
    yourServer: 'Ваш сервер',
    medium: 'Средний',
    
    // Donate translations
    donate: 'Донат',
    donateDesc: 'Поддержите разработку игры и получите эксклюзивные преимущества!',
    donate1: 'Стартовый пакет',
    donate1Desc: 'Начните с базовых преимуществ',
    donate2: 'Премиум пакет (Навсегда)',
    donate2Desc: 'Продвинутые функции для серьезных игроков',
    donate3: 'Пакет ускорения',
    donate3Desc: 'Значительно ускорьте свой прогресс',
    donate4: 'Максимальный пакет',
    donate4Desc: 'Максимальные преимущества и эксклюзивный контент',
    donate5: 'Пакет монет',
    donate5Desc: 'Внутриигровая валюта для покупок',
    donate6: 'Специальный пакет',
    donate6Desc: 'Ограниченное предложение с уникальными наградами',
    feature1: 'Дополнительные слоты серверов',
    feature2: 'Ускоренные курсы обучения',
    feature3: 'Бонусные ежедневные награды',
    feature4: 'VIP приоритет поддержки',
    feature5: 'Эксклюзивные типы серверов',
    feature6: 'События с двойным опытом',
    feature7: 'Мгновенный ремонт серверов',
    feature8: 'Продвинутая аналитика',
    feature9: 'Пользовательские темы серверов',
    feature10: 'Максимальная емкость серверов',
    feature11: 'Приоритетная поддержка в чате',
    feature12: 'Эксклюзивные достижения',
    feature13: '10.000 внутриигровых монет',
    feature14: 'Без комиссий за транзакции',
    feature15: 'Множитель бонуса монет',
    feature16: 'Сезонные награды',
    feature17: 'Ранний доступ к функциям',
    feature18: 'Доступ к событиям сообщества',
    popular: 'Популярный',
    purchase: 'Купить',
    confirmPurchase: 'Подтвердить покупку',
    included: 'Включено',
    paymentNotice: 'Обработка платежа',
    paymentNoticeDesc: 'Это демо версия. Реальные платежи не обрабатываются.',
    buyNow: 'Купить сейчас',
    purchaseNotAvailable: 'Покупка недоступна',
    purchaseNotAvailableDesc: 'Это демо версия. Обработка платежей не реализована.',
    
    // Server mini-game translations
    serverminigame1: 'Подключение сервера',
    serverminigame2: 'Соедините все провода по цветам, чтобы включить сервер. У вас есть 30 секунд!',
    serverminigame3: 'Неправильное подключение',
    serverminigame4: 'Убедитесь, что соединяете провода одинакового цвета!',
    serverminigame5: 'Успех!',
    serverminigame6: 'Сервер теперь онлайн и готов к использованию.',
    serverminigame7: 'Неудача!',
    serverminigame8: 'Время вышло! Прочность сервера уменьшена на 1.',
    serverminigame9: 'Подключено:',
    serverminigame10: 'Ваш сервер теперь онлайн и генерирует доход.',
    serverminigame11: 'Попробуйте снова, когда сервер будет отремонтирован.',
    connectServer: 'Подключить сервер',
    serverNowOnline: 'Сервер теперь онлайн и генерирует доход.',
    yourServer: 'Сервер',
    timeLeft: 'Осталось времени',
    startGame: 'Начать игру',
    close: 'Закрыть',
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
    monthlyCost: 'Місячна оплата',
    netProfitMonth: 'Дохід на місяць',
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
    
    // Learning progress
    learningInProgress: 'Навчання в процесі',
    timeRemaining: 'залишилося',
    serverSlotReward: '+{amount} Серверний слот',

    // Statistics
    totalPlayers: 'Всього Гравців',
    onlineNow: 'Зараз Онлайн',
    serversHosted: 'Серверів Розміщено',
    totalBalance: 'Загальний Баланс',

    // Additional hosting translations
    availableSlots: 'Доступні слоти',
    needMoreMoney: 'Для купівлі цього сервера вам буде потрібно {amount}',
    serverAddedToYourServers: '{serverName} був доданий до ваших серверів!',
    needLearningCourse: 'Необхідний курс навчання',
    monthlyCost: 'Щомісячна вартість',
    netProfitMonth: 'Чистий прибуток/місяць',
    needMoreFunds: 'Не вистачає {amount}',
    wantMoreServers: 'Хочете більше серверів?',
    learningCoursesBenefit: 'Кожен пройдений курс дає змогу розблокувати додаткові серверні слоти та підвищити ефективність роботи сервера. Відвідайте Навчальний центр, щоб почати свій наступний курс!',
    
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
    errorjob: 'Помилка, робота поки що недоступна',
    
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
    tutorialJobs: 'Дистанційна робота',
    startJob: 'Почати роботу',
    completeJob: 'Завершити роботу',
    availableIn: 'Доступно через',
    earnMoney: 'Заробити {amount}',
    cooldownTime: 'Перезарядка: {time}',
    jobStarted: 'Робота виконана',
    jobStartedDesc: '{jobName} виконана! Ви отримали {reward}.',
    
    // Job types
    serverMaintenance: 'Обслуговування сервера',
    performanceOptimization: 'Оптимізація продуктивності',
    securityAudit: 'Аудит безпеки',
    
    // Tutorial tips
    tutorialTips: 'Підказки навчання',
    tipCompleteJobs: 'За допомогою міні-ігор ви можете отримати певний досвід',
    tipJobCooldown: 'Щоб відкрити рейтинг і потрапити до нього - потрібно мати хоча б 5 рівень',
    tipEarnToUnlock: 'Якщо у вас є питання або ви знайшли помилку - перейдіть на вкладку "Звіт"',
    tipPurchaseServers: "Купуйте сервери для пасивного доходу, не забувайте стежити за ними",
    tipTakeCourses: 'Пройдіть навчальні курси, щоб розблокувати більше серверних слотів і не тільки',
    browseServerStore: 'Переглянути магазин серверів',
    browseLearningCourses: 'Переглянути курси навчання',
    
    // Activities
    recentActivities: 'Нещодавні дії',
    
    // Server management
    purchaseServer: 'Купити сервер',
    deleteServer: 'Видалити сервер',
    toggleServer: 'Перемкнути сервер',
    noServersYet: 'Серверів поки немає',
    addNewServer: 'Добавити новий сервер',
    availableServerSlots: 'Доступно серверних слотів: {availableSlots}. Відвідайте магазин серверів, щоб придбати нові сервери.',
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
    achievementsList: {
      'first-steps': {
        title: "Першi кроки",
        description: "Виконайте свою першу роботу",
      },
      'first-server': {
        title: "Перший сервер",
        description: "Купіть свій перший сервер",
      },
      'server-collection': {
        title: "Колекціонер серверів",
        description: "Володійте 5 серверами одночасно",
      },
      'millionaire': {
        title: "Мільйонер",
        description: "Досягніть балансу $1.000.000",
      },
      'job-master': {
        title: "Майстер завдань",
        description: "Виконайте загалом 100 робіт",
      },
      'learning-enthusiast': {
        title: "Любитель навчання",
        description: "Пройти всі навчальні курси",
      },
      'early-earner': {
        title: "Ранній заробіток",
        description: "Отримати перші $10.000",
      },
      'efficient-worker': {
        title: "Ефективний працівник",
        description: "Виконати 10 робіт",
      },
      'server-builder': {
        title: "Конструктор серверів",
        description: "Володійте 3 різними типами серверів",
      },
      'security-expert': {
        title: "Експерт з безпеки",
        description: "Виконати 50 робіт з аудиту безпеки",
      },
      'maintenance-guru': {
        title: "Гуру технічного обслуговування",
        description: "Виконати 75 робіт з технічного обслуговування",
      },
      'optimization-master': {
        title: "Майстер оптимізації",
        description: "Виконайте 60 робіт з оптимізації",
      },
      'wealthy-investor': {
        title: "Багатий інвестор",
        description: "Досягніть на балансі $100.000",
      },
      'server-mogul': {
        title: "Серверний магнат",
        description: "Володійте 10 серверами одночасно",
      },
      'persistent-learner': {
        title: "Наполегливий учень",
        description: "Пройдіть 3 навчальні курси",
      },
      'speed-demon': {
        title: "Демон швидкості",
        description: "Виконайте загалом 200 робіт",
      },
      'infrastructure-king': {
        title: "Король інфраструктури",
        description: "Володійте 15 серверами одночасно",
      },
      'multi-millionaire': {
        title: "Мультимільйонер",
        description: "Досягніть $5.000.000 на балансі",
      },
      'course-completionist': {
        title: "Завершувач курсів",
        description: "Пройдіть усі доступні навчальні курси",
      },
      'workaholic': {
        title: "Трудоголік",
        description: "Виконайте загалом 500 робіт",
      },
      'server-empire': {
        title: "Імперія серверів",
        description: "Володійте 20 серверами одночасно",
      },
      'financial-titan': {
        title: "Фінансовий титан",
        description: "Досягніть $10.000.000 на балансі",
      },
      'legendary-worker': {
        title: "Легендарний працівник",
        description: "Виконайте загалом 1000 робіт",
      },
      'server-overlord': {
        title: "Володар серверів",
        description: "Володійте 30 серверами одночасно",
      },
      'billionaire-club': {
        title: "Клуб мільярдерів",
        description: "Досягніть $100.000.000 на балансі",
      },
      'ultimate-legend': {
        title: "Абсолютна легенда",
        description: "Виконайте загалом 2500 робіт",
      }
    },
    rankings: 'Рейтинг',
    claimReward: 'Забрати нагороду',
    rewardClaimed: 'Нагорода отримана',
    questCompleted: 'Завдання виконано',
    reward: 'Нагорода',
    progress: 'Прогрес',
    claiming: 'Отримання...',
    
    // Daily quests
    dailyQuestsList: {
      'daily-maintenance': {
        title: 'Щоденне обслуговування',
        description: 'Виконайте 3 роботи з обслуговування серверів'
      },
      'daily-income': {
        title: 'Пасивний дохід',
        description: 'Заробіть $5.000 від доходів серверів'
      },
      'daily-optimization': {
        title: 'Оптимізація серверів',
        description: 'Виконайте 2 роботи з оптимізації продуктивності'
      },
      'daily-security': {
        title: 'Перевірка безпеки',
        description: 'Виконайте 1 роботу з аудиту безпеки'
      },
      'daily-earnings': {
        title: 'Щоденні доходи',
        description: 'Заробіть $10.000 від доходів серверів'
      },
      'daily-worker': {
        title: 'Працьовитий',
        description: 'Виконайте 5 робіт будь-якого типу'
      },
      'daily-mixed-jobs': {
        title: 'Змішані завдання',
        description: 'Виконайте 2 роботи з обслуговування та 1 з оптимізації'
      },
      'daily-income-boost': {
        title: 'Прискорення доходу',
        description: 'Заробіть $20.000 від доходів серверів'
      },
      'daily-job-spree': {
        title: 'Серія робіт',
        description: 'Виконайте 8 робіт будь-якого типу'
      },
      'daily-mega-earner': {
        title: 'Кодер-магнат',
        description: 'Заробіть $50.000 від доходів серверів'
      }
    },
    
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
    chatRules: 'Правила чата',
    chatRule1: 'Не спамити і не флудити - без капсу, однакових повідомлень, безглуздих символів.',
    chatRule2: 'Поважай інших гравців - ніяких образ, провокацій і дискримінації.',
    chatRule3: 'Без мату і ненормативної лексики - фільтр може автоматично блокувати такі слова.',
    chatRule4: 'Заборонено рекламу та посилання на сторонні ресурси.',
    chatRule5: 'Адміністрація завжди має останнє слово - рішення модераторів обговорюються тільки в підтримці.',
    giveMoney: 'Видати гроші',
    takeMoney: 'Забрати гроші',
    deleteUser: 'Видалити аккаунт гравця',
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
    registrationdate: 'Дата реєстрації: ',
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
    levelUpCongrats: 'Вітаємо! Ви досягли',
    levelUpCongrats3: 'рівня',
    levelUpCongrats2: 'Щоб закрити вікно, клацніть де-небудь',
    newAbilitiesUnlocked: 'Нові можливості розблоковані!',
    
    // Tooltips and hints
    profileTooltip: 'Натисніть на свою аватарку, щоб побачити прогрес та іншу цікаву інформацію',
    nicknameTooltip: 'Якщо натиснути на свій нік або чужий, можна перейти на профіль гравця',
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
    deleteWarningMessage: 'Ця дія НЕЗВОРОТНА!\nЯкщо ви хочете просто вимкнути сервер, використовуйте кнопку "Увімкнути/Вимкнути" замість видалення.',
    deleteLastWarning: '🚨 ОСТАННЄ ПОПЕРЕДЖЕННЯ!\nВи впевнені, що хочете НАЗАВЖДИ видалити сервер "{serverName}"?\nНапишіть "ВИДАЛИТИ" щоб підтвердити:',
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
    minutes: ' хв.',
    hours: ' год.',
    seconds: ' сек.',
    secondsShort: 'сек',
    until: 'до',
    reset: 'скидання',
    resetAvailable: 'Скидання доступне',
    progressLabel: 'Прогрес',
    earnedLabel: 'Отримано',
    completedTasks: 'завдань',
    
    // Additional UI strings
    serverLimitNotice: 'Повідомлення про ліміт серверів',
    serverLimitWarning: 'Ви використовуєте {currentServers} з {serverLimit} доступних слотів серверів. Пройдіть курси навчання, щоб збільшити ліміт!',
    requiresLevel: 'Потрібен рівень {level}',
    purchaseFirstServer: 'Купіть свій перший сервер у магазині серверів, щоб почати отримувати дохід.',
    serverPurchased: 'Сервер куплено',
    purchaseFailed: 'Покупка не вдалася',
    serverLimitReached: 'Ліміт серверів досягнуто',
    serverLimitReachedDesc: 'У вас може бути лише {serverLimit} серверів. Пройдіть курси навчання, щоб збільшити ліміт.',
    purchaseServer: 'Купити сервер',
    reachedServerLimit: 'Ви досягли ліміту серверів {serverLimit}. Пройдіть курси навчання, щоб розблокувати більше слотів!',
    completeLearningCoursesToIncrease: 'Пройдіть курси навчання, щоб збільшити ліміт серверів',
    
    // Learning Center specific translations
    learningBenefits: 'Переваги навчання',
    moreServers: 'Більше серверів',
    unlockAdditionalServerSlots: 'Розблокуйте додаткові слоти серверів',
    higherEfficiency: 'Вища ефективність',
    increaseServerIncomeRates: 'Збільште дохідність серверів',
    betterRankings: 'Кращий рейтинг',
    climbTheLeaderboards: 'Піднімайтеся в таблиці лідерів',
    
    // Learning tab specific
    unknownReward: 'Невідома нагорода',
    serverSlotReward: '+{amount} слот сервера',
    serverEfficiencyReward: '+{amount}% ефективності серверiв',
    unlockServerReward: 'Розблоковує {serverType}',
    gpuServer: 'GPU сервер',
    tpuServer: 'TPU сервер', 
    specialServer: 'Спеціальний сервер',
    learningInProgressError: 'Навчання в процесі',
    oneCourseAtTime: 'Ви можете проходити тільки один курс за раз. Будь ласка, дочекайтеся завершення поточного курсу.',
    needMoneyForCourse: 'Вам потрібно {amount} для початку цього курсу.',
    courseStarted: 'Курс розпочато',
    courseStartedDesc: 'Ви розпочали курс {courseTitle}. Перевірте свій прогрес у вкладці серверів!',
    failedToStartCourse: 'Не вдалося розпочати курс',
    currentCourse: 'Поточний курс',
    availableCourses: 'Доступні курси',
    duration: 'Тривалість',
    requiresLevelX: 'Потрібен рівень {level}',
    startCourse: 'Розпочати курс',
    needMoreForCourse: 'Потрібно ще {amount}',
    completeCurrentFirst: 'Спочатку завершіть поточний курс',
    
    // Player profile
    loadingPlayerProfile: 'Завантаження профілю гравця...',
    playerNotFound: 'Гравця не знайдено',
    playerNotFoundDesc: 'Гравець "{nickname}" не існує або профіль закритий.',
    goBack: 'Назад',
    back: 'Назад',
    playerProfile: 'Профіль гравця',
    online: 'Онлайн',
    offline: 'Офлайн',
    level: 'Рівень',
    rank: 'Місце',
    servers: 'серверів',
    totalBalance: 'Загальний баланс',
    activeServers: 'Активні сервери',
    globalRank: 'Глобальне місце',
    recentActivity: 'Нещодавня активність',
    turnOnOff: 'Увімкнути/Вимкнути',
    
    // Reports system
    reports: 'Звіти',
    createNewReport: 'Створити новий звіт',
    reportSubject: 'Тема звіту',
    reportCategory: 'Категорія звіту',
    initialMessage: 'Початкове повідомлення',
    general: 'Загальні',
    technical: 'Технічні',
    createReport: 'Створити звіт',
    reportSent: 'Звіт відправлено',
    reportSentDescription: 'Ваш звіт успішно відправлено.',
    reportClosed: 'Звіт закрито',
    reportClosedDescription: 'Звіт успішно закрито.',
    reportDeleted: 'Звіт видалено',
    reportDeletedDescription: 'Звіт успішно видалено.',
    reportMarked: 'Звіт позначено',
    reportUnmarked: 'Звіт не позначено',
    closeReport: 'Закрити звіт',
    markReport: 'Позначити звіт',
    deleteReport: 'Видалити звіт',
    sendMessage: 'Надіслати повідомлення',
    typeMessage: 'Повідомлення...',
    noReports: 'Ще немає звітів',
    createFirstReport: 'Створіть свій перший звіт за допомогою кнопки вище.',
    reportStatus: 'Статус',
    reportCreated: 'Створено',
    reportClosed: 'Закрито',
    reportMarked: 'Позначено',
    fillAllFields: "Будь ласка, заповніть всі обов'язкові поля",
    subjectTooLong: 'Тема не повинна перевищувати 50 символів',
    messageTooLong: 'Повідомлення не повинно перевищувати 500 символів',
    characters: 'символів',
    reportType: 'Тип звіту',
    reportTypeFeature: 'Функціональний запит',
    reportTypeComplaint: 'Скарга',
    reportTypeOther: 'Інше',
    reportMessage: 'Повідомлення',
    submitReport: 'Надіслати звіт',
    
    // Reports reopen functionality
    reopenChat: 'Перезапустити чат',
    reportReopened: 'Звіт перезапущено',
    reportReopenedDescription: 'Звіт успішно перезапущено для подальшого спілкування',
    chatClosedByAdmin: 'Чат закрито адміністратором',
    
    // Additional reports translations
    myReports: 'Мої звіти',
    incomingReports: 'Вхідні звіти',
    newTicket: 'Новий тикет',
    createNewTicket: 'Створити новий тикет',
    subject: 'Тема',
    category: 'Категорія',
    description: 'Опис',
    selectCategory: 'Вибрати категорію',
    reportTypeBug: 'Баг або інша помилка',
    otherIssue: 'Інше',
    featureIssue: 'Запит функції',
    reportTypeComplaint: 'Скарга',
    generalIssue: 'Загальний випуск',
    technicalIssue: 'Технічний випуск',
    startChat: 'Почати чат',
    sending: 'Надсилання...',
    activeReportExists: 'Ви вже маєте активний звіт. Будь ласка, дочекайтеся відповіді адміністратора.',
    noIncomingReports: 'Немає вхідних звітів',
    selectReportToView: 'Виберіть звіт, щоб переглянути розмову',
    closeChat: 'Закрити чат',
    deleteChat: 'Видалити чат',
    markChat: 'Позначити чат',
    unmarkChat: 'Зняти позначку',
    admin: 'Адміністратор',
    open: 'Відкрито',
    closed: 'Закрито',

    // Мини-игры переводы
    miniGames: 'Міні-ігри',
    miniGamesDesc: 'Перевірте свої навички в захоплюючих міні-іграх та заробляйте досвід!',
    minigame1: 'Захист від DDoS',
    minigame1Desc: 'Захистіть свої сервери від вхідних пакетних атак',
    minigame2: 'Фільтр Фаєрвола',
    minigame2Desc: 'Дозволяйте легітимні запити та блокуйте шкідливі',
    requests: 'відповідей',
    howToPlay: 'Як грати',
    ddosInstructions: 'Клікайте по червоних пакетах, щоб знищити їх до того, як вони досягнуть вашого сервера. Швидкість збільшується з часом! За кожне знищення +1 досвід.',
    firewallInstructions: 'Переглядайте кожен запит та вибирайте дозволити безпечні запити або заблокувати небезпечні. Будьте швидкими та точними! За кожну правильну відповідь +1 досвід.',
    gameCompleted: 'Гра завершена!',
    earnedXP: 'Ви заробили {amount} досвіду!',
    packetsDestroyed: 'Пакетів знищено',
    correct: 'Правильно',
    correct2: 'вірний',
    packet: 'пакет',
    wrong: 'Неправильно',
    score: 'Рахунок',
    timeLeft: 'Часу залишилось',
    requestsLeft: 'Запитів залишилось',
    blockOrAllow: 'Блокуйте небезпечні запити або дозволяйте безпечні',
    block: 'Заблокувати',
    allow: 'Дозволити',
    yourServer: 'Ваш сервер',
    medium: 'Середній',
    
    // Донат переводы
    donate: 'Донат',
    donateDesc: 'Підтримайте розробку гри та отримайте ексклюзивні переваги!',
    donate1: 'Стартовий пакет',
    donate1Desc: 'Почніть з базових переваг',
    donate2: 'Преміум пакет (Навсегда)',
    donate2Desc: 'Просунуті функції для серйозних гравців',
    donate3: 'Пакет прискорення',
    donate3Desc: 'Значно прискорте свій прогрес',
    donate4: 'Максимальний пакет',
    donate4Desc: 'Максимальні переваги та ексклюзивний контент',
    donate5: 'Пакет монет',
    donate5Desc: 'Внутрішньоігрова валюта для покупок',
    donate6: 'Спеціальний пакет',
    donate6Desc: 'Обмежена пропозиція з унікальними нагородами',
    feature1: 'Додаткові слоти серверів',
    feature2: 'Прискорені курси навчання',
    feature3: 'Бонусні щоденні нагороди',
    feature4: 'VIP пріоритет підтримки',
    feature5: 'Ексклюзивні типи серверів',
    feature6: 'Події з подвійним досвідом',
    feature7: 'Миттєвий ремонт серверів',
    feature8: 'Розширена аналітика',
    feature9: 'Користувацькі теми серверів',
    feature10: 'Максимальна ємність серверів',
    feature11: 'Пріоритетна підтримка в чаті',
    feature12: 'Ексклюзивні досягнення',
    feature13: '10.000 внутрішньоігрових монет',
    feature14: 'Без комісій за транзакції',
    feature15: 'Множник бонусу монет',
    feature16: 'Сезонні нагороди',
    feature17: 'Ранній доступ до функцій',
    feature18: 'Доступ до подій спільноти',
    popular: 'Популярний',
    purchase: 'Купити',
    confirmPurchase: 'Підтвердити покупку',
    included: 'Включено',
    paymentNotice: 'Обробка платежу',
    paymentNoticeDesc: 'Це демо версія. Реальні платежі не обробляються.',
    buyNow: 'Купити зараз',
    purchaseNotAvailable: 'Покупка недоступна',
    purchaseNotAvailableDesc: 'Це демо версія. Обробка платежів не реалізована.',
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
    monthlyCost: 'Monatliche Zahlung',
    netProfitMonth: 'Einkommen pro Monat',
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
    
    // Learning progress
    learningInProgress: 'Lernen im Prozess',
    timeRemaining: 'verbleibende',

    // Statistics
    totalPlayers: 'Gesamtspieler',
    onlineNow: 'Jetzt Online',
    serversHosted: 'Gehostete Server',
    totalBalance: 'Gesamtguthaben',

    // Additional hosting translations
    availableSlots: 'Verfügbare Slots',
    needMoreMoney: 'Um diesen Server zu kaufen, benötigen Sie {amount}',
    serverAddedToYourServers: '{serverName} wurde zu Ihren Servern hinzugefügt!',
    needLearningCourse: 'Schulungskurs erforderlich',
    needMoreFunds: 'Nicht genug {amount}',
    wantMoreServers: 'Mehr Server gewünscht?',
    learningCoursesBenefit: 'Jeder abgeschlossene Kurs schaltet zusätzliche Server-Slots frei und erhöht die Server-Effizienz. Besuchen Sie das Schulungszentrum, um Ihren nächsten Kurs zu beginnen!',
    
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
    errorjob: 'Fehler, Arbeit ist noch nicht verfügbar',
    
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
    tutorialJobs: 'Fernarbeit',
    startJob: 'Job starten',
    completeJob: 'Job abschließen',
    availableIn: 'Verfügbar in',
    earnMoney: '{amount} verdienen',
    cooldownTime: 'Abklingzeit: {time}',
    jobStarted: 'Auftrag erledigt',
    jobStartedDesc: '{JobName} ist erledigt! Du hast {reward} verdient.',
    
    // Job types
    serverMaintenance: 'Server-Wartung',
    performanceOptimization: 'Leistungsoptimierung',
    securityAudit: 'Sicherheitsaudit',
    
    // Tutorial tips
    tutorialTips: 'Tutorial-Tipps',
    tipCompleteJobs: 'Mit Minispielen können Sie Erfahrungen sammeln',
    tipJobCooldown: 'Um die Bewertung zu öffnen und in sie einzusteigen, benötigen Sie mindestens Stufe 5',
    tipEarnToUnlock: 'Wenn Sie eine Frage haben oder einen Fehler gefunden haben - gehen Sie auf die Registerkarte "Bericht"',
    tipPurchaseServers: "Kaufen Sie Server für passives Einkommen, vergessen Sie nicht, sie im Auge zu behalten",
    tipTakeCourses: 'Nehmen Sie an Schulungen teil, um mehr Serverplätze und mehr freizuschalten',
    browseServerStore: 'Server Shop durchsuchen',
    browseLearningCourses: 'Lernkurse durchsuchen',
    
    // Activities
    recentActivities: 'Kürzliche Aktivitäten',
    
    // Server management
    purchaseServer: 'Server kaufen',
    deleteServer: 'Server löschen',
    toggleServer: 'Server umschalten',
    noServersYet: 'Noch keine Server',
    addNewServer: 'Einen neuen Server hinzufügen',
    availableServerSlots: 'Sie haben einen {availableSlots} Serverplatz zur Verfügung. Besuchen Sie den Serverladen, um neue Server zu kaufen.',
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
    achievementsList: {
      'first-steps': {
        title: "Erste Schritte",
        description: "Erledigen Sie Ihren ersten Auftrag",
      },
      'first-server': {
        title: "Erster Server",
        description: "Kaufen Sie Ihren ersten Server",
      },
      'server-collection': {
        title: "Server-Sammler",
        description: "5 Server gleichzeitig besitzen",
      },
      'millionaire': {
        title: "Millionär",
        description: "1.000.000 $ Guthaben anhäufen",
      },
      'job-master': {
        title: "Job Master",
        description: "100 Jobs erledigen",
      },
      'learning-enthusiast': {
        title: "Lernbegeisterter",
        description: "Alle Lernkurse abschließen",
      },
      'early-earner': {
        title: "Frühverdiener",
        description: "Alle Lernkurse abschließen",
      },
      'efficient-worker': {
        title: "Effizienter Arbeiter",
        description: "10 Jobs abschließen",
      },
      'server-builder': {
        title: "Server Builder",
        description: "Besitze 3 verschiedene Servertypen",
      },
      'security-expert': {
        title: "Sicherheitsexperte",
        description: "Erledige 50 Sicherheitsprüfungsaufträge",
      },
      'maintenance-guru': {
        title: "Wartungsguru",
        description: "Erledige 75 Wartungsaufträge",
      },
      'optimization-master': {
        title: "Optimierungsmeister",
        description: "Erledige 60 Optimierungsaufträge",
      },
      'wealthy-investor': {
        title: "Wohlhabender Investor",
        description: "100.000 $ Guthaben anhäufen",
      },
      'server-mogul': {
        title: "Server Mogul",
        description: "10 Server gleichzeitig besitzen",
      },
      'persistent-learner': {
        title: "Ausdauernder Lerner",
        description: "3 Lernkurse abschließen",
      },
      'speed-demon': {
        title: "Geschwindigkeitsdämon",
        description: "Insgesamt 200 Jobs erledigen",
      },
      'infrastructure-king': {
        title: "Infrastrukturkönig",
        description: "15 Server gleichzeitig besitzen",
      },
      'multi-millionaire': {
        title: "Multi-Millionär",
        description: "5.000.000 $ Guthaben anhäufen",
      },
      'course-completionist': {
        title: "Kursabsolvent",
        description: "Alle verfügbaren Lernkurse abschließen",
      },
      'workaholic': {
        title: "Workaholic",
        description: "Insgesamt 500 Jobs abschließen",
      },
      'server-empire': {
        title: "Server-Imperium",
        description: "20 Server gleichzeitig besitzen",
      },
      'financial-titan': {
        title: "Finanz-Titan",
        description: "10.000.000 $ Guthaben anhäufen",
      },
      'legendary-worker': {
        title: "Legendärer Arbeiter",
        description: "Insgesamt 1000 Jobs erledigen",
      },
      'server-overlord': {
        title: "Server-Overlord",
        description: "30 Server gleichzeitig besitzen",
      },
      'billionaire-club': {
        title: "Billionaire Club",
        description: "100.000.000 $ Guthaben anhäufen",
      },
      'ultimate-legend': {
        title: "Ultimative Legende",
        description: "Insgesamt 2500 Jobs erledigen",
      }
    },
    rankings: 'Rangliste',
    claimReward: 'Belohnung einfordern',
    rewardClaimed: 'Belohnung erhalten',
    questCompleted: 'Aufgabe abgeschlossen',
    reward: 'Belohnung',
    progress: 'Fortschritt',
    claiming: 'Einfordern...',
    
    // Daily quests
    dailyQuestsList: {
      'daily-maintenance': {
        title: 'Tägliche Wartung',
        description: 'Führen Sie 3 Server-Wartungsaufgaben arbeit'
      },
      'daily-income': {
        title: 'Passives Einkommen',
        description: 'Verdienen Sie $5.000 aus Server-Einkommen'
      },
      'daily-optimization': {
        title: 'Server-Optimierung',
        description: 'Führen Sie 2 Leistungsoptimierungs-Aufgaben arbeit'
      },
      'daily-security': {
        title: 'Sicherheitsprüfung',
        description: 'Führen Sie 1 Sicherheitsaudit-Aufgabe arbeit'
      },
      'daily-earnings': {
        title: 'Tägliche Einnahmen',
        description: 'Verdienen Sie $10.000 aus Server-Einkommen'
      },
      'daily-worker': {
        title: 'Fleißiger Arbeiter',
        description: 'Führen Sie 5 Aufgaben beliebigen Typs arbeit'
      },
      'daily-mixed-jobs': {
        title: 'Gemischte Aufgaben',
        description: 'Führen Sie 2 Wartungs- und 1 Optimierungsaufgabe arbeit'
      },
      'daily-income-boost': {
        title: 'Einkommens-Boost',
        description: 'Verdienen Sie $20.000 aus Server-Einkommen'
      },
      'daily-job-spree': {
        title: 'Aufgaben-Serie',
        description: 'Führen Sie 8 Aufgaben beliebigen Typs arbeit'
      },
      'daily-mega-earner': {
        title: 'Mega-Verdiener',
        description: 'Verdienen Sie $50.000 aus Server-Einkommen'
      }
    },
    
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
    chatRules: 'Chat-Regeln',
    chatRule1: 'Kein Spamming oder Flooding - keine Großbuchstaben, keine identischen Nachrichten, keine sinnlosen Zeichen.',
    chatRule2: 'Respektiere andere Spieler - keine Beleidigungen, Provokationen und Diskriminierungen.',
    chatRule3: 'Keine matte und beleidigende Sprache - der Filter kann solche Wörter automatisch blockieren..',
    chatRule4: 'Werbung und Links zu fremden Ressourcen sind verboten.',
    chatRule5: 'Die Administration hat immer das letzte Wort - Entscheidungen der Moderatoren werden nur zur Unterstützung diskutiert.',
    giveMoney: 'Geld geben',
    takeMoney: 'Geld nehmen',
    deleteUser: 'Benutzerkonto löschen',
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
    registrationdate: 'Datum der Registrierung: ',
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
    levelUpCongrats: 'Herzlichen Glückwunsch! Sie haben erreicht',
    levelUpCongrats3: 'Level',
    levelUpCongrats2: 'Um das Fenster zu schließen, klicken Sie irgendwo',
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
    deleteWarningMessage: 'Diese Aktion ist IRREVERSIBEL!\nWenn Sie den Server nur ausschalten möchten, verwenden Sie die "Ein/Aus"-Taste anstatt zu löschen.',
    deleteLastWarning: '🚨 LETZTE WARNUNG!\nSind Sie sicher, dass Sie Server "{serverName}" PERMANENT löschen möchten?\nGeben Sie "LÖSCHEN" ein, um zu bestätigen:',
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
    minutes: ' Min.',
    hours: ' St.',
    seconds: ' Sek.',
    secondsShort: 'Sek',
    until: 'bis',
    reset: 'zurücksetzen',
    resetAvailable: 'Zurücksetzen verfügbar',
    progressLabel: 'Fortschritt',
    earnedLabel: 'Verdient',
    completedTasks: 'Aufgaben',
    
    // Additional UI strings
    serverLimitNotice: 'Server-Limit-Hinweis',
    serverLimitWarning: 'Sie verwenden {currentServers} von {serverLimit} verfügbaren Server-Slots. Absolvieren Sie Lernkurse, um Ihr Limit zu erhöhen!',
    requiresLevel: 'Benötigt Level {level}',
    purchaseFirstServer: 'Kaufen Sie Ihren ersten Server aus dem Server-Shop, um Einkommen zu erzielen.',
    serverPurchased: 'Server gekauft',
    purchaseFailed: 'Kauf fehlgeschlagen',
    reachedServerLimit: 'Sie haben Ihr Server-Limit von {serverLimit} erreicht. Absolvieren Sie Lernkurse, um mehr Slots freizuschalten!',
    completeLearningCoursesToIncrease: 'Absolvieren Sie Lernkurse, um Ihr Server-Limit zu erhöhen',
    
    // Learning Center specific translations
    learningBenefits: 'Lernvorteile',
    moreServers: 'Mehr Server',
    unlockAdditionalServerSlots: 'Schalten Sie zusätzliche Server-Slots frei',
    higherEfficiency: 'Höhere Effizienz',
    increaseServerIncomeRates: 'Erhöhen Sie die Server-Einnahmeraten',
    betterRankings: 'Bessere Rankings',
    climbTheLeaderboards: 'Steigen Sie in den Bestenlisten auf',
    
    // Learning tab specific
    unknownReward: 'Unbekannte Belohnung',
    serverSlotReward: '+{amount} Server-Slot{plural}',
    serverEfficiencyReward: '+{amount}% Server-Effizienz',
    unlockServerReward: 'Schaltet {serverType} frei',
    gpuServer: 'GPU-Server',
    tpuServer: 'TPU-Server', 
    specialServer: 'Spezial-Server',
    learningInProgressError: 'Lernen läuft',
    oneCourseAtTime: 'Sie können nur einen Kurs gleichzeitig belegen. Bitte warten Sie, bis der aktuelle Kurs abgeschlossen ist.',
    needMoneyForCourse: 'Sie benötigen {amount}, um diesen Kurs zu starten.',
    courseStarted: 'Kurs gestartet',
    courseStartedDesc: 'Sie haben den Kurs {courseTitle} gestartet. Überprüfen Sie Ihren Fortschritt im Server-Tab!',
    failedToStartCourse: 'Kurs konnte nicht gestartet werden',
    currentCourse: 'Aktueller Kurs',
    availableCourses: 'Verfügbare Kurse',
    duration: 'Dauer',
    requiresLevelX: 'Benötigt Level {level}',
    startCourse: 'Kurs starten',
    needMoreForCourse: 'Benötigen Sie noch {amount}',
    completeCurrentFirst: 'Beenden Sie zuerst den aktuellen Kurs',
    
    // Player profile
    loadingPlayerProfile: 'Spielerprofil wird geladen...',
    playerNotFound: 'Spieler nicht gefunden',
    playerNotFoundDesc: 'Der Spieler "{nickname}" existiert nicht oder das Profil ist privat.',
    goBack: 'Zurück',
    back: 'Zurück',
    playerProfile: 'Spielerprofil',
    activeServers: 'Aktive Server',
    globalRank: 'Globaler Rang',
    recentActivity: 'Kürzliche Aktivität',
    turnOnOff: 'Ein/Aus',
    
    // Reports system
    reports: 'Berichte',
    createNewReport: 'Neuen Bericht erstellen',
    reportSubject: 'Betreff des Berichts',
    reportCategory: 'Berichtskategorie',
    initialMessage: 'Erste Nachricht',
    general: 'Allgemeines',
    technical: 'Technisches',
    createReport: 'Bericht erstellen',
    reportSent: 'Bericht gesendet',
    reportSentDescription: 'Ihr Bericht wurde erfolgreich gesendet.',
    reportClosed: 'Bericht geschlossen',
    reportClosedDescription: 'Bericht wurde erfolgreich geschlossen.',
    reportDeleted: 'Bericht gelöscht',
    reportDeletedDescription: 'Bericht wurde erfolgreich gelöscht.',
    reportMarked: 'Markierter Bericht',
    reportUnmarked: 'Unmarkierter Bericht',
    closeReport: 'Bericht schließen',
    markReport: 'Bericht markieren',
    deleteReport: 'Bericht löschen',
    sendMessage: 'Nachricht senden',
    typeMessage: 'Nachricht...',
    noReports: 'Noch keine Berichte',
    createFirstReport: 'Erstellen Sie Ihren ersten Bericht über die Schaltfläche oben.',
    reportStatus: 'Status',
    reportCreated: 'Erstellt',
    reportClosed: 'Abgeschlossen',
    reportMarked: 'Markiert',
    fillAllFields: 'Bitte füllen Sie alle erforderlichen Felder aus',
    subjectTooLong: 'Der Betreff darf nicht länger als 50 Zeichen sein',
    messageTooLong: 'Die Nachricht darf nicht länger als 500 Zeichen sein',
    characters: 'Zeichen',
    reportType: 'Berichtstyp',
    reportTypeFeature: 'Funktionsanfrage',
    reportTypeComplaint: 'Beschwerde',
    reportTypeOther: 'Sonstiges',
    reportMessage: 'Bericht',
    submitReport: 'Einen Bericht einreichen',
    
    // Reports reopen functionality
    reopenChat: 'Chat wiedereröffnen',
    reportReopened: 'Bericht wiedereröffnet',
    reportReopenedDescription: 'Bericht wurde erfolgreich für weitere Kommunikation wiedereröffnet',
    chatClosedByAdmin: 'Chat vom Administrator geschlossen',
    
    // Additional reports translations
    myReports: 'Meine Berichte',
    incomingReports: 'Eingehende Berichte',
    newTicket: 'Neues Ticket',
    createNewTicket: 'Neues Ticket erstellen',
    subject: 'Betreff',
    category: 'Kategorie',
    description: 'Beschreibung',
    selectCategory: 'Kategorie auswählen',
    reportTypeBug: 'Bug oder sonstiger Fehler',
    otherIssue: 'Sonstiges',
    featureIssue: 'Feature-Anfrage',
    reportTypeComplaint: 'Reklamation',
    generalIssue: 'Allgemeines Problem',
    technicalIssue: 'Technisches Problem',
    startChat: 'Chat starten',
    sending: 'Senden...',
    activeReportExists: 'Sie haben bereits einen aktiven Bericht. Bitte warten Sie auf die Antwort des Administrators.',
    noIncomingReports: 'Keine eingehenden Berichte',
    selectReportToView: 'Wählen Sie einen Bericht aus, um die Konversation anzuzeigen',
    closeChat: 'Chat schließen',
    deleteChat: 'Chat löschen',
    markChat: 'Chat markieren',
    unmarkChat: 'Chat entmarkieren',
    admin: 'Admin',
    open: 'Öffnen',
    closed: 'Geschlossen',

    // Mini-Spiele Übersetzungen
    miniGames: 'Mini-Spiele',
    miniGamesDesc: 'Testen Sie Ihre Fähigkeiten in unterhaltsamen Mini-Spielen und verdienen Sie XP!',
    minigame1: 'DDoS-Schutz',
    minigame1Desc: 'Verteidigen Sie Ihre Server vor eingehenden Paketangriffen',
    minigame2: 'Firewall-Filter',
    minigame2Desc: 'Erlauben Sie legitime Anfragen und blockieren Sie schädliche',
    requests: 'antworten',
    howToPlay: 'Wie man spielt',
    ddosInstructions: 'Klicken Sie auf die roten Pakete, um sie zu zerstören, bevor sie Ihren Server erreichen. Die Geschwindigkeit steigt mit der Zeit! Für jede Zerstörung +1 Erfahrung.',
    firewallInstructions: 'Überprüfen Sie jede Anfrage und wählen Sie sichere Anfragen zulassen oder gefährliche blockieren. Seien Sie schnell und genau! Für jede richtige Antwort gibt es +1 Erfahrung.',
    gameCompleted: 'Spiel abgeschlossen!',
    earnedXP: 'Sie haben {amount} XP verdient!',
    packetsDestroyed: 'Pakete zerstört',
    correct: 'Richtig',
    correct2: 'rechts',
    packet: 'Paket',
    wrong: 'Falsch',
    score: 'Punktzahl',
    timeLeft: 'Zeit übrig',
    requestsLeft: 'Anfragen übrig',
    blockOrAllow: 'Blockieren Sie gefährliche Anfragen oder erlauben Sie sichere',
    block: 'Blockieren',
    allow: 'Erlauben',
    yourServer: 'Ihr Server',
    medium: 'Mittel',
    
    // Spenden Übersetzungen
    donate: 'Spenden',
    donateDesc: 'Unterstützen Sie die Spielentwicklung und erhalten Sie exklusive Vorteile!',
    donate1: 'Starter-Paket',
    donate1Desc: 'Beginnen Sie mit grundlegenden Vorteilen',
    donate2: 'Premium-Paket (Für immer)',
    donate2Desc: 'Erweiterte Funktionen für ernsthafte Spieler',
    donate3: 'Boost-Paket',
    donate3Desc: 'Beschleunigen Sie Ihren Fortschritt erheblich',
    donate4: 'Ultimate-Paket',
    donate4Desc: 'Maximale Vorteile und exklusiver Inhalt',
    donate5: 'Münz-Paket',
    donate5Desc: 'Spielwährung für Käufe',
    donate6: 'Spezial-Paket',
    donate6Desc: 'Zeitlich begrenztes Angebot mit einzigartigen Belohnungen',
    feature1: 'Zusätzliche Server-Slots',
    feature2: 'Beschleunigte Lernkurse',
    feature3: 'Bonus-Tagesbelohnungen',
    feature4: 'VIP-Support-Priorität',
    feature5: 'Exklusive Server-Typen',
    feature6: 'Doppel-XP-Events',
    feature7: 'Sofortige Server-Reparaturen',
    feature8: 'Erweiterte Analytik',
    feature9: 'Benutzerdefinierte Server-Themes',
    feature10: 'Maximale Server-Kapazität',
    feature11: 'Priorität Chat-Support',
    feature12: 'Exklusive Errungenschaften',
    feature13: '10.000 Spielmünzen',
    feature14: 'Keine Transaktionsgebühren',
    feature15: 'Münz-Bonus-Multiplikator',
    feature16: 'Saisonale Belohnungen',
    feature17: 'Früher Zugang zu Features',
    feature18: 'Zugang zu Community-Events',
    popular: 'Beliebt',
    purchase: 'Kaufen',
    confirmPurchase: 'Kauf bestätigen',
    included: 'Inbegriffen',
    paymentNotice: 'Zahlungsabwicklung',
    paymentNoticeDesc: 'Dies ist eine Demo-Version. Echte Zahlungen werden nicht verarbeitet.',
    buyNow: 'Jetzt kaufen',
    purchaseNotAvailable: 'Kauf nicht verfügbar',
    purchaseNotAvailableDesc: 'Dies ist eine Demo-Version. Zahlungsabwicklung ist nicht implementiert.',
  }
};

// Function to localize error messages based on language
export function localizeError(error, language = 'en') {
  const t = (key) => {
    // Check new translations first
    if (newTranslations[key] && newTranslations[key][language]) {
      return newTranslations[key][language];
    }
    // Fall back to old translations - but first check if key exists in current language
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    // Try English as fallback
    if (translations.en && translations.en[key]) {
      return translations.en[key];
    }
    // Return key if not found
    return key;
  };
  
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