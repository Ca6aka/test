// PM2 Ecosystem Configuration for Root Tycoon
module.exports = {
  apps: [
    {
      name: 'root-tycoon',
      script: 'server/index.js',
      instances: process.env.PM2_INSTANCES || 'max', // Use all CPU cores
      exec_mode: 'cluster',
      
      // Environment variables
      env: {
        NODE_ENV: 'development',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      
      // Resource limits
      max_memory_restart: process.env.PM2_MAX_MEMORY_RESTART || '1G',
      min_uptime: '10s',
      max_restarts: 10,
      
      // Logging
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Auto restart on file changes (disable in production)
      watch: false,
      ignore_watch: [
        'node_modules',
        'logs',
        'data',
        'users',
        '.git',
        '*.log'
      ],
      
      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 8000,
      
      // Health monitoring
      health_check_grace_period: 3000,
      
      // Advanced settings
      instance_var: 'INSTANCE_ID',
      
      // Node.js specific
      node_args: '--max-old-space-size=2048',
      
      // Cron restart (optional - restart daily at 4 AM)
      cron_restart: '0 4 * * *',
      
      // Source map support
      source_map_support: false,
      
      // Disable automatic restart
      autorestart: true,
      
      // Additional metadata
      vizion: false
    },
    
    // Backup service (runs separately)
    {
      name: 'root-tycoon-backup',
      script: 'database/backup.js',
      args: 'schedule',
      instances: 1,
      exec_mode: 'fork',
      
      env: {
        NODE_ENV: 'production'
      },
      
      // Resource limits for backup service
      max_memory_restart: '512M',
      
      // Logging
      log_file: './logs/backup.log',
      out_file: './logs/backup-out.log',
      error_file: './logs/backup-error.log',
      
      // Auto restart settings
      autorestart: true,
      max_restarts: 5,
      min_uptime: '30s',
      
      // Disable file watching for backup service
      watch: false
    }
  ],
  
  // Deployment configuration
  deploy: {
    production: {
      user: 'deploy',
      host: ['your-server.com'],
      ref: 'origin/main',
      repo: 'git@github.com:your-username/root-tycoon.git',
      path: '/var/www/root-tycoon',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      'post-setup': 'npm install && npm run build'
    }
  }
};