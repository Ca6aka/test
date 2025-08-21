#!/usr/bin/env node

// Simple version for quick testing
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';
const CONCURRENT_USERS = 50;
const REQUESTS_PER_USER = 20;

async function testEndpoint(endpoint, method = 'GET', body = null) {
  const startTime = Date.now();
  
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : null
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    return {
      success: response.ok,
      status: response.status,
      responseTime,
      endpoint
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      responseTime: Date.now() - startTime,
      endpoint
    };
  }
}

async function simulateUser(userId) {
  const results = [];
  const endpoints = [
    '/api/stats/general',
    '/api/rankings', 
    '/api/auth/me',
    '/api/servers',
    '/api/chat/messages',
    '/api/quests'
  ];
  
  for (let i = 0; i < REQUESTS_PER_USER; i++) {
    const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
    const result = await testEndpoint(endpoint);
    results.push(result);
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
  }
  
  return results;
}

async function runStressTest() {
  console.log(`🚀 Starting simple stress test...`);
  console.log(`👥 Concurrent users: ${CONCURRENT_USERS}`);
  console.log(`📊 Requests per user: ${REQUESTS_PER_USER}`);
  console.log(`📡 Total requests: ${CONCURRENT_USERS * REQUESTS_PER_USER}`);
  console.log('');

  const startTime = Date.now();
  
  // Create promises for all users
  const userPromises = [];
  for (let i = 0; i < CONCURRENT_USERS; i++) {
    userPromises.push(simulateUser(i + 1));
  }
  
  // Wait for all users to complete
  console.log('⏳ Running test...');
  const allResults = await Promise.all(userPromises);
  
  // Flatten results
  const results = allResults.flat();
  const endTime = Date.now();
  const totalDuration = (endTime - startTime) / 1000;
  
  // Calculate statistics
  const totalRequests = results.length;
  const successfulRequests = results.filter(r => r.success).length;
  const failedRequests = totalRequests - successfulRequests;
  const averageResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / totalRequests;
  const requestsPerSecond = totalRequests / totalDuration;
  const successRate = (successfulRequests / totalRequests) * 100;
  
  // Response time percentiles
  const responseTimes = results.map(r => r.responseTime).sort((a, b) => a - b);
  const p50 = responseTimes[Math.floor(responseTimes.length * 0.5)];
  const p95 = responseTimes[Math.floor(responseTimes.length * 0.95)];
  const p99 = responseTimes[Math.floor(responseTimes.length * 0.99)];
  
  // Error breakdown
  const errors = {};
  results.filter(r => !r.success).forEach(r => {
    const key = r.error || `HTTP ${r.status}`;
    errors[key] = (errors[key] || 0) + 1;
  });
  
  // Print results
  console.log('\n' + '='.repeat(50));
  console.log('📋 STRESS TEST RESULTS');
  console.log('='.repeat(50));
  console.log(`⏱️  Test Duration: ${totalDuration.toFixed(2)} seconds`);
  console.log(`📡 Total Requests: ${totalRequests}`);
  console.log(`✅ Successful: ${successfulRequests} (${successRate.toFixed(2)}%)`);
  console.log(`❌ Failed: ${failedRequests}`);
  console.log(`⚡ Requests/second: ${requestsPerSecond.toFixed(2)}`);
  console.log(`📊 Average Response Time: ${averageResponseTime.toFixed(2)}ms`);
  console.log(`📈 Response Time Percentiles:`);
  console.log(`   50th: ${p50}ms`);
  console.log(`   95th: ${p95}ms`);
  console.log(`   99th: ${p99}ms`);
  
  if (Object.keys(errors).length > 0) {
    console.log(`🚨 Errors:`);
    Object.entries(errors).forEach(([error, count]) => {
      console.log(`   ${error}: ${count}`);
    });
  }
  
  // Performance rating
  console.log(`\n🎯 Performance Rating:`);
  if (successRate >= 99 && averageResponseTime <= 200) {
    console.log(`   🟢 EXCELLENT - Ready for production!`);
  } else if (successRate >= 95 && averageResponseTime <= 500) {
    console.log(`   🟡 GOOD - Minor optimizations needed`);
  } else if (successRate >= 90) {
    console.log(`   🟠 FAIR - Performance issues detected`);
  } else {
    console.log(`   🔴 POOR - Significant issues need attention`);
  }
  
  console.log('='.repeat(50));
}

runStressTest().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});