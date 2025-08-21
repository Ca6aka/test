// Storage adapter to switch between file-based and MySQL storage
import dotenv from 'dotenv';
import { storage as fileStorage } from './storage.js';
import { mysqlStorage } from './mysql-storage.js';
import { testConnection } from '../database/mysql-config.js';

dotenv.config();

class StorageAdapter {
  constructor() {
    this.useMySQL = process.env.NODE_ENV === 'production' || process.env.USE_MYSQL === 'true';
    this.mysqlAvailable = false;
    this.storage = fileStorage; // Default to file storage
  }
  
  async initialize() {
    if (this.useMySQL) {
      console.log('🔄 Checking MySQL connection...');
      this.mysqlAvailable = await testConnection();
      
      if (this.mysqlAvailable) {
        this.storage = mysqlStorage;
        console.log('✅ Using MySQL storage');
      } else {
        console.log('⚠️ MySQL unavailable, falling back to file storage');
        this.storage = fileStorage;
      }
    } else {
      console.log('📁 Using file-based storage (development mode)');
      this.storage = fileStorage;
    }
    
    return this.storage;
  }
  
  // Proxy all storage methods to the active storage backend
  async createUser(userData) {
    return this.storage.createUser(userData);
  }
  
  async getUser(userId) {
    return this.storage.getUser(userId);
  }
  
  async getUserByEmail(email) {
    return this.storage.getUserByEmail(email);
  }
  
  async getUserByNickname(nickname) {
    return this.storage.getUserByNickname(nickname);
  }
  
  async updateUser(userId, updates) {
    return this.storage.updateUser(userId, updates);
  }
  
  async deleteUser(userId) {
    return this.storage.deleteUser(userId);
  }
  
  async validatePassword(userId, password) {
    return this.storage.validatePassword(userId, password);
  }
  
  async addServerToUser(userId, serverData) {
    return this.storage.addServerToUser(userId, serverData);
  }
  
  async getServer(serverId) {
    return this.storage.getServer(serverId);
  }
  
  async getUserServers(userId) {
    return this.storage.getUserServers(userId);
  }
  
  async updateServer(serverId, updates) {
    return this.storage.updateServer(serverId, updates);
  }
  
  async deleteServer(serverId) {
    return this.storage.deleteServer(serverId);
  }
  
  async addChatMessage(userId, message, language = 'ru', systemMessage = false) {
    return this.storage.addChatMessage(userId, message, language, systemMessage);
  }
  
  async getChatMessages(language = 'ru', limit = 100) {
    return this.storage.getChatMessages(language, limit);
  }
  
  async deleteChatMessage(messageId) {
    return this.storage.deleteChatMessage(messageId);
  }
  
  async createDailyQuest(userId, questData) {
    return this.storage.createDailyQuest(userId, questData);
  }
  
  async updateDailyQuest(questId, updates) {
    return this.storage.updateDailyQuest(questId, updates);
  }
  
  async getUserDailyQuests(userId) {
    return this.storage.getUserDailyQuests(userId);
  }
  
  async addActivity(userId, description) {
    return this.storage.addActivity(userId, description);
  }
  
  async getUserActivities(userId, limit = 50) {
    return this.storage.getUserActivities(userId, limit);
  }
  
  async setJobCooldown(userId, jobType, cooldownMs) {
    return this.storage.setJobCooldown(userId, jobType, cooldownMs);
  }
  
  async getJobCooldowns(userId) {
    return this.storage.getJobCooldowns(userId);
  }
  
  async clearExpiredCooldowns() {
    return this.storage.clearExpiredCooldowns();
  }
  
  async createReport(reportData) {
    return this.storage.createReport(reportData);
  }
  
  async getReports(status = null) {
    return this.storage.getReports(status);
  }
  
  async updateReport(reportId, updates) {
    return this.storage.updateReport(reportId, updates);
  }
  
  async createPayment(paymentData) {
    return this.storage.createPayment(paymentData);
  }
  
  async updatePayment(orderId, updates) {
    return this.storage.updatePayment(orderId, updates);
  }
  
  async getPayment(orderId) {
    return this.storage.getPayment(orderId);
  }
  
  async getRankings() {
    return this.storage.getRankings();
  }
  
  async getGeneralStats() {
    return this.storage.getGeneralStats();
  }
  
  async getSystemSetting(key) {
    return this.storage.getSystemSetting(key);
  }
  
  async setSystemSetting(key, value, description = null) {
    return this.storage.setSystemSetting(key, value, description);
  }
  
  async activateSubscription(userId, type) {
    return this.storage.activateSubscription(userId, type);
  }
  
  async manageSubscription(userId, type, action, days) {
    return this.storage.manageSubscription(userId, type, action, days);
  }
  
  async healthCheck() {
    return this.storage.healthCheck();
  }
  
  // Storage-specific methods that might not exist in all implementations
  async filterMessage(message, user, language = 'ru') {
    if (this.storage.filterMessage) {
      return this.storage.filterMessage(message, user, language);
    }
    return { text: message, wasFiltered: false, warningCount: 0 };
  }
  
  async checkDailyQuestReset(userId) {
    if (this.storage.checkDailyQuestReset) {
      return this.storage.checkDailyQuestReset(userId);
    }
    return null;
  }
  
  async completeJob(userId, jobType) {
    if (this.storage.completeJob) {
      return this.storage.completeJob(userId, jobType);
    }
    throw new Error('Job completion not implemented in current storage backend');
  }
  
  async startLearning(userId, courseName) {
    if (this.storage.startLearning) {
      return this.storage.startLearning(userId, courseName);
    }
    throw new Error('Learning system not implemented in current storage backend');
  }
  
  async completeLearning(userId) {
    if (this.storage.completeLearning) {
      return this.storage.completeLearning(userId);
    }
    throw new Error('Learning completion not implemented in current storage backend');
  }
  
  async getCurrentLearning(userId) {
    if (this.storage.getCurrentLearning) {
      return this.storage.getCurrentLearning(userId);
    }
    return null;
  }
  
  async claimDailyBonus(userId) {
    if (this.storage.claimDailyBonus) {
      return this.storage.claimDailyBonus(userId);
    }
    throw new Error('Daily bonus not implemented in current storage backend');
  }
  
  async canClaimDailyBonus(userId) {
    if (this.storage.canClaimDailyBonus) {
      return this.storage.canClaimDailyBonus(userId);
    }
    return false;
  }
  
  // Background income system methods - these are critical for the game functionality
  async updateAllActiveUsersIncome() {
    if (this.storage.updateAllActiveUsersIncome) {
      return this.storage.updateAllActiveUsersIncome();
    }
    // Fallback: silent return for missing functionality
    return { message: 'Income update not available in current storage' };
  }
  
  async updateUserActivity(userId) {
    if (this.storage.updateUserActivity) {
      return this.storage.updateUserActivity(userId);
    }
    // Silent fallback for optional feature
  }
  
  async checkExpiredMutes() {
    if (this.storage.checkExpiredMutes) {
      return this.storage.checkExpiredMutes();
    }
    // Silent fallback for optional feature
  }
  
  async updateIncome(userId) {
    return this.storage.updateIncome(userId);
  }
  
  async getAllUsers() {
    return this.storage.getAllUsers();
  }
  
  async getServers() {
    return this.storage.getServers();
  }

  // Compatibility method for existing code
  getStorageType() {
    return this.mysqlAvailable && this.useMySQL ? 'mysql' : 'file';
  }
  
  // Method to gracefully switch storage backends during runtime
  async switchToMySQL() {
    if (!this.mysqlAvailable) {
      this.mysqlAvailable = await testConnection();
    }
    
    if (this.mysqlAvailable) {
      this.storage = mysqlStorage;
      console.log('✅ Switched to MySQL storage');
      return true;
    }
    
    console.log('❌ Cannot switch to MySQL: connection unavailable');
    return false;
  }
  
  async switchToFileStorage() {
    this.storage = fileStorage;
    console.log('📁 Switched to file storage');
    return true;
  }
}

// Create and export the adapter instance
export const storageAdapter = new StorageAdapter();

// Initialize storage on import
storageAdapter.initialize().catch(error => {
  console.error('Storage initialization error:', error);
});