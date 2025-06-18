const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // ✅ fix this


const Grocery = sequelize.define('Grocery', {
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
  original_price: DataTypes.DECIMAL(10, 2),
  discounted_price: DataTypes.DECIMAL(10, 2),
  image: DataTypes.STRING,
  rating: DataTypes.DECIMAL(3, 2),
  is_best_seller: DataTypes.BOOLEAN,
  quantity: DataTypes.INTEGER,
  category: DataTypes.STRING,
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'groceries',
  timestamps: true
});

module.exports = Grocery;
