import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data');
const usersDir = path.join(__dirname, '..', 'users');
const chatFile = path.join(dataDir, 'chat.json');

// Level and Experience System (60 levels, 10% increase per level)
function calculateLevel(experience) {
  let level = 1;
  let requiredExp = 100;
  let totalExp = 0;
  
  while (totalExp + requiredExp <= experience && level < 60) {
    totalExp += requiredExp;
    level++;
    requiredExp = Math.floor(requiredExp * 1.1);
  }
  
  return level;
}

function getExperienceForLevel(level) {
  let totalExp = 0;
  let currentExp = 100;
  
  for (let i = 1; i < level && i < 60; i++) {
    totalExp += currentExp;
    currentExp = Math.floor(currentExp * 1.1);
  }
  
  return totalExp;
}

function getExperienceToNextLevel(experience) {
  const currentLevel = calculateLevel(experience);
  if (currentLevel >= 60) return 0;
  const nextLevelExp = getExperienceForLevel(currentLevel + 1);
  return nextLevelExp - experience;
}

function getExperienceForCurrentLevel(experience) {
  const currentLevel = calculateLevel(experience);
  const currentLevelStart = getExperienceForLevel(currentLevel);
  const nextLevelStart = getExperienceForLevel(currentLevel + 1);
  return {
    current: experience - currentLevelStart,
    needed: nextLevelStart - currentLevelStart
  };
}

// Avatar Generation System
function generateRandomAvatar(nickname = '') {
  // Special avatar for Ca6aka (super admin)
  if (nickname === 'Ca6aka') {
    return {
      gradient: 'from-purple-500 via-pink-500 via-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500',
      pattern: 'rainbow-super-admin',
      seed: 999999,
      animation: 'rainbow-pulse'
    };
  }
  
  const multiColorGradients = [
    'from-red-400 via-pink-500 to-purple-600',
    'from-blue-400 via-purple-500 to-indigo-600', 
    'from-green-400 via-teal-500 to-cyan-600',
    'from-yellow-400 via-orange-500 to-red-600',
    'from-purple-400 via-violet-500 to-indigo-600',
    'from-pink-400 via-rose-500 to-red-600',
    'from-indigo-400 via-blue-500 to-cyan-600',
    'from-teal-400 via-emerald-500 to-green-600',
    'from-orange-400 via-amber-500 to-yellow-600',
    'from-cyan-400 via-sky-500 to-blue-600',
    'from-emerald-400 via-green-500 to-teal-600',
    'from-rose-400 via-pink-500 to-red-600',
    'from-violet-400 via-purple-500 to-indigo-600',
    'from-amber-400 via-orange-500 to-red-600',
    'from-lime-400 via-green-500 to-emerald-600'
  ];
  
  const animations = [
    'gradient-shift',
    'pulse-glow', 
    'shimmer-wave',
    'color-dance',
    'soft-pulse'
  ];
  
  const selectedGradient = multiColorGradients[Math.floor(Math.random() * multiColorGradients.length)];
  const selectedAnimation = animations[Math.floor(Math.random() * animations.length)];
  
  return {
    gradient: selectedGradient,
    pattern: 'multi-color',
    seed: Math.floor(Math.random() * 1000000),
    animation: selectedAnimation
  };
}

// Server products configuration with level requirements
const SERVER_PRODUCTS = [
  {
    id: 'basic-web',
    name: 'Basic Web Server',
    type: 'Web Hosting',
    price: 5000,
    incomePerMinute: 15,
    monthlyCost: 45,
    icon: 'fas fa-globe',
    requiredLevel: 1
  },
  {
    id: 'database-server',
    name: 'Database Server',
    type: 'Storage',
    price: 8000,
    incomePerMinute: 25,
    monthlyCost: 85,
    icon: 'fas fa-database',
    requiredLevel: 4
  },
  {
    id: 'high-performance',
    name: 'High Performance Server',
    type: 'Gaming/Apps',
    price: 12000,
    incomePerMinute: 50,
    monthlyCost: 120,
    icon: 'fas fa-server',
    requiredLevel: 8
  },
  {
    id: 'cdn-server',
    name: 'CDN Server',
    type: 'Content Delivery',
    price: 15000,
    incomePerMinute: 100,
    monthlyCost: 180,
    icon: 'fas fa-cloud',
    requiredLevel: 12
  },
  {
    id: 'gpu-server',
    name: 'GPU Server',
    type: 'AI',
    price: 25000,
    incomePerMinute: 150,
    monthlyCost: 250,
    icon: 'fas fa-microchip',
    requiredLevel: 25,
    requiredLearning: 'ai-gpu-settings'
  },
  {
    id: 'tpu-server',
    name: 'TPU Server',
    type: 'Computing',
    price: 47500,
    incomePerMinute: 200,
    monthlyCost: 350,
    icon: 'fas fa-brain',
    requiredLevel: 45,
    requiredLearning: 'tpu-settings-machine'
  }
];

const JOB_TYPES = [
  {
    id: 'maintenance',
    name: 'Server Maintenance',
    reward: 150,
    experienceReward: 10,
    cooldown: 180000, // 5 minutes
    icon: 'fas fa-wrench'
  },
  {
    id: 'optimization',
    name: 'Performance Optimization',
    reward: 250,
    experienceReward: 18,
    cooldown: 300000, // 7.5 minutes
    icon: 'fas fa-tachometer-alt'
  },
  {
    id: 'security-audit',
    name: 'Security Audit',
    reward: 500,
    experienceReward: 25,
    cooldown: 420000, // 10 minutes
    icon: 'fas fa-shield-alt'
  }
];

const LEARNING_COURSES = [
  {
    id: 'basic-setup',
    title: 'Basic Server Setup',
    description: 'Learn the fundamentals of server configuration and deployment',
    difficulty: 'Beginner',
    duration: 30 * 60 * 1000, // 30 minutes in milliseconds
    reward: { type: 'serverSlots', amount: 1 },
    price: 3500,
    requiredLevel: 1
  },
  {
    id: 'advanced-management',
    title: 'Advanced Server Management',
    description: 'Master advanced server optimization and scaling techniques',
    difficulty: 'Advanced',
    duration: 120 * 60 * 1000, // 2 hours in milliseconds
    reward: { type: 'serverSlots', amount: 2 },
    price: 8000,
    requiredLevel: 5
  },
  {
    id: 'security-protocols',
    title: 'Security Protocols',
    description: 'Implement robust security measures for your server infrastructure',
    difficulty: 'Intermediate',
    duration: 90 * 60 * 1000, // 1.5 hours in milliseconds
    reward: { type: 'efficiency', amount: 15 },
    price: 5000,
    requiredLevel: 12
  },
  {
    id: 'ai-gpu-settings',
    title: 'AI GPU Settings',
    description: 'Master GPU configuration for AI workloads and machine learning tasks',
    difficulty: 'Expert',
    duration: 4 * 60 * 60 * 1000, // 4 hours in milliseconds
    reward: { type: 'serverUnlock', serverType: 'gpu-server' },
    price: 15000,
    requiredLevel: 25
  },
  {
    id: 'tpu-settings-machine',
    title: 'TPU Settings Machine',
    description: 'Advanced TPU configuration for high-performance computing and neural networks',
    difficulty: 'Master',
    duration: 6 * 60 * 60 * 1000, // 6 hours in milliseconds
    reward: { type: 'serverUnlock', serverType: 'tpu-server' },
    price: 25000,
    requiredLevel: 45
  }
];

const ACHIEVEMENTS = [
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Complete your first job',
    icon: 'fas fa-play',
    reward: 500,
    condition: { type: 'jobs', count: 1 }
  },
  {
    id: 'first-server',
    title: 'First Server',
    description: 'Purchase your first server',
    icon: 'fas fa-server',
    reward: 1000,
    condition: { type: 'servers', count: 1 }
  },
  {
    id: 'server-collection',
    title: 'Server Collector',
    description: 'Own 5 servers simultaneously',
    icon: 'fas fa-warehouse',
    reward: 5000,
    condition: { type: 'servers', count: 5 }
  },
  {
    id: 'millionaire',
    title: 'Millionaire',
    description: 'Accumulate $1,000,000 in balance',
    icon: 'fas fa-money-bill-wave',
    reward: 50000,
    condition: { type: 'balance', amount: 1000000 }
  },
  {
    id: 'job-master',
    title: 'Job Master',
    description: 'Complete 100 jobs',
    icon: 'fas fa-tasks',
    reward: 10000,
    condition: { type: 'jobs', count: 100 }
  },
  {
    id: 'learning-enthusiast',
    title: 'Learning Enthusiast',
    description: 'Complete all learning courses',
    icon: 'fas fa-graduation-cap',
    reward: 25000,
    condition: { type: 'courses', count: 5 }
  },
  {
    id: 'early-earner',
    title: 'Early Earner',
    description: 'Earn your first $10,000',
    icon: 'fas fa-coins',
    reward: 2000,
    condition: { type: 'balance', amount: 10000 }
  },
  {
    id: 'efficient-worker',
    title: 'Efficient Worker',
    description: 'Complete 10 jobs',
    icon: 'fas fa-briefcase',
    reward: 3000,
    condition: { type: 'jobs', count: 10 }
  },
  {
    id: 'server-builder',
    title: 'Server Builder',
    description: 'Own 3 different types of servers',
    icon: 'fas fa-network-wired',
    reward: 7500,
    condition: { type: 'servers', count: 3 }
  },
  {
    id: 'security-expert',
    title: 'Security Expert',
    description: 'Complete 50 Security Audit jobs',
    icon: 'fas fa-shield-alt',
    reward: 15000,
    condition: { type: 'jobs', count: 50 }
  },
  {
    id: 'maintenance-guru',
    title: 'Maintenance Guru',
    description: 'Complete 75 Maintenance jobs',
    icon: 'fas fa-wrench',
    reward: 12000,
    condition: { type: 'jobs', count: 75 }
  },
  {
    id: 'optimization-master',
    title: 'Optimization Master',
    description: 'Complete 60 Optimization jobs',
    icon: 'fas fa-tachometer-alt',
    reward: 13500,
    condition: { type: 'jobs', count: 60 }
  },
  {
    id: 'wealthy-investor',
    title: 'Wealthy Investor',
    description: 'Accumulate $100,000 in balance',
    icon: 'fas fa-dollar-sign',
    reward: 20000,
    condition: { type: 'balance', amount: 100000 }
  },
  {
    id: 'server-mogul',
    title: 'Server Mogul',
    description: 'Own 10 servers simultaneously',
    icon: 'fas fa-building',
    reward: 25000,
    condition: { type: 'servers', count: 10 }
  },
  {
    id: 'persistent-learner',
    title: 'Persistent Learner',
    description: 'Complete 3 learning courses',
    icon: 'fas fa-book',
    reward: 18000,
    condition: { type: 'courses', count: 3 }
  },
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Complete 200 jobs total',
    icon: 'fas fa-bolt',
    reward: 30000,
    condition: { type: 'jobs', count: 200 }
  },
  {
    id: 'infrastructure-king',
    title: 'Infrastructure King',
    description: 'Own 15 servers simultaneously',
    icon: 'fas fa-crown',
    reward: 40000,
    condition: { type: 'servers', count: 15 }
  },
  {
    id: 'multi-millionaire',
    title: 'Multi-Millionaire',
    description: 'Accumulate $5,000,000 in balance',
    icon: 'fas fa-gem',
    reward: 100000,
    condition: { type: 'balance', amount: 5000000 }
  },
  {
    id: 'course-completionist',
    title: 'Course Completionist',
    description: 'Complete all available learning courses',
    icon: 'fas fa-award',
    reward: 35000,
    condition: { type: 'courses', count: 5 }
  },
  {
    id: 'workaholic',
    title: 'Workaholic',
    description: 'Complete 500 jobs total',
    icon: 'fas fa-fire',
    reward: 75000,
    condition: { type: 'jobs', count: 500 }
  },
  {
    id: 'server-empire',
    title: 'Server Empire',
    description: 'Own 20 servers simultaneously',
    icon: 'fas fa-globe',
    reward: 60000,
    condition: { type: 'servers', count: 20 }
  },
  {
    id: 'financial-titan',
    title: 'Financial Titan',
    description: 'Accumulate $10,000,000 in balance',
    icon: 'fas fa-university',
    reward: 200000,
    condition: { type: 'balance', amount: 10000000 }
  },
  {
    id: 'legendary-worker',
    title: 'Legendary Worker',
    description: 'Complete 1000 jobs total',
    icon: 'fas fa-trophy',
    reward: 150000,
    condition: { type: 'jobs', count: 1000 }
  },
  {
    id: 'server-overlord',
    title: 'Server Overlord',
    description: 'Own 30 servers simultaneously',
    icon: 'fas fa-chess-king',
    reward: 100000,
    condition: { type: 'servers', count: 30 }
  },
  {
    id: 'billionaire-club',
    title: 'Billionaire Club',
    description: 'Accumulate $100,000,000 in balance',
    icon: 'fas fa-star',
    reward: 500000,
    condition: { type: 'balance', amount: 100000000 }
  },
  {
    id: 'ultimate-legend',
    title: 'Ultimate Legend',
    description: 'Complete 2500 jobs total',
    icon: 'fas fa-medal',
    reward: 1000000,
    condition: { type: 'jobs', count: 2500 }
  }
];

const DAILY_QUESTS = [
  {
    id: 'daily-maintenance',
    title: 'Daily Maintenance',
    description: 'Complete 3 Server Maintenance jobs',
    reward: 2000,
    requirement: { type: 'job', jobType: 'maintenance', count: 3 }
  },
  {
    id: 'daily-income',
    title: 'Passive Income',
    description: 'Earn $5,000 from server income',
    reward: 1500,
    requirement: { type: 'income', amount: 5000 }
  },
  {
    id: 'daily-optimization',
    title: 'Server Optimization',
    description: 'Complete 2 Performance Optimization jobs',
    reward: 3000,
    requirement: { type: 'job', jobType: 'optimization', count: 2 }
  },
  {
    id: 'daily-security',
    title: 'Security Check',
    description: 'Complete 1 Security Audit job',
    reward: 2500,
    requirement: { type: 'job', jobType: 'security-audit', count: 1 }
  },
  {
    id: 'daily-earnings',
    title: 'Daily Earnings',
    description: 'Earn $10,000 from server income',
    reward: 3500,
    requirement: { type: 'income', amount: 10000 }
  },
  {
    id: 'daily-worker',
    title: 'Hard Worker',
    description: 'Complete 5 jobs of any type',
    reward: 4000,
    requirement: { type: 'job', jobType: 'any', count: 5 }
  },
  {
    id: 'daily-mixed-jobs',
    title: 'Mixed Tasks',
    description: 'Complete 2 Maintenance and 1 Optimization job',
    reward: 3200,
    requirement: { type: 'job', jobType: 'mixed', count: 3 }
  },
  {
    id: 'daily-income-boost',
    title: 'Income Boost',
    description: 'Earn $20,000 from server income',
    reward: 5000,
    requirement: { type: 'income', amount: 20000 }
  },
  {
    id: 'daily-job-spree',
    title: 'Job Spree',
    description: 'Complete 8 jobs of any type',
    reward: 6000,
    requirement: { type: 'job', jobType: 'any', count: 8 }
  },
  {
    id: 'daily-mega-earner',
    title: 'Mega Earner',
    description: 'Earn $50,000 from server income',
    reward: 8000,
    requirement: { type: 'income', amount: 50000 }
  }
];

export class FileStorage {
  constructor() {
    this.ensureDataDirectory();
  }

  async ensureDataDirectory() {
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }
    try {
      await fs.access(usersDir);
    } catch {
      await fs.mkdir(usersDir, { recursive: true });
    }
  }

  async readJsonFile(filename) {
    try {
      const filePath = path.join(dataDir, filename);
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  async writeJsonFile(filename, data) {
    const filePath = path.join(dataDir, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  }

  async getUserFile(nickname) {
    const filePath = path.join(usersDir, `${nickname}.json`);
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  async saveUserFile(user) {
    const filePath = path.join(usersDir, `${user.nickname}.json`);
    await fs.writeFile(filePath, JSON.stringify(user, null, 2));
  }

  async getAllUsers() {
    try {
      const files = await fs.readdir(usersDir);
      const users = [];
      for (const file of files) {
        if (file.endsWith('.json')) {
          const nickname = file.replace('.json', '');
          const user = await this.getUserFile(nickname);
          if (user) users.push(user);
        }
      }
      return users;
    } catch {
      return [];
    }
  }

  async getServers() {
    const servers = await this.readJsonFile('servers.json');
    return servers || [];
  }

  async saveServers(servers) {
    await this.writeJsonFile('servers.json', servers);
  }

  async getRankingsData() {
    const rankings = await this.readJsonFile('rankings.json');
    return rankings || [];
  }

  async saveRankings(rankings) {
    await this.writeJsonFile('rankings.json', rankings);
  }

  // User management
  async getUser(id) {
    const users = await this.getAllUsers();
    return users.find(user => user.id === id);
  }

  async getUserByNickname(nickname) {
    return await this.getUserFile(nickname);
  }

  async getUserByNicknameCaseInsensitive(nickname) {
    try {
      const files = await fs.readdir(usersDir);
      const normalizedNickname = nickname.toLowerCase();
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const fileNickname = file.replace('.json', '');
          if (fileNickname.toLowerCase() === normalizedNickname) {
            return await this.getUserFile(fileNickname);
          }
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  // Check registration count by IP (lifetime limit)
  async checkRegistrationsByIP(ip) {
    const users = await this.getAllUsers();
    
    return users.filter(user => 
      user.registrationIP === ip
    ).length;
  }

  async createUser(userData) {
    const avatar = generateRandomAvatar();
    const user = {
      id: randomUUID(),
      nickname: userData.nickname,
      password: userData.password,
      balance: 13000, // Starting balance
      level: 1,
      experience: 0,
      totalEarnings: 13000, // Include starting balance
      totalSpent: 0,
      avatar: avatar,
      serverLimit: 3, // Starting server limit
      tutorialCompleted: false,
      admin: userData.admin || 0,
      banned: false,
      muted: false,
      muteExpires: null,
      isOnline: userData.isOnline || false,
      lastIncomeUpdate: Date.now(),
      jobCooldowns: {},
      currentLearning: null,
      activities: [],
      achievements: [],
      completedJobsCount: 0,
      completedCoursesCount: 0,
      completedLearning: [],
      efficiencyBonus: 0,
      dailyQuests: this.generateDailyQuests(),
      lastQuestReset: Date.now(),
      registrationIP: userData.registrationIP,
      registrationTime: userData.registrationTime
    };
    
    await this.saveUserFile(user);
    await this.updateRankings();
    
    return user;
  }

  async updateUser(userId, updates) {
    const users = await this.getAllUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const updatedUser = { ...user, ...updates };
    await this.saveUserFile(updatedUser);
    await this.updateRankings();
    
    return updatedUser;
  }

  async updateUserActivity(userId) {
    const user = await this.getUser(userId);
    if (!user) return;
    
    const now = Date.now();
    await this.updateUser(userId, { 
      lastSeen: now,
      isOnline: true 
    });
  }

  // Daily Quests System
  generateDailyQuests() {
    const today = new Date().toDateString();
    return DAILY_QUESTS.map(quest => ({
      ...quest,
      id: `${quest.id}-${today}`,
      progress: 0,
      completed: false,
      date: today
    }));
  }

  async checkDailyQuestReset(userId) {
    const user = await this.getUser(userId);
    if (!user) return;

    const lastReset = user.lastQuestReset || 0;
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    
    if (lastReset < oneDayAgo) {
      await this.updateUser(userId, {
        dailyQuests: this.generateDailyQuests(),
        lastQuestReset: Date.now()
      });
    }
  }

  async updateDailyQuest(userId, questType, data) {
    const user = await this.getUser(userId);
    if (!user || !user.dailyQuests) return;

    await this.checkDailyQuestReset(userId);
    
    const quests = [...user.dailyQuests];
    let updated = false;

    quests.forEach(quest => {
      if (quest.completed) return;

      const req = quest.requirement;
      
      if (req.type === 'job' && questType === 'job') {
        // Handle different job quest types
        if (req.jobType === 'any') {
          // Any job type counts
          quest.progress = Math.min(quest.progress + 1, req.count);
          if (quest.progress >= req.count) {
            quest.completed = true;
            this.completeQuest(userId, quest);
          }
          updated = true;
        } else if (req.jobType === data.jobType) {
          // Specific job type
          quest.progress = Math.min(quest.progress + 1, req.count);
          if (quest.progress >= req.count) {
            quest.completed = true;
            this.completeQuest(userId, quest);
          }
          updated = true;
        } else if (req.jobType === 'mixed') {
          // Mixed jobs - track individual job types
          if (!quest.jobCounts) {
            quest.jobCounts = { maintenance: 0, optimization: 0, 'security-audit': 0 };
          }
          
          if (quest.jobCounts[data.jobType] !== undefined) {
            quest.jobCounts[data.jobType]++;
            
            // For mixed quest: 2 Maintenance + 1 Optimization
            const maintenanceCount = quest.jobCounts.maintenance || 0;
            const optimizationCount = quest.jobCounts.optimization || 0;
            
            if (maintenanceCount >= 2 && optimizationCount >= 1) {
              quest.progress = req.count;
              quest.completed = true;
              this.completeQuest(userId, quest);
            } else {
              quest.progress = maintenanceCount + optimizationCount;
            }
            updated = true;
          }
        }
      } else if (req.type === 'income' && questType === 'income') {
        quest.progress = Math.min(quest.progress + data.amount, req.amount);
        if (quest.progress >= req.amount) {
          quest.completed = true;
          this.completeQuest(userId, quest);
        }
        updated = true;
      }
    });

    if (updated) {
      await this.updateUser(userId, { dailyQuests: quests });
    }
  }

  async completeQuest(userId, quest) {
    const user = await this.getUser(userId);
    if (!user) return;

    // Mark quest as completed but not automatically claim reward
    // User will need to manually claim the reward
    await this.addActivity(userId, `Daily quest completed: ${quest.title} - Reward ready to claim!`);
  }

  // Achievements System
  async checkAchievements(userId) {
    const user = await this.getUser(userId);
    if (!user) return;

    const userAchievements = user.achievements || [];
    const servers = await this.getUserServers(userId);
    
    for (const achievement of ACHIEVEMENTS) {
      // Skip if already earned
      if (userAchievements.includes(achievement.id)) continue;

      let earned = false;
      const condition = achievement.condition;

      switch (condition.type) {
        case 'servers':
          earned = servers.length >= condition.count;
          break;
        case 'balance':
          earned = user.balance >= condition.amount;
          break;
        case 'jobs':
          earned = (user.completedJobsCount || 0) >= condition.count;
          break;
        case 'courses':
          earned = (user.completedCoursesCount || 0) >= condition.count;
          break;
      }

      if (earned) {
        const newAchievements = [...userAchievements, achievement.id];
        await this.updateUser(userId, {
          achievements: newAchievements,
          balance: user.balance + achievement.reward
        });

        await this.addActivity(userId, `Achievement unlocked: ${achievement.title} (+$${achievement.reward.toLocaleString()})`);
      }
    }
  }

  // Server management
  async getUserServers(userId) {
    const servers = await this.getServers();
    return servers.filter(server => server.ownerId === userId);
  }

  async purchaseServer(userId, productId) {
    const user = await this.getUser(userId);
    if (!user) throw new Error('User not found');

    const product = SERVER_PRODUCTS.find(p => p.id === productId);
    if (!product) throw new Error('Invalid product');

    const userServers = await this.getUserServers(userId);
    if (userServers.length >= user.serverLimit) {
      throw new Error('Server limit reached');
    }

    if (user.balance < product.price) {
      throw new Error('Insufficient funds');
    }
    
    // Check level requirement
    const userLevel = user.level || calculateLevel(user.experience || 0);
    if (product.requiredLevel && userLevel < product.requiredLevel) {
      throw new Error(`Requires level ${product.requiredLevel}`);
    }

    // Check learning requirement
    if (product.requiredLearning) {
      const completedLearning = user.completedLearning || [];
      if (!completedLearning.includes(product.requiredLearning)) {
        throw new Error(`Requires completed learning: ${product.requiredLearning}`);
      }
    }

    // Create new server
    const servers = await this.getServers();
    const newServer = {
      id: randomUUID(),
      ownerId: userId,
      name: product.name,
      type: product.type,
      incomePerMinute: product.incomePerMinute,
      monthlyCost: product.monthlyCost,
      icon: product.icon,
      isOnline: true,
      loadPercentage: 50, // Default 50% load
      durability: 100, // Server starts with 100% durability
      lastDurabilityUpdate: Date.now(),
      createdAt: Date.now()
    };

    servers.push(newServer);
    await this.saveServers(servers);

    // Update user balance and spending tracking
    const updatedUser = await this.updateUser(userId, {
      balance: user.balance - product.price,
      totalSpent: (user.totalSpent || 0) + product.price
    });

    // Add activity
    await this.addActivity(userId, `Purchased ${product.name} for $${product.price.toLocaleString()}`);

    // Check achievements
    await this.checkAchievements(userId);

    return { user: updatedUser, server: newServer };
  }

  async toggleServer(userId, serverId) {
    const servers = await this.getServers();
    const serverIndex = servers.findIndex(s => s.id === serverId && s.ownerId === userId);
    
    if (serverIndex === -1) {
      throw new Error('Server not found');
    }

    const server = servers[serverIndex];
    
    // Check durability before turning on
    if (!server.isOnline && (server.durability || 100) <= 0) {
      throw new Error('Server requires maintenance before it can be turned on');
    }

    servers[serverIndex].isOnline = !servers[serverIndex].isOnline;
    await this.saveServers(servers);

    const status = servers[serverIndex].isOnline ? 'online' : 'offline';
    await this.addActivity(userId, `Turned ${servers[serverIndex].name} ${status}`);
  }

  async deleteServer(userId, serverId) {
    const servers = await this.getServers();
    const serverIndex = servers.findIndex(s => s.id === serverId && s.ownerId === userId);
    
    if (serverIndex === -1) {
      throw new Error('Server not found');
    }

    const serverName = servers[serverIndex].name;
    servers.splice(serverIndex, 1);
    await this.saveServers(servers);

    await this.addActivity(userId, `Deleted server: ${serverName}`);
  }

  async updateServerLoad(userId, serverId, loadPercentage) {
    const servers = await this.getServers();
    const serverIndex = servers.findIndex(s => s.id === serverId && s.ownerId === userId);
    
    if (serverIndex === -1) {
      throw new Error('Server not found');
    }

    // Update server load percentage
    servers[serverIndex].loadPercentage = loadPercentage;
    await this.saveServers(servers);
    
    return { success: true };
  }

  async checkServerOverload(userId, serverId, loadPercentage) {
    // Only check for overload if load is very high and after a delay
    if (loadPercentage < 90) return; // Only check servers with 90%+ load
    
    // Get server to check last overload check time
    const servers = await this.getServers();
    const server = servers.find(s => s.id === serverId && s.ownerId === userId);
    if (!server) return;
    
    const now = Date.now();
    const lastOverloadCheck = server.lastOverloadCheck || 0;
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
    const tenMinutes = 10 * 60 * 1000; // 10 minutes in milliseconds
    
    // Don't check servers that are less than 10 minutes old (newly purchased)
    const serverAge = now - (server.createdAt || now);
    if (serverAge < tenMinutes) return;
    
    // Only check every 5 minutes minimum
    if (now - lastOverloadCheck < fiveMinutes) return;
    
    // Update last check time
    server.lastOverloadCheck = now;
    await this.saveServers(servers);
    
    // Calculate shutdown probability based on load (much lower chances)
    let shutdownChance = 0;
    
    if (loadPercentage > 95) {
      shutdownChance = 0.15; // 15% chance every 5 minutes
    } else if (loadPercentage > 90) {
      shutdownChance = 0.05; // 5% chance every 5 minutes
    }
    
    // Random check for shutdown
    if (Math.random() < shutdownChance) {
      await this.shutdownServerFromOverload(userId, serverId);
    }
  }

  async shutdownServerFromOverload(userId, serverId) {
    const servers = await this.getServers();
    const serverIndex = servers.findIndex(s => s.id === serverId && s.ownerId === userId);
    
    if (serverIndex === -1 || !servers[serverIndex].isOnline) return;

    // Shutdown the server
    const serverName = servers[serverIndex].name;
    const loadPercentage = servers[serverIndex].loadPercentage || 50;
    servers[serverIndex].isOnline = false;
    
    await this.saveServers(servers);
    
    // Add activity log
    await this.addActivity(userId, `Server "${serverName}" shutdown due to overload (${loadPercentage}% load)`);
  }

  // Job management
  async startJob(userId, jobType) {
    const user = await this.getUser(userId);
    if (!user) throw new Error('User not found');

    const job = JOB_TYPES.find(j => j.id === jobType);
    if (!job) throw new Error('Invalid job type');

    // Check cooldown
    const cooldownEnd = user.jobCooldowns[jobType];
    if (cooldownEnd && Date.now() < cooldownEnd) {
      const remainingTime = Math.ceil((cooldownEnd - Date.now()) / 1000);
      throw new Error(`Job on cooldown for ${remainingTime} seconds`);
    }

    // Update user balance and set cooldown
    const newCooldowns = {
      ...user.jobCooldowns,
      [jobType]: Date.now() + job.cooldown
    };

    // Award experience for job completion based on job type
    const experienceGain = job.experienceReward;
    const newExperience = (user.experience || 0) + experienceGain;
    const newLevel = calculateLevel(newExperience);
    const oldLevel = user.level || calculateLevel(user.experience || 0);
    
    const updates = {
      balance: user.balance + job.reward,
      experience: newExperience,
      level: newLevel,
      totalEarnings: (user.totalEarnings || 10000) + job.reward,
      jobCooldowns: newCooldowns,
      completedJobsCount: (user.completedJobsCount || 0) + 1
    };
    
    const updatedUser = await this.updateUser(userId, updates);

    let activityMessage = `Completed ${job.name} (+$${job.reward.toLocaleString()}, +${experienceGain} XP)`;
    
    // Check for level up
    if (newLevel > oldLevel) {
      activityMessage += ` - Level Up! Now level ${newLevel}`;
    }
    
    await this.addActivity(userId, activityMessage);

    // Update daily quests
    await this.updateDailyQuest(userId, 'job', { jobType });

    // Check achievements
    await this.checkAchievements(userId);

    return { 
      user: updatedUser, 
      earnedAmount: job.reward,
      experienceGained: experienceGain,
      leveledUp: newLevel > oldLevel,
      newLevel: newLevel > oldLevel ? newLevel : null
    };
  }

  async getJobCooldowns(userId) {
    const user = await this.getUser(userId);
    if (!user) return {};

    return user.jobCooldowns || {};
  }

  // Learning management
  async startLearning(userId, courseId) {
    const user = await this.getUser(userId);
    if (!user) throw new Error('User not found');

    if (user.currentLearning) {
      throw new Error('Already learning a course');
    }

    const course = LEARNING_COURSES.find(c => c.id === courseId);
    if (!course) throw new Error('Invalid course');

    if (user.balance < course.price) {
      throw new Error('Insufficient funds');
    }
    
    // Check level requirement
    const userLevel = user.level || calculateLevel(user.experience || 0);
    if (course.requiredLevel && userLevel < course.requiredLevel) {
      throw new Error(`Requires level ${course.requiredLevel}`);
    }

    const learning = {
      id: courseId,
      title: course.title,
      description: course.description,
      difficulty: course.difficulty,
      startTime: Date.now(),
      endTime: Date.now() + course.duration,
      progress: 0,
      reward: course.reward
    };

    const updatedUser = await this.updateUser(userId, {
      balance: user.balance - course.price,
      totalSpent: (user.totalSpent || 0) + course.price,
      currentLearning: learning
    });

    await this.addActivity(userId, `Started learning course: ${course.title}`);

    return { user: updatedUser, learning };
  }

  async getCurrentLearning(userId) {
    const user = await this.getUser(userId);
    if (!user || !user.currentLearning) return null;

    const learning = user.currentLearning;
    const now = Date.now();
    
    if (now >= learning.endTime) {
      // Course completed
      await this.completeLearning(userId);
      return null;
    }

    // Update progress
    const elapsed = now - learning.startTime;
    const total = learning.endTime - learning.startTime;
    const progress = Math.floor((elapsed / total) * 100);
    const timeRemaining = this.formatTime(learning.endTime - now);

    return {
      ...learning,
      progress,
      timeRemaining
    };
  }

  async completeLearning(userId) {
    const user = await this.getUser(userId);
    if (!user || !user.currentLearning) return;

    const learning = user.currentLearning;
    const updates = { 
      currentLearning: null,
      completedCoursesCount: (user.completedCoursesCount || 0) + 1
    };

    // Apply rewards
    if (learning.reward.type === 'serverSlots') {
      const newServerLimit = user.serverLimit + learning.reward.amount;
      updates.serverLimit = Math.min(newServerLimit, 25); // Max 25 servers
      
      // Only mark server slot courses as completed if we've reached the 25 server limit
      if (updates.serverLimit >= 25) {
        updates.completedLearning = [...(user.completedLearning || []), learning.id];
      } else {
        // Keep existing completed learning without adding this course
        updates.completedLearning = user.completedLearning || [];
      }
    } else {
      // For non-server-slot courses, always mark as completed
      updates.completedLearning = [...(user.completedLearning || []), learning.id];
      
      if (learning.reward.type === 'efficiency') {
        // Apply efficiency bonus to all current and future servers
        const currentBonus = user.efficiencyBonus || 0;
        updates.efficiencyBonus = currentBonus + learning.reward.amount;
      }
      // Server unlock rewards are handled by the completedLearning array
    }

    await this.updateUser(userId, updates);
    await this.addActivity(userId, `Completed learning course: ${learning.title}`);
    
    // Check achievements
    await this.checkAchievements(userId);
  }

  // Income updates
  async updateServersDurability() {
    const servers = await this.getServers();
    const now = Date.now();
    let updated = false;
    
    for (const server of servers) {
      const lastUpdate = server.lastDurabilityUpdate || server.createdAt || now;
      const timeDiff = now - lastUpdate;
      const tenMinutes = 10 * 60 * 1000; // 10 minutes in milliseconds
      
      // Only update durability for online servers every 10 minutes
      if (server.isOnline && timeDiff >= tenMinutes) {
        const durabilityLoss = Math.floor(timeDiff / tenMinutes); // 1% per 10 minutes
        const currentDurability = server.durability || 100;
        server.durability = Math.max(0, currentDurability - durabilityLoss);
        server.lastDurabilityUpdate = now;
        updated = true;
        
        // If durability reaches 0, turn server offline
        if (server.durability <= 0) {
          server.isOnline = false;
          await this.addActivity(server.ownerId, `${server.name} went offline due to maintenance required`);
        }
      }
      
      // Add durability field to existing servers that don't have it
      if (server.durability === undefined) {
        server.durability = 100;
        server.lastDurabilityUpdate = server.createdAt || now;
        updated = true;
      }
    }
    
    if (updated) {
      await this.saveServers(servers);
    }
  }

  async repairServer(userId, serverId, repairType = 'full') {
    const user = await this.getUser(userId);
    if (!user) throw new Error('User not found');

    const servers = await this.getServers();
    const serverIndex = servers.findIndex(s => s.id === serverId && s.ownerId === userId);
    
    if (serverIndex === -1) {
      throw new Error('Server not found');
    }

    const server = servers[serverIndex];
    const currentDurability = server.durability || 100;
    
    if (currentDurability >= 100) {
      throw new Error('Server does not need repair');
    }

    // Calculate repair cost based on damage and server income
    const damage = 100 - currentDurability;
    let repairCost;
    let durabilityRestore;
    
    if (repairType === 'partial') {
      // Partial repair: restore 50% of missing durability
      durabilityRestore = Math.min(50, damage);
      repairCost = Math.ceil((server.incomePerMinute || 15) * damage * 0.3); // 30% of income per minute per damage point
    } else {
      // Full repair: restore to 100%
      durabilityRestore = damage;
      repairCost = Math.ceil((server.incomePerMinute || 15) * damage * 0.5); // 50% of income per minute per damage point
    }

    if (user.balance < repairCost) {
      throw new Error(`Insufficient funds. Repair cost: $${repairCost}`);
    }

    // Apply repair
    servers[serverIndex].durability = Math.min(100, currentDurability + durabilityRestore);
    await this.saveServers(servers);

    // Update user balance
    await this.updateUser(userId, {
      balance: user.balance - repairCost,
      totalSpent: (user.totalSpent || 0) + repairCost
    });

    const repairTypeText = repairType === 'partial' ? 'Partial repair' : 'Full repair';
    await this.addActivity(userId, `${repairTypeText} of ${server.name} for $${repairCost.toLocaleString()}`);

    return {
      server: servers[serverIndex],
      cost: repairCost,
      durabilityRestored: durabilityRestore
    };
  }

  async updateIncome(userId) {
    const user = await this.getUser(userId);
    if (!user) throw new Error('User not found');

    // Update server durability before calculating income
    await this.updateServersDurability();

    const servers = await this.getUserServers(userId);
    const now = Date.now();
    const lastUpdate = user.lastIncomeUpdate || now;
    const timeDiff = now - lastUpdate;
    
    // Calculate income from online servers (per minute, so divide by 60000ms)
    const efficiencyBonus = user.efficiencyBonus || 0;
    const totalIncome = servers.reduce((sum, server) => {
      if (!server.isOnline) return sum;
      const baseIncome = server.incomePerMinute;
      const loadPercentage = server.loadPercentage || 50;
      const loadAdjustment = baseIncome * (1 + (loadPercentage - 50) / 100);
      // Apply efficiency bonus (rounded up in favor of player)
      const efficiencyAdjustment = Math.ceil(loadAdjustment * (1 + efficiencyBonus / 100));
      return sum + efficiencyAdjustment;
    }, 0);
    
    // Calculate rental costs per minute (10% of income as standard)
    const totalRentalCost = totalIncome * 0.1;

    const incomeEarned = Math.floor((totalIncome * timeDiff) / 60000);
    const rentalCost = Math.floor((totalRentalCost * timeDiff) / 60000);
    const netIncome = incomeEarned - rentalCost;

    if (Math.abs(netIncome) > 0) {
      const newBalance = Math.max(0, user.balance + netIncome);
      // Update totalEarnings and totalSpent separately for proper tracking
      const updateData = {
        balance: newBalance,
        lastIncomeUpdate: now
      };
      
      // Update totalEarnings if we earned money
      if (incomeEarned > 0) {
        updateData.totalEarnings = (user.totalEarnings || 0) + incomeEarned;
      }
      
      // Update totalSpent if we had rental costs
      if (rentalCost > 0) {
        updateData.totalSpent = (user.totalSpent || 0) + rentalCost;
      }
      
      const updatedUser = await this.updateUser(userId, updateData);

      // Update daily quest for income
      if (incomeEarned > 0) {
        await this.updateDailyQuest(userId, 'income', { amount: incomeEarned });
      }

      // Add activity log for income/expenses
      if (incomeEarned > 0 && rentalCost > 0) {
        await this.addActivity(userId, `Income: +$${incomeEarned}, Rental: -$${rentalCost} (Net: ${netIncome >= 0 ? '+' : ''}$${netIncome})`);
      } else if (incomeEarned > 0) {
        await this.addActivity(userId, `Income earned: +$${incomeEarned} from ${servers.filter(s => s.isOnline).length} active servers`);
      } else if (rentalCost > 0) {
        await this.addActivity(userId, `Rental cost: -$${rentalCost} for ${servers.length} servers`);
      }

      // Check for server overloads
      for (const server of servers.filter(s => s.isOnline)) {
        await this.checkServerOverload(userId, server.id, server.loadPercentage || 50);
      }

      // Check achievements
      await this.checkAchievements(userId);

      return { user: updatedUser, incomeEarned, rentalCost, netIncome };
    }

    return { user, incomeEarned: 0, rentalCost: 0, netIncome: 0 };
  }

  // Tutorial
  async completeTutorial(userId) {
    const updatedUser = await this.updateUser(userId, {
      tutorialCompleted: true
    });

    await this.addActivity(userId, 'Tutorial completed! All features unlocked.');

    return { user: updatedUser };
  }

  // Activities
  async addActivity(userId, description) {
    const user = await this.getUser(userId);
    if (!user) return;

    const activities = user.activities || [];
    activities.unshift({
      id: randomUUID(),
      description,
      timestamp: new Date().toLocaleString()
    });

    // Keep only last 5 activities to save disk space
    const trimmedActivities = activities.slice(0, 5);

    await this.updateUser(userId, { activities: trimmedActivities });
  }

  async getUserActivities(userId) {
    const user = await this.getUser(userId);
    return user?.activities || [];
  }

  // Rankings - read directly from users folder
  async getRankings() {
    try {
      const userFiles = await fs.readdir(usersDir);
      const jsonFiles = userFiles.filter(file => file.endsWith('.json'));
      
      const rankings = [];
      
      for (const fileName of jsonFiles) {
        try {
          const userPath = path.join(usersDir, fileName);
          const userData = JSON.parse(await fs.readFile(userPath, 'utf8'));
          
          // Get server count for this user from servers.json
          const userServers = await this.getUserServers(userData.id);
          
          rankings.push({
            id: userData.id,
            nickname: userData.nickname,
            balance: userData.balance || 0,
            serverCount: userServers.length,
            isOnline: this.isUserOnline(userData)
          });
        } catch (err) {
          // Skip invalid user files
          continue;
        }
      }
      
      return rankings
        .sort((a, b) => b.balance - a.balance)
        .map((user, index) => ({
          ...user,
          rank: index + 1
        }));
    } catch (error) {
      return [];
    }
  }

  isUserOnline(userData) {
    // Check if user has been banned
    if (userData.banned) return false;
    
    // User is online if they've been active in the last 5 minutes
    const lastActivity = Math.max(
      userData.lastSeen || 0,
      userData.lastIncomeUpdate || 0
    );
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    return lastActivity > fiveMinutesAgo;
  }

  async getPlayerByNickname(nickname) {
    try {
      const userFiles = await fs.readdir(usersDir);
      const jsonFiles = userFiles.filter(file => file.endsWith('.json'));
      
      for (const fileName of jsonFiles) {
        try {
          const userPath = path.join(usersDir, fileName);
          const userData = JSON.parse(await fs.readFile(userPath, 'utf8'));
          
          if (userData.nickname === nickname) {
            // Count servers correctly from servers.json
            const userServers = await this.getUserServers(userData.id);
            userData.serverCount = userServers.length;
            return userData;
          }
        } catch (err) {
          continue;
        }
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  async updateRankings() {
    const rankings = await this.getRankings();
    await this.saveRankings(rankings);
  }

  async getGeneralStats() {
    try {
      // Read directly from users folder
      const userFiles = await fs.readdir(usersDir);
      const jsonFiles = userFiles.filter(file => file.endsWith('.json'));
      
      // Get all servers from servers.json
      const allServers = await this.getServers();
      
      let totalBalance = 0;
      let onlineCount = 0;
      
      for (const fileName of jsonFiles) {
        try {
          const userPath = path.join(usersDir, fileName);
          const userData = JSON.parse(await fs.readFile(userPath, 'utf8'));
          
          // Calculate total balance
          totalBalance += userData.balance || 0;
          
          // Check if user is online based on isOnline field
          if (userData.isOnline === true) {
            onlineCount++;
          }
        } catch (err) {
          // Skip invalid user files
          continue;
        }
      }
      
      return {
        totalPlayers: jsonFiles.length,
        onlinePlayers: onlineCount,
        totalServers: allServers.length,
        totalBalance: Math.floor(totalBalance)
      };
    } catch (error) {
      return {
        totalPlayers: 0,
        onlinePlayers: 0,
        totalServers: 0,
        totalBalance: 0
      };
    }
  }

  // Get all achievements
  getAchievements() {
    return ACHIEVEMENTS;
  }

  // Get all daily quests templates
  getDailyQuests() {
    return DAILY_QUESTS;
  }

  // Chat system
  async getChatMessages() {
    try {
      const data = await fs.readFile(chatFile, 'utf8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async saveChatMessages(messages) {
    await fs.writeFile(chatFile, JSON.stringify(messages, null, 2));
  }

  async sendChatMessage(userId, message) {
    const user = await this.getUser(userId);
    if (!user || user.banned) {
      throw new Error('Cannot send message');
    }

    // Check if user is muted
    if (user.muted && user.muteExpires && Date.now() < user.muteExpires) {
      const timeLeft = Math.ceil((user.muteExpires - Date.now()) / 60000);
      throw new Error(`You are muted for ${timeLeft} more minutes`);
    }

    // Remove mute if expired
    if (user.muted && user.muteExpires && Date.now() >= user.muteExpires) {
      await this.updateUser(userId, {
        muted: false,
        muteExpires: null
      });
    }

    const messages = await this.getChatMessages();
    const newMessage = {
      id: randomUUID(),
      userId,
      nickname: user.nickname,
      message: message.trim(),
      timestamp: Date.now(),
      deleted: false,
      adminLevel: user.admin || 0  // Store admin level at time of message
    };

    messages.push(newMessage);
    
    // Keep only last 100 messages
    if (messages.length > 100) {
      messages.splice(0, messages.length - 100);
    }

    await this.saveChatMessages(messages);
    return newMessage;
  }

  async deleteChatMessage(messageId, adminUserId) {
    const admin = await this.getUser(adminUserId);
    if (!admin || admin.admin < 1) {
      throw new Error('Admin access required');
    }

    const messages = await this.getChatMessages();
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    
    if (messageIndex === -1) {
      throw new Error('Message not found');
    }

    messages[messageIndex].deleted = true;
    messages[messageIndex].deletedBy = admin.nickname;
    messages[messageIndex].deletedAt = Date.now();

    await this.saveChatMessages(messages);
    return messages[messageIndex];
  }

  async muteUser(targetUserId, adminUserId, duration) {
    const admin = await this.getUser(adminUserId);
    if (!admin || admin.admin < 1) {
      throw new Error('Admin access required');
    }

    const targetUser = await this.getUser(targetUserId);
    if (!targetUser) {
      throw new Error('User not found');
    }

    // Can't mute other admins unless you're super admin
    if (targetUser.admin >= 1 && admin.nickname !== 'Ca6aka') {
      throw new Error('Only super admin can mute other admins');
    }

    const muteExpires = Date.now() + (duration * 60 * 1000); // duration in minutes

    await this.updateUser(targetUserId, {
      muted: true,
      muteExpires
    });

    await this.addActivity(targetUserId, `Muted for ${duration} minutes by admin ${admin.nickname}`);

    return { success: true, muteExpires };
  }

  async unmuteUser(targetUserId, adminUserId) {
    const admin = await this.getUser(adminUserId);
    if (!admin || admin.admin < 1) {
      throw new Error('Admin access required');
    }

    const targetUser = await this.getUser(targetUserId);
    if (!targetUser) {
      throw new Error('User not found');
    }

    await this.updateUser(targetUserId, {
      muted: false,
      muteExpires: null
    });

    await this.addActivity(targetUserId, `Unmuted by admin ${admin.nickname}`);

    return { success: true };
  }

  async getActiveMutes() {
    const users = await this.getAllUsers();
    const now = Date.now();
    
    // Filter users who are currently muted
    const mutedUsers = users.filter(user => {
      if (!user.muted || !user.muteExpires) return false;
      
      // If mute has expired, automatically unmute them
      if (now >= user.muteExpires) {
        this.updateUser(user.id, {
          muted: false,
          muteExpires: null
        });
        return false;
      }
      
      return true;
    });

    return mutedUsers.map(user => ({
      id: user.id,
      nickname: user.nickname,
      muteExpires: user.muteExpires,
      timeLeft: Math.ceil((user.muteExpires - now) / 60000) // minutes left
    }));
  }

  async checkExpiredMutes() {
    const users = await this.getAllUsers();
    const now = Date.now();
    
    for (const user of users) {
      if (user.muted && user.muteExpires && now >= user.muteExpires) {
        await this.updateUser(user.id, {
          muted: false,
          muteExpires: null
        });
        await this.addActivity(user.id, 'Mute automatically expired');
      }
    }
  }

  // Background income updater for all users with active servers
  async updateAllActiveUsersIncome() {
    try {
      const users = await this.getAllUsers();
      const servers = await this.getServers();
      const now = Date.now();
      
      let updatedUsersCount = 0;
      
      // Group servers by owner for efficiency
      const serversByOwner = {};
      servers.forEach(server => {
        if (!serversByOwner[server.ownerId]) {
          serversByOwner[server.ownerId] = [];
        }
        serversByOwner[server.ownerId].push(server);
      });
      
      for (const user of users) {
        const userServers = serversByOwner[user.id] || [];
        const activeServers = userServers.filter(s => s.isOnline);
        
        // Only update income for users with active servers
        if (activeServers.length > 0) {
          const lastUpdate = user.lastIncomeUpdate || now;
          const timeSinceUpdate = now - lastUpdate;
          
          // Only update if it's been more than 30 seconds since last update
          // This prevents too frequent updates and potential conflicts
          if (timeSinceUpdate > 30000) {
            try {
              const result = await this.updateIncome(user.id);
              if (result.netIncome !== 0) {
                updatedUsersCount++;
                console.log(`Background income update: ${user.nickname} earned $${result.netIncome}`);
              }
            } catch (error) {
              console.error(`Error updating income for ${user.nickname}:`, error.message);
            }
          }
        }
      }
      
      if (updatedUsersCount > 0) {
        console.log(`Background income update completed: ${updatedUsersCount} users updated`);
      }
      
    } catch (error) {
      console.error('Error in background income update:', error);
    }
  }

  // Utility methods
  formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  // Server synchronization with data/servers.json
  async syncServerData(userServers) {
    try {
      // Read existing servers data
      let allServers = await this.readJsonFile('servers.json') || [];
      
      // Remove old entries for this user's servers
      allServers = allServers.filter(server => !userServers.find(us => us.id === server.id));
      
      // Add ALL current user's servers (both online and offline) - preserve ALL fields
      const updatedServers = userServers.map(server => ({
        ...server, // Preserve ALL server fields
        lastUpdated: Date.now()
      }));
      
      allServers.push(...updatedServers);
      
      // Save updated servers data
      await this.writeJsonFile('servers.json', allServers);
    } catch (error) {
      console.error('Error syncing server data:', error);
    }
  }
}

export const storage = new FileStorage();
