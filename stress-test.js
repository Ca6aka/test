#!/usr/bin/env node

import fetch from 'node-fetch';
import { performance } from 'perf_hooks';

// Configuration
const BASE_URL = 'http://localhost:5000';
const NUM_VIRTUAL_PLAYERS = 150;
const TEST_DURATION_MINUTES = 10;
const ACTIONS_PER_MINUTE = 5; // Each player performs 5 actions per minute

// Player actions weights (probability)
const ACTIONS = [
  { name: 'login', weight: 10, endpoint: '/api/auth/login', method: 'POST' },
  { name: 'getServers', weight: 20, endpoint: '/api/servers', method: 'GET' },
  { name: 'buyServer', weight: 8, endpoint: '/api/servers', method: 'POST' },
  { name: 'sendChatMessage', weight: 15, endpoint: '/api/chat/message', method: 'POST' },
  { name: 'getChatMessages', weight: 25, endpoint: '/api/chat/messages', method: 'GET' },
  { name: 'claimDailyBonus', weight: 5, endpoint: '/api/daily-bonus/claim', method: 'POST' },
  { name: 'getRankings', weight: 10, endpoint: '/api/rankings', method: 'GET' },
  { name: 'getQuests', weight: 7, endpoint: '/api/quests', method: 'GET' }
];

// Statistics tracking
const stats = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  averageResponseTime: 0,
  responseTimes: [],
  errors: {},
  playersOnline: 0,
  serversCreated: 0,
  messagessSent: 0
};

// Virtual player class
class VirtualPlayer {
  constructor(id) {
    this.id = id;
    this.nickname = `TestPlayer${id}`;
    this.sessionCookie = null;
    this.isActive = true;
    this.balance = Math.floor(Math.random() * 50000) + 10000;
    this.level = Math.floor(Math.random() * 20) + 1;
    this.servers = [];
    this.lastAction = Date.now();
  }

  async makeRequest(endpoint, method = 'GET', body = null) {
    const startTime = performance.now();
    
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': `StressTest-Player-${this.id}`,
          ...(this.sessionCookie && { 'Cookie': this.sessionCookie })
        }
      };

      if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${BASE_URL}${endpoint}`, options);
      const endTime = performance.now();
      const responseTime = endTime - startTime;

      // Store session cookie from login
      if (endpoint.includes('/auth/login') && response.headers.get('set-cookie')) {
        this.sessionCookie = response.headers.get('set-cookie');
      }

      stats.totalRequests++;
      stats.responseTimes.push(responseTime);

      if (response.ok) {
        stats.successfulRequests++;
        return await response.json();
      } else {
        stats.failedRequests++;
        const error = `${response.status}: ${response.statusText}`;
        stats.errors[error] = (stats.errors[error] || 0) + 1;
        console.log(`❌ Player ${this.id} - ${method} ${endpoint}: ${error}`);
        return null;
      }
    } catch (error) {
      const endTime = performance.now();
      stats.totalRequests++;
      stats.failedRequests++;
      stats.responseTimes.push(endTime - startTime);
      
      const errorKey = error.message || 'Unknown error';
      stats.errors[errorKey] = (stats.errors[errorKey] || 0) + 1;
      console.log(`❌ Player ${this.id} - ${method} ${endpoint}: ${errorKey}`);
      return null;
    }
  }

  async register() {
    return await this.makeRequest('/api/auth/register', 'POST', {
      nickname: this.nickname,
      password: 'testpass123'
    });
  }

  async login() {
    return await this.makeRequest('/api/auth/login', 'POST', {
      nickname: this.nickname,
      password: 'testpass123'
    });
  }

  async performRandomAction() {
    // Select random action based on weights
    const totalWeight = ACTIONS.reduce((sum, action) => sum + action.weight, 0);
    let random = Math.random() * totalWeight;
    
    let selectedAction = ACTIONS[0];
    for (const action of ACTIONS) {
      random -= action.weight;
      if (random <= 0) {
        selectedAction = action;
        break;
      }
    }

    await this.executeAction(selectedAction);
  }

  async executeAction(action) {
    let body = null;

    switch (action.name) {
      case 'login':
        body = { nickname: this.nickname, password: 'testpass123' };
        break;
        
      case 'buyServer':
        if (Math.random() < 0.3) { // 30% chance to buy server
          const serverTypes = ['basic', 'standard', 'premium'];
          const serverType = serverTypes[Math.floor(Math.random() * serverTypes.length)];
          body = { serverType };
          const result = await this.makeRequest(action.endpoint, action.method, body);
          if (result) {
            stats.serversCreated++;
            this.servers.push(result);
          }
        }
        return;
        
      case 'sendChatMessage':
        const messages = [
          'Hello everyone!',
          'How is everyone doing?',
          'This server is awesome!',
          'Anyone want to team up?',
          'Great game!',
          'Testing the chat system',
          '🚀 To the moon!',
          'Good luck everyone!'
        ];
        body = { 
          message: messages[Math.floor(Math.random() * messages.length)],
          language: 'en'
        };
        const result = await this.makeRequest(action.endpoint, action.method, body);
        if (result) {
          stats.messagessSent++;
        }
        return;
    }

    await this.makeRequest(action.endpoint, action.method, body);
  }

  async startActivity() {
    console.log(`🎮 Player ${this.nickname} joining the game...`);
    
    // Register and login
    await this.register();
    await this.login();
    
    if (this.sessionCookie) {
      stats.playersOnline++;
      console.log(`✅ Player ${this.nickname} successfully logged in`);
    }

    // Start performing actions
    this.actionInterval = setInterval(async () => {
      if (this.isActive) {
        await this.performRandomAction();
        this.lastAction = Date.now();
      }
    }, (60 / ACTIONS_PER_MINUTE) * 1000); // Convert actions per minute to millisecond interval
  }

  stop() {
    this.isActive = false;
    if (this.actionInterval) {
      clearInterval(this.actionInterval);
    }
    stats.playersOnline = Math.max(0, stats.playersOnline - 1);
  }
}

// Stress test controller
class StressTest {
  constructor() {
    this.players = [];
    this.isRunning = false;
    this.startTime = null;
  }

  async start() {
    console.log('🚀 Starting stress test...');
    console.log(`📊 Configuration:`);
    console.log(`   - Virtual players: ${NUM_VIRTUAL_PLAYERS}`);
    console.log(`   - Test duration: ${TEST_DURATION_MINUTES} minutes`);
    console.log(`   - Actions per player per minute: ${ACTIONS_PER_MINUTE}`);
    console.log(`   - Expected total requests: ~${NUM_VIRTUAL_PLAYERS * ACTIONS_PER_MINUTE * TEST_DURATION_MINUTES}`);
    console.log('');

    this.isRunning = true;
    this.startTime = Date.now();

    // Create and start players in batches to avoid overwhelming the server
    const batchSize = 10;
    for (let i = 0; i < NUM_VIRTUAL_PLAYERS; i += batchSize) {
      const batchPromises = [];
      
      for (let j = i; j < Math.min(i + batchSize, NUM_VIRTUAL_PLAYERS); j++) {
        const player = new VirtualPlayer(j + 1);
        this.players.push(player);
        batchPromises.push(player.startActivity());
      }

      await Promise.all(batchPromises);
      
      // Small delay between batches
      if (i + batchSize < NUM_VIRTUAL_PLAYERS) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      console.log(`📈 Created ${Math.min(i + batchSize, NUM_VIRTUAL_PLAYERS)} players...`);
    }

    // Start statistics reporting
    this.startStatsReporting();

    // Schedule test end
    setTimeout(() => {
      this.stop();
    }, TEST_DURATION_MINUTES * 60 * 1000);

    console.log(`\n🎯 Stress test running! Check the logs for real-time statistics...`);
  }

  startStatsReporting() {
    this.statsInterval = setInterval(() => {
      const runtime = Math.floor((Date.now() - this.startTime) / 1000);
      const avgResponseTime = stats.responseTimes.length > 0 
        ? (stats.responseTimes.reduce((a, b) => a + b, 0) / stats.responseTimes.length).toFixed(2)
        : 0;

      const successRate = stats.totalRequests > 0 
        ? ((stats.successfulRequests / stats.totalRequests) * 100).toFixed(2)
        : 0;

      console.log(`\n📊 Live Stats (${runtime}s elapsed):`);
      console.log(`   👥 Players online: ${stats.playersOnline}`);
      console.log(`   📡 Total requests: ${stats.totalRequests}`);
      console.log(`   ✅ Successful: ${stats.successfulRequests} (${successRate}%)`);
      console.log(`   ❌ Failed: ${stats.failedRequests}`);
      console.log(`   ⏱️  Avg response time: ${avgResponseTime}ms`);
      console.log(`   🖥️  Servers created: ${stats.serversCreated}`);
      console.log(`   💬 Messages sent: ${stats.messagessSent}`);

      if (Object.keys(stats.errors).length > 0) {
        console.log(`   🚨 Top errors:`);
        const sortedErrors = Object.entries(stats.errors)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3);
        
        sortedErrors.forEach(([error, count]) => {
          console.log(`      - ${error}: ${count} times`);
        });
      }
    }, 10000); // Report every 10 seconds
  }

  stop() {
    if (!this.isRunning) return;

    console.log('\n🛑 Stopping stress test...');
    this.isRunning = false;

    // Stop all players
    this.players.forEach(player => player.stop());
    
    // Clear intervals
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
    }

    // Generate final report
    this.generateFinalReport();
  }

  generateFinalReport() {
    const totalDuration = (Date.now() - this.startTime) / 1000;
    const avgResponseTime = stats.responseTimes.length > 0 
      ? (stats.responseTimes.reduce((a, b) => a + b, 0) / stats.responseTimes.length)
      : 0;

    const successRate = stats.totalRequests > 0 
      ? (stats.successfulRequests / stats.totalRequests) * 100
      : 0;

    const requestsPerSecond = stats.totalRequests / totalDuration;

    console.log('\n' + '='.repeat(60));
    console.log('📋 FINAL STRESS TEST REPORT');
    console.log('='.repeat(60));
    console.log(`🕒 Test Duration: ${totalDuration.toFixed(2)} seconds`);
    console.log(`👥 Virtual Players: ${NUM_VIRTUAL_PLAYERS}`);
    console.log(`📡 Total Requests: ${stats.totalRequests}`);
    console.log(`✅ Successful Requests: ${stats.successfulRequests} (${successRate.toFixed(2)}%)`);
    console.log(`❌ Failed Requests: ${stats.failedRequests}`);
    console.log(`⚡ Requests/second: ${requestsPerSecond.toFixed(2)}`);
    console.log(`⏱️  Average Response Time: ${avgResponseTime.toFixed(2)}ms`);
    console.log(`🖥️  Servers Created: ${stats.serversCreated}`);
    console.log(`💬 Chat Messages Sent: ${stats.messagessSent}`);

    if (stats.responseTimes.length > 0) {
      const sortedTimes = [...stats.responseTimes].sort((a, b) => a - b);
      const p95 = sortedTimes[Math.floor(sortedTimes.length * 0.95)];
      const p99 = sortedTimes[Math.floor(sortedTimes.length * 0.99)];
      const maxTime = Math.max(...sortedTimes);
      
      console.log(`📈 Response Time Percentiles:`);
      console.log(`   95th percentile: ${p95.toFixed(2)}ms`);
      console.log(`   99th percentile: ${p99.toFixed(2)}ms`);
      console.log(`   Max response time: ${maxTime.toFixed(2)}ms`);
    }

    if (Object.keys(stats.errors).length > 0) {
      console.log(`\n🚨 Error Summary:`);
      const sortedErrors = Object.entries(stats.errors)
        .sort(([,a], [,b]) => b - a);
      
      sortedErrors.forEach(([error, count]) => {
        console.log(`   ${error}: ${count} times`);
      });
    }

    // Performance assessment
    console.log(`\n🎯 Performance Assessment:`);
    if (successRate >= 99.5) {
      console.log(`   🟢 EXCELLENT: ${successRate.toFixed(2)}% success rate`);
    } else if (successRate >= 95) {
      console.log(`   🟡 GOOD: ${successRate.toFixed(2)}% success rate`);
    } else if (successRate >= 90) {
      console.log(`   🟠 FAIR: ${successRate.toFixed(2)}% success rate`);
    } else {
      console.log(`   🔴 POOR: ${successRate.toFixed(2)}% success rate`);
    }

    if (avgResponseTime <= 100) {
      console.log(`   🟢 FAST: ${avgResponseTime.toFixed(2)}ms average response`);
    } else if (avgResponseTime <= 500) {
      console.log(`   🟡 ACCEPTABLE: ${avgResponseTime.toFixed(2)}ms average response`);
    } else if (avgResponseTime <= 1000) {
      console.log(`   🟠 SLOW: ${avgResponseTime.toFixed(2)}ms average response`);
    } else {
      console.log(`   🔴 VERY SLOW: ${avgResponseTime.toFixed(2)}ms average response`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Stress test completed successfully!');
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, stopping stress test...');
  if (stressTest) {
    stressTest.stop();
  }
  process.exit(0);
});

// Start the stress test
const stressTest = new StressTest();
stressTest.start().catch(error => {
  console.error('❌ Stress test failed:', error);
  process.exit(1);
});