#!/usr/bin/env node

// Database-focused stress test
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';
const CONCURRENT_OPERATIONS = 30;
const OPERATIONS_PER_THREAD = 25;

// Test data
const testUsers = Array.from({ length: 100 }, (_, i) => ({
  nickname: `StressUser${i}`,
  password: 'testpass123'
}));

const chatMessages = [
  'Hello from stress test!',
  'Testing database performance',
  'How is the server handling this?',
  'Stress test message #',
  'Database load test in progress',
  'Performance monitoring active'
];

async function makeRequest(endpoint, method = 'GET', body = null, cookies = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(cookies && { 'Cookie': cookies })
    }
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  return {
    ok: response.ok,
    status: response.status,
    data: response.ok ? await response.json() : null,
    cookies: response.headers.get('set-cookie'),
    responseTime: Date.now()
  };
}

async function testDatabaseOperations(threadId) {
  const results = {
    registers: 0,
    logins: 0,
    serverPurchases: 0,
    chatMessages: 0,
    queries: 0,
    errors: 0,
    totalTime: 0
  };

  const startTime = Date.now();
  let sessionCookies = null;

  for (let i = 0; i < OPERATIONS_PER_THREAD; i++) {
    try {
      const operationType = Math.random();
      
      if (operationType < 0.2) {
        // Register new user (20% - write operation)
        const user = testUsers[Math.floor(Math.random() * testUsers.length)];
        const response = await makeRequest('/api/auth/register', 'POST', {
          nickname: `${user.nickname}_${threadId}_${i}`,
          password: user.password
        });
        
        if (response.ok) {
          results.registers++;
        } else {
          results.errors++;
        }
        
      } else if (operationType < 0.4) {
        // Login user (20% - read + session)
        const user = testUsers[Math.floor(Math.random() * testUsers.length)];
        const response = await makeRequest('/api/auth/login', 'POST', {
          nickname: user.nickname,
          password: user.password
        });
        
        if (response.ok) {
          results.logins++;
          sessionCookies = response.cookies;
        } else {
          results.errors++;
        }
        
      } else if (operationType < 0.5 && sessionCookies) {
        // Buy server (10% - complex write operation)
        const serverTypes = ['basic', 'standard', 'premium'];
        const serverType = serverTypes[Math.floor(Math.random() * serverTypes.length)];
        
        const response = await makeRequest('/api/servers', 'POST', {
          serverType
        }, sessionCookies);
        
        if (response.ok) {
          results.serverPurchases++;
        } else {
          results.errors++;
        }
        
      } else if (operationType < 0.7 && sessionCookies) {
        // Send chat message (20% - write operation)
        const message = `${chatMessages[Math.floor(Math.random() * chatMessages.length)]} ${i}`;
        
        const response = await makeRequest('/api/chat/message', 'POST', {
          message,
          language: 'en'
        }, sessionCookies);
        
        if (response.ok) {
          results.chatMessages++;
        } else {
          results.errors++;
        }
        
      } else {
        // Query operations (30% - read operations)
        const queries = [
          '/api/rankings',
          '/api/chat/messages',
          '/api/servers',
          '/api/quests',
          '/api/stats/general'
        ];
        
        const query = queries[Math.floor(Math.random() * queries.length)];
        const response = await makeRequest(query, 'GET', null, sessionCookies);
        
        if (response.ok) {
          results.queries++;
        } else {
          results.errors++;
        }
      }
      
      // Small delay to simulate real user behavior
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
      
    } catch (error) {
      results.errors++;
      console.log(`Thread ${threadId} error:`, error.message);
    }
  }

  results.totalTime = Date.now() - startTime;
  return results;
}

async function runDatabaseStressTest() {
  console.log('🗄️  Starting Database Stress Test...');
  console.log(`🧵 Concurrent threads: ${CONCURRENT_OPERATIONS}`);
  console.log(`📊 Operations per thread: ${OPERATIONS_PER_THREAD}`);
  console.log(`💾 Total database operations: ${CONCURRENT_OPERATIONS * OPERATIONS_PER_THREAD}`);
  console.log('');

  const startTime = Date.now();
  
  // Create concurrent operations
  const operations = [];
  for (let i = 0; i < CONCURRENT_OPERATIONS; i++) {
    operations.push(testDatabaseOperations(i + 1));
  }
  
  console.log('⏳ Hammering the database...');
  const results = await Promise.all(operations);
  
  const endTime = Date.now();
  const totalDuration = (endTime - startTime) / 1000;
  
  // Aggregate results
  const totals = results.reduce((sum, result) => ({
    registers: sum.registers + result.registers,
    logins: sum.logins + result.logins,
    serverPurchases: sum.serverPurchases + result.serverPurchases,
    chatMessages: sum.chatMessages + result.chatMessages,
    queries: sum.queries + result.queries,
    errors: sum.errors + result.errors
  }), {
    registers: 0,
    logins: 0,
    serverPurchases: 0,
    chatMessages: 0,
    queries: 0,
    errors: 0
  });
  
  const totalOperations = Object.values(totals).reduce((a, b) => a + b, 0);
  const successfulOperations = totalOperations - totals.errors;
  const operationsPerSecond = totalOperations / totalDuration;
  const successRate = (successfulOperations / totalOperations) * 100;
  
  // Print results
  console.log('\n' + '='.repeat(60));
  console.log('🗄️  DATABASE STRESS TEST RESULTS');
  console.log('='.repeat(60));
  console.log(`⏱️  Duration: ${totalDuration.toFixed(2)} seconds`);
  console.log(`💾 Total Operations: ${totalOperations}`);
  console.log(`✅ Successful: ${successfulOperations} (${successRate.toFixed(2)}%)`);
  console.log(`❌ Failed: ${totals.errors}`);
  console.log(`⚡ Operations/second: ${operationsPerSecond.toFixed(2)}`);
  console.log('');
  console.log('📊 Operation Breakdown:');
  console.log(`   👤 User Registrations: ${totals.registers}`);
  console.log(`   🔐 User Logins: ${totals.logins}`);
  console.log(`   🖥️  Server Purchases: ${totals.serverPurchases}`);
  console.log(`   💬 Chat Messages: ${totals.chatMessages}`);
  console.log(`   📋 Database Queries: ${totals.queries}`);
  
  // Database performance assessment
  console.log(`\n🎯 Database Performance Assessment:`);
  if (successRate >= 99.5 && operationsPerSecond >= 50) {
    console.log(`   🟢 EXCELLENT: Database handles load perfectly`);
  } else if (successRate >= 95 && operationsPerSecond >= 30) {
    console.log(`   🟡 GOOD: Database performance is acceptable`);
  } else if (successRate >= 90) {
    console.log(`   🟠 FAIR: Database showing signs of stress`);
  } else {
    console.log(`   🔴 POOR: Database struggling under load`);
  }
  
  if (totals.errors > 0) {
    console.log(`\n⚠️  Recommendations:`);
    console.log(`   - Check database connection pool size`);
    console.log(`   - Monitor database CPU and memory usage`);
    console.log(`   - Consider query optimization`);
    console.log(`   - Review database indexes`);
  }
  
  console.log('='.repeat(60));
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Database stress test interrupted');
  process.exit(0);
});

runDatabaseStressTest().catch(error => {
  console.error('❌ Database stress test failed:', error);
  process.exit(1);
});