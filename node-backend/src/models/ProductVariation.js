const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./Product');


const ProductVariation = sequelize.define('ProductVariation', {
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },

  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  tableName: 'product_variations'
});

// Define associations
ProductVariation.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });


module.exports = ProductVariation; 