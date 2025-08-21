import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import cron from 'node-cron';
import dotenv from 'dotenv';

dotenv.config();

export class DatabaseBackup {
  
  static getBackupConfig() {
    return {
      enabled: process.env.BACKUP_ENABLED === 'true',
      retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS) || 30,
      backupPath: process.env.BACKUP_PATH || '/var/backups/root_tycoon',
      dbConfig: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'root_tycoon'
      }
    };
  }
  
  static async createIncrementalBackup() {
    const config = this.getBackupConfig();
    
    if (!config.enabled) {
      console.log('Backup is disabled in configuration');
      return;
    }
    
    try {
      // Ensure backup directory exists
      if (!fs.existsSync(config.backupPath)) {
        fs.mkdirSync(config.backupPath, { recursive: true });
      }
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(config.backupPath, `backup_${timestamp}.sql`);
      const changelogFile = path.join(config.backupPath, `changelog_${timestamp}.sql`);
      
      console.log(`🔄 Creating incremental backup: ${backupFile}`);
      
      // Get last backup time
      const lastBackupTime = this.getLastBackupTime(config.backupPath);
      
      // Create mysqldump command for incremental backup
      const mysqldumpCmd = [
        'mysqldump',
        `--host=${config.dbConfig.host}`,
        `--port=${config.dbConfig.port}`,
        `--user=${config.dbConfig.user}`,
        config.dbConfig.password ? `--password=${config.dbConfig.password}` : '',
        '--single-transaction',
        '--routines',
        '--triggers',
        '--add-drop-table',
        '--extended-insert',
        '--quick',
        '--lock-tables=false',
        config.dbConfig.database
      ].filter(Boolean);
      
      // Add incremental backup condition if last backup exists
      if (lastBackupTime) {
        // For incremental backups, we'll include WHERE clauses for tables with timestamps
        const incrementalTables = [
          'users',
          'chat_messages', 
          'activities',
          'daily_quests',
          'payments',
          'reports'
        ];
        
        for (const table of incrementalTables) {
          mysqldumpCmd.push(`--where="updated_at >= '${lastBackupTime}' OR created_at >= '${lastBackupTime}'"`);
        }
      }
      
      // Execute backup
      const command = `${mysqldumpCmd.join(' ')} > ${backupFile}`;
      execSync(command, { stdio: 'inherit' });
      
      // Compress backup
      execSync(`gzip ${backupFile}`, { stdio: 'inherit' });
      console.log(`✅ Backup created and compressed: ${backupFile}.gz`);
      
      // Create changelog with recent changes
      await this.createChangelog(changelogFile, lastBackupTime);
      
      // Update backup timestamp
      this.updateLastBackupTime(config.backupPath);
      
      // Clean old backups
      this.cleanOldBackups(config.backupPath, config.retentionDays);
      
    } catch (error) {
      console.error('❌ Backup failed:', error.message);
      throw error;
    }
  }
  
  static getLastBackupTime(backupPath) {
    const timestampFile = path.join(backupPath, '.last_backup');
    
    if (fs.existsSync(timestampFile)) {
      return fs.readFileSync(timestampFile, 'utf8').trim();
    }
    
    return null;
  }
  
  static updateLastBackupTime(backupPath) {
    const timestampFile = path.join(backupPath, '.last_backup');
    const currentTime = new Date().toISOString();
    fs.writeFileSync(timestampFile, currentTime);
  }
  
  static async createChangelog(changelogFile, lastBackupTime) {
    if (!lastBackupTime) return;
    
    const config = this.getBackupConfig();
    
    try {
      const changelogQuery = `
-- Database Changelog - Changes since ${lastBackupTime}
-- Generated: ${new Date().toISOString()}

SELECT 
  'USERS' as table_name,
  COUNT(*) as changes_count
FROM users 
WHERE updated_at >= '${lastBackupTime}' OR created_at >= '${lastBackupTime}'

UNION ALL

SELECT 
  'CHAT_MESSAGES' as table_name,
  COUNT(*) as changes_count
FROM chat_messages 
WHERE created_at >= '${lastBackupTime}'

UNION ALL

SELECT 
  'ACTIVITIES' as table_name,
  COUNT(*) as changes_count
FROM activities 
WHERE created_at >= '${lastBackupTime}'

UNION ALL

SELECT 
  'PAYMENTS' as table_name,
  COUNT(*) as changes_count
FROM payments 
WHERE updated_at >= '${lastBackupTime}' OR created_at >= '${lastBackupTime}';
      `;
      
      fs.writeFileSync(changelogFile, changelogQuery);
      console.log(`📝 Changelog created: ${changelogFile}`);
      
    } catch (error) {
      console.error('Error creating changelog:', error.message);
    }
  }
  
  static cleanOldBackups(backupPath, retentionDays) {
    try {
      const files = fs.readdirSync(backupPath);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
      
      let deletedCount = 0;
      
      for (const file of files) {
        if (file.startsWith('backup_') || file.startsWith('changelog_')) {
          const filePath = path.join(backupPath, file);
          const stats = fs.statSync(filePath);
          
          if (stats.mtime < cutoffDate) {
            fs.unlinkSync(filePath);
            deletedCount++;
          }
        }
      }
      
      if (deletedCount > 0) {
        console.log(`🧹 Cleaned ${deletedCount} old backup files`);
      }
      
    } catch (error) {
      console.error('Error cleaning old backups:', error.message);
    }
  }
  
  static setupScheduledBackups() {
    const config = this.getBackupConfig();
    
    if (!config.enabled) {
      console.log('Scheduled backups are disabled');
      return;
    }
    
    // Schedule daily backup at 00:00 (midnight)
    cron.schedule('0 0 * * *', async () => {
      console.log('🕐 Starting scheduled backup at midnight...');
      try {
        await this.createIncrementalBackup();
        console.log('✅ Scheduled backup completed successfully');
      } catch (error) {
        console.error('❌ Scheduled backup failed:', error.message);
      }
    }, {
      timezone: 'Europe/Kiev'
    });
    
    console.log('⏰ Scheduled daily backups at 00:00 (Kiev time)');
  }
  
  static async restoreFromBackup(backupFilePath) {
    const config = this.getBackupConfig();
    
    try {
      console.log(`🔄 Restoring database from: ${backupFilePath}`);
      
      // Decompress if needed
      let sqlFile = backupFilePath;
      if (backupFilePath.endsWith('.gz')) {
        execSync(`gunzip -c ${backupFilePath} > ${backupFilePath.replace('.gz', '')}`, { stdio: 'inherit' });
        sqlFile = backupFilePath.replace('.gz', '');
      }
      
      // Restore database
      const restoreCmd = [
        'mysql',
        `--host=${config.dbConfig.host}`,
        `--port=${config.dbConfig.port}`,
        `--user=${config.dbConfig.user}`,
        config.dbConfig.password ? `--password=${config.dbConfig.password}` : '',
        config.dbConfig.database,
        `< ${sqlFile}`
      ].filter(Boolean).join(' ');
      
      execSync(restoreCmd, { stdio: 'inherit' });
      
      console.log('✅ Database restored successfully');
      
    } catch (error) {
      console.error('❌ Restore failed:', error.message);
      throw error;
    }
  }
}

// CLI runner
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  
  switch (command) {
    case 'backup':
      DatabaseBackup.createIncrementalBackup()
        .then(() => process.exit(0))
        .catch((error) => {
          console.error('Backup failed:', error);
          process.exit(1);
        });
      break;
      
    case 'restore':
      const backupFile = process.argv[3];
      if (!backupFile) {
        console.error('Please provide backup file path');
        process.exit(1);
      }
      DatabaseBackup.restoreFromBackup(backupFile)
        .then(() => process.exit(0))
        .catch((error) => {
          console.error('Restore failed:', error);
          process.exit(1);
        });
      break;
      
    case 'schedule':
      DatabaseBackup.setupScheduledBackups();
      console.log('Backup scheduler started. Press Ctrl+C to stop.');
      break;
      
    default:
      console.log('Usage: node backup.js [backup|restore <file>|schedule]');
      process.exit(1);
  }
}