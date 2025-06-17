const { Sequelize } = require('sequelize');
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    database: process.env.DB_NAME || 'superapp_db',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: console.log,
    define: {
      timestamps: true,
      underscored: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  production: {
    database: process.env.DB_NAME || 'yrpitsolutions_ecom',
    username: process.env.DB_USER || 'yrpitsolutions_ecom',
    password: process.env.DB_PASS || '',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};

const dbConfig = config[env];
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    define: dbConfig.define,
    pool: dbConfig.pool
  }
);

// Test the connection and sync models
const initializeDatabase = async () => {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync models without dropping tables
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    if (error.original) {
      console.error('Original error:', error.original);
    }
    if (error.parent) {
      console.error('Parent error:', error.parent);
    }
    process.exit(1);
  }
};

module.exports = sequelize;
module.exports.initializeDatabase = initializeDatabase;