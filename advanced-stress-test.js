#!/usr/bin/env node

import fetch from 'node-fetch';
import { performance } from 'perf_hooks';

const BASE_URL = 'http://localhost:5000';
const NUM_PLAYERS = 100;
const TEST_DURATION = 120; // 2 minutes
const ACTIONS_PER_PLAYER = 30;

// Test statistics
const stats = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  responseTimes: [],
  playersCreated: 0,
  playersLoggedIn: 0,
  serversCreated: 0,
  messagesSent: 0,
  errors: {}
};

class TestPlayer {
  constructor(id) {
    this.id = id;
    this.nickname = `TestPlayer${id}_${Date.now()}`;
    this.password = 'testpass123';
    this.cookies = null;
    this.balance = 0;
  }

  async makeRequest(endpoint, method = 'GET', body = null) {
    const startTime = performance.now();
    
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(this.cookies && { 'Cookie': this.cookies })
        }
      };

      if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${BASE_URL}${endpoint}`, options);
      const responseTime = performance.now() - startTime;
      
      stats.totalRequests++;
      stats.responseTimes.push(responseTime);

      // Store cookies from login
      if (endpoint.includes('/auth/') && response.headers.get('set-cookie')) {
        this.cookies = response.headers.get('set-cookie');
      }

      if (response.ok) {
        stats.successfulRequests++;
        return await response.json().catch(() => null);
      } else {
        stats.failedRequests++;
        const error = `${response.status} ${response.statusText}`;
        stats.errors[error] = (stats.errors[error] || 0) + 1;
        return null;
      }
    } catch (error) {
      stats.totalRequests++;
      stats.failedRequests++;
      stats.responseTimes.push(performance.now() - startTime);
      
      const errorKey = error.code || error.message || 'Unknown error';
      stats.errors[errorKey] = (stats.errors[errorKey] || 0) + 1;
      return null;
    }
  }

  async register() {
    const result = await this.makeRequest('/api/auth/register', 'POST', {
      nickname: this.nickname,
      password: this.password
    });
    
    if (result) {
      stats.playersCreated++;
      console.log(`✅ Player ${this.nickname} registered`);
    }
    return result;
  }

  async login() {
    const result = await this.makeRequest('/api/auth/login', 'POST', {
      nickname: this.nickname,
      password: this.password
    });
    
    if (result) {
      stats.playersLoggedIn++;
      console.log(`🔐 Player ${this.nickname} logged in`);
      this.balance = result.user?.balance || 50000; // Default balance
    }
    return result;
  }

  async performRandomActions() {
    const actions = [
      this.getServers.bind(this),
      this.getChatMessages.bind(this),
      this.getRankings.bind(this),
      this.getQuests.bind(this),
      this.buyServer.bind(this),
      this.sendChatMessage.bind(this)
    ];

    for (let i = 0; i < ACTIONS_PER_PLAYER; i++) {
      const action = actions[Math.floor(Math.random() * actions.length)];
      await action();
      
      // Random delay between actions
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 300));
    }
  }

  async getServers() {
    await this.makeRequest('/api/servers');
  }

  async getChatMessages() {
    await this.makeRequest('/api/chat/messages');
  }

  async getRankings() {
    await this.makeRequest('/api/rankings');
  }

  async getQuests() {
    await this.makeRequest('/api/quests');
  }

  async buyServer() {
    if (Math.random() < 0.3 && this.balance >= 1000) { // 30% chance to buy server
      const serverTypes = ['basic', 'standard', 'premium'];
      const serverType = serverTypes[Math.floor(Math.random() * serverTypes.length)];
      
      const result = await this.makeRequest('/api/servers', 'POST', { serverType });
      if (result) {
        stats.serversCreated++;
        console.log(`🖥️  Player ${this.nickname} bought ${serverType} server`);
      }
    }
  }

  async sendChatMessage() {
    if (Math.random() < 0.4) { // 40% chance to send message
      const messages = [
        'Hello everyone!',
        'Great game!',
        'Anyone online?',
        'Testing the server',
        'How is everyone doing?',
        'Love this game!',
        'Server running smooth'
      ];
      
      const message = messages[Math.floor(Math.random() * messages.length)];
      const result = await this.makeRequest('/api/chat/message', 'POST', {
        message,
        language: 'en'
      });
      
      if (result) {
        stats.messagesSent++;
        console.log(`💬 Player ${this.nickname}: ${message}`);
      }
    }
  }
}

async function runAdvancedStressTest() {
  console.log('🚀 Advanced Stress Test Starting...');
  console.log(`👥 Virtual Players: ${NUM_PLAYERS}`);
  console.log(`⏱️  Test Duration: ${TEST_DURATION} seconds`);
  console.log(`🎯 Actions per player: ${ACTIONS_PER_PLAYER}`);
  console.log(`📡 Expected requests: ~${NUM_PLAYERS * (ACTIONS_PER_PLAYER + 2)}`); // +2 for register/login
  console.log('');

  const startTime = Date.now();

  // Create players and register them
  console.log('📝 Creating and registering players...');
  const players = [];
  const registrationPromises = [];

  for (let i = 1; i <= NUM_PLAYERS; i++) {
    const player = new TestPlayer(i);
    players.push(player);
    
    // Stagger registrations to avoid overwhelming the server
    registrationPromises.push(
      new Promise(resolve => {
        setTimeout(async () => {
          await player.register();
          await player.login();
          resolve();
        }, i * 50); // 50ms delay between each player
      })
    );
  }

  await Promise.all(registrationPromises);

  console.log(`\n✅ ${stats.playersCreated} players registered, ${stats.playersLoggedIn} logged in`);
  console.log('🎮 Starting gameplay simulation...\n');

  // Start performance actions
  const actionPromises = players.map(player => player.performRandomActions());
  
  // Start statistics reporting
  const statsInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const avgResponseTime = stats.responseTimes.length > 0 
      ? (stats.responseTimes.reduce((a, b) => a + b, 0) / stats.responseTimes.length).toFixed(2)
      : 0;
    const successRate = stats.totalRequests > 0 
      ? ((stats.successfulRequests / stats.totalRequests) * 100).toFixed(2)
      : 0;

    console.log(`📊 Live Stats (${elapsed}s): ${stats.totalRequests} requests, ${successRate}% success, ${avgResponseTime}ms avg, ${stats.serversCreated} servers, ${stats.messagesSent} messages`);
  }, 5000);

  // Wait for all actions to complete
  await Promise.all(actionPromises);
  clearInterval(statsInterval);

  // Generate final report
  const totalDuration = (Date.now() - startTime) / 1000;
  const avgResponseTime = stats.responseTimes.length > 0 
    ? (stats.responseTimes.reduce((a, b) => a + b, 0) / stats.responseTimes.length)
    : 0;
  const successRate = stats.totalRequests > 0 
    ? (stats.successfulRequests / stats.totalRequests) * 100
    : 0;
  const requestsPerSecond = stats.totalRequests / totalDuration;

  console.log('\n' + '='.repeat(70));
  console.log('🏁 ADVANCED STRESS TEST COMPLETED');
  console.log('='.repeat(70));
  console.log(`⏱️  Duration: ${totalDuration.toFixed(2)} seconds`);
  console.log(`👥 Players Created: ${stats.playersCreated}/${NUM_PLAYERS}`);
  console.log(`🔐 Players Logged In: ${stats.playersLoggedIn}`);
  console.log(`📡 Total Requests: ${stats.totalRequests}`);
  console.log(`✅ Successful: ${stats.successfulRequests} (${successRate.toFixed(2)}%)`);
  console.log(`❌ Failed: ${stats.failedRequests}`);
  console.log(`⚡ Requests/second: ${requestsPerSecond.toFixed(2)}`);
  console.log(`📊 Avg Response Time: ${avgResponseTime.toFixed(2)}ms`);
  console.log(`🖥️  Servers Created: ${stats.serversCreated}`);
  console.log(`💬 Messages Sent: ${stats.messagesSent}`);

  // Response time percentiles
  if (stats.responseTimes.length > 0) {
    const sortedTimes = [...stats.responseTimes].sort((a, b) => a - b);
    const p50 = sortedTimes[Math.floor(sortedTimes.length * 0.5)];
    const p95 = sortedTimes[Math.floor(sortedTimes.length * 0.95)];
    const p99 = sortedTimes[Math.floor(sortedTimes.length * 0.99)];
    
    console.log(`📈 Response Time Percentiles:`);
    console.log(`   50th: ${p50.toFixed(2)}ms`);
    console.log(`   95th: ${p95.toFixed(2)}ms`);
    console.log(`   99th: ${p99.toFixed(2)}ms`);
  }

  // Error summary
  if (Object.keys(stats.errors).length > 0) {
    console.log(`\n🚨 Error Summary:`);
    const sortedErrors = Object.entries(stats.errors)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
    
    sortedErrors.forEach(([error, count]) => {
      console.log(`   ${error}: ${count} times`);
    });
  }

  // Performance assessment
  console.log(`\n🎯 Overall Assessment:`);
  let score = 0;
  
  if (successRate >= 99) score += 3;
  else if (successRate >= 95) score += 2;
  else if (successRate >= 90) score += 1;
  
  if (avgResponseTime <= 100) score += 3;
  else if (avgResponseTime <= 300) score += 2;
  else if (avgResponseTime <= 600) score += 1;
  
  if (requestsPerSecond >= 100) score += 2;
  else if (requestsPerSecond >= 50) score += 1;

  if (score >= 7) {
    console.log(`   🟢 EXCELLENT (${score}/8): Production ready!`);
  } else if (score >= 5) {
    console.log(`   🟡 GOOD (${score}/8): Minor optimizations needed`);
  } else if (score >= 3) {
    console.log(`   🟠 FAIR (${score}/8): Performance issues detected`);
  } else {
    console.log(`   🔴 POOR (${score}/8): Needs significant improvements`);
  }

  console.log('='.repeat(70));
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Test interrupted by user');
  process.exit(0);
});

runAdvancedStressTest().catch(error => {
  console.error('❌ Advanced stress test failed:', error);
  process.exit(1);
});