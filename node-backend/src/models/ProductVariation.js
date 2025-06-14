const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./product');

const ProductVariation = sequelize.define('ProductVariation', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  product_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  sale_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  attributes: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'product_variations',
  timestamps: true,
  indexes: [
    {
      fields: ['product_id']
    }
  ]
});

module.exports = ProductVariation; 