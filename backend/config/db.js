const mysql = require('mysql2/promise');
require('dotenv').config();

// Determine SSL requirement:
// Set DB_SSL=true in .env if your MySQL provider requires SSL (e.g. PlanetScale, AWS RDS, Aiven, Azure).
// For local MySQL (or when DB_SSL is false), SSL is disabled.
const sslEnabled = process.env.DB_SSL === 'true';

let poolConfig;

if (process.env.DATABASE_URL) {
  // Support mysql://user:password@host:port/database connection strings
  poolConfig = {
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    decimalNumbers: true,
    ...(sslEnabled ? { ssl: { rejectUnauthorized: false } } : {})
  };
} else {
  // Individual MySQL parameters
  poolConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: Number(process.env.DB_PORT),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    decimalNumbers: true,
    ...(sslEnabled ? { ssl: { rejectUnauthorized: false } } : {})
  };
}

const pool = mysql.createPool(poolConfig);

// Helper wrapper providing dual support for:
// 1) const [rows] = await db.query(sql, params);  (Idiomatic MySQL)
// 2) const res = await db.query(sql, params); res.rows  (Convenience property)
const db = {
  pool,
  async query(sql, params) {
    const [result, fields] = await pool.query(sql, params);
    const res = [result, fields];

    // Expose .rows on the array for queries returning records
    Object.defineProperty(res, 'rows', {
      get() {
        return Array.isArray(result) ? result : [];
      },
      configurable: true
    });

    // Expose .insertId for INSERT statements
    Object.defineProperty(res, 'insertId', {
      get() {
        return result && result.insertId !== undefined ? result.insertId : undefined;
      },
      configurable: true
    });

    // Expose .affectedRows for UPDATE/DELETE statements
    Object.defineProperty(res, 'affectedRows', {
      get() {
        return result && result.affectedRows !== undefined ? result.affectedRows : undefined;
      },
      configurable: true
    });

    return res;
  },
  async execute(sql, params) {
    return this.query(sql, params);
  }
};

module.exports = db;
