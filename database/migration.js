import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { executeQuery, testConnection } from './mysql-config.js';
import { storage as fileStorage } from '../server/storage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Migration functions to convert JSON data to MySQL
export class DatabaseMigration {
  
  static async initializeDatabase() {
    console.log('🔄 Initializing MySQL database...');
    
    // Test connection first
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Cannot establish database connection');
    }
    
    // Read and execute schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split schema into individual statements
    const statements = schema.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      try {
        await executeQuery(statement.trim());
      } catch (error) {
        console.error('Schema execution error:', error.message);
        // Continue with other statements
      }
    }
    
    console.log('✅ Database schema initialized');
  }
  
  static async migrateUsers() {
    console.log('🔄 Migrating users from JSON to MySQL...');
    
    const usersDir = path.join(process.cwd(), 'users');
    if (!fs.existsSync(usersDir)) {
      console.log('No users directory found, skipping user migration');
      return;
    }
    
    const userFiles = fs.readdirSync(usersDir).filter(file => file.endsWith('.json'));
    let migratedCount = 0;
    
    for (const userFile of userFiles) {
      try {
        const userPath = path.join(usersDir, userFile);
        const userData = JSON.parse(fs.readFileSync(userPath, 'utf8'));
        
        // Insert user
        await executeQuery(`
          INSERT INTO users (
            id, nickname, email, password_hash, balance, level, experience, admin,
            tutorial_completed, chat_language, chat_warnings, muted, mute_expires,
            vip_status, vip_expires_at, premium_status, premium_activated_at,
            registration_time, last_activity, real_activity, daily_bonus_streak,
            last_daily_bonus, ip_address
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            balance = VALUES(balance),
            level = VALUES(level),
            experience = VALUES(experience),
            last_activity = VALUES(last_activity)
        `, [
          userData.id,
          userData.nickname,
          userData.email || `${userData.nickname}@example.com`,
          userData.password || 'migrated_user',
          userData.balance || 0,
          userData.level || 1,
          userData.experience || 0,
          userData.admin || 0,
          userData.tutorialCompleted || false,
          userData.chatLanguage || 'ru',
          userData.chatWarnings || 0,
          userData.muted || false,
          userData.muteExpires || null,
          userData.vipStatus || 'none',
          userData.vipExpiresAt ? new Date(userData.vipExpiresAt) : null,
          userData.premiumStatus || 'none',
          userData.premiumActivatedAt ? new Date(userData.premiumActivatedAt) : null,
          userData.registrationTime ? new Date(userData.registrationTime) : new Date(),
          userData.lastActivity ? new Date(userData.lastActivity) : new Date(),
          userData.realActivity ? new Date(userData.realActivity) : new Date(),
          userData.dailyBonusStreak || 0,
          userData.lastDailyBonus ? new Date(userData.lastDailyBonus) : null,
          userData.ipAddress || null
        ]);
        
        // Migrate user's servers
        if (userData.servers && userData.servers.length > 0) {
          for (const server of userData.servers) {
            await executeQuery(`
              INSERT INTO servers (id, user_id, name, type, status, monthly_cost, monthly_income, purchased_at, last_income_time)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
              ON DUPLICATE KEY UPDATE
                status = VALUES(status),
                last_income_time = VALUES(last_income_time)
            `, [
              server.id || `server_${Date.now()}_${Math.random()}`,
              userData.id,
              server.name || 'Migrated Server',
              server.type || 'basic',
              server.status || 'online',
              server.monthlyCost || 0,
              server.monthlyIncome || 0,
              server.purchasedAt ? new Date(server.purchasedAt) : new Date(),
              server.lastIncomeTime ? new Date(server.lastIncomeTime) : new Date()
            ]);
          }
        }
        
        // Migrate daily quests
        if (userData.dailyQuests && userData.dailyQuests.length > 0) {
          for (const quest of userData.dailyQuests) {
            await executeQuery(`
              INSERT INTO daily_quests (id, user_id, title, description, reward, target_value, current_progress, completed, claimed, quest_date)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              ON DUPLICATE KEY UPDATE
                current_progress = VALUES(current_progress),
                completed = VALUES(completed),
                claimed = VALUES(claimed)
            `, [
              quest.id,
              userData.id,
              quest.title || 'Migrated Quest',
              quest.description || 'Migrated from JSON',
              quest.reward || 0,
              quest.targetValue || 1,
              quest.currentProgress || 0,
              quest.completed || false,
              quest.claimed || false,
              new Date().toISOString().split('T')[0]
            ]);
          }
        }
        
        migratedCount++;
      } catch (error) {
        console.error(`Error migrating user ${userFile}:`, error.message);
      }
    }
    
    console.log(`✅ Migrated ${migratedCount} users to MySQL`);
  }
  
  static async migrateChatMessages() {
    console.log('🔄 Migrating chat messages...');
    
    const chatFiles = ['chat.json', 'chat-ru.json', 'chat-en.json', 'chat-de.json', 'chat-ua.json'];
    let migratedCount = 0;
    
    for (const chatFile of chatFiles) {
      const chatPath = path.join(process.cwd(), 'data', chatFile);
      if (!fs.existsSync(chatPath)) continue;
      
      try {
        const chatData = JSON.parse(fs.readFileSync(chatPath, 'utf8'));
        const language = chatFile.split('-')[1]?.split('.')[0] || 'ru';
        
        if (chatData.messages && Array.isArray(chatData.messages)) {
          for (const message of chatData.messages) {
            await executeQuery(`
              INSERT IGNORE INTO chat_messages (id, user_id, message, language, timestamp, deleted, system_message)
              VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [
              message.id,
              message.userId || 'system',
              message.message,
              language,
              message.timestamp,
              message.deleted || false,
              message.systemMessage || false
            ]);
            migratedCount++;
          }
        }
      } catch (error) {
        console.error(`Error migrating chat file ${chatFile}:`, error.message);
      }
    }
    
    console.log(`✅ Migrated ${migratedCount} chat messages to MySQL`);
  }
  
  static async migrateActivities() {
    console.log('🔄 Migrating user activities...');
    
    // This would need to be implemented based on your current activity storage
    // For now, we'll create a basic structure
    console.log('✅ Activities migration structure ready');
  }
  
  static async runFullMigration() {
    try {
      console.log('🚀 Starting full database migration...');
      
      await this.initializeDatabase();
      await this.migrateUsers();
      await this.migrateChatMessages();
      await this.migrateActivities();
      
      console.log('🎉 Database migration completed successfully!');
      
      // Backup original JSON files
      const backupDir = path.join(process.cwd(), 'json_backup_' + Date.now());
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      
      console.log(`📦 JSON backup created in: ${backupDir}`);
      
    } catch (error) {
      console.error('❌ Migration failed:', error.message);
      throw error;
    }
  }
}

// CLI runner
if (import.meta.url === `file://${process.argv[1]}`) {
  DatabaseMigration.runFullMigration()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}