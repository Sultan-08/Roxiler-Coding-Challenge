const mysql = require('mysql2/promise');
require('dotenv').config();

const sslEnabled = process.env.DB_SSL === 'true';

let poolConfig;

if (process.env.DATABASE_URL) {
  poolConfig = {
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    decimalNumbers: true,
    ...(sslEnabled ? { ssl: { rejectUnauthorized: false } } : {})
  };
} else {
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

const db = {
  pool,
  async query(sql, params) {
    const [result, fields] = await pool.query(sql, params);
    const res = [result, fields];

    Object.defineProperty(res, 'rows', {
      get() {
        return Array.isArray(result) ? result : [];
      },
      configurable: true
    });

    Object.defineProperty(res, 'insertId', {
      get() {
        return result && result.insertId !== undefined ? result.insertId : undefined;
      },
      configurable: true
    });

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
