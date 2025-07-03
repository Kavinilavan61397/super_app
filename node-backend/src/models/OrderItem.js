const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false
  },
  product_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false
  },
  variation_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'price'
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  product_snapshot: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
    field: 'product_snapshot',
  },
  original_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    field: 'original_price'
  },
  discounted_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    field: 'discounted_price'
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at',
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'order_items',
  underscored: true
});

module.exports = OrderItem; 