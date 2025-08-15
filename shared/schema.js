// User schema
export const createUser = (userData) => ({
  id: userData.id,
  nickname: userData.nickname,
  password: userData.password,
  balance: userData.balance || 10000,
  serverLimit: userData.serverLimit || 3,
  tutorialCompleted: userData.tutorialCompleted || false,
  lastIncomeUpdate: userData.lastIncomeUpdate || Date.now(),
  jobCooldowns: userData.jobCooldowns || {},
  currentLearning: userData.currentLearning || null,
  activities: userData.activities || []
});

// Server schema
export const createServer = (serverData) => ({
  id: serverData.id,
  ownerId: serverData.ownerId,
  name: serverData.name,
  type: serverData.type,
  incomePerMinute: serverData.incomePerMinute,
  monthlyCost: serverData.monthlyCost,
  icon: serverData.icon,
  isOnline: serverData.isOnline !== undefined ? serverData.isOnline : true,
  usage: serverData.usage || Math.floor(Math.random() * 50) + 25,
  createdAt: serverData.createdAt || Date.now()
});

// Activity schema
export const createActivity = (activityData) => ({
  id: activityData.id,
  description: activityData.description,
  timestamp: activityData.timestamp || new Date().toLocaleString()
});

// Learning schema
export const createLearning = (learningData) => ({
  id: learningData.id,
  title: learningData.title,
  description: learningData.description,
  difficulty: learningData.difficulty,
  startTime: learningData.startTime,
  endTime: learningData.endTime,
  progress: learningData.progress || 0,
  reward: learningData.reward
});

// Game state schema
export const createGameState = (gameStateData = {}) => ({
  user: gameStateData.user || null,
  servers: gameStateData.servers || [],
  activities: gameStateData.activities || [],
  jobCooldowns: gameStateData.jobCooldowns || {},
  currentLearning: gameStateData.currentLearning || null,
  totalIncomePerMinute: gameStateData.totalIncomePerMinute || 0,
  unlockedTabs: gameStateData.unlockedTabs || ['tutorial']
});

// Validation helpers
export const validateUser = (user) => {
  if (!user.nickname || typeof user.nickname !== 'string') {
    throw new Error('Nickname is required and must be a string');
  }
  if (!user.password || typeof user.password !== 'string') {
    throw new Error('Password is required and must be a string');
  }
  return true;
};

export const validateServer = (server) => {
  if (!server.name || typeof server.name !== 'string') {
    throw new Error('Server name is required and must be a string');
  }
  if (!server.ownerId || typeof server.ownerId !== 'string') {
    throw new Error('Owner ID is required and must be a string');
  }
  if (typeof server.incomePerMinute !== 'number' || server.incomePerMinute < 0) {
    throw new Error('Income per minute must be a positive number');
  }
  return true;
};
