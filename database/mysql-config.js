import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Connection pool configuration
const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'root_tycoon',
  connectionLimit: 1000,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  multipleStatements: true,
  charset: 'utf8mb4'
};

// Create connection pool
const pool = mysql.createPool(poolConfig);

// Test connection function
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL connection established successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    return false;
  }
}

// Execute query with error handling
export async function executeQuery(query, params = []) {
  try {
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error('Query execution error:', error.message);
    console.error('Query:', query);
    console.error('Params:', params);
    throw error;
  }
}

// Execute transaction
export async function executeTransaction(queries) {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  
  try {
    const results = [];
    for (const { query, params } of queries) {
      const [result] = await connection.execute(query, params);
      results.push(result);
    }
    
    await connection.commit();
    connection.release();
    return results;
  } catch (error) {
    await connection.rollback();
    connection.release();
    throw error;
  }
}

// Get pool stats
export function getPoolStats() {
  return {
    totalConnections: pool.pool._allConnections.length,
    freeConnections: pool.pool._freeConnections.length,
    acquiringConnections: pool.pool._acquiringConnections.length
  };
}

export default pool;