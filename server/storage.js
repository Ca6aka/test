import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data');

// Server products configuration
const SERVER_PRODUCTS = [
  {
    id: 'basic-web',
    name: 'Basic Web Server',
    type: 'Web Hosting',
    price: 5000,
    incomePerMinute: 150,
    monthlyCost: 45,
    icon: 'fas fa-globe'
  },
  {
    id: 'high-performance',
    name: 'High Performance Server',
    type: 'Gaming/Apps',
    price: 12000,
    incomePerMinute: 350,
    monthlyCost: 120,
    icon: 'fas fa-server'
  },
  {
    id: 'database-server',
    name: 'Database Server',
    type: 'Storage',
    price: 8000,
    incomePerMinute: 200,
    monthlyCost: 85,
    icon: 'fas fa-database'
  },
  {
    id: 'cdn-server',
    name: 'CDN Server',
    type: 'Content Delivery',
    price: 15000,
    incomePerMinute: 450,
    monthlyCost: 180,
    icon: 'fas fa-cloud'
  }
];

const JOB_TYPES = [
  {
    id: 'maintenance',
    name: 'Server Maintenance',
    reward: 500,
    cooldown: 300000, // 5 minutes
    icon: 'fas fa-wrench'
  },
  {
    id: 'optimization',
    name: 'Performance Optimization',
    reward: 1200,
    cooldown: 600000, // 10 minutes
    icon: 'fas fa-tachometer-alt'
  },
  {
    id: 'security-audit',
    name: 'Security Audit',
    reward: 800,
    cooldown: 450000, // 7.5 minutes
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
    price: 2000
  },
  {
    id: 'advanced-management',
    title: 'Advanced Server Management',
    description: 'Master advanced server optimization and scaling techniques',
    difficulty: 'Advanced',
    duration: 120 * 60 * 1000, // 2 hours in milliseconds
    reward: { type: 'serverSlots', amount: 2 },
    price: 8000
  },
  {
    id: 'security-protocols',
    title: 'Security Protocols',
    description: 'Implement robust security measures for your server infrastructure',
    difficulty: 'Intermediate',
    duration: 90 * 60 * 1000, // 1.5 hours in milliseconds
    reward: { type: 'efficiency', amount: 15 },
    price: 5000
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

  async getUsers() {
    const users = await this.readJsonFile('users.json');
    return users || [];
  }

  async saveUsers(users) {
    await this.writeJsonFile('users.json', users);
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
    const users = await this.getUsers();
    return users.find(user => user.id === id);
  }

  async getUserByNickname(nickname) {
    const users = await this.getUsers();
    return users.find(user => user.nickname === nickname);
  }

  async createUser(userData) {
    const users = await this.getUsers();
    const user = {
      id: randomUUID(),
      nickname: userData.nickname,
      password: userData.password,
      balance: 10000, // Starting balance
      serverLimit: 3, // Starting server limit
      tutorialCompleted: false,
      lastIncomeUpdate: Date.now(),
      jobCooldowns: {},
      currentLearning: null,
      activities: []
    };
    
    users.push(user);
    await this.saveUsers(users);
    await this.updateRankings();
    
    return user;
  }

  async updateUser(userId, updates) {
    const users = await this.getUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    users[userIndex] = { ...users[userIndex], ...updates };
    await this.saveUsers(users);
    await this.updateRankings();
    
    return users[userIndex];
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
      usage: Math.floor(Math.random() * 50) + 25, // Random usage 25-75%
      createdAt: Date.now()
    };

    servers.push(newServer);
    await this.saveServers(servers);

    // Update user balance
    const updatedUser = await this.updateUser(userId, {
      balance: user.balance - product.price
    });

    // Add activity
    await this.addActivity(userId, `Purchased ${product.name} for $${product.price.toLocaleString()}`);

    return { user: updatedUser, server: newServer };
  }

  async toggleServer(userId, serverId) {
    const servers = await this.getServers();
    const serverIndex = servers.findIndex(s => s.id === serverId && s.ownerId === userId);
    
    if (serverIndex === -1) {
      throw new Error('Server not found');
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

    const updatedUser = await this.updateUser(userId, {
      balance: user.balance + job.reward,
      jobCooldowns: newCooldowns
    });

    await this.addActivity(userId, `Completed ${job.name} (+$${job.reward.toLocaleString()})`);

    return { user: updatedUser };
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
    const updates = { currentLearning: null };

    // Apply rewards
    if (learning.reward.type === 'serverSlots') {
      updates.serverLimit = user.serverLimit + learning.reward.amount;
    } else if (learning.reward.type === 'efficiency') {
      // Efficiency bonus could be applied to future servers or existing ones
      // For now, we'll just track it in activities
    }

    await this.updateUser(userId, updates);
    await this.addActivity(userId, `Completed learning course: ${learning.title}`);
  }

  // Income updates
  async updateIncome(userId) {
    const user = await this.getUser(userId);
    if (!user) throw new Error('User not found');

    const servers = await this.getUserServers(userId);
    const now = Date.now();
    const lastUpdate = user.lastIncomeUpdate || now;
    const timeDiff = now - lastUpdate;
    
    // Calculate income from online servers (per minute, so divide by 60000ms)
    const totalIncome = servers.reduce((sum, server) => {
      return sum + (server.isOnline ? server.incomePerMinute : 0);
    }, 0);

    const incomeEarned = Math.floor((totalIncome * timeDiff) / 60000);

    if (incomeEarned > 0) {
      const updatedUser = await this.updateUser(userId, {
        balance: user.balance + incomeEarned,
        lastIncomeUpdate: now
      });

      return { user: updatedUser, incomeEarned };
    }

    return { user, incomeEarned: 0 };
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

    // Keep only last 50 activities
    const trimmedActivities = activities.slice(0, 50);

    await this.updateUser(userId, { activities: trimmedActivities });
  }

  async getUserActivities(userId) {
    const user = await this.getUser(userId);
    return user?.activities || [];
  }

  // Rankings
  async getRankings() {
    const users = await this.getUsers();
    const rankings = users
      .map(user => ({
        id: user.id,
        nickname: user.nickname,
        balance: user.balance,
        serverCount: 0 // We'll calculate this
      }))
      .sort((a, b) => b.balance - a.balance)
      .map((user, index) => ({
        ...user,
        rank: index + 1
      }));

    // Calculate server counts
    const servers = await this.getServers();
    rankings.forEach(user => {
      user.serverCount = servers.filter(s => s.ownerId === user.id).length;
    });

    return rankings;
  }

  async updateRankings() {
    const rankings = await this.getRankings();
    await this.saveRankings(rankings);
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
}

export const storage = new FileStorage();
