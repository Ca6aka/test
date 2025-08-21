-- Root Tycoon Database Schema
-- MySQL 8.0+ compatible

CREATE DATABASE IF NOT EXISTS root_tycoon CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE root_tycoon;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  nickname VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  balance DECIMAL(15,2) DEFAULT 0.00,
  level INT DEFAULT 1,
  experience INT DEFAULT 0,
  admin TINYINT DEFAULT 0,
  tutorial_completed BOOLEAN DEFAULT FALSE,
  chat_language VARCHAR(5) DEFAULT 'ru',
  chat_warnings INT DEFAULT 0,
  muted BOOLEAN DEFAULT FALSE,
  mute_expires BIGINT DEFAULT NULL,
  vip_status VARCHAR(20) DEFAULT 'none',
  vip_expires_at DATETIME NULL,
  premium_status VARCHAR(20) DEFAULT 'none',
  premium_activated_at DATETIME NULL,
  registration_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
  real_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
  daily_bonus_streak INT DEFAULT 0,
  last_daily_bonus DATE NULL,
  ip_address VARCHAR(45),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_nickname (nickname),
  INDEX idx_email (email),
  INDEX idx_admin (admin),
  INDEX idx_last_activity (last_activity)
);

-- Servers table
CREATE TABLE IF NOT EXISTS servers (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'offline',
  monthly_cost DECIMAL(10,2) NOT NULL,
  monthly_income DECIMAL(10,2) NOT NULL,
  purchased_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_income_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_type (type)
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  message TEXT NOT NULL,
  language VARCHAR(5) DEFAULT 'ru',
  timestamp BIGINT NOT NULL,
  deleted BOOLEAN DEFAULT FALSE,
  system_message BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_language (language),
  INDEX idx_timestamp (timestamp),
  INDEX idx_deleted (deleted)
);

-- Daily quests table
CREATE TABLE IF NOT EXISTS daily_quests (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  reward DECIMAL(10,2) NOT NULL,
  target_value INT NOT NULL,
  current_progress INT DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  claimed BOOLEAN DEFAULT FALSE,
  quest_date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_quest_date (quest_date),
  INDEX idx_completed (completed),
  INDEX idx_claimed (claimed)
);

-- Activities/logs table
CREATE TABLE IF NOT EXISTS activities (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  description TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_timestamp (timestamp)
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id VARCHAR(36) PRIMARY KEY,
  reporter_id VARCHAR(36) NOT NULL,
  reported_user_id VARCHAR(36) NOT NULL,
  reason VARCHAR(100) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  resolved_by VARCHAR(36) NULL,
  resolved_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reported_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_reporter_id (reporter_id),
  INDEX idx_reported_user_id (reported_user_id),
  INDEX idx_status (status)
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  order_id VARCHAR(100) NOT NULL UNIQUE,
  type VARCHAR(20) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  gateway VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  payment_url TEXT NULL,
  invoice_id VARCHAR(100) NULL,
  processed_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_order_id (order_id),
  INDEX idx_status (status),
  INDEX idx_type (type)
);

-- Job cooldowns table
CREATE TABLE IF NOT EXISTS job_cooldowns (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  job_type VARCHAR(50) NOT NULL,
  expires_at BIGINT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_job (user_id, job_type),
  INDEX idx_user_id (user_id),
  INDEX idx_job_type (job_type),
  INDEX idx_expires_at (expires_at)
);

-- Learning courses table
CREATE TABLE IF NOT EXISTS learning_courses (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  course_name VARCHAR(100) NOT NULL,
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME NULL,
  progress INT DEFAULT 0,
  duration_hours INT NOT NULL,
  cost DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_course_name (course_name),
  INDEX idx_completed_at (completed_at)
);

-- System settings table
CREATE TABLE IF NOT EXISTS system_settings (
  setting_key VARCHAR(100) PRIMARY KEY,
  setting_value TEXT NOT NULL,
  description TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('maintenance_mode', 'false', 'Enable/disable maintenance mode'),
('daily_bonus_base', '100', 'Base daily bonus amount'),
('max_servers_per_user', '25', 'Maximum servers per user'),
('chat_message_limit', '5', 'Messages per minute limit'),
('registration_enabled', 'true', 'Allow new user registrations')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);