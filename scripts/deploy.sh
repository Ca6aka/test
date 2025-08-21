#!/bin/bash

# Root Tycoon Production Deployment Script
# Usage: ./scripts/deploy.sh [production|staging]

set -e  # Exit on any error

ENVIRONMENT=${1:-production}
APP_NAME="root-tycoon"
DEPLOY_DIR="/var/www/root-tycoon"
BACKUP_DIR="/var/backups/root-tycoon"
LOG_DIR="/var/log/root-tycoon"

echo "🚀 Starting deployment for environment: $ENVIRONMENT"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root"
   exit 1
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    print_error "PM2 is not installed. Please install it first: npm install -g pm2"
    exit 1
fi

# Check if MySQL is running
if ! systemctl is-active --quiet mysql; then
    print_error "MySQL is not running. Please start MySQL service first."
    exit 1
fi

# Create necessary directories
print_status "Creating necessary directories..."
sudo mkdir -p $DEPLOY_DIR
sudo mkdir -p $BACKUP_DIR
sudo mkdir -p $LOG_DIR
sudo mkdir -p $LOG_DIR/logs

# Set proper permissions
sudo chown -R $USER:$USER $DEPLOY_DIR
sudo chown -R $USER:$USER $LOG_DIR

# Navigate to deployment directory
cd $DEPLOY_DIR

# Backup current version if exists
if [ -d "$DEPLOY_DIR/current" ]; then
    print_status "Backing up current version..."
    BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S)"
    mv current $BACKUP_NAME
    print_status "Current version backed up as $BACKUP_NAME"
fi

# Clone or pull latest code
if [ ! -d ".git" ]; then
    print_status "Cloning repository..."
    git clone https://github.com/your-username/root-tycoon.git current
else
    print_status "Pulling latest changes..."
    cd current
    git pull origin main
    cd ..
fi

cd current

# Install dependencies
print_status "Installing dependencies..."
npm ci --production

# Copy environment file
if [ ! -f ".env" ]; then
    print_warning "No .env file found. Creating from template..."
    cp .env.example .env
    print_warning "Please edit .env file with your configuration before continuing"
    nano .env
fi

# Run database migration
print_status "Running database migration..."
node database/migration.js

# Build frontend if needed
if [ -d "client" ]; then
    print_status "Building frontend..."
    cd client
    npm ci
    npm run build
    cd ..
fi

# Stop existing PM2 processes
print_status "Stopping existing PM2 processes..."
pm2 stop $APP_NAME || true
pm2 stop "${APP_NAME}-backup" || true

# Start PM2 processes
print_status "Starting PM2 processes..."
pm2 start ecosystem.config.js --env $ENVIRONMENT

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
sudo pm2 startup systemd -u $USER --hp $HOME

# Test deployment
print_status "Testing deployment..."
sleep 10

if pm2 list | grep -q "online"; then
    print_status "✅ Deployment successful!"
    
    # Display status
    pm2 status
    
    # Show logs
    print_status "Recent logs:"
    pm2 logs --lines 20
    
else
    print_error "❌ Deployment failed!"
    pm2 logs
    exit 1
fi

# Setup log rotation
print_status "Setting up log rotation..."
sudo tee /etc/logrotate.d/root-tycoon > /dev/null <<EOF
$LOG_DIR/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0644 $USER $USER
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

# Setup backup cron job
print_status "Setting up backup cron job..."
(crontab -l 2>/dev/null; echo "0 0 * * * cd $DEPLOY_DIR/current && node database/backup.js backup") | crontab -

# Setup monitoring alerts (optional)
if command -v curl &> /dev/null; then
    print_status "Setting up health check monitoring..."
    # Add your monitoring URL here
    # curl -X POST "your-monitoring-service.com/api/deployments" \
    #      -H "Content-Type: application/json" \
    #      -d '{"service":"root-tycoon","status":"deployed","environment":"'$ENVIRONMENT'"}'
fi

print_status "🎉 Deployment completed successfully!"
print_status "App is running on: http://localhost:5000"
print_status "PM2 Management:"
print_status "  - View status: pm2 status"
print_status "  - View logs: pm2 logs $APP_NAME"
print_status "  - Restart app: pm2 restart $APP_NAME"
print_status "  - Stop app: pm2 stop $APP_NAME"

print_warning "Don't forget to:"
print_warning "  1. Configure your reverse proxy (nginx/apache)"
print_warning "  2. Setup SSL certificates"
print_warning "  3. Configure firewall rules"
print_warning "  4. Set up monitoring and alerts"