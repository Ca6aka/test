import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import { executeQuery, executeTransaction, getPoolStats } from '../database/mysql-config.js';

export class MySQLStorage {
  
  // User management
  async createUser(userData) {
    const id = randomUUID();
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    await executeQuery(`
      INSERT INTO users (
        id, nickname, email, password_hash, balance, level, experience,
        admin, tutorial_completed, chat_language, registration_time,
        last_activity, real_activity, ip_address
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, userData.nickname, userData.email, hashedPassword,
      userData.balance || 0, userData.level || 1, userData.experience || 0,
      userData.admin || 0, userData.tutorialCompleted || false,
      userData.chatLanguage || 'ru', new Date(), new Date(), new Date(),
      userData.ipAddress || null
    ]);
    
    return this.getUser(id);
  }
  
  async getUser(userId) {
    const [user] = await executeQuery('SELECT * FROM users WHERE id = ?', [userId]);
    if (!user) return null;
    
    // Get user's servers
    const servers = await executeQuery('SELECT * FROM servers WHERE user_id = ?', [userId]);
    
    // Get user's daily quests
    const dailyQuests = await executeQuery(`
      SELECT * FROM daily_quests 
      WHERE user_id = ? AND quest_date = CURDATE()
    `, [userId]);
    
    // Get recent activities
    const activities = await executeQuery(`
      SELECT * FROM activities 
      WHERE user_id = ? 
      ORDER BY timestamp DESC 
      LIMIT 50
    `, [userId]);
    
    return {
      ...user,
      servers: servers || [],
      dailyQuests: dailyQuests || [],
      activities: activities || []
    };
  }
  
  async getUserByEmail(email) {
    const [user] = await executeQuery('SELECT * FROM users WHERE email = ?', [email]);
    return user || null;
  }
  
  async getUserByNickname(nickname) {
    const [user] = await executeQuery('SELECT * FROM users WHERE nickname = ?', [nickname]);
    return user || null;
  }
  
  async updateUser(userId, updates) {
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), userId];
    
    await executeQuery(`
      UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = ?
    `, values);
    
    return this.getUser(userId);
  }
  
  async deleteUser(userId) {
    await executeQuery('DELETE FROM users WHERE id = ?', [userId]);
  }
  
  // Authentication
  async validatePassword(userId, password) {
    const [user] = await executeQuery('SELECT password_hash FROM users WHERE id = ?', [userId]);
    if (!user) return false;
    
    return bcrypt.compare(password, user.password_hash);
  }
  
  // Server management
  async addServerToUser(userId, serverData) {
    const serverId = randomUUID();
    
    await executeQuery(`
      INSERT INTO servers (id, user_id, name, type, status, monthly_cost, monthly_income, purchased_at, last_income_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      serverId, userId, serverData.name, serverData.type,
      serverData.status || 'online', serverData.monthlyCost,
      serverData.monthlyIncome, new Date(), new Date()
    ]);
    
    return this.getServer(serverId);
  }
  
  async getServer(serverId) {
    const [server] = await executeQuery('SELECT * FROM servers WHERE id = ?', [serverId]);
    return server || null;
  }
  
  async getUserServers(userId) {
    return executeQuery('SELECT * FROM servers WHERE user_id = ?', [userId]);
  }
  
  async updateServer(serverId, updates) {
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), serverId];
    
    await executeQuery(`
      UPDATE servers SET ${setClause}, updated_at = NOW() WHERE id = ?
    `, values);
    
    return this.getServer(serverId);
  }
  
  async deleteServer(serverId) {
    await executeQuery('DELETE FROM servers WHERE id = ?', [serverId]);
  }
  
  // Chat system
  async addChatMessage(userId, message, language = 'ru', systemMessage = false) {
    const messageId = randomUUID();
    const timestamp = Date.now();
    
    await executeQuery(`
      INSERT INTO chat_messages (id, user_id, message, language, timestamp, system_message)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [messageId, userId, message, language, timestamp, systemMessage]);
    
    return messageId;
  }
  
  async getChatMessages(language = 'ru', limit = 100) {
    return executeQuery(`
      SELECT cm.*, u.nickname, u.admin, u.vip_status, u.premium_status
      FROM chat_messages cm
      LEFT JOIN users u ON cm.user_id = u.id
      WHERE cm.language = ? AND cm.deleted = FALSE
      ORDER BY cm.timestamp DESC
      LIMIT ?
    `, [language, limit]);
  }
  
  async deleteChatMessage(messageId) {
    await executeQuery(
      'UPDATE chat_messages SET deleted = TRUE WHERE id = ?',
      [messageId]
    );
  }
  
  // Daily quests
  async createDailyQuest(userId, questData) {
    const questId = questData.id || randomUUID();
    const today = new Date().toISOString().split('T')[0];
    
    await executeQuery(`
      INSERT INTO daily_quests (id, user_id, title, description, reward, target_value, current_progress, quest_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      questId, userId, questData.title, questData.description,
      questData.reward, questData.targetValue, questData.currentProgress || 0, today
    ]);
    
    return questId;
  }
  
  async updateDailyQuest(questId, updates) {
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), questId];
    
    await executeQuery(`
      UPDATE daily_quests SET ${setClause}, updated_at = NOW() WHERE id = ?
    `, values);
  }
  
  async getUserDailyQuests(userId) {
    const today = new Date().toISOString().split('T')[0];
    return executeQuery(`
      SELECT * FROM daily_quests 
      WHERE user_id = ? AND quest_date = ?
      ORDER BY created_at ASC
    `, [userId, today]);
  }
  
  // Activities/Logs
  async addActivity(userId, description) {
    const activityId = randomUUID();
    const timestamp = Date.now();
    
    await executeQuery(`
      INSERT INTO activities (id, user_id, description, timestamp)
      VALUES (?, ?, ?, ?)
    `, [activityId, userId, description, timestamp]);
  }
  
  async getUserActivities(userId, limit = 50) {
    return executeQuery(`
      SELECT * FROM activities 
      WHERE user_id = ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    `, [userId, limit]);
  }
  
  // Job cooldowns
  async setJobCooldown(userId, jobType, cooldownMs) {
    const cooldownId = randomUUID();
    const expiresAt = Date.now() + cooldownMs;
    
    await executeQuery(`
      INSERT INTO job_cooldowns (id, user_id, job_type, expires_at)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE expires_at = VALUES(expires_at)
    `, [cooldownId, userId, jobType, expiresAt]);
  }
  
  async getJobCooldowns(userId) {
    const cooldowns = await executeQuery(`
      SELECT job_type, expires_at FROM job_cooldowns
      WHERE user_id = ? AND expires_at > ?
    `, [userId, Date.now()]);
    
    const result = {};
    for (const cooldown of cooldowns) {
      result[cooldown.job_type] = cooldown.expires_at;
    }
    return result;
  }
  
  async clearExpiredCooldowns() {
    await executeQuery('DELETE FROM job_cooldowns WHERE expires_at <= ?', [Date.now()]);
  }
  
  // Reports system
  async createReport(reportData) {
    const reportId = randomUUID();
    
    await executeQuery(`
      INSERT INTO reports (id, reporter_id, reported_user_id, reason, description)
      VALUES (?, ?, ?, ?, ?)
    `, [
      reportId, reportData.reporterId, reportData.reportedUserId,
      reportData.reason, reportData.description || ''
    ]);
    
    return reportId;
  }
  
  async getReports(status = null) {
    let query = `
      SELECT r.*, 
             reporter.nickname as reporter_nickname,
             reported.nickname as reported_nickname,
             resolver.nickname as resolver_nickname
      FROM reports r
      LEFT JOIN users reporter ON r.reporter_id = reporter.id
      LEFT JOIN users reported ON r.reported_user_id = reported.id
      LEFT JOIN users resolver ON r.resolved_by = resolver.id
    `;
    
    const params = [];
    if (status) {
      query += ' WHERE r.status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY r.created_at DESC';
    
    return executeQuery(query, params);
  }
  
  async updateReport(reportId, updates) {
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), reportId];
    
    await executeQuery(`
      UPDATE reports SET ${setClause}, updated_at = NOW() WHERE id = ?
    `, values);
  }
  
  // Payments
  async createPayment(paymentData) {
    const paymentId = randomUUID();
    
    await executeQuery(`
      INSERT INTO payments (id, user_id, order_id, type, amount, currency, gateway, status, payment_url, invoice_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      paymentId, paymentData.userId, paymentData.orderId, paymentData.type,
      paymentData.amount, paymentData.currency, paymentData.gateway,
      paymentData.status || 'pending', paymentData.paymentUrl || null,
      paymentData.invoiceId || null
    ]);
    
    return paymentId;
  }
  
  async updatePayment(orderId, updates) {
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), orderId];
    
    await executeQuery(`
      UPDATE payments SET ${setClause}, updated_at = NOW() WHERE order_id = ?
    `, values);
  }
  
  async getPayment(orderId) {
    const [payment] = await executeQuery('SELECT * FROM payments WHERE order_id = ?', [orderId]);
    return payment || null;
  }
  
  // Rankings and statistics
  async getRankings() {
    return executeQuery(`
      SELECT id, nickname, balance, level, experience,
             vip_status, premium_status, last_activity
      FROM users
      ORDER BY balance DESC, level DESC
      LIMIT 100
    `);
  }
  
  async getGeneralStats() {
    const [stats] = await executeQuery(`
      SELECT 
        COUNT(*) as totalPlayers,
        SUM(CASE WHEN last_activity > DATE_SUB(NOW(), INTERVAL 5 MINUTE) THEN 1 ELSE 0 END) as onlinePlayers,
        COUNT(DISTINCT user_id) as totalChatMessages,
        SUM(balance) as totalEconomy
      FROM users
    `);
    
    const [serverStats] = await executeQuery(`
      SELECT COUNT(*) as totalServers,
             SUM(monthly_income) as totalIncome
      FROM servers
    `);
    
    return {
      ...stats,
      ...serverStats,
      poolStats: getPoolStats()
    };
  }
  
  // System settings
  async getSystemSetting(key) {
    const [setting] = await executeQuery(
      'SELECT setting_value FROM system_settings WHERE setting_key = ?',
      [key]
    );
    return setting ? setting.setting_value : null;
  }
  
  async setSystemSetting(key, value, description = null) {
    await executeQuery(`
      INSERT INTO system_settings (setting_key, setting_value, description)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        setting_value = VALUES(setting_value),
        description = COALESCE(VALUES(description), description)
    `, [key, value, description]);
  }
  
  // Subscription management
  async activateSubscription(userId, type) {
    const user = await this.getUser(userId);
    if (!user) throw new Error('User not found');
    
    const updates = {};
    
    if (type === 'vip') {
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);
      updates.vip_status = 'active';
      updates.vip_expires_at = expiresAt;
    } else if (type === 'premium') {
      updates.premium_status = 'active';
      updates.premium_activated_at = new Date();
      // Remove VIP if upgrading to Premium
      updates.vip_status = 'none';
      updates.vip_expires_at = null;
    }
    
    return this.updateUser(userId, updates);
  }
  
  async manageSubscription(userId, type, action, days) {
    const updates = {};
    
    if (action === 'grant') {
      if (type === 'vip') {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + days);
        updates.vip_status = 'active';
        updates.vip_expires_at = expiresAt;
      } else if (type === 'premium') {
        updates.premium_status = 'active';
        updates.premium_activated_at = new Date();
      }
    } else if (action === 'revoke') {
      if (type === 'vip') {
        updates.vip_status = 'none';
        updates.vip_expires_at = null;
      } else if (type === 'premium') {
        updates.premium_status = 'none';
        updates.premium_activated_at = null;
      }
    }
    
    await this.updateUser(userId, updates);
    return { success: true, message: `${type.toUpperCase()} ${action}ed successfully` };
  }
  
  // Health check
  async healthCheck() {
    try {
      await executeQuery('SELECT 1');
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        poolStats: getPoolStats()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

export const mysqlStorage = new MySQLStorage();